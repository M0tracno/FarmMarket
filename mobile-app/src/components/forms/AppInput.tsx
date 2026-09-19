import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  RADIUS,
  SIZES,
  SPACING,
} from '@/theme';
import { type IconName } from '@/constants/icons';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export function AppInput({
  label,
  error,
  helperText,
  required = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  style,
  ...props
}: AppInputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? COLORS.error
    : focused
      ? COLORS.primary
      : COLORS.border;

  const isDisabled = props.editable === false;

  return (
    <View style={containerStyle}>
      {/* Label */}
      {label && (
        <AppText variant="bodyMedium" style={styles.label}>
          {label}
          {required && (
            <AppText color={COLORS.error}> *</AppText>
          )}
        </AppText>
      )}

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          { borderColor },
          isDisabled && styles.disabled,
        ]}
      >
        {/* Left Icon */}
        {leftIcon && (
          <AppIcon
            name={leftIcon}
            size="sm"
            color={
              focused
                ? COLORS.primary
                : COLORS.text.secondary
            }
            style={styles.leftIcon}
          />
        )}

        {/* Text Input */}
        <TextInput
          {...props}
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            Platform.OS === 'web' && styles.webInput,
            inputStyle,
            style,
          ]}
          placeholderTextColor={COLORS.text.muted}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
        />

        {/* Right Icon */}
        {rightIcon && (
          <Pressable
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            hitSlop={8}
            style={styles.rightIconButton}
          >
            <AppIcon
              name={rightIcon}
              size="sm"
              color={
                focused
                  ? COLORS.primary
                  : COLORS.text.secondary
              }
            />
          </Pressable>
        )}
      </View>

      {/* Error */}
      {error ? (
        <AppText
          variant="caption"
          color={COLORS.error}
          style={styles.message}
        >
          {error}
        </AppText>
      ) : helperText ? (
        <AppText
          variant="caption"
          color={COLORS.text.secondary}
          style={styles.message}
        >
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: SPACING.sm,
  },

  inputContainer: {
    minHeight: SIZES.inputHeight,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    minHeight: SIZES.inputHeight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,

    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,

    borderWidth: 0,
    backgroundColor: 'transparent',
  },

  /*
   * Web-specific fix:
   * Removes the browser's default input outline.
   */
  webInput: {
    outlineWidth: 0,
  },

  inputWithLeftIcon: {
    paddingLeft: SPACING.sm,
  },

  inputWithRightIcon: {
    paddingRight: SPACING.sm,
  },

  leftIcon: {
    marginLeft: SPACING.md,
  },

  rightIconButton: {
    marginRight: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },

  message: {
    marginTop: SPACING.xs,
  },
});