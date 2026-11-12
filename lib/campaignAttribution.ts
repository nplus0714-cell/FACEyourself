const keys = ['source', 'medium', 'campaign', 'content'] as const;
export type CampaignAttribution = Partial<Record<(typeof keys)[number], string>>;

export function readCampaignAttribution(params: URLSearchParams): CampaignAttribution {
  const attribution: CampaignAttribution = {};
  for (const key of keys) {
    const value = params.get(`utm_${key}`)?.trim().toLowerCase();
    const maxLength = key === 'source' || key === 'medium' ? 80 : 120;
    if (value && value.length <= maxLength && /^[a-z0-9][a-z0-9_-]*$/.test(value)) {
      attribution[key] = value;
    }
  }
  return attribution;
}
