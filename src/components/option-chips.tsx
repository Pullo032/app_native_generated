import { useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors, radius } from '../constants/theme';

type OptionChipsProps = {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
};

export function OptionChips({ options, selected, onSelect }: OptionChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          active={option === selected}
          onPress={() => onSelect(option)}
        />
      ))}
    </ScrollView>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const [scale] = useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 3, tension: 180, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        style={[styles.chip, active && styles.chipActive]}>
        <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 8,
    paddingRight: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.primaryBright,
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.text,
  },
});
