import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { CategorySection, HomeHeader, HomeSearchBar } from '@/components';
import { HOME_CATEGORIES } from '@/constants/home';
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
          location="Hyderabad"
          onNotificationPress={() => {}}
          onProfilePress={() => {}}
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
