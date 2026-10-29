import { useState } from 'react';

import { analyzeSentiment, type SentimentResponse } from '../services/nlp';
import { AnalysisShell } from './analysis-shell';
import { GenerateButton } from './generate-button';
import { ResultCard, type ResultStatus } from './result-card';
import { Reveal } from './reveal';
import { SentimentResult } from './sentiment-result';
import { TipCard } from './tip-card';

const SENTIMENT_SUGGESTIONS = [
  'Ce produit est absolument fantastique et dépasse mes attentes !',
  'Très déçu du délai de livraison et du service client désagréable.',
  'Le paquet a été déposé dans la boîte aux lettres à 14h.',
];

export function SentimentScreen() {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [message, setMessage] = useState<string | undefined>();
  const [result, setResult] = useState<SentimentResponse | null>(null);

  const canRun = prompt.trim().length > 0 && status !== 'loading';

  async function handleRun() {
    if (!canRun) return;
    setStatus('loading');
    setResult(null);
    try {
      const response = await analyzeSentiment(prompt.trim());
      setResult(response);
      setStatus('done');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'L’analyse de sentiment a échoué.');
      setStatus('error');
    }
  }

  return (
    <AnalysisShell
      eyebrow="ANALYSE DE SENTIMENT"
      title="Lisez entre les lignes"
      subtitle="WELI classe le texte et indique le niveau de confiance."
      placeholder="Ex : Je suis vraiment ravi du service, tout s’est parfaitement passé."
      prompt={prompt}
      onPromptChange={setPrompt}
      suggestions={SENTIMENT_SUGGESTIONS}>
      <Reveal delay={220}>
        <GenerateButton
          label="Analyser le sentiment"
          loadingLabel="Analyse en cours..."
          loading={status === 'loading'}
          disabled={!canRun}
          onPress={handleRun}
        />
      </Reveal>

      <Reveal delay={280}>
        <ResultCard
          status={status}
          emptyText="Le sentiment détecté apparaîtra ici."
          message={message}>
          {result ? <SentimentResult result={result} /> : undefined}
        </ResultCard>
      </Reveal>

      <Reveal delay={340}>
        <TipCard text="Plus le texte est complet, plus le score de confiance est fiable." />
      </Reveal>
    </AnalysisShell>
  );
}
