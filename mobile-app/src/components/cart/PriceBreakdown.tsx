import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CART_COPY, type CartCopy } from '@/constants/config';

import { AppText } from '@/components/common/AppText';
import { CART_LAYOUT, CART_TYPOGRAPHY, COLORS, SIZES, UI } from '@/theme';
import { type CartPriceSummary } from '@/types';
import { formatPaise, formatPaiseCompact } from '@/utils/price';

interface PriceBreakdownProps {
  copy?: CartCopy;
  summary: CartPriceSummary;
}

export function PriceBreakdown({ summary, copy = CART_COPY }: PriceBreakdownProps) {
  return (
    <View style={styles.container}>
      <AppText style={styles.title}>
        {copy.priceDetails}
      </AppText>

      <View style={styles.row}>
        <AppText style={styles.labelText}>
          {copy.productPrice}
        </AppText>
        <AppText style={styles.valueText}>
          {copy.pricePrefix}{formatPaiseCompact(summary.productTotalPaise)}
        </AppText>
      </View>

      <View style={styles.row}>
        <AppText style={styles.shippingLabelText}>
          {copy.shipping}
        </AppText>
        <View style={styles.shippingValue}>
          {summary.isShippingFree ? (
            <>
              <AppText style={styles.freeText}>
                {copy.freeShipping}
              </AppText>
              <AppText style={styles.shippingStrikethrough}>
                {copy.pricePrefix}{formatPaiseCompact(summary.shippingOriginalPaise, true)}
              </AppText>
            </>
          ) : (
            <AppText style={styles.valueText}>
              {copy.pricePrefix}{formatPaiseCompact(summary.shippingPaise)}
            </AppText>
          )}
        </View>
      </View>

      <View style={styles.dashedDivider} />

      <View style={styles.row}>
        <AppText style={styles.orderTotalLabel}>{copy.orderTotal}</AppText>
        <AppText style={styles.orderTotalValue}>
          {formatPaise(summary.orderTotalPaise)}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SIZES.priceDetailsHeight,
    backgroundColor: COLORS.priceSurface,
    marginTop: CART_LAYOUT.priceTopGap,
    paddingHorizontal: CART_LAYOUT.sectionPadding,
    paddingTop: CART_LAYOUT.pricePaddingTop,
  },
  title: {
    ...CART_TYPOGRAPHY.priceTitle,
    color: COLORS.text.black,
    marginBottom: CART_LAYOUT.priceTitleGap,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: CART_LAYOUT.priceRowGap,
  },
  labelText: { ...CART_TYPOGRAPHY.body },
  valueText: { ...CART_TYPOGRAPHY.body },
  shippingLabelText: { ...CART_TYPOGRAPHY.shipping, color: COLORS.stepperGreen },
  shippingValue: { flexDirection: 'row', alignItems: 'center', gap: CART_LAYOUT.shippingPriceGap },
  freeText: { ...CART_TYPOGRAPHY.shipping, color: COLORS.stepperGreen },
  shippingStrikethrough: {
    ...CART_TYPOGRAPHY.body,
    color: COLORS.originalPrice,
    textDecorationLine: 'line-through',
  },
  dashedDivider: {
    borderBottomWidth: UI.borderWidth,
    borderBottomColor: COLORS.cardBorder,
    borderStyle: 'dashed',
    marginVertical: CART_LAYOUT.priceDividerGap,
  },
  orderTotalLabel: { ...CART_TYPOGRAPHY.body },
  orderTotalValue: { ...CART_TYPOGRAPHY.itemPrice, color: COLORS.purple },
});
