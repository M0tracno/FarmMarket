import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { CART_COPY, type CartCopy } from '@/constants/config';

import { IMAGES } from '@/constants/images';
import { ICONS } from '@/constants/icons';
import { AppText } from '@/components/common/AppText';
import { CART_LAYOUT, CART_TYPOGRAPHY, COLORS, SIZES } from '@/theme';

interface CouponBannerProps {
  copy?: CartCopy;
  onPress?: () => void;
  appliedCoupon?: string | null;
}

export function CouponBanner({ onPress, appliedCoupon, copy = CART_COPY }: CouponBannerProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityState={{ disabled: !onPress }}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={
        appliedCoupon ? copy.couponAccessibility(appliedCoupon) : copy.applyCoupon
      }
    >
      <Image source={IMAGES.couponIcon} style={styles.iconImage} resizeMode="contain" accessible={false} />

      <View style={styles.textContainer}>
        <AppText variant="bodyMedium" style={styles.titleText}>
          {appliedCoupon ? copy.couponApplied(appliedCoupon) : copy.applyCoupon}
        </AppText>
        <AppText color={COLORS.text.dark} style={styles.descriptionText} numberOfLines={1}>
          {appliedCoupon
            ? copy.changeCoupon
            : copy.couponOffers}
        </AppText>
      </View>

      <Ionicons name={ICONS.chevronRight} size={SIZES.couponArrowSize} color={COLORS.text.black} style={styles.arrow} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SIZES.couponBannerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.purpleSurface,
    paddingHorizontal: CART_LAYOUT.sectionPadding,
    marginTop: CART_LAYOUT.sectionGap,
  },
  iconImage: {
    width: SIZES.couponIconWidth,
    height: SIZES.couponIconHeight,
    marginRight: CART_LAYOUT.couponIconGap,
  },
  textContainer: {
    flex: 1,
    gap: CART_LAYOUT.couponTextGap,
    marginBottom: CART_LAYOUT.couponTextBottomMargin,
  },
  titleText: {
    ...CART_TYPOGRAPHY.couponTitle,
    color: COLORS.text.black,
    alignSelf: 'flex-start',
  },
  descriptionText: { ...CART_TYPOGRAPHY.couponDescription, alignSelf: 'flex-start' },
  arrow: {
    width: SIZES.couponArrowSize,
    height: SIZES.couponArrowSize,
    lineHeight: SIZES.couponArrowSize,
  },
});
