import React from 'react';
import { BookOpen, LockKeyhole } from 'lucide-react';

interface AwarenessUnavailableProps {
  hasAssessmentResult: boolean;
  onViewResult: () => void;
  onStartTest: () => void;
  onBackHome: () => void;
}

export const AwarenessUnavailable: React.FC<AwarenessUnavailableProps> = ({
  hasAssessmentResult,
  onViewResult,
  onStartTest,
  onBackHome,
}) => (
  <section className="mx-auto max-w-3xl pb-28 pt-8 fade-in md:pt-16">
    <div className="overflow-hidden border border-[#CFC6B8] bg-[#F7F2EB]">
      <div className="grid md:grid-cols-[0.72fr_1.28fr]">
        <div className="flex min-h-64 items-center justify-center bg-[#4A382D] px-8 py-12 text-[#F7F2EB] md:min-h-[30rem]">
          <div className="text-center">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-white/30 bg-white/10" aria-hidden="true">
              <BookOpen size={34} strokeWidth={1.35} />
            </span>
            <p className="mt-7 text-xs font-medium tracking-[0.24em] text-white/65">FACE DAILY</p>
            <p className="mt-3 serif text-3xl leading-[1.5]">自我覺察日記</p>
          </div>
        </div>

        <div className="flex flex-col justify-center px-7 py-12 sm:px-10 md:px-14 md:py-16">
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#8C635B]">
            <LockKeyhole size={15} strokeWidth={1.7} aria-hidden="true" />
            尚未開放
          </p>
          <h1 className="mt-5 serif text-4xl font-normal leading-[1.45] text-[#2D2D2D] md:text-5xl">覺察路徑正在整理中</h1>
          <p className="mt-6 text-base leading-[2] text-[#5F574F]">
            正式開放後，系統會先讀取你的 24 題 FACE 人格結果，再把每日覺察直接寫入同一頁日記，不會另外跳到獨立結果頁。
          </p>
          <p className="mt-4 text-sm leading-7 text-[#8C7E6D]">目前先暫停填寫與儲存，既有 FACE 測驗結果不受影響。</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={hasAssessmentResult ? onViewResult : onStartTest}
              className="bg-[#4A382D] px-7 py-4 text-sm font-medium text-white transition hover:bg-[#352821]"
            >
              {hasAssessmentResult ? '查看我的 FACE 結果 →' : '先完成 FACE 測驗 →'}
            </button>
            <button type="button" onClick={onBackHome} className="border border-[#8C7E6D] bg-white px-7 py-4 text-sm font-medium text-[#4A382D] transition hover:bg-[#FCFBF8]">
              返回首頁
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);
