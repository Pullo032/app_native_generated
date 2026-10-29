import type { GeneratorType } from '../constants/generators';

export type GenerationRequest = {
  type: GeneratorType;
  prompt: string;
  options: Record<string, string>;
};

export type GenerationResponse = {
  content: string | null;
  message: string;
};

export async function generateContent(request: GenerationRequest): Promise<GenerationResponse> {
  void request;
  return {
    content: null,
    message: 'Génération non connectée au backend pour le moment.',
  };
}
