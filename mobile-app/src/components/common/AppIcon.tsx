import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { COLORS, ICON_SIZES } from '@/theme';
import { ICONS, type IconName } from '@/constants/icons';

interface AppIconProps {
  name: IconName;
  size?: keyof typeof ICON_SIZES;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function AppIcon({
  name,
  size = 'md',
  color = COLORS.text.primary,
  style,
}: AppIconProps) {
  return (
    <Ionicons
      name={ICONS[name]}
      size={ICON_SIZES[size]}
      color={color}
      style={[styles.icon, style]}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});