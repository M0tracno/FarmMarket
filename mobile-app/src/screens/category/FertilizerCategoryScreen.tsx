import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

import {
  CategoryHeroBanner,
  HomeHeader,
  HomeSearchBar,
  ProductCard,
} from '@/components';
import { APP_CONFIG, CATEGORY_STRINGS } from '@/constants/categoryStrings';
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
              location={APP_CONFIG.defaultLocation}
              onNotificationPress={() => {}}
              onProfilePress={() => {}}
            />

            <HomeSearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={CATEGORY_STRINGS.searchPlaceholder}
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
