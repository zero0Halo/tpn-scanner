type PaddleBox = [
  [number, number],
  [number, number],
  [number, number],
  [number, number],
];
type PaddleEntry = {
  text: string;
  confidence: number;
  box: PaddleBox;
};

type PaddleData = PaddleEntry[];

export type FormData = {
  canvasData: HTMLCanvasElement;
  paddleData: PaddleData;
};
