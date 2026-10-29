import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from './app-header';
import { GenerateButton } from './generate-button';
import { GlowBackground } from './glow-background';
import { OptionChips } from './option-chips';
import { Reveal } from './reveal';
import { ResultCard, type ResultStatus } from './result-card';
import { TipCard } from './tip-card';
import type { GeneratorConfig } from '../constants/generators';
import { colors, radius } from '../constants/theme';
import { generateContent } from '../services/generation';

const MAX_PROMPT_LENGTH = 500;

type GeneratorScreenProps = {
  config: GeneratorConfig;
};

function initialSelections(config: GeneratorConfig) {
  return Object.fromEntries(config.optionGroups.map((group) => [group.label, group.options[0]]));
}

export function GeneratorScreen({ config }: GeneratorScreenProps) {
  const insets = useSafeAreaInsets();
  const [prompt, setPrompt] = useState('');
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    initialSelections(config)
  );
  const [status, setStatus] = useState<ResultStatus>('idle');
  const [message, setMessage] = useState<string | undefined>(undefined);

  const canGenerate = prompt.trim().length > 0 && status !== 'loading';

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setStatus('loading');
    try {
      const response = await generateContent({
        type: config.type,
        prompt: prompt.trim(),
        options: selections,
      });
      setMessage(response.message);
    } catch {
      setMessage('Une erreur est survenue. Réessayez plus tard.');
    }
    setStatus('done');
  };

  return (
    <View style={styles.screen}>
      <GlowBackground />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 140 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Reveal>
          <AppHeader />
        </Reveal>

        <Reveal delay={80} style={styles.intro}>
          <Text style={styles.eyebrow}>{config.eyebrow}</Text>
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.subtitle}>{config.subtitle}</Text>
        </Reveal>

        <Reveal delay={160}>
          <View style={styles.promptCard}>
            <TextInput
              value={prompt}
              onChangeText={setPrompt}
              placeholder={config.placeholder}
              placeholderTextColor={colors.textDisabled}
              multiline
              maxLength={MAX_PROMPT_LENGTH}
              textAlignVertical="top"
              style={styles.input}
            />
            <Text style={styles.counter}>
              {prompt.length} / {MAX_PROMPT_LENGTH}
            </Text>
          </View>
        </Reveal>

        {config.optionGroups.map((group, index) => (
          <Reveal key={group.label} delay={220 + index * 60} style={styles.group}>
            <Text style={styles.groupLabel}>{group.label.toUpperCase()}</Text>
            <OptionChips
              options={group.options}
              selected={selections[group.label]}
              onSelect={(option) =>
                setSelections((current) => ({ ...current, [group.label]: option }))
              }
            />
          </Reveal>
        ))}

        <Reveal delay={380}>
          <GenerateButton
            label={config.actionLabel}
            loading={status === 'loading'}
            disabled={!canGenerate}
            onPress={handleGenerate}
          />
        </Reveal>

        <Reveal delay={440}>
          <ResultCard status={status} emptyText={config.emptyResultText} message={message} />
        </Reveal>

        <Reveal delay={500}>
          <TipCard text={config.tip} />
        </Reveal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    gap: 22,
  },
  intro: {
    gap: 8,
  },
  eyebrow: {
    color: colors.primaryBright,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 36,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  promptCard: {
    padding: 16,
    minHeight: 150,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    minHeight: 110,
    color: colors.text,
    fontSize: 16,
    lineHeight: 23,
  },
  counter: {
    alignSelf: 'flex-end',
    color: colors.textDisabled,
    fontSize: 12,
    fontWeight: '600',
  },
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
