import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import type { ReformulateResponse } from '../services/nlp';
import { colors, radius } from '../constants/theme';

export function ReformulateResult({
  result,
  onUseAsInput,
}: {
  result: ReformulateResponse;
  onUseAsInput?: (text: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result.prediction) return;
    await Clipboard.setStringAsync(result.prediction);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionBar}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="color-wand-outline" size={13} color={colors.primaryBright} />
            <Text style={styles.badgeText}>{result.tone}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="brush-outline" size={13} color={colors.mint} />
            <Text style={[styles.badgeText, { color: colors.mint }]}>{result.style}</Text>
          </View>
        </View>

        <Pressable
          onPress={handleCopy}
          accessibilityRole="button"
          accessibilityLabel="Copier le texte reformulé"
          style={[styles.copyButton, copied && styles.copyButtonDone]}>
          <Ionicons
            name={copied ? 'checkmark' : 'copy-outline'}
            size={14}
            color={copied ? colors.text : colors.mint}
          />
          <Text style={[styles.copyButtonText, copied && styles.copyButtonTextDone]}>
            {copied ? 'Copié !' : 'Copier'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.predictionText} selectable>
          {result.prediction}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {result.generation_parameters.max_new_tokens} tokens max • {result.generation_parameters.num_beams} beams
        </Text>

        {onUseAsInput ? (
          <Pressable
            onPress={() => onUseAsInput(result.prediction)}
            style={styles.reuseButton}
            accessibilityRole="button">
            <Ionicons name="arrow-redo-outline" size={13} color={colors.mint} />
            <Text style={styles.reuseText}>Réutiliser comme entrée</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    color: colors.primaryBright,
    fontSize: 12,
    fontWeight: '700',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  copyButtonDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryBright,
  },
  copyButtonText: {
    color: colors.mint,
    fontSize: 12,
    fontWeight: '700',
  },
  copyButtonTextDone: {
    color: colors.text,
  },
  textWrap: {
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  predictionText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  reuseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reuseText: {
    color: colors.mint,
    fontSize: 12,
    fontWeight: '600',
  },
});
