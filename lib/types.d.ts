import { z } from "zod";

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

export const TpnLabelObj = z.object({
  patientName: z.string().nullable(),
  rxNumber: z.string().nullable(),
  ivNumber: z.string().nullable(),
  prescriber: z.string().nullable(),

  orderVolumeMl: z.number().nullable(),
  compoundVolumeMl: z.number().nullable(),

  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.number().nullable(),
      unit: z.string().nullable(),
    }),
  ),

  administerVia: z.string().nullable(),
  administerDate: z.string().nullable(),
  orderSerialNumber: z.string().nullable(),
});

export type TpnLabel = z.infer<typeof TpnLabelObj>;
