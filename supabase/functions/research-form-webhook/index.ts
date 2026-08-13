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

const VERSION = 'face-baseline-40q-v2.1-two-stage';
const DIMENSION_TRAITS: Record<Dimension, [Trait, Trait]> = {
  FOCUS: ['A', 'P'], ANALYSIS: ['R', 'I'], CYCLE: ['L', 'T'], EXPOSURE: ['C', 'D'],
};
const dimensionByNumber: Record<number, Dimension> = {
  1: 'FOCUS', 2: 'ANALYSIS', 3: 'CYCLE', 4: 'EXPOSURE', 5: 'FOCUS', 6: 'ANALYSIS', 7: 'CYCLE', 8: 'EXPOSURE',
  9: 'FOCUS', 10: 'FOCUS', 11: 'ANALYSIS', 12: 'ANALYSIS', 13: 'CYCLE', 14: 'CYCLE', 15: 'EXPOSURE', 16: 'EXPOSURE',
  17: 'FOCUS', 18: 'ANALYSIS', 19: 'CYCLE', 20: 'EXPOSURE', 21: 'FOCUS', 22: 'ANALYSIS', 23: 'CYCLE', 24: 'EXPOSURE',
  25: 'FOCUS', 26: 'FOCUS', 27: 'FOCUS', 28: 'FOCUS', 29: 'ANALYSIS', 30: 'ANALYSIS', 31: 'ANALYSIS', 32: 'ANALYSIS',
  33: 'CYCLE', 34: 'CYCLE', 35: 'CYCLE', 36: 'CYCLE', 37: 'EXPOSURE', 38: 'EXPOSURE', 39: 'EXPOSURE', 40: 'EXPOSURE',
};
const traits: Array<[Trait, Trait]> = [
  ['A','P'],['R','I'],['L','T'],['C','D'],['A','P'],['R','I'],['L','T'],['C','D'],
  ['A','P'],['A','P'],['R','I'],['R','I'],['L','T'],['L','T'],['C','D'],['C','D'],
  ['A','P'],['R','I'],['T','L'],['C','D'],['P','A'],['I','R'],['L','T'],['D','C'],
  ['A','P'],['A','P'],['A','P'],['A','P'],['R','I'],['R','I'],['R','I'],['R','I'],
  ['L','T'],['L','T'],['L','T'],['L','T'],['C','D'],['C','D'],['C','D'],['C','D'],
];
const groupByNumber: Record<number, string> = {
  25:'F1',26:'F1',27:'F2',28:'F2',29:'A1',30:'A1',31:'A2',32:'A2',
  33:'C1',34:'C1',35:'C2',36:'C2',37:'E1',38:'E1',39:'E2',40:'E2',
};
const QUESTIONS: Question[] = Array.from({ length: 40 }, (_, index) => {
  const number = index + 1;
  return {
    code: `face-v2-${String(number).padStart(2, '0')}`,
    dimension: dimensionByNumber[number],
    type: number <= 16 ? 'binary' : number <= 24 ? 'agreement' : 'bipolar',
    traitA: traits[index][0], traitB: traits[index][1], group: groupByNumber[number],
  };
});

const agreementValue: Partial<Record<Answer, number>> = { very_agree: 10, somewhat_agree: 7, neutral: 5, somewhat_disagree: 3, very_disagree: 0 };
const bipolarValue: Partial<Record<Answer, number>> = { very_a: 10, somewhat_a: 7, balanced: 5, somewhat_b: 3, very_b: 0 };

function calculate(answers: Record<string, Answer>) {
  const raw: Record<Trait, number> = { A:0, P:0, R:0, I:0, L:0, T:0, C:0, D:0 };
  const rows: Array<{ question_code:string; selected_option:Answer; dimension:Dimension; score_value:number }> = [];
  let skipped = 0;
  for (const question of QUESTIONS) {
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
  for (const group of [...new Set(QUESTIONS.flatMap((q) => q.group ? [q.group] : []))]) {
    const grouped = QUESTIONS.filter((q) => q.group === group);
    const selected = grouped.map((q) => answers[q.code]);
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
  return { scores, faceCode, rows, skipped, insufficientData: skipped > 8 };
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  const expectedSecret = Deno.env.get('RESEARCH_FORM_WEBHOOK_SECRET');
  if (!expectedSecret || request.headers.get('x-research-secret') !== expectedSecret) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const payload = await request.json();
    if (!payload.consentResearch) return Response.json({ error: 'Research consent is required' }, { status: 400 });
    if (!payload.responseId || !payload.submittedAt || typeof payload.answers !== 'object') return Response.json({ error: 'Invalid payload' }, { status: 400 });
    const email = String(payload.email || '').trim().toLowerCase() || null;
    if ((payload.consentResultEmail || payload.consentMarketing) && !email) return Response.json({ error: 'Email is required for email consent' }, { status: 400 });
    const calculated = calculate(payload.answers as Record<string, Answer>);
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: existingSubmission } = await supabase.from('research_submissions')
      .select('id').eq('external_response_id', String(payload.responseId)).maybeSingle();
    if (existingSubmission) return Response.json({ ok: true, submissionId: existingSubmission.id, receivedAnswers: 40, duplicate: true });
    let participantId: string | null = null;
    if (email) {
      const { data: participant, error } = await supabase.from('research_participants').upsert({
        email,
        consent_research: true,
        consent_result_email: Boolean(payload.consentResultEmail),
        consent_marketing: Boolean(payload.consentMarketing),
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
    const { data: submission, error: submissionError } = await supabase.from('research_submissions').upsert({
      participant_id: participantId,
      external_response_id: String(payload.responseId),
      assessment_version: VERSION,
      face_code: calculated.faceCode,
      scores: calculated.scores,
      not_applicable_count: calculated.skipped,
      insufficient_data: calculated.insufficientData,
      submitted_at: new Date(payload.submittedAt).toISOString(),
      metadata: {
        formId: payload.formId || null,
        calibration: payload.calibration && typeof payload.calibration === 'object' ? payload.calibration : {},
        feedback: payload.feedback && typeof payload.feedback === 'object' ? payload.feedback : {},
      },
    }, { onConflict: 'external_response_id' }).select('id').single();
    if (submissionError) throw submissionError;
    const answerRows = calculated.rows.map((row) => ({ ...row, submission_id: submission.id }));
    const { error: answersError } = await supabase.from('research_answers').upsert(answerRows, { onConflict: 'submission_id,question_code' });
    if (answersError) throw answersError;
    return Response.json({ ok: true, submissionId: submission.id, receivedAnswers: answerRows.length });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
});
