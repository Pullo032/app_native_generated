import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabButton } from '../../components/tab-button';
import { GENERATOR_TABS } from '../../constants/generators';
import { colors, radius } from '../../constants/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot />
      <TabList style={[styles.tabList, { bottom: insets.bottom + 12 }]}>
        {GENERATOR_TABS.map((generator) => (
          <TabTrigger key={generator.type} name={generator.type} href={generator.href} asChild>
            <TabButton icon={generator.tabIcon} label={generator.tabLabel} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
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
});
