export type BillingCycle = "MONTHLY" | "YEARLY";
export type SubscribeStatus = "ACTIVE" | "PAUSED";
export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "SIMPLE_PAY" | "ETC";
export type SubscribeCategory =
  | "OTT"
  | "MUSIC"
  | "CLOUD"
  | "PRODUCTIVITY"
  | "AI"
  | "NEWS"
  | "EDUCATION"
  | "GAME"
  | "SHOPPING"
  | "DESIGN"
  | "ETC";

// create/update 요청 바디
export interface Subscription {
  serviceName: string;
  category: SubscribeCategory;
  price: number;
  billingCycle: BillingCycle;
  billingDay: number;
  billingMonth: number | null;
  paymentMethod: PaymentMethod;
}

// 서버 응답 — 서버 할당 필드 포함
export interface SubscriptionDetail extends Subscription {
  subscriptionId: number;
  status: SubscribeStatus;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORY_META: Record<
  SubscribeCategory,
  { label: string; emoji: string; examples: string }
> = {
  OTT: {
    label: "영상 스트리밍",
    emoji: "🎬",
    examples: "Netflix, Disney+, TVING",
  },
  MUSIC: {
    label: "음악 스트리밍",
    emoji: "🎵",
    examples: "Spotify, Melon, Apple Music",
  },
  CLOUD: {
    label: "클라우드",
    emoji: "☁️",
    examples: "iCloud, Google Drive, Dropbox",
  },
  PRODUCTIVITY: {
    label: "생산성",
    emoji: "💼",
    examples: "Notion, Microsoft 365",
  },
  AI: {
    label: "AI 서비스",
    emoji: "🤖",
    examples: "ChatGPT, Claude, Perplexity",
  },
  NEWS: { label: "뉴스/콘텐츠", emoji: "📰", examples: "NYT, Medium" },
  EDUCATION: {
    label: "교육/강의",
    emoji: "📚",
    examples: "Inflearn, Udemy, Coursera",
  },
  GAME: { label: "게임", emoji: "🎮", examples: "Xbox Game Pass, PS Plus" },
  SHOPPING: {
    label: "쇼핑 멤버십",
    emoji: "🛍️",
    examples: "쿠팡 와우, 네이버플러스",
  },
  DESIGN: { label: "디자인", emoji: "🎨", examples: "Figma, Adobe CC, Canva" },
  ETC: { label: "기타", emoji: "📦", examples: "기타 구독 서비스" },
};

export const BILLING_CYCLE_META: Record<BillingCycle, { label: string }> = {
  MONTHLY: { label: "월간 결제" },
  YEARLY: { label: "연간 결제" },
};

export const SUBSCRIBE_STATUS_META: Record<
  SubscribeStatus,
  { label: string; color: string }
> = {
  ACTIVE: { label: "활성", color: "#22c55e" },
  PAUSED: { label: "일시 정지", color: "#94a3b8" },
};

export const PAYMENT_METHOD_META: Record<PaymentMethod, { label: string }> = {
  CARD: { label: "카드 결제" },
  BANK_TRANSFER: { label: "계좌이체" },
  SIMPLE_PAY: { label: "간편결제" },
  ETC: { label: "기타" },
};
