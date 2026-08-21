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
type Dimension = 'FOCUS' | 'ANALYSIS' | 'CYCLE' | 'EXPOSURE';
type ResearchAnswerRow = {
  submission_id: string;
  question_code: string;
  selected_option: string;
  dimension: Dimension;
  score_value: number;
};

const DIMENSION_META: Record<Dimension, { calibrationKey: string; leftTrait: typeof scoreKeys[number] }> = {
  FOCUS: { calibrationKey: 'focus', leftTrait: 'A' },
  ANALYSIS: { calibrationKey: 'analysis', leftTrait: 'R' },
  CYCLE: { calibrationKey: 'cycle', leftTrait: 'L' },
  EXPOSURE: { calibrationKey: 'exposure', leftTrait: 'C' },
};
const CURRENT_QUESTION_DIMENSIONS: Record<number, Dimension> = {
  1:'FOCUS',2:'FOCUS',3:'ANALYSIS',4:'ANALYSIS',5:'CYCLE',6:'CYCLE',7:'EXPOSURE',8:'EXPOSURE',
  9:'FOCUS',10:'FOCUS',11:'FOCUS',12:'FOCUS',13:'ANALYSIS',14:'ANALYSIS',15:'ANALYSIS',16:'ANALYSIS',
  17:'CYCLE',18:'CYCLE',19:'CYCLE',20:'CYCLE',21:'EXPOSURE',22:'EXPOSURE',23:'EXPOSURE',24:'EXPOSURE',
};
const CURRENT_QUESTION_GROUPS: Record<number, string> = {
  9:'F1',10:'F1',11:'F2',12:'F2',13:'A1',14:'A1',15:'A2',16:'A2',
  17:'C1',18:'C1',19:'C2',20:'C2',21:'E1',22:'E1',23:'E2',24:'E2',
};
const CURRENT_QUESTION_DEFINITIONS = Array.from({ length: 24 }, (_, index) => {
  const number = index + 1;
  return {
    code: `face-v2-${String(number).padStart(2, '0')}`,
    dimension: CURRENT_QUESTION_DIMENSIONS[number],
    type: number <= 8 ? 'binary' as const : 'bipolar' as const,
    group: CURRENT_QUESTION_GROUPS[number] ?? null,
  };
});

const CALIBRATION_VALUES: Record<Dimension, Record<string, number>> = {
  FOCUS: { '非常偏積極':100, '比較偏積極':75, '介於兩者之間':50, '比較偏保守':25, '非常偏保守':0 },
  ANALYSIS: { '非常依賴數據與規則':100, '比較依賴數據與規則':75, '兩種方式並用':50, '比較依賴盤面感受':25, '非常依賴盤面感受':0 },
  CYCLE: { '非常偏向長期持有':100, '比較偏向長期持有':75, '兩種方式並用':50, '比較偏向掌握波段':25, '非常偏向掌握波段':0 },
  EXPOSURE: { '非常偏向集中配置':100, '比較偏向集中配置':75, '介於兩者之間':50, '比較偏向分散配置':25, '非常偏向分散配置':0 },
};

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

const round = (value: number, digits = 0) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const sampleVariance = (values: number[]) => {
  if (values.length < 2) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1);
};

const pearson = (pairs: Array<[number, number]>) => {
  if (pairs.length < 3) return null;
  const xs = pairs.map(([x]) => x);
  const ys = pairs.map(([, y]) => y);
  const meanX = xs.reduce((sum, value) => sum + value, 0) / xs.length;
  const meanY = ys.reduce((sum, value) => sum + value, 0) / ys.length;
  const numerator = pairs.reduce((sum, [x, y]) => sum + (x - meanX) * (y - meanY), 0);
  const denominator = Math.sqrt(
    xs.reduce((sum, value) => sum + (value - meanX) ** 2, 0)
    * ys.reduce((sum, value) => sum + (value - meanY) ** 2, 0),
  );
  return denominator === 0 ? null : numerator / denominator;
};

const cronbachAlpha = (matrix: number[][]) => {
  if (matrix.length < 3 || matrix[0]?.length < 2) return null;
  const itemCount = matrix[0].length;
  const itemVariances = Array.from({ length: itemCount }, (_, index) => sampleVariance(matrix.map((row) => row[index])) ?? 0);
  const totalVariance = sampleVariance(matrix.map((row) => row.reduce((sum, value) => sum + value, 0)));
  if (!totalVariance || totalVariance <= 0) return null;
  return (itemCount / (itemCount - 1)) * (1 - itemVariances.reduce((sum, value) => sum + value, 0) / totalVariance);
};

