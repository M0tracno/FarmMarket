import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppIcon } from '@/components';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING } from '@/theme';

interface HomeSearchBarProps {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onVoicePress?: () => void;
  onScanPress?: () => void;
}

export function HomeSearchBar({
  value,
  placeholder = 'Search products',
  onChangeText,
  onVoicePress,
  onScanPress,
}: HomeSearchBarProps) {
  return (
    <View style={styles.container}>
      <AppIcon name="search" size="md" color={COLORS.text.secondary} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.text.muted}
        style={styles.input}
        returnKeyType="search"
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voice search"
        onPress={onVoicePress}
        style={styles.iconButton}
      >
        <AppIcon name="help" size="md" color={COLORS.text.secondary} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Scan product"
        onPress={onScanPress}
        style={styles.iconButton}
      >
        <AppIcon name="products" size="md" color={COLORS.text.secondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
  },

  input: {
    flex: 1,
    marginHorizontal: SPACING.sm,
    paddingVertical: 0,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
  },

  iconButton: {
    padding: SPACING.xs,
  },
});
