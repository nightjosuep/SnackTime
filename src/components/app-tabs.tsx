import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

import { Colors, FontFamilies } from '@/constants/theme';
import { useCart } from '@/hooks/use-cart';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { itemCount } = useCart();

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{
        default: { fontFamily: FontFamilies.body },
        selected: { color: colors.text, fontFamily: FontFamilies.body },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Catálogo</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={require('@/assets/images/tabIcons/home.png')}
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calculator">
        <NativeTabs.Trigger.Label>
          {itemCount > 0 ? `Calculadora (${itemCount})` : 'Calculadora'}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="function" md="calculate" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
