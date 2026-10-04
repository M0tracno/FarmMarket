import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { CART_COPY, type CartCopy } from '@/constants/config';

import { ICONS } from '@/constants/icons';
import { AppText } from '@/components/common/AppText';
import { CART_LAYOUT, CART_TYPOGRAPHY, COLORS, RADIUS, SIZES, UI } from '@/theme';
import { type Product } from '@/types';
import { getProductDiscountPercent, formatPaise } from '@/utils/price';

interface ProductRecommendationCardProps {
  copy?: CartCopy;
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductPress?: (product: Product) => void;
}

export function ProductRecommendationCard({
  product,
  onAddToCart,
  copy = CART_COPY,
  onProductPress,
}: ProductRecommendationCardProps) {
  const hasDiscount = product.mrpPaise > product.pricePaise;
  const imageSource = typeof product.imageUrl === 'string' ? { uri: product.imageUrl } : product.imageUrl;

  return (
    <View style={styles.container}>
      <Pressable style={styles.imageContainer} onPress={() => onProductPress?.(product)} disabled={!onProductPress} accessibilityRole="button" accessibilityLabel={product.name}>
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel={product.name}
        />
      </Pressable>

      <View style={styles.info}>
        <AppText style={styles.productTitle} numberOfLines={1}>
          {product.name}
        </AppText>

        <AppText style={styles.variantText}>
          {product.variant}
        </AppText>

        <View style={styles.priceRow}>
          <AppText style={styles.priceText}>
            {formatPaise(product.pricePaise, true)}
          </AppText>
          {hasDiscount && (
            <>
              <AppText style={styles.mrpText}>
                {formatPaise(product.mrpPaise, true)}
              </AppText>
              <AppText style={styles.discountText}>
                {copy.discount(getProductDiscountPercent(product))}
              </AppText>
            </>
          )}
        </View>
      </View>

      <Pressable
        onPress={() => onAddToCart(product)}
        style={styles.addButton}
        accessibilityRole="button"
        accessibilityLabel={copy.addProduct(product.name)}
      >
        <Ionicons name={ICONS.cart} size={SIZES.recommendationIconWidth} color={COLORS.purple} style={styles.cartIcon} />
        <AppText style={styles.buttonText} numberOfLines={1}>
          {copy.addToCart}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZES.recommendationCardWidth,
    height: SIZES.recommendationCardHeight,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: UI.borderWidth,
    borderColor: COLORS.purpleBorder,
    padding: CART_LAYOUT.cardPadding,
    overflow: 'hidden',
  },
  imageContainer: {
    height: SIZES.recommendationCardImageHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  info: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: CART_LAYOUT.cardPadding,
    paddingTop: UI.tightGap,
  },
  productTitle: { ...CART_TYPOGRAPHY.recommendationName, color: COLORS.text.black },
  variantText: {
    ...CART_TYPOGRAPHY.recommendationVariant,
    color: COLORS.text.dark,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI.compactGap,
  },
  priceText: {
    ...CART_TYPOGRAPHY.recommendationPrice,
    color: COLORS.purple,
  },
  mrpText: {
    ...CART_TYPOGRAPHY.recommendationMrp,
    color: COLORS.originalPrice,
    textDecorationLine: 'line-through',
  },
  discountText: {
    ...CART_TYPOGRAPHY.recommendationDiscount,
    color: COLORS.purple,
  },
  addButton: {
    width: SIZES.recommendationButtonWidth,
    height: SIZES.recommendationButtonHeight,
    alignSelf: 'center',
    borderRadius: CART_LAYOUT.recommendationButtonRadius,
    paddingVertical: CART_LAYOUT.recommendationButtonPaddingVertical,
    paddingHorizontal: CART_LAYOUT.recommendationButtonPaddingHorizontal,
    borderWidth: UI.fineBorderWidth,
    borderColor: COLORS.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CART_LAYOUT.cardPadding,
    backgroundColor: COLORS.purpleLight,
    marginBottom: CART_LAYOUT.cardContentGap,
  },
  cartIcon: {
    flexShrink: 0,
    width: SIZES.recommendationIconWidth,
    height: SIZES.recommendationIconHeight,
    lineHeight: SIZES.recommendationIconHeight,
  },
  buttonText: {
    ...CART_TYPOGRAPHY.recommendationButton,
    flexShrink: 0,
    color: COLORS.purple,
  },
});
