export const STYLES = [
  { id: "sketch", label: "Sketch", description: "Raw, pencil-like strokes with visible construction lines." },
  { id: "line-art", label: "Fine Line", description: "Delicate, precise lines with minimal shading." },
  { id: "stipple", label: "Stipple/Dotwork", description: "Created entirely from thousands of tiny dots." },
  { id: "blackwork", label: "Blackwork", description: "Bold, solid black shapes and high contrast." },
  { id: "traditional", label: "Traditional", description: "Bold outlines and a limited, classic palette." },
  { id: "surrealism", label: "Surrealism", description: "Dream-like, illogical scenes and bizarre imagery." },
  { id: "neo-traditional", label: "Neo-Traditional", description: "Modern take on traditional with more detail and color." },
  { id: "japanese", label: "Japanese/Irezumi", description: "Traditional Japanese motifs like dragons and koi." },
  { id: "geometric", label: "Geometric", description: "Perfect shapes, patterns, and mathematical precision." },
  { id: "watercolor", label: "Watercolor", description: "Fluid, painterly style with vibrant color splashes." },
  { id: "tribal", label: "Tribal", description: "Bold black patterns inspired by indigenous cultures." },
  { id: "realism", label: "Realism", description: "Photorealistic depictions of people, animals, or objects." },
  { id: "trash-polka", label: "Trash Polka", description: "Collage-like style mixing realism and abstract strokes." },
  { id: "bio-mechanical", label: "Bio-Mechanical", description: "Fusing human anatomy with machine parts." },
  { id: "minimalist", label: "Minimalist", description: "Simple, clean designs with negative space." },
  { id: "abstract", label: "Abstract", description: "Non-representational forms and symbolic imagery." },
  { id: "illustrative", label: "Illustrative", description: "Comic book style with bold colors and outlines." },
  { id: "cartoon", label: "Cartoon", description: "Playful, exaggerated features and vibrant hues." },
  { id: "gothic", label: "Gothic", description: "Dark, ornate designs with intricate details." },
  { id: "steampunk", label: "Steampunk", description: "Victorian-era machinery fused with organic elements." },
  { id: "cyberpunk", label: "Cyberpunk", description: "Neon lights, circuitry, and futuristic dystopia." },
  { id: "floral", label: "Floral", description: "Beautiful flowers and botanical motifs." },
  { id: "mandala", label: "Mandala", description: "Symmetrical patterns radiating from a center." },
  { id: "horror", label: "Horror", description: "Spooky, macabre themes with dark imagery." },
] as const;

export type TattooStyle = typeof STYLES[number]["id"];

export const PLACEMENTS = [
  { id: "forearm", label: "Forearm", image: "/placements/generated-image-1 (8).webp" },
  { id: "chest", label: "Chest", image: "/placements/generated-image-1 (9).webp" },
  { id: "back", label: "Back", image: "/placements/generated-image-1 (10).webp" },
  { id: "shoulder", label: "Shoulder", image: "/placements/generated-image-1 (11).webp" },
  { id: "leg", label: "Leg/Calf", image: "/placements/generated-image-1 (12).webp" },
  { id: "ribs", label: "Ribs", image: "/placements/generated-image-1 (13).webp" },
  { id: "neck", label: "Neck", image: "/placements/generated-image-1 (14).webp" },
  { id: "hand", label: "Hand", image: "/placements/generated-image-1 (15).webp" },
  { id: "wrist", label: "Wrist", image: "/placements/generated-image-1 (16).webp" },
  { id: "ankle", label: "Ankle", image: "/placements/generated-image-1 (17).webp" },
  { id: "thigh", label: "Thigh", image: "/placements/generated-image-1 (18).webp" },
  { id: "stomach", label: "Stomach", image: "/placements/generated-image-1 (19).webp" },
  { id: "spine", label: "Spine", image: "/placements/generated-image-2 (10).webp" },
  { id: "bicep", label: "Bicep", image: "" },
  { id: "tricep", label: "Tricep", image: "" },
  { id: "shin", label: "Shin", image: "" },
  { id: "foot", label: "Foot", image: "" },
  { id: "finger", label: "Finger", image: "" },
  { id: "hip", label: "Hip", image: "" },
  { id: "full-sleeve", label: "Full Sleeve", image: "" },
] as const;

export type TattooPlacement = typeof PLACEMENTS[number]["id"];

export const COLORS = [
  "Black & Grey",
  "Full Color",
  "Red Ink Accents",
  "Blue Ink",
  "Minimalist",
] as const;

export type TattooColor = typeof COLORS[number];

export const ASPECT_RATIOS = [
  { id: "square", label: "Square", value: "1:1" },
  { id: "portrait", label: "Portrait", value: "3:4" },
  { id: "landscape", label: "Landscape", value: "4:3" },
  { id: "wide", label: "Wide", value: "16:9" },
] as const;

export type AspectRatio = typeof ASPECT_RATIOS[number]["value"];

export const MOODS = [
  "Melancholic",
  "Triumphant",
  "Chaotic",
  "Serene",
  "Aggressive",
  "Mystical",
  "Nostalgic",
  "Ethereal",
  "Dark",
  "Playful",
  "Stoic",
  "Romantic",
  "Futuristic",
  "Elegant",
] as const;

export type Mood = typeof MOODS[number];

export const QUESTIONS = [
  {
    id: "pain",
    question: "What is the pain you carry that made you who you are?",
    placeholder: "Speak your truth... it stays between us.",
  },
  {
    id: "memory",
    question: "What is the one memory you would bleed to keep?",
    placeholder: "The moment that defined your soul...",
  },
] as const;

export const UI_TEXT = {
  title: "Tattty",
  subtitle: "Deep Ink, No Data. Your story, translated into art.",
  generateButton: "Get Me Inked",
  generating: "Baddie is thinking...",
  inking: "Tattty is inking...",
} as const;
