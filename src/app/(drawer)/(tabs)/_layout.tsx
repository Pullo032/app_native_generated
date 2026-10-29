import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabButton } from '../../../components/tab-button';
import { GENERATOR_TABS, type GeneratorConfig } from '../../../constants/generators';
import { colors, radius } from '../../../constants/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const leftTabs = GENERATOR_TABS.slice(0, 2);
  const rightTabs = GENERATOR_TABS.slice(2);

  return (
    <Tabs>
      <TabSlot />
      <TabList style={[styles.tabList, { bottom: insets.bottom + 12 }]}>
        {leftTabs.map(renderTab)}
        <Pressable
          onPress={() => router.push('/camera')}
          accessibilityRole="button"
          accessibilityLabel="Ouvrir la caméra"
          style={styles.addButton}>
          <Ionicons name="add" size={30} color={colors.text} />
        </Pressable>
        {rightTabs.map(renderTab)}
      </TabList>
    </Tabs>
  );
}

function renderTab(generator: GeneratorConfig) {
  return (
    <TabTrigger key={generator.type} name={generator.type} href={generator.href} asChild>
      <TabButton icon={generator.tabIcon} label={generator.tabLabel} />
    </TabTrigger>
  );
}

const styles = StyleSheet.create({
  tabList: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  addButton: {
    width: 56,
    height: 56,
    marginTop: -28,
    marginHorizontal: 4,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryBright,
    borderWidth: 4,
    borderColor: colors.background,
    shadowColor: colors.primaryBright,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
  },
});
