import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { AppIcon } from '@/components/common/AppIcon';
import { COLORS, RADIUS, SPACING } from '@/theme';
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
              ₹ {priceRupees}
            </AppText>

            <AppText
              variant="caption"
              color={COLORS.text.muted}
              style={styles.originalPrice}
            >
              ₹{originalPriceRupees}
            </AppText>

            <AppText variant="caption" style={styles.discount}>
              {product.discountPercentage}% off
            </AppText>
          </View>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Add ${product.name} to cart`}
        onPress={() => onAddToCart?.(product)}
        style={styles.addButton}
      >
        <AppIcon name="cart" size="sm" color={COLORS.purple} />
        <AppText variant="caption" style={styles.addButtonText}>
          Add To Card
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  clickableArea: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#FAFAFA',
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
    fontSize: 11,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: SPACING.xs,
  },
  price: {
    fontWeight: '700',
    color: COLORS.purple,
  },
  originalPrice: {
    fontSize: 10,
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 10,
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
    paddingVertical: 6,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.purpleLight,
  },
  addButtonText: {
    color: COLORS.purple,
    fontWeight: '600',
    fontSize: 12,
  },
});
