export type ChoiceLetter = "A" | "B" | "C" | "D";

export type VisualTable = {
  kind: "table";
  title?: string;
  columns: string[];
  rows: (string | number)[][];
  note?: string;
};

export type VisualChart = {
  kind: "bar" | "line";
  title?: string;
  xLabel?: string;
  yLabel?: string;
  categories: string[];
  series: { name: string; values: (number | null)[] }[];
  note?: string;
};

export type VisualData = VisualTable | VisualChart;

export type PublicChoice = {
  letter: ChoiceLetter;
  text: string;
};

export type RevealedChoice = PublicChoice & {
  rationale: string | null;
};

export type PublicQuestion = {
  id: string;
  assessment: string;
  test: string;
  domain: string;
  skill: string;
  difficulty: string;
  stimulus: string;
  prompt: string;
  hasVisual: boolean;
  visualType: string | null;
  visualImagePath: string | null;
  visualData: VisualData | null;
  sourcePage: number;
  choices: PublicChoice[];
};

export type RevealedQuestion = Omit<PublicQuestion, "choices"> & {
  correctChoice: ChoiceLetter;
  rationale: string;
  choices: RevealedChoice[];
};
