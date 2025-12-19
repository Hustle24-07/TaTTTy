export const FONT_STYLES = [
  "Gothic/Blackletter",
  "Chicano/LA Style",
  "Traditional/Old School",
  "Script/Cursive",
  "Graffiti/Street",
  "Tribal",
  "Japanese Brush",
  "Victorian/Ornate",
  "Minimalist/Fine Line",
  "Hand-poked/Stick & Poke"
] as const;

export type FontStyle = typeof FONT_STYLES[number];

export const UI_TEXT = {
  enterTextLabel: "Enter your text",
  enterTextPlaceholder: "e.g. Family First, 1998, Strength...",
  selectColorLabel: "Select Ink Color",
  selectStyleLabel: "Style",
  selectStylePlaceholder: "Choose a style...",
  black: "Black Ink",
  colors: "Color Ink",
  customizeLabel: "Customize your Fonts",
  customizePlaceholder: "Thoroughly describe your design (optional)",
  generateButton: "Generate Lettering",
  generating: "Generating...",
} as const;
