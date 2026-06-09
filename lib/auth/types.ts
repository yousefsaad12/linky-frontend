export type PlanName = "free" | "pro";

export type PlanLimits = {
  maxLinks: number | null;
  clickHistoryDays: number;
};

export type PlanFeatures = {
  basicAnalytics: boolean;
  deviceAnalytics: boolean;
  countryAnalytics: boolean;
  cityAnalytics: boolean;
  advancedAnalytics: boolean;
  apiAccess: boolean;
};

export type PlanUsage = {
  links: number;
};

export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  plan: PlanName;
  limits: PlanLimits;
  features: PlanFeatures;
  usage: PlanUsage;
};

export type ApiKeySummary = {
  _id: string;
  name: string;
  prefix: string;
  lastUsedAt?: string | null;
  createdAt: string;
};

export type CreateApiKeyResponse = {
  id: string;
  name: string;
  prefix: string;
  key: string;
  createdAt: string;
};
