import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius } from '../constants/theme';

type TipCardProps = {
  text: string;
};

export function TipCard({ text }: TipCardProps) {
  return (
    <View style={styles.card}>
      <Ionicons name="bulb-outline" size={20} color={colors.mint} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
    borderLeftWidth: 3,
    borderLeftColor: colors.primaryBright,
  },
  text: {
    flex: 1,
    color: colors.mint,
    fontSize: 14,
    lineHeight: 20,
  },
});
