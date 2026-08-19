import { createClient } from 'jsr:@supabase/supabase-js@2';

type Trait = 'A' | 'P' | 'R' | 'I' | 'L' | 'T' | 'C' | 'D';
type Dimension = 'FOCUS' | 'ANALYSIS' | 'CYCLE' | 'EXPOSURE';
type Answer = 'A' | 'B' | 'very_agree' | 'somewhat_agree' | 'neutral' | 'somewhat_disagree' | 'very_disagree' | 'very_a' | 'somewhat_a' | 'balanced' | 'somewhat_b' | 'very_b' | 'not_applicable';

type Question = {
  code: string;
  dimension: Dimension;
  type: 'binary' | 'agreement' | 'bipolar';
  traitA: Trait;
  traitB: Trait;
  group?: string;
};

const LEGACY_VERSION = 'face-baseline-40q-v2.1-two-stage';
const CURRENT_VERSION = 'face-baseline-24q-v3.0-two-stage';
const CURRENT_SURVEY_RELEASE = 'google-form-v2.5-24q';
const DIMENSION_TRAITS: Record<Dimension, [Trait, Trait]> = {
  FOCUS: ['A', 'P'], ANALYSIS: ['R', 'I'], CYCLE: ['L', 'T'], EXPOSURE: ['C', 'D'],
};

const legacyDimensionByNumber: Record<number, Dimension> = {
  1:'FOCUS',2:'ANALYSIS',3:'CYCLE',4:'EXPOSURE',5:'FOCUS',6:'ANALYSIS',7:'CYCLE',8:'EXPOSURE',
  9:'FOCUS',10:'FOCUS',11:'ANALYSIS',12:'ANALYSIS',13:'CYCLE',14:'CYCLE',15:'EXPOSURE',16:'EXPOSURE',
  17:'FOCUS',18:'ANALYSIS',19:'CYCLE',20:'EXPOSURE',21:'FOCUS',22:'ANALYSIS',23:'CYCLE',24:'EXPOSURE',
  25:'FOCUS',26:'FOCUS',27:'FOCUS',28:'FOCUS',29:'ANALYSIS',30:'ANALYSIS',31:'ANALYSIS',32:'ANALYSIS',
  33:'CYCLE',34:'CYCLE',35:'CYCLE',36:'CYCLE',37:'EXPOSURE',38:'EXPOSURE',39:'EXPOSURE',40:'EXPOSURE',
};
const legacyTraits: Array<[Trait, Trait]> = [
  ['A','P'],['R','I'],['L','T'],['C','D'],['A','P'],['R','I'],['L','T'],['C','D'],
  ['A','P'],['A','P'],['R','I'],['R','I'],['L','T'],['L','T'],['C','D'],['C','D'],
  ['A','P'],['R','I'],['T','L'],['C','D'],['P','A'],['I','R'],['L','T'],['D','C'],
  ['A','P'],['A','P'],['A','P'],['A','P'],['R','I'],['R','I'],['R','I'],['R','I'],
  ['L','T'],['L','T'],['L','T'],['L','T'],['C','D'],['C','D'],['C','D'],['C','D'],
];
const legacyGroupByNumber: Record<number, string> = {
  25:'F1',26:'F1',27:'F2',28:'F2',29:'A1',30:'A1',31:'A2',32:'A2',
  33:'C1',34:'C1',35:'C2',36:'C2',37:'E1',38:'E1',39:'E2',40:'E2',
};
const LEGACY_QUESTIONS: Question[] = Array.from({ length: 40 }, (_, index) => {
  const number = index + 1;
  return {
    code: `face-v2-${String(number).padStart(2, '0')}`,
    dimension: legacyDimensionByNumber[number],
    type: number <= 16 ? 'binary' : number <= 24 ? 'agreement' : 'bipolar',
    traitA: legacyTraits[index][0], traitB: legacyTraits[index][1], group: legacyGroupByNumber[number],
  };
});

