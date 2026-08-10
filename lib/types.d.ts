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

export type PaddleData = PaddleEntry[];

export type APIFormData = {
  canvasData: HTMLCanvasElement;
  paddleData: PaddleData;
};
