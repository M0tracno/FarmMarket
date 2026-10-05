import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import {
  CategorySection,
  CropAdvisorBanner,
  HomeHeader,
  HomeSearchBar,
} from '@/components';

import {
  HOME_CATEGORIES,
  HOME_HEADER_DATA,
  HOME_TOP_COMPANIES,
} from '@/constants/home';
import { COLORS, SPACING } from '@/theme';

export function HomeScreen() {
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
        />
        <CropAdvisorBanner />
        <CategorySection
          title="Top Companies"
          categories={HOME_TOP_COMPANIES}
          marginTop={-70}
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
