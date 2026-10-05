import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import {
  CategoryHeroBanner,
  HomeHeader,
  HomeSearchBar,
  ProductCard,
} from '@/components';
import {
  EQUIPMENT_BANNER,
  EQUIPMENT_PRODUCTS,
} from '@/constants/equipment';
import { COLORS, SPACING, useResponsive } from '@/theme';
import type { ProductItem } from '@/types/product';

export function EquipmentCategoryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isSmall } = useResponsive();

  const filteredProducts = EQUIPMENT_PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductPress = (product: ProductItem) => {
    // Navigates or handles product click
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
              title={EQUIPMENT_BANNER.title}
              subtitle={EQUIPMENT_BANNER.subtitle}
              image={EQUIPMENT_BANNER.image}
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
