import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppIcon } from '@/components';
import { COLORS, FONT_FAMILY, SPACING, useResponsive } from '@/theme';

interface HomeSearchBarProps {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  onVoicePress?: () => void;
  onScanPress?: () => void;
  onWishlistPress?: () => void;
}

export function HomeSearchBar({
  value,
  placeholder = 'Search seeds, fertilizers, equipment...',
  onChangeText,
  onVoicePress,
  onScanPress,
  onWishlistPress,
}: HomeSearchBarProps) {
  const { home } = useResponsive();

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.container,
          {
            height: home.searchHeight,
            borderRadius: home.searchRadius,
            paddingHorizontal: home.searchHorizontalPadding,
          },
        ]}
      >
        <AppIcon name="search" size="lg" color={COLORS.text.secondary} />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.muted}
          style={[
            styles.input,
            {
              fontSize: home.searchFontSize,
              lineHeight: home.searchLineHeight,
            },
          ]}
          returnKeyType="search"
          numberOfLines={1}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voice search"
          onPress={onVoicePress}
          style={styles.iconButton}
          hitSlop={8}
        >
          <AppIcon name="microphone" size="md" />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Scan product"
          onPress={onScanPress}
          style={styles.iconButton}
          hitSlop={8}
        >
          <AppIcon name="scan" size="md" />
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Wishlist"
        onPress={onWishlistPress}
        style={styles.wishlistButton}
        hitSlop={8}
      >
        <AppIcon name="wishlist" size="lg" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
  },

  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.categoryborder,
    backgroundColor: COLORS.surface,
  },

  input: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: SPACING.sm,
    paddingVertical: 0,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text.primary,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },

  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },

  wishlistButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.md,
  },
});
