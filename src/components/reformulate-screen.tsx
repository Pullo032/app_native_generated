import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import {
  REFORMULATE_BEAMS,
  REFORMULATE_MAX_TOKENS,
  REFORMULATE_STYLES,
  REFORMULATE_TONES,
} from '../constants/tools';
import { colors } from '../constants/theme';
import { reformulate, type ReformulateResponse } from '../services/nlp';
import { AnalysisShell } from './analysis-shell';
import { GenerateButton } from './generate-button';
import { OptionChips } from './option-chips';
import { ReformulateResult } from './reformulate-result';
import { ResultCard, type ResultStatus } from './result-card';
import { Reveal } from './reveal';
import { TipCard } from './tip-card';

const REFORMULATE_SUGGESTIONS = [
  'Merci de nous transmettre votre document avant demain soir.',
  'Je ne peux pas assister à la réunion en raison d’un imprévu.',
  'Votre proposition est intéressante mais le tarif est trop élevé.',
];

export function ReformulateScreen() {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState(REFORMULATE_TONES[0]);
  const [style, setStyle] = useState(REFORMULATE_STYLES[0]);
  const [maxTokens, setMaxTokens] = useState('128');
  const [beams, setBeams] = useState('4');
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [message, setMessage] = useState<string | undefined>();
  const [result, setResult] = useState<ReformulateResponse | null>(null);

  const canRun = prompt.trim().length > 0 && status !== 'loading';

  async function handleRun() {
    if (!canRun) return;
    setStatus('loading');
    setResult(null);
    try {
      const response = await reformulate({
        input_text: prompt.trim(),
        tone,
        style,
        max_new_tokens: Number(maxTokens),
        num_beams: Number(beams),
      });
      setResult(response);
      setStatus('done');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'La reformulation a échoué.');
      setStatus('error');
    }
  }

  return (
    <AnalysisShell
      eyebrow="REFORMULATION"
      title="Réécrivez avec le bon ton"
      subtitle="Collez un texte, choisissez le ton et le style, WELI le reformule."
      placeholder="Ex : Merci de bien vouloir nous faire parvenir le dossier avant vendredi..."
      prompt={prompt}
      onPromptChange={setPrompt}
      suggestions={REFORMULATE_SUGGESTIONS}>
      <Reveal delay={220} style={styles.group}>
        <Text style={styles.groupLabel}>TON</Text>
        <OptionChips options={REFORMULATE_TONES} selected={tone} onSelect={setTone} />
      </Reveal>

      <Reveal delay={280} style={styles.group}>
        <Text style={styles.groupLabel}>STYLE</Text>
        <OptionChips options={REFORMULATE_STYLES} selected={style} onSelect={setStyle} />
      </Reveal>

      <Reveal delay={340} style={styles.group}>
        <Text style={styles.groupLabel}>LONGUEUR MAX</Text>
        <OptionChips options={REFORMULATE_MAX_TOKENS} selected={maxTokens} onSelect={setMaxTokens} />
      </Reveal>

      <Reveal delay={400} style={styles.group}>
        <Text style={styles.groupLabel}>BEAMS</Text>
        <OptionChips options={REFORMULATE_BEAMS} selected={beams} onSelect={setBeams} />
      </Reveal>

      <Reveal delay={460}>
        <GenerateButton
          label="Reformuler"
          loadingLabel="Reformulation en cours..."
          loading={status === 'loading'}
          disabled={!canRun}
          onPress={handleRun}
        />
      </Reveal>

      <Reveal delay={520}>
        <ResultCard
          status={status}
          emptyText="Le texte reformulé apparaîtra ici."
          message={message}>
          {result ? (
            <ReformulateResult
              result={result}
              onUseAsInput={(newText) => {
                setPrompt(newText);
                setStatus('idle');
                setResult(null);
              }}
            />
          ) : undefined}
        </ResultCard>
      </Reveal>

      <Reveal delay={580}>
        <TipCard text="Un ton clair et un style précis donnent une reformulation plus fidèle." />
      </Reveal>
    </AnalysisShell>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 10,
  },
  groupLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
});
