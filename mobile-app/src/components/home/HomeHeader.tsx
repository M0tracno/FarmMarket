import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, AppText } from '@/components';
import { COLORS, useResponsive } from '@/theme';

interface HomeHeaderProps {
  location: string;
  walletBalance: number;
  onLocationPress?: () => void;
  onNotificationPress?: () => void;
  onWalletPress?: () => void;
  onCartPress?: () => void;
}

export function HomeHeader({
  location,
  walletBalance,
  onLocationPress,
  onNotificationPress,
  onWalletPress,
  onCartPress,
}: HomeHeaderProps) {
  const { home } = useResponsive();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: home.headerHorizontalPadding,
          paddingVertical: home.headerVerticalPadding,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Delivery location: ${location}`}
        onPress={onLocationPress}
        style={styles.locationButton}
      >
        <AppIcon name="location" size="lg" />

        <AppText
          variant="bodyMedium"
          numberOfLines={1}
          style={[
            styles.locationText,
            {
              fontSize: home.locationFontSize,
              lineHeight: home.locationLineHeight,
            },
          ]}
        >
          {location}
        </AppText>

        <AppIcon name="chevronDown" size="md" />
      </Pressable>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={onNotificationPress}
          style={[
            styles.actionButton,
            {
              width: home.headerActionSize,
              height: home.headerActionSize,
            },
          ]}
        >
          <AppIcon name="notifications" size="lg" />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Wallet"
          onPress={onWalletPress}
          style={[
            styles.walletButton,
            {
              height: home.walletHeight,
              minWidth: home.walletWidth,
              paddingHorizontal: home.walletHorizontalPadding,
              borderRadius: home.walletRadius,
              gap: home.walletGap,
            },
          ]}
        >
          <AppIcon name="wallet" size="md" />

          <AppText
            variant="caption"
            style={{
              fontSize: home.walletFontSize,
              lineHeight: home.walletLineHeight,
            }}
          >
            {walletBalance}
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cart"
          onPress={onCartPress}
          style={[
            styles.actionButton,
            {
              width: home.headerActionSize,
              height: home.headerActionSize,
            },
          ]}
        >
          <AppIcon name="cart" size="lg" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
  },

  locationButton: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    flexShrink: 1,
    marginHorizontal: 6,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },

  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
