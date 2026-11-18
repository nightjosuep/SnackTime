import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { FontFamilies } from '@/constants/theme';
import { CartProvider } from '@/hooks/use-cart';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [FontFamilies.heading]: require('@/assets/fonts/DopeFortune.ttf'),
    [FontFamilies.body]: require('@/assets/fonts/SuckerBrush.ttf'),
  });
  const colorScheme = useColorScheme();

  if (fontError) throw fontError;
  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <CartProvider>
        <AppTabs />
      </CartProvider>
    </ThemeProvider>
  );
}
