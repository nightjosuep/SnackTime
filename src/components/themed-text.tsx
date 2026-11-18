import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { FontFamilies, Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  small: {
    fontFamily: FontFamilies.body,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: 'normal',
  },
  smallBold: {
    fontFamily: FontFamilies.body,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: 'normal',
  },
  default: {
    fontFamily: FontFamilies.body,
    fontSize: 17,
    lineHeight: 26,
    fontWeight: 'normal',
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: 48,
    fontWeight: 'normal',
    lineHeight: 52,
  },
  subtitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 'normal',
  },
  link: {
    fontFamily: FontFamilies.body,
    lineHeight: 30,
    fontSize: 15,
  },
  linkPrimary: {
    fontFamily: FontFamilies.body,
    lineHeight: 30,
    fontSize: 15,
    color: '#3c87f7',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
