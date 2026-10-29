import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';

const logo = require('../../assets/img/logo.jpeg');

export function AppHeader() {
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.wordmark}>
          weli<Text style={styles.dot}>.</Text>
        </Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.studio}>Studio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    overflow: 'hidden',
  },
  wordmark: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  dot: {
    color: colors.primaryBright,
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: colors.border,
  },
  studio: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
