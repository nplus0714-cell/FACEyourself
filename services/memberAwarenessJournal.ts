import { getSupabaseClient } from '../lib/supabase';
import type { Json } from '../lib/database.types';
import type { DailyAwarenessStateCode } from '../data/dailyAwarenessPreview';
import type { DailyAwarenessResult } from '../data/dailyAwarenessPreview';
import type { DailyAwarenessAnswers } from '../data/dailyAwarenessQuestions';

export type MemberAwarenessJournal = {
  nickname: string | null;
  entries: Record<string, string>;
  awareness: Record<string, { stateCode: DailyAwarenessStateCode; answers: DailyAwarenessAnswers | null; result: DailyAwarenessResult | null }>;
};

const requireUserId = async () => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Authentication is required');
  return { supabase, userId: data.user.id };
};

export const getMemberAwarenessJournal = async (): Promise<MemberAwarenessJournal> => {
  const { supabase, userId } = await requireUserId();
  const [profileResult, entriesResult] = await Promise.all([
    supabase.from('member_profiles').select('nickname').eq('user_id', userId).maybeSingle(),
    supabase.from('awareness_diary_entries').select('entry_date, content, state_code, answers, result').eq('user_id', userId).order('entry_date', { ascending: false }),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (entriesResult.error) throw entriesResult.error;

  return {
    nickname: profileResult.data?.nickname ?? null,
    entries: Object.fromEntries((entriesResult.data ?? []).map((entry) => [entry.entry_date, entry.content])),
    awareness: Object.fromEntries((entriesResult.data ?? [])
      .filter((entry) => entry.state_code)
      .map((entry) => {
        const payload = entry.answers as (Record<string, unknown> | null);
        const legacyResult = payload?._result as DailyAwarenessResult | undefined;
        const result = (entry.result as unknown as DailyAwarenessResult | null) ?? legacyResult ?? null;
        const answers = payload ? Object.fromEntries(Object.entries(payload).filter(([key]) => key !== '_result')) as DailyAwarenessAnswers : null;
        return [entry.entry_date, {
          stateCode: entry.state_code as DailyAwarenessStateCode,
          answers,
          result,
        }];
      })),
  };
};

export const saveDailyAwarenessResult = async (
  entryDate: string,
  result: DailyAwarenessResult,
  answers: DailyAwarenessAnswers,
) => {
  const { supabase, userId } = await requireUserId();
  const updatedAt = new Date().toISOString();
  const stateCode: DailyAwarenessStateCode = result.patternCode === 'mixed' ? 'watching' : result.patternCode;
  const answersPayload = JSON.parse(JSON.stringify(answers)) as Json;
  const resultPayload = JSON.parse(JSON.stringify(result)) as Json;
  const updated = await supabase.from('awareness_diary_entries')
    .update({
      state_code: stateCode,
      answers: answersPayload,
      result: resultPayload,
      face_code: result.faceCode,
      assessment_version: result.modelVersion,
      completed_at: updatedAt,
      updated_at: updatedAt,
    })
    .eq('user_id', userId).eq('entry_date', entryDate).select('id').maybeSingle();
  if (updated.error) throw updated.error;
  if (!updated.data) {
    const { error } = await supabase.from('awareness_diary_entries').insert({
      user_id: userId,
      entry_date: entryDate,
      state_code: stateCode,
      answers: answersPayload,
      result: resultPayload,
      face_code: result.faceCode,
      assessment_version: result.modelVersion,
      completed_at: updatedAt,
      updated_at: updatedAt,
    });
    if (error) throw error;
  }
};

export const saveMemberNickname = async (nickname: string) => {
  const { supabase, userId } = await requireUserId();
  const { error } = await supabase.from('member_profiles').upsert({
    user_id: userId,
    nickname,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  if (error) throw error;
};

export const saveMemberDiaryEntry = async (entryDate: string, content: string) => {
  const { supabase, userId } = await requireUserId();
  if (!content) {
    // Clearing the free-text note must not erase the daily awareness result
    // stored in the same daily record.
    const { error } = await supabase.from('awareness_diary_entries')
      .update({ content: '', updated_at: new Date().toISOString() })
      .eq('user_id', userId).eq('entry_date', entryDate);
    if (error) throw error;
    return;
  }

  const updatedAt = new Date().toISOString();
  const updated = await supabase.from('awareness_diary_entries')
    .update({ content, updated_at: updatedAt })
    .eq('user_id', userId).eq('entry_date', entryDate).select('id').maybeSingle();
  if (updated.error) throw updated.error;
  if (!updated.data) {
    const { error } = await supabase.from('awareness_diary_entries').insert({
      user_id: userId, entry_date: entryDate, content, updated_at: updatedAt,
    });
    if (error) throw error;
  }
};