const answerSide = (selectedOption: string) => {
  if (selectedOption === 'A' || selectedOption === 'very_a' || selectedOption === 'somewhat_a') return 'a';
  if (selectedOption === 'B' || selectedOption === 'very_b' || selectedOption === 'somewhat_b') return 'b';
  if (selectedOption === 'balanced' || selectedOption === 'neutral') return 'middle';
  return 'not_applicable';
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

  const { data: waitlistEntries, error: waitlistError } = await admin
    .from('early_access_waitlist')
    .select('id, email, nickname, interest, source, status, marketing_consent, consent_version, marketing_consented_at, unsubscribed_at, user_id, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(5000);
  if (waitlistError) return Response.json({ error: waitlistError.message }, { status: 500, headers: corsHeaders });

  const submissionIds = submissions.map((row) => row.id);
  const participantIds = [...new Set(submissions.map((row) => row.participant_id).filter(Boolean))];
  const [{ data: participants, error: participantError }, { data: answers, error: answerError }, { data: reviews, error: reviewError }] = await Promise.all([
    participantIds.length > 0
      ? admin.from('research_participants').select('id, email, consent_research, consent_result_email, consent_marketing, unsubscribed_at').in('id', participantIds)
      : Promise.resolve({ data: [], error: null }),
    submissionIds.length > 0
      ? admin.from('research_answers').select('submission_id, question_code, selected_option, dimension, score_value').in('submission_id', submissionIds)
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
  const answersBySubmission = new Map<string, ResearchAnswerRow[]>();
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
  const includedRows = currentRows.filter((row) => row.includedInAnalysis);
  const includedIds = new Set(includedRows.map((row) => row.id));
  const analysisStage = includedRows.length < 30 ? 'collecting'
    : includedRows.length < 100 ? 'preliminary'
      : includedRows.length < 200 ? 'screening' : 'stable';

  const questionAnalytics = CURRENT_QUESTION_DEFINITIONS.map((question) => {
    const questionAnswers = includedRows
      .map((row) => answersBySubmission.get(row.id)?.find((answer) => answer.question_code === question.code))
      .filter((answer): answer is ResearchAnswerRow => Boolean(answer));
    const sideCounts = { a: 0, middle: 0, b: 0, not_applicable: 0 };
    questionAnswers.forEach((answer) => { sideCounts[answerSide(answer.selected_option)] += 1; });
    const applicableAnswers = questionAnswers.filter((answer) => answer.selected_option !== 'not_applicable');
    const applicableCount = applicableAnswers.length;
    const percentage = (count: number, denominator: number) => denominator > 0 ? round((count / denominator) * 100) : 0;
    const discriminationPairs: Array<[number, number]> = [];
    const dimensionCodes = CURRENT_QUESTION_DEFINITIONS
      .filter((candidate) => candidate.dimension === question.dimension && candidate.code !== question.code)
      .map((candidate) => candidate.code);
    includedRows.forEach((row) => {
      const submissionAnswers = answersBySubmission.get(row.id) || [];
      const item = submissionAnswers.find((answer) => answer.question_code === question.code);
      if (!item || item.selected_option === 'not_applicable') return;
      const otherItems = dimensionCodes
        .map((code) => submissionAnswers.find((answer) => answer.question_code === code))
        .filter((answer): answer is ResearchAnswerRow => Boolean(answer) && answer.selected_option !== 'not_applicable');
      if (otherItems.length !== dimensionCodes.length) return;
      discriminationPairs.push([Number(item.score_value), otherItems.reduce((sum, answer) => sum + Number(answer.score_value), 0)]);
    });
    const discriminationValue = pearson(discriminationPairs);
    const sideAPercentage = percentage(sideCounts.a, applicableCount);
    const middlePercentage = percentage(sideCounts.middle, applicableCount);
    const sideBPercentage = percentage(sideCounts.b, applicableCount);
    const notApplicablePercentage = percentage(sideCounts.not_applicable, includedRows.length);
    const dominantPercentage = Math.max(sideAPercentage, sideBPercentage);
    const flags: string[] = [];
    if (includedRows.length >= 30 && dominantPercentage >= 85) flags.push('單側選項過度集中');
    if (includedRows.length >= 30 && middlePercentage >= 35) flags.push('中間選項偏高');
    if (includedRows.length >= 30 && notApplicablePercentage >= 20) flags.push('不適用比例偏高');
    if (includedRows.length >= 30 && discriminationValue !== null && discriminationValue < 0) flags.push('鑑別方向相反');
    else if (includedRows.length >= 30 && discriminationValue !== null && discriminationValue < 0.2) flags.push('鑑別度偏低');
    const status = includedRows.length < 30 ? 'collecting'
      : flags.some((flag) => ['單側選項過度集中', '不適用比例偏高', '鑑別方向相反'].includes(flag)) ? 'review'
        : flags.length > 0 ? 'watch' : 'healthy';
    return {
      code: question.code,
      dimension: question.dimension,
      type: question.type,
      group: question.group,
      sampleSize: includedRows.length,
      applicableCount,
      sideACount: sideCounts.a,
      middleCount: sideCounts.middle,
      sideBCount: sideCounts.b,
      notApplicableCount: sideCounts.not_applicable,
      sideAPercentage,
      middlePercentage,
      sideBPercentage,
      notApplicablePercentage,
      meanAValue: applicableCount > 0
        ? round(applicableAnswers.reduce((sum, answer) => sum + Number(answer.score_value), 0) / applicableCount, 1)
        : null,
      discrimination: discriminationValue === null ? null : round(discriminationValue, 2),
      discriminationSampleSize: discriminationPairs.length,
      status,
      flags,
    };
  });

  const dimensionAnalytics = (Object.keys(DIMENSION_META) as Dimension[]).map((dimension) => {
    const definitions = CURRENT_QUESTION_DEFINITIONS.filter((question) => question.dimension === dimension);
    const matrix = includedRows.map((row) => {
      const submissionAnswers = answersBySubmission.get(row.id) || [];
      return definitions.map((question) => submissionAnswers.find((answer) => answer.question_code === question.code));
    }).filter((answerRow) => answerRow.every((answer) => answer && answer.selected_option !== 'not_applicable'))
      .map((answerRow) => answerRow.map((answer) => Number(answer!.score_value)));
    const meta = DIMENSION_META[dimension];
    const calibrationPairs = includedRows.map((row) => {
      const label = row.calibration[meta.calibrationKey];
      const selfValue = CALIBRATION_VALUES[dimension][label];
      const scoreValue = Number((row.scores as Record<string, number>)[meta.leftTrait]);
      return Number.isFinite(selfValue) && Number.isFinite(scoreValue) ? { selfValue, scoreValue } : null;
    }).filter((pair): pair is { selfValue: number; scoreValue: number } => Boolean(pair));
    const directionalPairs = calibrationPairs.filter((pair) => pair.selfValue !== 50 && pair.scoreValue !== 50);
    const directionalAgreementCount = directionalPairs.filter((pair) => (pair.selfValue > 50) === (pair.scoreValue > 50)).length;
    const alpha = cronbachAlpha(matrix);
    return {
      dimension,
      completeCaseCount: matrix.length,
      cronbachAlpha: alpha === null ? null : round(alpha, 2),
      calibrationCount: calibrationPairs.length,
      directionalCalibrationCount: directionalPairs.length,
      directionalAgreementPercentage: directionalPairs.length > 0
        ? round((directionalAgreementCount / directionalPairs.length) * 100)
        : null,
      meanCalibrationGap: calibrationPairs.length > 0
        ? round(calibrationPairs.reduce((sum, pair) => sum + Math.abs(pair.selfValue - pair.scoreValue), 0) / calibrationPairs.length, 1)
        : null,
    };
  });

  const scenarioGroups = [...new Set(CURRENT_QUESTION_DEFINITIONS.flatMap((question) => question.group ? [question.group] : []))]
    .map((group) => {
      const definitions = CURRENT_QUESTION_DEFINITIONS.filter((question) => question.group === group);
      let eligibleCount = 0;
      let sameDirectionCount = 0;
      includedRows.forEach((row) => {
        const submissionAnswers = answersBySubmission.get(row.id) || [];
        const sides = definitions.map((question) => {
          const answer = submissionAnswers.find((candidate) => candidate.question_code === question.code);
          return answer ? answerSide(answer.selected_option) : 'not_applicable';
        });
        if (!sides.every((side) => side === 'a' || side === 'b')) return;
        eligibleCount += 1;
        if (sides.every((side) => side === sides[0])) sameDirectionCount += 1;
      });
      return {
        group,
        dimension: definitions[0].dimension,
        eligibleCount,
        sameDirectionCount,
        sameDirectionPercentage: eligibleCount > 0 ? round((sameDirectionCount / eligibleCount) * 100) : null,
      };
    });

  const waitlistRows = (waitlistEntries || []).map((entry) => ({
    id: entry.id,
    email: entry.email,
    emailMasked: maskEmail(entry.email) || entry.email,
    nickname: entry.nickname,
    interest: entry.interest,
    source: entry.source,
    status: entry.status,
    marketingConsent: Boolean(entry.marketing_consent),
    consentVersion: entry.consent_version,
    marketingConsentedAt: entry.marketing_consented_at,
    unsubscribedAt: entry.unsubscribed_at,
    userId: entry.user_id,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
  }));
  const waitlistCountBy = (key: 'interest' | 'source') => Object.fromEntries(
    [...new Set(waitlistRows.map((entry) => entry[key] || (key === 'interest' ? 'unspecified' : 'unknown')))]
      .map((value) => [value, waitlistRows.filter((entry) => (entry[key] || (key === 'interest' ? 'unspecified' : 'unknown')) === value).length]),
  );

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
    questionAnalysis: {
      sampleSize: includedRows.length,
      stage: analysisStage,
      minimumForItemReview: 30,
      minimumForStableReview: 200,
      questions: questionAnalytics,
      dimensions: dimensionAnalytics,
      scenarioGroups,
    },
    waitlist: {
      summary: {
        total: waitlistRows.length,
        subscribed: waitlistRows.filter((entry) => entry.status === 'subscribed').length,
        unsubscribed: waitlistRows.filter((entry) => entry.status === 'unsubscribed').length,
        linkedMembers: waitlistRows.filter((entry) => Boolean(entry.userId)).length,
        byInterest: waitlistCountBy('interest'),
        bySource: waitlistCountBy('source'),
      },
      entries: waitlistRows,
    },
    submissions: rows,
  }, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
