import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

import {
  CategoryHeroBanner,
  HomeHeader,
  HomeSearchBar,
  ProductCard,
} from '@/components';
import {
  FERTILIZER_BANNER,
  FERTILIZER_PRODUCTS,
} from '@/constants/fertilizer';
import { COLORS, SPACING } from '@/theme';
import type { ProductItem } from '@/types/product';

export function FertilizerCategoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = FERTILIZER_PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductPress = (product: ProductItem) => {
    // Navigate / handle product press
  };

  const handleAddToCart = (product: ProductItem) => {
    // Add to cart handler
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.headerArea}>
            <HomeHeader
              location="Kolar, Karnataka"
              onNotificationPress={() => {}}
              onProfilePress={() => {}}
            />

            <HomeSearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search seeds, fertilizers, equipment..."
              onVoicePress={() => {}}
              onScanPress={() => {}}
            />

            <CategoryHeroBanner
              title={FERTILIZER_BANNER.title}
              subtitle={FERTILIZER_BANNER.subtitle}
              image={FERTILIZER_BANNER.image}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard
              product={item}
              onPress={handleProductPress}
              onAddToCart={handleAddToCart}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerArea: {
    marginBottom: SPACING.sm,
  },
  content: {
    paddingBottom: SPACING.xxxl,
  },
  row: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardWrapper: {
    flex: 1,
  },
});
