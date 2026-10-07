import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { MOCK_RECOMMENDATION_PRODUCTS } from '@/data/mockProducts';

import {
  CategorySection,
  CropAdvisorBanner,
  HomeHeader,
  HomeSearchBar,
  ProductSection,
} from '@/components';

import {
  HOME_CATEGORIES,
  HOME_HEADER_DATA,
  HOME_TOP_COMPANIES,
} from '@/constants/home';

import { COLORS, SPACING } from '@/theme';

export function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HomeHeader
          location={HOME_HEADER_DATA.location}
          walletBalance={HOME_HEADER_DATA.walletBalance}
          onLocationPress={() => {}}
          onNotificationPress={() => {}}
          onWalletPress={() => {}}
          onCartPress={() => {}}
        />

        <HomeSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onVoicePress={() => {}}
          onScanPress={() => {}}
        />

        <CategorySection
          title="Shop by Category"
          categories={HOME_CATEGORIES}
          onCategoryPress={(category) => {
            if (category.id === 'farming-tools') {
              router.push('/category/equipments');
            } else if (category.id === 'pesticides') {
              router.push('/category/pesticides');
            } else if (category.id === 'fertilizers') {
              router.push('/category/fertilizers');
            } else if (category.id === 'seeds') {
              router.push('/category/seeds');
            }
          }}
        />

        <CropAdvisorBanner />

        <CategorySection
          title="Top Companies"
          categories={HOME_TOP_COMPANIES}
          marginTop={-70}
        />

        <ProductSection
          title="Recommended for you"
          products={MOCK_RECOMMENDATION_PRODUCTS}
          onAddToCart={(product) => {
            // connect to CartContext here
          }}
        />

        <ProductSection
          title="Seeds Section"
          products={MOCK_RECOMMENDATION_PRODUCTS}
          onAddToCart={(product) => {
            // connect to CartContext here
          }}
        />

        <ProductSection
          title="Fertilizers"
          products={MOCK_RECOMMENDATION_PRODUCTS}
          onAddToCart={(product) => {
            // connect to CartContext here
          }}
        />

        <ProductSection
          title="Pesticides"
          products={MOCK_RECOMMENDATION_PRODUCTS}
          onAddToCart={(product) => {
            // connect to CartContext here
          }}
        />

        <ProductSection
          title="Equipment and Tools"
          products={MOCK_RECOMMENDATION_PRODUCTS}
          onAddToCart={(product) => {
            // connect to CartContext here
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingBottom: SPACING.xxxl,
  },
});
