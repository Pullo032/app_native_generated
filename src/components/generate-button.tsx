import { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius } from '../constants/theme';

type GenerateButtonProps = {
  label: string;
  loading: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function GenerateButton({ label, loading, disabled, onPress }: GenerateButtonProps) {
  const [scale] = useState(() => new Animated.Value(1));
  const [spin] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!loading) {
      spin.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [loading, spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const isDisabled = disabled || loading;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() =>
          Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start()
        }
        accessibilityRole="button"
        style={[styles.button, isDisabled && styles.buttonDisabled]}>
        {loading ? (
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Ionicons name="sync" size={20} color={colors.text} />
          </Animated.View>
        ) : (
          <Ionicons name="sparkles" size={20} color={colors.text} />
        )}
        <Text style={styles.label}>{loading ? 'Génération en cours...' : label}</Text>
        {loading ? <ActivityIndicator size="small" color={colors.mint} /> : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primaryBright,
    shadowColor: colors.primaryBright,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
