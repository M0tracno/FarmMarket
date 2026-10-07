import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { CART_COPY, type CartCopy } from '@/constants/config';

import { AppText } from '@/components/common/AppText';
import { ProductRecommendationCard } from '@/components/product/ProductRecommendationCard';
import { CART_LAYOUT, CART_TYPOGRAPHY, COLORS, UI } from '@/theme';
import { type Product } from '@/types';

interface RecommendationCarouselProps {
  copy?: CartCopy;
  title: string;
  products: readonly Product[];
  onViewMore?: () => void;
  onAddToCart: (product: Product) => void;
  onProductPress?: (product: Product) => void;
}

export function RecommendationCarousel({
  title,
  products,
  onViewMore,
  onAddToCart,
  copy = CART_COPY,
  onProductPress,
}: RecommendationCarouselProps) {
  if (products.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="subheading" style={styles.titleText}>{title}</AppText>
        <Pressable onPress={onViewMore} disabled={!onViewMore} accessibilityRole="button" accessibilityState={{ disabled: !onViewMore }} accessibilityLabel={copy.viewMore} hitSlop={UI.hitSlop}>
          <AppText variant="caption" color={COLORS.text.purple} style={styles.viewMoreText}>
            {copy.viewMore}
          </AppText>
        </Pressable>
      </View>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProductRecommendationCard
            product={item}
            copy={copy}
            onAddToCart={onAddToCart}
            onProductPress={onProductPress}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CART_LAYOUT.recommendationHeight,
    marginTop: CART_LAYOUT.recommendationTopGap,
    backgroundColor: COLORS.purpleSurface,
    paddingTop: CART_LAYOUT.recommendationPaddingTop,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: CART_LAYOUT.sectionPadding,
    marginBottom: CART_LAYOUT.recommendationHeaderGap,
  },
  titleText: { ...CART_TYPOGRAPHY.sectionTitle, color: COLORS.text.black },
  viewMoreText: { ...CART_TYPOGRAPHY.viewMore },
  listContent: {
    paddingHorizontal: CART_LAYOUT.sectionPadding,
    gap: CART_LAYOUT.recommendationGap,
  },
});
