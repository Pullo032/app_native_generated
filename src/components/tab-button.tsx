import { forwardRef, useEffect, useState, type ComponentRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TabTriggerSlotProps } from 'expo-router/ui';

import type { IconName } from '../constants/generators';
import { colors, radius } from '../constants/theme';

type TabButtonProps = Omit<TabTriggerSlotProps, 'ref'> & {
  icon: IconName;
  label: string;
};

export const TabButton = forwardRef<ComponentRef<typeof Pressable>, TabButtonProps>(function TabButton(
  { isFocused, icon, label, ...pressableProps },
  ref
) {
  const [focus] = useState(() => new Animated.Value(isFocused ? 1 : 0));

  useEffect(() => {
    Animated.spring(focus, {
      toValue: isFocused ? 1 : 0,
      friction: 7,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [isFocused, focus]);

  const pillScale = focus.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <Pressable
      {...pressableProps}
      ref={ref}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={styles.button}>
      <Animated.View
        pointerEvents="none"
        style={[styles.pill, { opacity: focus, transform: [{ scale: pillScale }] }]}
      />
      <Ionicons name={icon} size={20} color={isFocused ? colors.text : colors.textMuted} />
      <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 8,
  },
  pill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.text,
  },
});
