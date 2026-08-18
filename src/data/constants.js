export const NODES = [
  { id: "intake", cx: 80, cy: 180, r: 20, label: "intake", stage: 0 },
  { id: "router", cx: 235, cy: 180, r: 20, label: "intent router", stage: 1 },
  { id: "planner", cx: 390, cy: 180, r: 20, label: "planner", stage: 2 },
  { id: "resume", cx: 590, cy: 80, r: 18, label: "resume", stage: 3, agent: true },
  { id: "jobs", cx: 590, cy: 180, r: 18, label: "jobs", stage: 3, agent: true },
  { id: "interview", cx: 590, cy: 280, r: 18, label: "interview", stage: 3, agent: true },
  { id: "synth", cx: 770, cy: 180, r: 20, label: "synthesis", stage: 4 },
  { id: "memory", cx: 905, cy: 180, r: 18, label: "memory", stage: 5 },
  { id: "final", cx: 1030, cy: 180, r: 18, label: "final", stage: 6 },
];

export const EDGES = [
  "M80,180 L235,180", "M235,180 L390,180",
  "M390,180 C480,180 500,80 590,80", "M390,180 L590,180", "M390,180 C480,180 500,280 590,280",
  "M590,80 C680,80 700,180 770,180", "M590,180 L770,180", "M590,280 C680,280 700,180 770,180",
  "M770,180 L905,180", "M905,180 L1030,180",
];

export const NAV = [
  { href: "#products", label: "Products" },
  { href: "#model", label: "How it works" },
  { href: "#roadmap", label: "Roadmap" },
];
