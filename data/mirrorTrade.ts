/**
 * MirrorTrade's future data contract.
 *
 * This is intentionally UI-only for now. When authentication and CRM sync are
 * ready, `userId`, `assessmentRunId`, and the holdings will be persisted as a
 * member-owned portfolio-check record instead of being sent from the browser
 * to a CRM directly.
 */
export interface MirrorTradeHolding {
  id: string;
  symbol: string;
  allocation: string;
  holdingReason: string;
}

export interface MirrorTradeDraft {
  userId: string;
  assessmentRunId?: string;
  faceCode?: string;
  holdings: MirrorTradeHolding[];
  updatedAt: string;
}

export const createEmptyHolding = (): MirrorTradeHolding => ({
  id: crypto.randomUUID(),
  symbol: '',
  allocation: '',
  holdingReason: '',
});
