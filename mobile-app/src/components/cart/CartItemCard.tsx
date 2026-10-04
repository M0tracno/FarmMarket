import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { CART_CONFIG, CART_COPY, type CartCopy } from '@/constants/config';

import { IMAGES } from '@/constants/images';
import { AppText } from '@/components/common/AppText';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { CART_LAYOUT, CART_TYPOGRAPHY, COLORS, RADIUS, SIZES, UI } from '@/theme';
import { type CartItem } from '@/types';
import { getProductDiscountPercent, formatPaise } from '@/utils/price';

interface CartItemCardProps {
  copy?: CartCopy;
  item: CartItem;
  minQuantity?: number;
  maxQuantity?: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onDelete: () => void;
}

export function CartItemCard({
  item,
  onIncrement,
  onDecrement,
  onDelete,
  minQuantity = CART_CONFIG.MIN_QUANTITY_PER_ITEM,
  maxQuantity = CART_CONFIG.MAX_QUANTITY_PER_ITEM,
  copy = CART_COPY,
}: CartItemCardProps) {
  const { product, quantity } = item;
  const hasDiscount = product.mrpPaise > product.pricePaise;
  const imageSource = typeof product.imageUrl === 'string' ? { uri: product.imageUrl } : product.imageUrl;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel={product.name}
        />
      </View>

      <View style={styles.details}>
        <View style={styles.topRow}>
          <AppText style={styles.productName} numberOfLines={1}>
            {product.name}
          </AppText>
          <Pressable
            onPress={onDelete}
            hitSlop={UI.hitSlop}
            accessibilityRole="button"
            accessibilityLabel={copy.removeProduct(product.name)}
          >
            <Image source={IMAGES.trashIcon} style={styles.trashIcon} resizeMode="contain" accessible={false} />
          </Pressable>
        </View>

        <View style={styles.priceRow}>
          <AppText variant="bodyMedium" color={COLORS.text.purple} style={styles.priceText}>
            {formatPaise(product.pricePaise)}
          </AppText>
          {hasDiscount && (
            <>
              <AppText
                variant="caption"
                color={COLORS.text.muted}
                style={styles.mrpText}
              >
                {formatPaise(product.mrpPaise, true)}
              </AppText>
              <AppText color={COLORS.text.purple} style={styles.discountText}>
                {copy.discount(getProductDiscountPercent(product))}
              </AppText>
            </>
          )}
        </View>

        <View style={styles.bottomRow}>
          <AppText color={COLORS.text.dark} style={styles.variantText}>
            {product.variant}
          </AppText>
          <QuantityStepper
            quantity={quantity}
            min={minQuantity}
            max={maxQuantity}
            copy={copy}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SIZES.cartItemCardHeight,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.purpleSurface,
    paddingHorizontal: CART_LAYOUT.itemPadding,
    paddingVertical: CART_LAYOUT.itemPadding,
  },
  imageContainer: {
    width: SIZES.cartItemImageContainerSize,
    height: SIZES.cartItemImageContainerSize,
    borderRadius: RADIUS.xl,
    borderWidth: UI.borderWidth,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: SIZES.cartItemImageWidth,
    height: SIZES.cartItemImageHeight,
  },
  details: {
    flex: 1,
    marginLeft: CART_LAYOUT.itemDetailsGap,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trashIcon: {
    width: SIZES.cartTrashIconSize,
    height: SIZES.cartTrashIconSize,
  },
  productName: {
    ...CART_TYPOGRAPHY.itemName,
    flex: 1,
    color: COLORS.text.black,
    marginRight: CART_LAYOUT.cardPadding,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI.compactGap,
    marginTop: CART_LAYOUT.cardPadding,
  },
  priceText: { ...CART_TYPOGRAPHY.itemPrice },
  mrpText: {
    ...CART_TYPOGRAPHY.itemMrp,
    color: COLORS.originalPrice,
    textDecorationLine: 'line-through',
  },
  discountText: { ...CART_TYPOGRAPHY.itemDiscount },
  variantText: { ...CART_TYPOGRAPHY.body },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: CART_LAYOUT.cardPadding,
  },
});
