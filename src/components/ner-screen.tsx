import { useState } from 'react';

import { extractEntities, type NerResponse } from '../services/nlp';
import { AnalysisShell } from './analysis-shell';
import { GenerateButton } from './generate-button';
import { NerResult } from './ner-result';
import { ResultCard, type ResultStatus } from './result-card';
import { Reveal } from './reveal';
import { TipCard } from './tip-card';

const NER_SUGGESTIONS = [
  'Marie Curie a reçu le prix Nobel à Paris en physique et chimie.',
  'Emmanuel Macron et la directrice de l’UNESCO se rencontrent à Rome.',
  'Apple et Microsoft développent de nouveaux centres de données en France.',
];

export function NerScreen() {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [message, setMessage] = useState<string | undefined>();
  const [result, setResult] = useState<NerResponse | null>(null);

  const canRun = prompt.trim().length > 0 && status !== 'loading';

  async function handleRun() {
    if (!canRun) return;
    setStatus('loading');
    setResult(null);
    try {
      const response = await extractEntities(prompt.trim());
      setResult(response);
      setStatus('done');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'L’extraction NER a échoué.');
      setStatus('error');
    }
  }

  return (
    <AnalysisShell
      eyebrow="RECONNAISSANCE D’ENTITÉS"
      title="Repérez les informations clés"
      subtitle="WELI extrait les personnes, lieux, organisations et autres entités."
      placeholder="Ex : Marie Dupont a rencontré le maire de Lyon au siège de l’UNESCO."
      prompt={prompt}
      onPromptChange={setPrompt}
      suggestions={NER_SUGGESTIONS}>
      <Reveal delay={220}>
        <GenerateButton
          label="Extraire les entités"
          loadingLabel="Extraction en cours..."
          loading={status === 'loading'}
          disabled={!canRun}
          onPress={handleRun}
        />
      </Reveal>

      <Reveal delay={280}>
        <ResultCard
          status={status}
          emptyText="Les entités détectées apparaîtront ici."
          message={message}>
          {result ? <NerResult result={result} /> : undefined}
        </ResultCard>
      </Reveal>

      <Reveal delay={340}>
        <TipCard text="Un texte avec des noms propres donne des détections plus riches." />
      </Reveal>
    </AnalysisShell>
  );
}
