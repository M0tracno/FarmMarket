import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CART_COPY, type CartCopy } from '@/constants/config';

import { AppText } from '@/components/common/AppText';
import { CART_LAYOUT, CART_TYPOGRAPHY, COLORS, RADIUS, SIZES, UI } from '@/theme';
import { formatPaise } from '@/utils/price';

interface CartBottomBarProps {
  copy?: CartCopy;
  totalPaise: number;
  onContinue?: () => void;
  disabled?: boolean;
  actionWidth?: number;
  actionTopMargin?: number;
  rightPadding?: number;
}

export function CartBottomBar({
  totalPaise,
  onContinue,
  disabled = false,
  copy = CART_COPY,
  actionWidth = SIZES.continueButtonWidth,
  actionTopMargin,
  rightPadding = CART_LAYOUT.footerPaddingHorizontal,
}: CartBottomBarProps) {
  const isDisabled = disabled || !onContinue;

  return (
    <View style={[styles.container, { paddingRight: rightPadding }]}>
      <View style={styles.priceSection}>
        <AppText style={styles.priceText}>
          {formatPaise(totalPaise)}
        </AppText>
        <AppText color={COLORS.text.black} style={styles.priceLabel}>
          {copy.viewPrice}
        </AppText>
      </View>

      <Pressable
        onPress={onContinue}
        disabled={isDisabled}
        accessibilityState={{ disabled: isDisabled }}
        style={[styles.continueButton, { width: actionWidth, marginTop: actionTopMargin }]}
        accessibilityRole="button"
        accessibilityLabel={copy.checkout}
      >
        <AppText style={styles.continueButtonText}>
          {copy.continue}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SIZES.cartBottomBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: CART_LAYOUT.footerPaddingHorizontal,
    paddingBottom: CART_LAYOUT.sectionPadding,
    backgroundColor: COLORS.purpleSurface,
    boxShadow: UI.bottomBarShadow,
    elevation: UI.elevation,
  },
  priceSection: { flex: 1, gap: CART_LAYOUT.footerTextGap },
  priceText: { ...CART_TYPOGRAPHY.itemPrice, color: COLORS.purple },
  priceLabel: { ...CART_TYPOGRAPHY.footerLabel, alignSelf: 'flex-start' },
  continueButton: {
    width: SIZES.continueButtonWidth,
    height: SIZES.continueButtonHeight,
    backgroundColor: COLORS.purple,
    borderRadius: RADIUS.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: { ...CART_TYPOGRAPHY.continueButton, color: COLORS.text.inverse },
});
