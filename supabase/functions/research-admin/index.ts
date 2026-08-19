import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
};

const CURRENT_ASSESSMENT_VERSION = 'face-baseline-24q-v3.0-two-stage';
const CURRENT_SURVEY_RELEASE = 'google-form-v2.5-24q';
const EXPECTED_QUESTION_COUNTS: Record<string, number> = {
  'face-baseline-40q-v2.1-two-stage': 40,
  [CURRENT_ASSESSMENT_VERSION]: 24,
};
const expectedCodesFor = (version: string) => {
  const count = EXPECTED_QUESTION_COUNTS[version] ?? 0;
  return Array.from({ length: count }, (_, index) => `face-v2-${String(index + 1).padStart(2, '0')}`);
};
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

const toStringRecord = (value: unknown): Record<string, string> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (!['GET', 'PATCH'].includes(request.method)) return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });

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
  if (request.method === 'PATCH') {
    const body = await request.json().catch(() => null) as null | {
      submissionId?: unknown;
      decision?: unknown;
      exclusionReason?: unknown;
      notes?: unknown;
    };
    const submissionId = typeof body?.submissionId === 'string' ? body.submissionId : '';
    const decision = typeof body?.decision === 'string' ? body.decision : '';
    const exclusionReason = typeof body?.exclusionReason === 'string' ? body.exclusionReason.trim() : '';
    const notes = typeof body?.notes === 'string' ? body.notes.trim().slice(0, 2000) : '';
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) {
      return Response.json({ error: 'Invalid submission ID' }, { status: 400, headers: corsHeaders });
    }
    if (!['included', 'excluded', 'needs_review'].includes(decision)) {
      return Response.json({ error: 'Invalid review decision' }, { status: 400, headers: corsHeaders });
    }
    if (decision === 'excluded' && !exclusionReason) {
      return Response.json({ error: 'Exclusion reason is required' }, { status: 400, headers: corsHeaders });
    }
    const { data: existingSubmission, error: existingError } = await admin
      .from('research_submissions').select('id').eq('id', submissionId).maybeSingle();
    if (existingError) return Response.json({ error: existingError.message }, { status: 500, headers: corsHeaders });
    if (!existingSubmission) return Response.json({ error: 'Submission not found' }, { status: 404, headers: corsHeaders });

    const reviewedAt = new Date().toISOString();
    const { data: review, error: reviewError } = await admin.from('research_submission_reviews').upsert({
      submission_id: submissionId,
      decision,
      exclusion_reason: decision === 'excluded' ? exclusionReason : null,
      notes: notes || null,
      reviewed_by: user.id,
      reviewed_at: reviewedAt,
      updated_at: reviewedAt,
    }, { onConflict: 'submission_id' }).select('submission_id, decision, exclusion_reason, notes, reviewed_at').single();
    if (reviewError) return Response.json({ error: reviewError.message }, { status: 500, headers: corsHeaders });
    return Response.json({
      review: {
        decision: review.decision,
        exclusionReason: review.exclusion_reason,
        notes: review.notes,
        reviewedAt: review.reviewed_at,
        reviewed: true,
      },
    }, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const { data: submissions, error: submissionError } = await admin
    .from('research_submissions')
    .select('id, participant_id, source, assessment_version, face_code, scores, not_applicable_count, insufficient_data, submitted_at, received_at, result_released_at, metadata')
    .order('submitted_at', { ascending: false })
    .limit(1000);
  if (submissionError) return Response.json({ error: submissionError.message }, { status: 500, headers: corsHeaders });

  const submissionIds = submissions.map((row) => row.id);
  const participantIds = [...new Set(submissions.map((row) => row.participant_id).filter(Boolean))];
  const [{ data: participants, error: participantError }, { data: answers, error: answerError }, { data: reviews, error: reviewError }] = await Promise.all([
    participantIds.length > 0
      ? admin.from('research_participants').select('id, email, consent_research, consent_result_email, consent_marketing, unsubscribed_at').in('id', participantIds)
      : Promise.resolve({ data: [], error: null }),
    submissionIds.length > 0
      ? admin.from('research_answers').select('submission_id, question_code, selected_option').in('submission_id', submissionIds)
      : Promise.resolve({ data: [], error: null }),
    submissionIds.length > 0
      ? admin.from('research_submission_reviews').select('submission_id, decision, exclusion_reason, notes, reviewed_at').in('submission_id', submissionIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (participantError || answerError || reviewError) {
    return Response.json({ error: participantError?.message || answerError?.message || reviewError?.message }, { status: 500, headers: corsHeaders });
  }

  const participantsById = new Map((participants || []).map((row) => [row.id, row]));
  const reviewsBySubmission = new Map((reviews || []).map((row) => [row.submission_id, row]));
  const duplicateGroups = new Map<string, string[]>();
  for (const submission of submissions) {
    if (!submission.participant_id) continue;
    const key = `${submission.participant_id}:${submission.assessment_version}`;
    const ids = duplicateGroups.get(key) || [];
    ids.push(submission.id);
    duplicateGroups.set(key, ids);
  }
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
    const expectedCodes = expectedCodesFor(submission.assessment_version);
    const expectedAnswerCount = expectedCodes.length;
    const missingQuestions = expectedCodes.filter((code) => !uniqueCodes.has(code));
    const answerCount = submissionAnswers.length;
    const scoresValid = scoresAreValid(submission.scores);
    const faceCodeValid = /^[AP][RI][LT][CD]$/.test(submission.face_code || '');
    const email = participant?.email || null;
    const emailUsable = isEmailUsable(email);
    const metadata = submission.metadata && typeof submission.metadata === 'object' ? submission.metadata as Record<string, unknown> : {};
    const calibration = toStringRecord(metadata.calibration);
    const feedback = toStringRecord(metadata.feedback);
    const market = metadata.market && typeof metadata.market === 'object' && !Array.isArray(metadata.market)
      ? metadata.market as Record<string, unknown> : {};
    const calibrationComplete = ['focus', 'analysis', 'cycle', 'exposure', 'realism']
      .every((key) => typeof calibration[key] === 'string' && calibration[key]);
    const supportedVersion = expectedAnswerCount > 0;
    const consentResearch = Boolean(participant?.consent_research);
    const researchReady = consentResearch
      && supportedVersion && answerCount === expectedAnswerCount && uniqueCodes.size === expectedAnswerCount && missingQuestions.length === 0
      && scoresValid && faceCodeValid && !submission.insufficient_data;
    const issues = [
      !supportedVersion && `不支援的版本：${submission.assessment_version}`,
      !consentResearch && '缺少研究同意',
      supportedVersion && answerCount !== expectedAnswerCount && `答案數為 ${answerCount}，預期 ${expectedAnswerCount}`,
      uniqueCodes.size !== answerCount && '存在重複題目',
      missingQuestions.length > 0 && `缺少 ${missingQuestions.length} 題`,
      !scoresValid && '分數資料不一致',
      !faceCodeValid && '人格代碼格式錯誤',
      submission.insufficient_data && '不適用題數過多',
      email && !emailUsable && 'Email 無法寄送',
    ].filter((issue): issue is string => Boolean(issue));
    const duplicateKey = submission.participant_id ? `${submission.participant_id}:${submission.assessment_version}` : '';
    const duplicateIds = duplicateKey ? duplicateGroups.get(duplicateKey) || [] : [];
    const duplicateGroupSize = duplicateIds.length;
    const duplicateRank = duplicateGroupSize > 1 ? duplicateIds.indexOf(submission.id) + 1 : null;
    const duplicateCandidate = duplicateGroupSize > 1;
    const storedReview = reviewsBySubmission.get(submission.id);
    const reviewDecision = storedReview?.decision
      ?? (!researchReady ? 'excluded' : duplicateCandidate ? 'needs_review' : 'included');
    const exclusionReason = storedReview?.exclusion_reason
      ?? (!researchReady ? issues[0] || '資料完整性未通過' : null);

    return {
      id: submission.id,
      participantId: submission.participant_id,
      submittedAt: submission.submitted_at,
      receivedAt: submission.received_at,
      resultReleasedAt: submission.result_released_at,
      source: submission.source,
      assessmentVersion: submission.assessment_version,
      surveyRelease: typeof metadata.surveyRelease === 'string' ? metadata.surveyRelease : null,
      instrumentMode: typeof metadata.instrumentMode === 'string' ? metadata.instrumentMode : null,
      faceCode: submission.face_code,
      scores: submission.scores,
      answerCount,
      expectedAnswerCount,
      missingQuestionCount: missingQuestions.length,
      notApplicableCount: submission.not_applicable_count,
      insufficientData: submission.insufficient_data,
      email,
      emailMasked: maskEmail(email),
      emailUsable,
      consentResearch,
      consentResultEmail: Boolean(participant?.consent_result_email),
      consentMarketing: Boolean(participant?.consent_marketing),
      unsubscribed: Boolean(participant?.unsubscribed_at),
      researchReady,
      reviewDecision,
      exclusionReason,
      reviewNotes: storedReview?.notes || null,
      reviewedAt: storedReview?.reviewed_at || null,
      reviewed: Boolean(storedReview),
      includedInAnalysis: researchReady && reviewDecision === 'included',
      duplicateCandidate,
      duplicateGroupSize,
      duplicateRank,
      canSendResult: researchReady && emailUsable && Boolean(participant?.consent_result_email) && !participant?.unsubscribed_at,
      canMarket: researchReady && emailUsable && Boolean(participant?.consent_marketing) && !participant?.unsubscribed_at,
      issues,
      calibration,
      feedback,
      market,
      calibrationComplete,
    };
  });

  const versions = [...new Set(rows.map((row) => row.assessmentVersion))];
  const currentRows = rows.filter((row) => row.assessmentVersion === CURRENT_ASSESSMENT_VERSION);
  return Response.json({
    generatedAt: new Date().toISOString(),
    currentAssessmentVersion: CURRENT_ASSESSMENT_VERSION,
    currentSurveyRelease: CURRENT_SURVEY_RELEASE,
    summary: {
      total: rows.length,
      currentVersion: rows.filter((row) => row.assessmentVersion === CURRENT_ASSESSMENT_VERSION).length,
      includedSamples: currentRows.filter((row) => row.includedInAnalysis).length,
      excludedSamples: currentRows.filter((row) => row.reviewDecision === 'excluded').length,
      needsSampleReview: currentRows.filter((row) => row.reviewDecision === 'needs_review').length,
      duplicateCandidates: currentRows.filter((row) => row.duplicateCandidate).length,
      researchReady: rows.filter((row) => row.researchReady).length,
      needsReview: rows.filter((row) => !row.researchReady).length,
      canSendResult: rows.filter((row) => row.canSendResult).length,
      canMarket: rows.filter((row) => row.canMarket).length,
      byVersion: Object.fromEntries(versions.map((version) => [version, rows.filter((row) => row.assessmentVersion === version).length])),
    },
    submissions: rows,
  }, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
