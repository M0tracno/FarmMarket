import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SIZES, SPACING } from '@/theme';
import { type IconName } from '@/constants/icons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const BUTTON_HEIGHTS: Record<ButtonSize, number> = {
  small: SIZES.smallButtonHeight,
  medium: SIZES.buttonHeight,
  large: 56,
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  const textColor =
    variant === 'primary'
      ? COLORS.text.inverse
      : variant === 'secondary'
        ? COLORS.text.primary
        : COLORS.primary;

  const iconColor = textColor;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          height: BUTTON_HEIGHTS[size],
          opacity: pressed && !isDisabled ? 0.8 : 1,
        },
        styles[variant],
        size === 'small' && styles.small,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <AppIcon name={icon} size="sm" color={iconColor} />
          )}

          <AppText
            variant="button"
            color={textColor}
            style={[
              icon && iconPosition === 'left' && styles.textWithLeftIcon,
              icon && iconPosition === 'right' && styles.textWithRightIcon,
            ]}
          >
            {title}
          </AppText>

          {icon && iconPosition === 'right' && (
            <AppIcon name={icon} size="sm" color={iconColor} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },

  primary: {
    backgroundColor: COLORS.primary,
  },

  secondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  ghost: {
    backgroundColor: 'transparent',
  },

  small: {
    paddingHorizontal: SPACING.md,
  },

  fullWidth: {
    width: '100%',
  },

  disabled: {
    opacity: 0.5,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textWithLeftIcon: {
    marginLeft: SPACING.sm,
  },

  textWithRightIcon: {
    marginRight: SPACING.sm,
  },
});