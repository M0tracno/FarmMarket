import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { CUSTOM_ICONS, ICONS, type IconName } from '@/constants/icons';
import { COLORS, ICON_SIZES } from '@/theme';

interface AppIconProps {
  name: IconName;
  size?: keyof typeof ICON_SIZES;
  color?: string;
  style?: StyleProp<ImageStyle>;
}

export function AppIcon({
  name,
  size = 'md',
  color = COLORS.text.primary,
  style,
}: AppIconProps) {
  const iconSize = ICON_SIZES[size];
  const customIcon = CUSTOM_ICONS[name];

  if (customIcon) {
    return (
      <Image
        source={customIcon}
        resizeMode="contain"
        style={[
          styles.icon,
          {
            width: iconSize,
            height: iconSize,
          },
          style,
        ]}
      />
    );
  }

  return (
    <Ionicons
      name={ICONS[name]}
      size={iconSize}
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
