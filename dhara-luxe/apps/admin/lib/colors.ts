export const COLOR_OPTIONS = [
  "Ecru",
  "Terra",
  "Forest",
  "Noir",
  "Sand",
  "Clay",
  "Cocoa",
  "Olive",
  "Burgundy",
  "Slate",
  "Blush",
  "Gold",
] as const;

export type ProductColor = typeof COLOR_OPTIONS[number];

export const COLOR_HEX: Record<ProductColor, string> = {
  Ecru: "#EAE5DB",
  Terra: "#C9B39A",
  Forest: "#2E4A38",
  Noir: "#1E1E1E",
  Sand: "#D8CBB6",
  Clay: "#B96E59",
  Cocoa: "#6B4F3A",
  Olive: "#6B7E4E",
  Burgundy: "#6E1F31",
  Slate: "#6E737B",
  Blush: "#E9C7C1",
  Gold: "#C2A97E",
};
