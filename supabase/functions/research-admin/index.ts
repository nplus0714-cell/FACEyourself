import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const expectedCodes = Array.from({ length: 40 }, (_, index) => `face-v2-${String(index + 1).padStart(2, '0')}`);
const scoreKeys = ['A', 'P', 'R', 'I', 'L', 'T', 'C', 'D'] as const;

const isEmailUsable = (email: string | null) => {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return !domain.endsWith('.invalid') && !['example.com', 'example.org', 'example.net'].includes(domain);
};

const maskEmail = (email: string | null) => {
  if (!email) return null;
  const [local, domain] = email.split('@');
  return `${local.slice(0, 2)}***@${domain}`;
};

const scoresAreValid = (scores: unknown) => {
  if (!scores || typeof scores !== 'object') return false;
  const values = scores as Record<string, unknown>;
  if (!scoreKeys.every((key) => Number.isFinite(Number(values[key])))) return false;
  return Number(values.A) + Number(values.P) === 100
    && Number(values.R) + Number(values.I) === 100
    && Number(values.L) + Number(values.T) === 100
    && Number(values.C) + Number(values.D) === 100;
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'GET') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });

  const url = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const allowedEmails = (Deno.env.get('RESEARCH_ADMIN_EMAILS') || '')
    .split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
  const authorization = request.headers.get('authorization') || '';
  const token = authorization.replace(/^Bearer\s+/i, '');

  const authClient = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: { user }, error: authError } = await authClient.auth.getUser(token);
  if (authError || !user?.email || !allowedEmails.includes(user.email.toLowerCase())) {
    return Response.json({ error: 'Forbidden' }, { status: 403, headers: corsHeaders });
  }

  const admin = createClient(url, serviceKey);
  const { data: submissions, error: submissionError } = await admin
    .from('research_submissions')
    .select('id, participant_id, assessment_version, face_code, scores, not_applicable_count, insufficient_data, submitted_at, received_at')
    .order('submitted_at', { ascending: false })
    .limit(500);
  if (submissionError) return Response.json({ error: submissionError.message }, { status: 500, headers: corsHeaders });

  const submissionIds = submissions.map((row) => row.id);
  const participantIds = [...new Set(submissions.map((row) => row.participant_id).filter(Boolean))];
  const [{ data: participants, error: participantError }, { data: answers, error: answerError }] = await Promise.all([
    admin.from('research_participants').select('id, email, consent_research, consent_result_email, consent_marketing, unsubscribed_at').in('id', participantIds),
    admin.from('research_answers').select('submission_id, question_code, selected_option').in('submission_id', submissionIds),
  ]);
  if (participantError || answerError) {
    return Response.json({ error: participantError?.message || answerError?.message }, { status: 500, headers: corsHeaders });
  }

  const participantsById = new Map((participants || []).map((row) => [row.id, row]));
  const answersBySubmission = new Map<string, Array<{ question_code: string; selected_option: string }>>();
  for (const answer of answers || []) {
    const current = answersBySubmission.get(answer.submission_id) || [];
    current.push(answer);
    answersBySubmission.set(answer.submission_id, current);
  }

  const rows = submissions.map((submission) => {
    const participant = participantsById.get(submission.participant_id);
    const submissionAnswers = answersBySubmission.get(submission.id) || [];
    const uniqueCodes = new Set(submissionAnswers.map((answer) => answer.question_code));
    const missingQuestions = expectedCodes.filter((code) => !uniqueCodes.has(code));
    const answerCount = submissionAnswers.length;
    const scoresValid = scoresAreValid(submission.scores);
    const faceCodeValid = /^[AP][RI][LT][CD]$/.test(submission.face_code || '');
    const emailUsable = isEmailUsable(participant?.email || null);
    const researchReady = Boolean(participant?.consent_research)
      && answerCount === 40 && uniqueCodes.size === 40 && missingQuestions.length === 0
      && scoresValid && faceCodeValid && !submission.insufficient_data;
    const issues = [
      !participant?.consent_research && '缺少研究同意',
      answerCount !== 40 && `答案數為 ${answerCount}`,
      uniqueCodes.size !== answerCount && '存在重複題目',
      missingQuestions.length > 0 && `缺少 ${missingQuestions.length} 題`,
      !scoresValid && '分數資料不一致',
      !faceCodeValid && '人格代碼格式錯誤',
      submission.insufficient_data && '不適用題數過多',
      participant?.email && !emailUsable && 'Email 無法寄送',
    ].filter(Boolean);

    return {
      id: submission.id,
      submittedAt: submission.submitted_at,
      assessmentVersion: submission.assessment_version,
      faceCode: submission.face_code,
      scores: submission.scores,
      answerCount,
      missingQuestionCount: missingQuestions.length,
      notApplicableCount: submission.not_applicable_count,
      insufficientData: submission.insufficient_data,
      emailMasked: maskEmail(participant?.email || null),
      emailUsable,
      consentResultEmail: Boolean(participant?.consent_result_email),
      consentMarketing: Boolean(participant?.consent_marketing),
      unsubscribed: Boolean(participant?.unsubscribed_at),
      researchReady,
      canSendResult: researchReady && emailUsable && Boolean(participant?.consent_result_email) && !participant?.unsubscribed_at,
      canMarket: researchReady && emailUsable && Boolean(participant?.consent_marketing) && !participant?.unsubscribed_at,
      issues,
    };
  });

  return Response.json({
    generatedAt: new Date().toISOString(),
    summary: {
      total: rows.length,
      researchReady: rows.filter((row) => row.researchReady).length,
      needsReview: rows.filter((row) => !row.researchReady).length,
      canSendResult: rows.filter((row) => row.canSendResult).length,
      canMarket: rows.filter((row) => row.canMarket).length,
    },
    submissions: rows,
  }, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