const currentDimensionByNumber: Record<number, Dimension> = {
  1:'FOCUS',2:'FOCUS',3:'ANALYSIS',4:'ANALYSIS',5:'CYCLE',6:'CYCLE',7:'EXPOSURE',8:'EXPOSURE',
  9:'FOCUS',10:'FOCUS',11:'FOCUS',12:'FOCUS',13:'ANALYSIS',14:'ANALYSIS',15:'ANALYSIS',16:'ANALYSIS',
  17:'CYCLE',18:'CYCLE',19:'CYCLE',20:'CYCLE',21:'EXPOSURE',22:'EXPOSURE',23:'EXPOSURE',24:'EXPOSURE',
};
const currentTraits: Array<[Trait, Trait]> = [
  ['A','P'],['A','P'],['R','I'],['R','I'],['L','T'],['L','T'],['C','D'],['C','D'],
  ['A','P'],['A','P'],['A','P'],['A','P'],['R','I'],['R','I'],['R','I'],['R','I'],
  ['L','T'],['L','T'],['L','T'],['L','T'],['C','D'],['C','D'],['C','D'],['C','D'],
];
const currentGroupByNumber: Record<number, string> = {
  9:'F1',10:'F1',11:'F2',12:'F2',13:'A1',14:'A1',15:'A2',16:'A2',
  17:'C1',18:'C1',19:'C2',20:'C2',21:'E1',22:'E1',23:'E2',24:'E2',
};
const CURRENT_QUESTIONS: Question[] = Array.from({ length: 24 }, (_, index) => {
  const number = index + 1;
  return {
    code: `face-v2-${String(number).padStart(2, '0')}`,
    dimension: currentDimensionByNumber[number],
    type: number <= 8 ? 'binary' : 'bipolar',
    traitA: currentTraits[index][0], traitB: currentTraits[index][1], group: currentGroupByNumber[number],
  };
});

const QUESTIONS_BY_VERSION: Record<string, Question[]> = {
  [LEGACY_VERSION]: LEGACY_QUESTIONS,
  [CURRENT_VERSION]: CURRENT_QUESTIONS,
};
const agreementValue: Partial<Record<Answer, number>> = { very_agree:10, somewhat_agree:7, neutral:5, somewhat_disagree:3, very_disagree:0 };
const bipolarValue: Partial<Record<Answer, number>> = { very_a:10, somewhat_a:7, balanced:5, somewhat_b:3, very_b:0 };

