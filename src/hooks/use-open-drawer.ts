import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

type DrawerLike = {
  openDrawer?: () => void;
  toggleDrawer?: () => void;
  getParent?: () => DrawerLike | undefined;
};

export function useOpenDrawer() {
  const navigation = useNavigation();

  return () => {
    try {
      navigation.dispatch(DrawerActions.openDrawer());
    } catch {
      let current: DrawerLike | undefined = navigation as unknown as DrawerLike;
      while (current) {
        if (typeof current.openDrawer === 'function') {
          current.openDrawer();
          return;
        }
        if (typeof current.toggleDrawer === 'function') {
          current.toggleDrawer();
          return;
        }
        current = current.getParent?.();
      }
    }
  };
}
