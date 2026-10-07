import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CART_COPY, type CartCopy } from '@/constants/config';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { CART_LAYOUT, CART_TYPOGRAPHY, COLORS, SIZES, UI } from '@/theme';
import { type DeliveryAddress } from '@/types';
import { formatAddress } from '@/utils/address';

interface AddressBarProps {
  copy?: CartCopy;
  address: DeliveryAddress;
  onChangePress?: () => void;
}

export function AddressBar({ address, onChangePress, copy = CART_COPY }: AddressBarProps) {
  return (
    <View style={styles.container}>
      <AppIcon name="location" size="xs" color={COLORS.text.secondary} />

      <View style={styles.addressContainer}>
        <AppText style={styles.addressLine} numberOfLines={2}>
          {formatAddress(address)}
        </AppText>
      </View>

      <Pressable onPress={onChangePress} disabled={!onChangePress} accessibilityRole="button" accessibilityState={{ disabled: !onChangePress }} accessibilityLabel={copy.changeAddress} hitSlop={UI.hitSlop}>
        <AppText style={styles.changeText}>
          {copy.changeAddress}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: CART_LAYOUT.addressHeight,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: CART_LAYOUT.sectionPadding,
    paddingTop: CART_LAYOUT.addressPaddingTop,
    paddingBottom: CART_LAYOUT.cardPadding,
    backgroundColor: COLORS.surface,
  },
  addressContainer: {
    flex: 1,
    minWidth: 0,
    maxWidth: SIZES.addressContainerWidth,
    height: SIZES.addressContainerHeight,
    marginLeft: CART_LAYOUT.addressIconGap,
    marginRight: CART_LAYOUT.addressActionGap,
  },
  addressLine: {
    ...CART_TYPOGRAPHY.address,
    color: COLORS.text.dark,
  },
  changeText: {
    ...CART_TYPOGRAPHY.addressAction,
    color: COLORS.text.primary,
    textDecorationLine: 'underline',
  },
});
