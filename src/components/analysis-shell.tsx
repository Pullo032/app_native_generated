import { type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius } from '../constants/theme';
import { AppHeader } from './app-header';
import { GlowBackground } from './glow-background';
import { Reveal } from './reveal';

const MAX_PROMPT_LENGTH = 500;

type AnalysisShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  placeholder: string;
  prompt: string;
  onPromptChange: (value: string) => void;
  suggestions?: string[];
  children: ReactNode;
};

export function AnalysisShell({
  eyebrow,
  title,
  subtitle,
  placeholder,
  prompt,
  onPromptChange,
  suggestions,
  children,
}: AnalysisShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <GlowBackground />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 48 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Reveal>
          <AppHeader />
        </Reveal>

        <Reveal delay={80} style={styles.intro}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Reveal>

        <Reveal delay={160}>
          <View style={styles.promptCard}>
            <TextInput
              value={prompt}
              onChangeText={onPromptChange}
              placeholder={placeholder}
              placeholderTextColor={colors.textDisabled}
              multiline
              maxLength={MAX_PROMPT_LENGTH}
              textAlignVertical="top"
              style={styles.input}
            />
            <View style={styles.promptFooter}>
              {prompt.length > 0 ? (
                <Pressable
                  onPress={() => onPromptChange('')}
                  style={styles.clearButton}
                  accessibilityRole="button"
                  accessibilityLabel="Effacer le texte">
                  <Ionicons name="close-circle" size={16} color={colors.textMuted} />
                  <Text style={styles.clearText}>Effacer</Text>
                </Pressable>
              ) : (
                <View />
              )}
              <Text style={styles.counter}>
                {prompt.length} / {MAX_PROMPT_LENGTH}
              </Text>
            </View>
          </View>
        </Reveal>

        {suggestions && suggestions.length > 0 ? (
          <Reveal delay={200} style={styles.suggestionsBox}>
            <View style={styles.suggestionHeader}>
              <Ionicons name="bulb-outline" size={14} color={colors.primaryBright} />
              <Text style={styles.suggestionTitle}>EXEMPLES RAPIDES</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionRow}>
              {suggestions.map((item, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => onPromptChange(item)}
                  style={styles.suggestionChip}
                  accessibilityRole="button">
                  <Text style={styles.suggestionChipText} numberOfLines={1}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Reveal>
        ) : null}

        {children}
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
  promptFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  clearText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  counter: {
    color: colors.textDisabled,
    fontSize: 12,
    fontWeight: '600',
  },
  suggestionsBox: {
    gap: 8,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  suggestionTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  suggestionRow: {
    gap: 8,
    paddingVertical: 2,
  },
  suggestionChip: {
    maxWidth: 240,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionChipText: {
    color: colors.mint,
    fontSize: 12,
    fontWeight: '600',
  },
});
