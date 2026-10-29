import { Drawer } from 'expo-router/drawer';

import { DrawerMenu } from '../../components/drawer-menu';
import { colors } from '../../constants/theme';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerMenu {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        overlayColor: 'rgba(17, 27, 29, 0.72)',
        drawerStyle: {
          width: 312,
          backgroundColor: colors.surface,
        },
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}>
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: 'Studio' }} />
      <Drawer.Screen name="reformulate" options={{ drawerLabel: 'Reformulation' }} />
      <Drawer.Screen name="sentiment" options={{ drawerLabel: 'Sentiment' }} />
      <Drawer.Screen name="ner" options={{ drawerLabel: 'NER' }} />
    </Drawer>
  );
}
