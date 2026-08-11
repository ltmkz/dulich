export const CATEGORIES = {
  HISTORICAL_SITE: "Di tích lịch sử",
  RED_ADDRESS: "Địa chỉ đỏ",
  TOURIST_SPOT: "Điểm du lịch",
  COMMUNITY_CENTER: "Điểm sinh hoạt cộng đồng",
  CULTURAL_HERITAGE: "Di sản văn hóa",
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  HISTORICAL_SITE: "#e74c3c",
  RED_ADDRESS: "#c0392b",
  TOURIST_SPOT: "#27ae60",
  COMMUNITY_CENTER: "#2980b9",
  CULTURAL_HERITAGE: "#8e44ad",
};

export const CATEGORY_ICONS: Record<CategoryKey, string> = {
  HISTORICAL_SITE: "🏛️",
  RED_ADDRESS: "🔴",
  TOURIST_SPOT: "🌿",
  COMMUNITY_CENTER: "🏘️",
  CULTURAL_HERITAGE: "🎭",
};
