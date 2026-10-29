import { postJson } from './api';

export type ReformulateRequest = {
  input_text: string;
  tone: string;
  style: string;
  max_new_tokens: number;
  num_beams: number;
};

export type ReformulateResponse = {
  input_text: string;
  tone: string;
  style: string;
  prediction: string;
  generation_parameters: {
    max_new_tokens: number;
    num_beams: number;
  };
};

export type SentimentResponse = {
  input_text: string;
  label: string;
  score: number;
  probabilities: Record<string, number>;
};

export type NerEntity = {
  text: string;
  label: string;
  score: number;
  start: number;
  end: number;
};

export type NerResponse = {
  input_text: string;
  entities: NerEntity[];
};

export function reformulate(request: ReformulateRequest) {
  return postJson<ReformulateResponse>('/reformulate', request);
}

export function analyzeSentiment(inputText: string) {
  return postJson<SentimentResponse>('/sentiment', { input_text: inputText });
}

export function extractEntities(inputText: string) {
  return postJson<NerResponse>('/ner', { input_text: inputText });
}
