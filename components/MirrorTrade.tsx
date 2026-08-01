import React from 'react';
import { AuthUser } from '../types';
import { MirrorTradeDemo } from './MirrorTradeDemo';

interface MirrorTradeProps {
  user: AuthUser | null;
  onLogin: () => void;
}

/**
 * The public route stays intentionally small: portfolio data belongs behind a
 * member session. `MirrorTradeDemo` is the transplanted standalone demo and
 * will later receive a real authenticated portfolio record.
 */
export const MirrorTrade: React.FC<MirrorTradeProps> = ({ user, onLogin }) => {
  if (!user) {
    return <section className="mx-auto max-w-4xl pb-28 pt-4 fade-in md:pt-10">
      <div className="border border-[#D1D1C7] bg-[#F7F4EF] px-7 py-12 text-center md:px-16 md:py-20">
        <p className="text-sm font-bold tracking-[0.2em] text-[#8C635B]">RATE · MIRRORTRADE</p>
        <h1 className="mt-5 serif text-4xl leading-[1.5] text-[#2D2D2D] md:text-5xl">RATE 鏡相診股</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-[2] text-[#5F574F]">認識自己用 FACE，再用 RATE 整理自選股與交易風格是否一致。</p>
        <div className="mx-auto mt-10 max-w-xl border-y border-[#D1D1C7] py-7 text-left text-base leading-[2] text-[#5F574F]">
          <p>FACE 向內看見你的交易傾向；RATE 向外整理真實持倉。兩者落差太大時，往往就是焦慮的來源。</p>
          <p className="mt-3">登入後，你可以輸入自選股，整理持股結構與交易習慣。</p>
          <p className="mt-3">RATE 不提供個別股票買賣建議、進出場時點、目標價、持股比例或報酬預估。</p>
          <p className="mt-3">未來正式登入與 CRM 資料表接上後，診股紀錄會只屬於你自己的會員帳戶。</p>
        </div>
        <button type="button" onClick={onLogin} className="mt-10 bg-[#2D2D2D] px-9 py-4 text-base font-bold text-white transition hover:bg-black">登入後開啟 RATE</button>
      </div>
    </section>;
  }

  return <div className="fade-in"><MirrorTradeDemo /></div>;
};
