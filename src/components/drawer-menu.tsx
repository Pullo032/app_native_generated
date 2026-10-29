import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { DrawerContentScrollView, type DrawerContentComponentProps } from 'expo-router/drawer';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconName } from '../constants/generators';
import { TOOL_NAV, type ToolId } from '../constants/tools';
import { colors, radius } from '../constants/theme';
import { API_HOST } from '../services/api';
import { Reveal } from './reveal';

const logo = require('../../assets/img/logo.jpeg');

export function DrawerMenu(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const activeId = resolveActiveTool(pathname);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
        },
      ]}>
      {/* Drawer Brand Header with close button */}
      <Reveal>
        <View style={styles.brandRow}>
          <View style={styles.brand}>
            <Image source={logo} style={styles.logo} />
            <View>
              <Text style={styles.wordmark}>
                weli<Text style={styles.dot}>.</Text>
              </Text>
              <Text style={styles.caption}>Studio & NLP</Text>
            </View>
          </View>

          <Pressable
            onPress={() => props.navigation.closeDrawer()}
            accessibilityRole="button"
            accessibilityLabel="Fermer le tiroir"
            style={styles.closeButton}>
            <Ionicons name="close" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      </Reveal>

      {/* STUDIO Section */}
      <Reveal delay={80} style={styles.section}>
        <Text style={styles.sectionLabel}>STUDIO</Text>
        {TOOL_NAV.filter((item) => item.section === 'studio').map((item) => (
          <DrawerLink
            key={item.id}
            icon={item.icon}
            label={item.label}
            description={item.description}
            active={activeId === item.id}
            onPress={() => {
              props.navigation.closeDrawer();
              router.navigate(item.href);
            }}
          />
        ))}
      </Reveal>

      {/* ANALYSE IA Section */}
      <Reveal delay={160} style={styles.section}>
        <Text style={styles.sectionLabel}>ANALYSE IA & NLP</Text>
        {TOOL_NAV.filter((item) => item.section === 'analyse').map((item) => (
          <DrawerLink
            key={item.id}
            icon={item.icon}
            label={item.label}
            description={item.description}
            active={activeId === item.id}
            onPress={() => {
              props.navigation.closeDrawer();
              router.navigate(item.href);
            }}
          />
        ))}
      </Reveal>

      {/* Server Status Footer */}
      <Reveal delay={240} style={styles.footerWrap}>
        <View style={styles.footerCard}>
          <View style={styles.statusDot} />
          <View style={styles.footerInfo}>
            <Text style={styles.footerTitle}>API en production</Text>
            <Text style={styles.footerSubtitle}>{API_HOST}</Text>
          </View>
          <Ionicons name="cloud-done-outline" size={16} color={colors.primaryBright} />
        </View>
      </Reveal>
    </DrawerContentScrollView>
  );
}

function resolveActiveTool(pathname: string): ToolId {
  if (pathname.startsWith('/reformulate')) return 'reformulate';
  if (pathname.startsWith('/sentiment')) return 'sentiment';
  if (pathname.startsWith('/ner')) return 'ner';
  return 'studio';
}

function DrawerLink({
  icon,
  label,
  description,
  active,
  onPress,
}: {
  icon: IconName;
  label: string;
  description: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.item, active && styles.itemActive]}>
      <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
        <Ionicons name={icon} size={18} color={active ? colors.text : colors.mint} />
      </View>
      <View style={styles.itemCopy}>
        <Text style={[styles.itemLabel, active && styles.itemLabelActive]}>{label}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      {active ? (
        <Ionicons name="chevron-forward" size={16} color={colors.primaryBright} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 22,
    backgroundColor: colors.surface,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 12,
  },
  wordmark: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  dot: {
    color: colors.primaryBright,
  },
  caption: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 4,
    marginLeft: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemActive: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.primaryBright,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
  },
  iconWrapActive: {
    backgroundColor: colors.primary,
  },
  itemCopy: {
    flex: 1,
    gap: 2,
  },
  itemLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  itemLabelActive: {
    color: colors.primaryBright,
  },
  itemDescription: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  footerWrap: {
    marginTop: 8,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryBright,
  },
  footerInfo: {
    flex: 1,
  },
  footerTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  footerSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
  },
});
