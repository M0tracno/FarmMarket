import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { ProductRecommendationCard } from '@/components/product/ProductRecommendationCard';
import { COLORS, FONT_SIZE, LINE_HEIGHT, SPACING } from '@/theme';
import type { Product } from '@/types';

interface ProductSectionProps {
  title: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductPress?: (product: Product) => void;
  onViewAllPress?: () => void;
  marginTop?: number;
}

export function ProductSection({
  title,
  products,
  onAddToCart,
  onProductPress,
  onViewAllPress,
  marginTop = SPACING.xxl,
}: ProductSectionProps) {
  return (
    <View
      style={[
        styles.container,
        {
          marginTop,
        },
      ]}
    >
      <View style={styles.header}>
        <AppText
          variant="heading"
          style={[
            styles.title,
            {
              fontSize: FONT_SIZE.md,
              lineHeight: LINE_HEIGHT.md,
            },
          ]}
        >
          {title}
        </AppText>

        <Pressable
          onPress={onViewAllPress}
          accessibilityRole="button"
          accessibilityLabel={`View all ${title}`}
          hitSlop={8}
        >
          <AppText
            variant="bodyMedium"
            style={[
              styles.viewAll,
              {
                fontSize: FONT_SIZE.sm,
                lineHeight: LINE_HEIGHT.sm,
              },
            ]}
          >
            View All
          </AppText>
        </Pressable>
      </View>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <ProductRecommendationCard
            product={item}
            onAddToCart={onAddToCart}
            onProductPress={onProductPress}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },

  title: {
    color: COLORS.text.black,
  },

  viewAll: {
    color: COLORS.purple,
  },

  list: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },

  separator: {
    width: SPACING.md,
  },
});
