import type { CaptureAction, GeneratorType } from '../constants/generators';

export type GenerationRequest = {
  type: GeneratorType;
  prompt: string;
  options: Record<string, string>;
};

export type GenerationResponse = {
  content: string | null;
  message: string;
};

export type Capture = {
  kind: 'photo' | 'video';
  uri: string;
};

export type CaptureRequest = {
  action: CaptureAction;
  capture: Capture;
};

export async function generateContent(request: GenerationRequest): Promise<GenerationResponse> {
  void request;
  return {
    content: null,
    message: 'Génération non connectée au backend pour le moment.',
  };
}

export async function processCapture(request: CaptureRequest): Promise<GenerationResponse> {
  void request;
  return {
    content: null,
    message: 'Traitement non connecté au backend pour le moment.',
  };
}
