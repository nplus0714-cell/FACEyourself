export const RESEARCH_ADMIN_EMAIL = 'face.trader.npc@gmail.com';

export const isResearchAdminEmail = (email?: string | null): boolean => (
  email?.trim().toLowerCase() === RESEARCH_ADMIN_EMAIL
);
