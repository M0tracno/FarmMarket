import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from 'react-native';

import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '@/theme';

type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodyMedium'
  | 'caption'
  | 'button'
  | 'category';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function AppText({
  variant = 'body',
  color = COLORS.text.primary,
  align,
  children,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[
        styles.base,
        styles[variant],
        { color, textAlign: align },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: FONT_FAMILY.regular,
  },

  display: {
    fontFamily: FONT_FAMILY.extraBold,
    fontSize: FONT_SIZE.xxxl,
    lineHeight: LINE_HEIGHT.xxxl,
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxl,
    lineHeight: LINE_HEIGHT.xxl,
  },

  heading: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },

  subheading: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
  },

  body: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },

  bodyMedium: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },

  caption: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },

  button: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },

  category: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },
});