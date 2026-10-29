import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius } from '../constants/theme';

export type ResultStatus = 'idle' | 'loading' | 'done';

type ResultCardProps = {
  status: ResultStatus;
  emptyText: string;
  message?: string;
};

export function ResultCard({ status, emptyText, message }: ResultCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>RÉSULTAT</Text>
        {status === 'done' ? (
          <Ionicons name="checkmark-circle" size={18} color={colors.primaryBright} />
        ) : null}
      </View>

      {status === 'idle' ? <Text style={styles.empty}>{emptyText}</Text> : null}
      {status === 'loading' ? <Shimmer /> : null}
      {status === 'done' ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

function Shimmer() {
  const [pulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.9] });

  return (
    <Animated.View style={[styles.shimmerWrap, { opacity }]}>
      <View style={[styles.bar, { width: '92%' }]} />
      <View style={[styles.bar, { width: '78%' }]} />
      <View style={[styles.bar, { width: '55%' }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 140,
    padding: 18,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.primaryBright,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  empty: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  message: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  shimmerWrap: {
    gap: 10,
    paddingVertical: 4,
  },
  bar: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surfaceRaised,
  },
});
