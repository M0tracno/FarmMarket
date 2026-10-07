import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { AppIcon } from '@/components/common/AppIcon';
import { APP_CONFIG, CATEGORY_STRINGS } from '@/constants/categoryStrings';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '@/theme';
import type { ProductItem } from '@/types/product';

interface ProductCardProps {
  product: ProductItem;
  onPress?: (product: ProductItem) => void;
  onAddToCart?: (product: ProductItem) => void;
}

export function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
  const priceRupees = (product.pricePaise / 100).toFixed(2);
  const originalPriceRupees = (product.originalPricePaise / 100).toFixed(0);

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={product.name}
        onPress={() => onPress?.(product)}
        style={styles.clickableArea}
      >
        <View style={styles.imageContainer}>
          <Image
            source={product.image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.details}>
          <AppText
            variant="caption"
            numberOfLines={1}
            style={styles.title}
          >
            {product.name}
          </AppText>

          <AppText
            variant="caption"
            color={COLORS.text.secondary}
            numberOfLines={1}
            style={styles.specs}
          >
            {product.specs}
          </AppText>

          <View style={styles.priceRow}>
            <AppText variant="caption" style={styles.price}>
              {APP_CONFIG.currencySymbol} {priceRupees}
            </AppText>

            <AppText
              variant="caption"
              color={COLORS.text.muted}
              style={styles.originalPrice}
            >
              {APP_CONFIG.currencySymbol}{originalPriceRupees}
            </AppText>

            <AppText variant="caption" style={styles.discount}>
              {product.discountPercentage}{CATEGORY_STRINGS.discountSuffix}
            </AppText>
          </View>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${CATEGORY_STRINGS.addToCart} ${product.name}`}
        onPress={() => onAddToCart?.(product)}
        style={styles.addButton}
      >
        <AppIcon name="cart" size="sm" color={COLORS.purple} />
        <AppText variant="caption" style={styles.addButtonText}>
          {CATEGORY_STRINGS.addToCart}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.purpleBorder,
    padding: SPACING.sm,
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: RADIUS.xxs,
  },
  clickableArea: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  image: {
    width: '85%',
    height: '85%',
  },
  details: {
    paddingHorizontal: SPACING.xs,
  },
  title: {
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  specs: {
    fontSize: FONT_SIZE.xxs + 1,
    marginTop: SPACING.xxs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  price: {
    fontWeight: '700',
    color: COLORS.purple,
  },
  originalPrice: {
    fontSize: FONT_SIZE.xxs,
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: FONT_SIZE.xxs,
    color: COLORS.purple,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm - 2,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.purpleLight,
  },
  addButtonText: {
    color: COLORS.purple,
    fontWeight: '600',
    fontSize: FONT_SIZE.xs,
  },
});
