import React from 'react';
import { SITE_IDENTITY } from '../data/siteIdentity';

const legalLinks = [
  { href: '/privacy', label: '隱私權政策' },
  { href: '/terms', label: '使用條款' },
  { href: '/refund-policy', label: '退款與取消政策' },
  { href: '/data-deletion', label: '資料刪除說明' },
];

export const SiteFooter: React.FC = () => (
  <footer className="mt-16 w-full border-t border-[#D1D1C7]/80 bg-[#F3F0EB] px-5 py-10 text-[#655D56] sm:mt-24 sm:px-8 md:py-12">
    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p className="serif text-xl text-[#2D2D2D]">{SITE_IDENTITY.publicName}</p>
        <a className="mt-3 inline-block text-sm underline decoration-[#A99182] underline-offset-4 transition hover:text-[#8C635B]" href={`mailto:${SITE_IDENTITY.email}`}>
          {SITE_IDENTITY.email}
        </a>
        <p className="mt-4 max-w-xl text-xs leading-6 text-[#7A7169]">
          本站提供交易教育與自我覺察內容，不構成投資建議、個別標的推薦或報酬保證。
        </p>
      </div>
      <nav className="flex max-w-xl flex-wrap gap-x-5 gap-y-3 text-sm" aria-label="法律與服務資訊">
        {legalLinks.map((link) => (
          <a key={link.href} href={link.href} className="border-b border-transparent pb-0.5 transition hover:border-[#8C635B] hover:text-[#8C635B]">
            {link.label}
          </a>
        ))}
      </nav>
    </div>
    <p className="mx-auto mt-8 max-w-6xl border-t border-[#D1D1C7]/70 pt-5 text-xs text-[#8A8179]">
      © {new Date().getFullYear()} {SITE_IDENTITY.publicName}
    </p>
  </footer>
);