function calculate(questions: Question[], answers: Record<string, Answer>) {
  const raw: Record<Trait, number> = { A:0, P:0, R:0, I:0, L:0, T:0, C:0, D:0 };
  const rows: Array<{ question_code:string; selected_option:Answer; dimension:Dimension; score_value:number }> = [];
  let skipped = 0;

  for (const question of questions) {
    const answer = answers[question.code];
    if (!answer) throw new Error(`Missing answer: ${question.code}`);
    if (answer === 'not_applicable') {
      if (question.type !== 'bipolar') throw new Error(`not_applicable is not allowed for ${question.code}`);
      skipped += 1;
      rows.push({ question_code: question.code, selected_option: answer, dimension: question.dimension, score_value: 0 });
      continue;
    }

    let aValue: number;
    if (question.type === 'binary') {
      if (answer !== 'A' && answer !== 'B') throw new Error(`Invalid binary answer: ${question.code}`);
      aValue = answer === 'A' ? 10 : 0;
    } else if (question.type === 'agreement') {
      aValue = agreementValue[answer] ?? -1;
    } else {
      aValue = bipolarValue[answer] ?? -1;
    }
    if (aValue < 0) throw new Error(`Invalid answer: ${question.code}`);
    raw[question.traitA] += aValue;
    raw[question.traitB] += 10 - aValue;
    rows.push({ question_code: question.code, selected_option: answer, dimension: question.dimension, score_value: aValue });
  }

  for (const group of [...new Set(questions.flatMap((question) => question.group ? [question.group] : []))]) {
    const grouped = questions.filter((question) => question.group === group);
    const selected = grouped.map((question) => answers[question.code]);
    if (selected.some((value) => value === 'balanced' || value === 'not_applicable')) continue;
    const sides = selected.map((value) => value === 'very_a' || value === 'somewhat_a' ? 'a' : 'b');
    if (sides.every((side) => side === sides[0])) raw[sides[0] === 'a' ? grouped[0].traitA : grouped[0].traitB] += 2;
  }

  const scores = { ...raw };
  for (const [left, right] of Object.values(DIMENSION_TRAITS)) {
    const total = raw[left] + raw[right];
    scores[left] = total === 0 ? 50 : Math.round((raw[left] / total) * 100);
    scores[right] = 100 - scores[left];
  }
  const faceCode = Object.values(DIMENSION_TRAITS).map(([left, right]) => scores[left] >= scores[right] ? left : right).join('');
  const scenarioCount = questions.filter((question) => question.type === 'bipolar').length;
  return { scores, faceCode, rows, skipped, insufficientData: scenarioCount > 0 && skipped / scenarioCount > 0.5 };
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  const expectedSecret = Deno.env.get('RESEARCH_FORM_WEBHOOK_SECRET');
  if (!expectedSecret || request.headers.get('x-research-secret') !== expectedSecret) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const payload = await request.json();
    if (!payload.consentResearch) return Response.json({ error: 'Research consent is required' }, { status: 400 });
    if (!payload.responseId || !payload.submittedAt || !payload.answers || typeof payload.answers !== 'object' || Array.isArray(payload.answers)) {
      return Response.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const assessmentVersion = String(payload.assessmentVersion || LEGACY_VERSION);
    const questions = QUESTIONS_BY_VERSION[assessmentVersion];
    if (!questions) return Response.json({ error: `Unsupported assessment version: ${assessmentVersion}` }, { status: 400 });
    if (assessmentVersion === CURRENT_VERSION && payload.surveyRelease !== CURRENT_SURVEY_RELEASE) {
      return Response.json({ error: 'Unsupported or missing survey release' }, { status: 400 });
    }

    const email = String(payload.email || '').trim().toLowerCase() || null;
    const requestedResultConsent = Boolean(payload.consentResultEmail);
    const requestedMarketingConsent = Boolean(payload.consentMarketing);
    const consentResultEmail = requestedResultConsent && Boolean(email);
    const consentMarketing = requestedMarketingConsent && Boolean(email);
    const calculated = calculate(questions, payload.answers as Record<string, Answer>);
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const { data: existingSubmission } = await supabase.from('research_submissions')
      .select('id').eq('external_response_id', String(payload.responseId)).maybeSingle();
    if (existingSubmission) return Response.json({ ok:true, submissionId:existingSubmission.id, receivedAnswers:questions.length, duplicate:true });

    let participantId: string;
    if (email) {
      const { data: participant, error } = await supabase.from('research_participants').upsert({
        email,
        consent_research: true,
        consent_result_email: consentResultEmail,
        consent_marketing: consentMarketing,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' }).select('id').single();
      if (error) throw error;
      participantId = participant.id;
    } else {
      const { data: participant, error } = await supabase.from('research_participants').insert({
        email: null, consent_research: true, consent_result_email: false, consent_marketing: false,
      }).select('id').single();
      if (error) throw error;
      participantId = participant.id;
    }

    const { data: submission, error: submissionError } = await supabase.from('research_submissions').insert({
      participant_id: participantId,
      external_response_id: String(payload.responseId),
      source: 'google_form',
      assessment_version: assessmentVersion,
      face_code: calculated.faceCode,
      scores: calculated.scores,
      not_applicable_count: calculated.skipped,
      insufficient_data: calculated.insufficientData,
      submitted_at: new Date(payload.submittedAt).toISOString(),
      metadata: {
        formId: payload.formId || null,
        surveyRelease: payload.surveyRelease || null,
        instrumentMode: payload.instrumentMode || null,
        questionCount: questions.length,
        calibration: payload.calibration && typeof payload.calibration === 'object' ? payload.calibration : {},
        feedback: payload.feedback && typeof payload.feedback === 'object' ? payload.feedback : {},
        market: payload.market && typeof payload.market === 'object' ? payload.market : {},
        requestedResultConsent,
        requestedMarketingConsent,
        emailMissingForRequestedConsent: !email && (requestedResultConsent || requestedMarketingConsent),
      },
    }).select('id').single();
    if (submissionError) throw submissionError;

    const answerRows = calculated.rows.map((row) => ({ ...row, submission_id: submission.id }));
    const { error: answersError } = await supabase.from('research_answers').insert(answerRows);
    if (answersError) throw answersError;
    return Response.json({ ok:true, submissionId:submission.id, assessmentVersion, receivedAnswers:answerRows.length });
  } catch (error) {
    console.error(error);
    return Response.json({ error:error instanceof Error ? error.message : 'Unknown error' }, { status:400 });
  }
});
