import React, { useEffect, useMemo, useState } from 'react';
import { FACE_MAP, getFaceCode } from '../constants';
import { getMemberAssessmentHistory, type MemberAssessmentRecord } from '../services/memberAssessmentHistory';
import { getBrowserPendingAssessment } from '../services/localAssessmentResult';
import type { AuthUser, FaceScores } from '../types';

interface LastAssessmentCardProps {
  user: AuthUser | null;
  localScores: FaceScores | null;
  localCompletedAt?: string;
  onViewResult: (scores: FaceScores) => void;
}

type DisplayedResult = {
  code: string;
  scores: FaceScores;
  completedAt?: string;
  source: 'member' | 'browser';
};

const getBrowserPendingResult = (): DisplayedResult | null => {
  const pending = getBrowserPendingAssessment();
  return pending ? {
    code: getFaceCode(pending.scores),
    scores: pending.scores,
    completedAt: pending.completedAt,
    source: 'browser',
  } : null;
};

const formatDate = (value?: string): string | null => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('zh-TW', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
};

/** A compact home-page reminder for the latest saved or guest-cached result. */
export const LastAssessmentCard: React.FC<LastAssessmentCardProps> = ({ user, localScores, localCompletedAt, onViewResult }) => {
  const [memberRecord, setMemberRecord] = useState<{ userId: string; record: MemberAssessmentRecord } | null>(null);

  useEffect(() => {
    let active = true;
    if (!user) {
      setMemberRecord(null);
      return () => { active = false; };
    }

    void getMemberAssessmentHistory()
      .then((records) => {
        if (active && records[0]) setMemberRecord({ userId: user.id, record: records[0] });
      })
      .catch((error) => console.warn('Unable to load the latest member assessment', error));

    return () => { active = false; };
  }, [user?.id]);

  const result = useMemo<DisplayedResult | null>(() => {
    if (user && memberRecord?.userId === user.id) {
      return {
        code: memberRecord.record.code,
        scores: memberRecord.record.scores,
        completedAt: memberRecord.record.completedAt,
        source: 'member',
      };
    }
    if (localScores) {
      return {
        code: getFaceCode(localScores),
        scores: localScores,
        completedAt: localCompletedAt,
        source: 'browser',
      };
    }
    return getBrowserPendingResult();
  }, [localCompletedAt, localScores, memberRecord, user]);

  if (!result) return null;

  const profile = FACE_MAP[result.code];
  const completedAt = formatDate(result.completedAt);

  return <section className="border border-[#D1D1C7] bg-[#FCFBF8] px-5 py-4 text-left shadow-[0_10px_28px_rgba(45,45,45,0.06)] sm:px-6" aria-label="上次測驗結果">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#8C635B]">LAST RESULT</p>
        <p className="mt-2 serif text-xl text-[#2D2D2D] sm:text-2xl">你上次的結果：{profile?.name ?? result.code}</p>
        <p className="mt-2 text-sm leading-6 text-[#70665D]">
          <span className="font-bold tracking-[0.12em] text-[#8C635B]">{result.code}</span>
          {profile?.attributes && <span className="ml-3">{profile.attributes.replaceAll(' / ', '／')}</span>}
        </p>
      </div>
      <button type="button" onClick={() => onViewResult(result.scores)} className="shrink-0 border-b border-[#2D2D2D] pb-1 pt-1 text-sm font-bold text-[#2D2D2D] transition hover:text-[#8C635B] hover:border-[#8C635B]">
        查看結果 →
      </button>
    </div>
    <p className="mt-3 text-xs text-[#8C7E6D]">{result.source === 'member' ? '已保存到你的帳號' : '暫存在這個瀏覽器'}{completedAt ? ` · ${completedAt}` : ''}</p>
  </section>;
};
