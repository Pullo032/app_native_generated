import { useEffect, useMemo, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import type { SentimentResponse } from '../services/nlp';
import { colors, radius } from '../constants/theme';

type SentimentMeta = {
  label: string;
  color: string;
  bgTint: string;
  borderColor: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const SENTIMENT_CONFIG: Record<string, SentimentMeta> = {
  positive: {
    label: 'Positif',
    color: '#31C191',
    bgTint: 'rgba(49, 193, 145, 0.14)',
    borderColor: 'rgba(49, 193, 145, 0.35)',
    icon: 'happy-outline',
  },
  negative: {
    label: 'Négatif',
    color: '#F87171',
    bgTint: 'rgba(248, 113, 113, 0.14)',
    borderColor: 'rgba(248, 113, 113, 0.35)',
    icon: 'sad-outline',
  },
  neutral: {
    label: 'Neutre',
    color: '#38BDF8',
    bgTint: 'rgba(56, 189, 248, 0.14)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    icon: 'remove-circle-outline',
  },
};

export function SentimentResult({ result }: { result: SentimentResponse }) {
  const [copied, setCopied] = useState(false);
  const normalizedKey = result.label.toLowerCase();
  const config =
    SENTIMENT_CONFIG[normalizedKey] ?? {
      label: result.label,
      color: colors.primaryBright,
      bgTint: 'rgba(49, 193, 145, 0.14)',
      borderColor: colors.border,
      icon: 'sparkles-outline',
    };

  const entries = useMemo(
    () =>
      Object.entries(result.probabilities ?? {}).sort(
        (left, right) => right[1] - left[1]
      ),
    [result.probabilities]
  );

  const handleCopy = async () => {
    const text = `Sentiment: ${config.label} (${Math.round(result.score * 100)}% de confiance)`;
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.sentimentBadge,
            { backgroundColor: config.bgTint, borderColor: config.borderColor },
          ]}>
          <Ionicons name={config.icon} size={20} color={config.color} />
          <Text style={[styles.sentimentLabel, { color: config.color }]}>
            {config.label.toUpperCase()}
          </Text>
        </View>

        <Pressable
          onPress={handleCopy}
          accessibilityRole="button"
          accessibilityLabel="Copier le résultat"
          style={[styles.copyButton, copied && styles.copyButtonDone]}>
          <Ionicons
            name={copied ? 'checkmark' : 'copy-outline'}
            size={13}
            color={copied ? colors.text : colors.mint}
          />
          <Text style={[styles.copyText, copied && styles.copyTextDone]}>
            {copied ? 'Copié !' : 'Copier'}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.scoreText}>
        Score global :{' '}
        <Text style={[styles.scoreValue, { color: config.color }]}>
          {Math.round(result.score * 100)}%
        </Text>{' '}
        de confiance
      </Text>

      <View style={styles.barsSection}>
        <Text style={styles.sectionHeader}>DÉTAIL DES PROBABILITÉS</Text>
        {entries.map(([name, value]) => {
          const itemKey = name.toLowerCase();
          const itemMeta = SENTIMENT_CONFIG[itemKey];
          return (
            <ProbabilityBar
              key={name}
              label={itemMeta?.label ?? name}
              value={value}
              color={itemMeta?.color ?? colors.mint}
            />
          );
        })}
      </View>
    </View>
  );
}

function ProbabilityBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [anim, value]);

  const targetWidth = Math.max(Math.round(value * 100), 2);
  const animatedWidth = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${targetWidth}%`],
  });

  return (
    <View style={styles.barRow}>
      <View style={styles.barCopy}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={[styles.barValue, { color }]}>
          {(value * 100).toFixed(1)}%
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: animatedWidth,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sentimentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  sentimentLabel: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
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
  copyText: {
    color: colors.mint,
    fontSize: 12,
    fontWeight: '700',
  },
  copyTextDone: {
    color: colors.text,
  },
  scoreText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  scoreValue: {
    fontWeight: '800',
  },
  barsSection: {
    gap: 10,
    marginTop: 4,
  },
  sectionHeader: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  barRow: {
    gap: 6,
  },
  barCopy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  barValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    height: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    overflow: 'hidden',
  },
  fill: {
    height: 9,
    borderRadius: radius.pill,
  },
});
