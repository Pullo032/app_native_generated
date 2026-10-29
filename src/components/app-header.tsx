import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';

import { useOpenDrawer } from '../hooks/use-open-drawer';
import { colors, radius } from '../constants/theme';

const logo = require('../../assets/img/logo.jpeg');

export function AppHeader() {
  const openDrawer = useOpenDrawer();
  const pathname = usePathname();

  const caption = pathname.startsWith('/reformulate')
    ? 'Reformulation'
    : pathname.startsWith('/sentiment')
    ? 'Sentiment'
    : pathname.startsWith('/ner')
    ? 'NER'
    : 'Studio';

  return (
    <View style={styles.row}>
      <Pressable
        onPress={openDrawer}
        accessibilityRole="button"
        accessibilityLabel="Ouvrir le menu"
        style={styles.menuButton}>
        <Ionicons name="menu" size={22} color={colors.text} />
      </Pressable>
      <View style={styles.brand}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.wordmark}>
          weli<Text style={styles.dot}>.</Text>
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.captionBadge}>
        <Text style={styles.studio}>{caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
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
  captionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
  },
  studio: {
    color: colors.mint,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
});
