import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components';
import { COLORS, RADIUS, SPACING } from '@/theme';
import type { HomeCategory } from '@/types/home';

interface CategorySectionProps {
  title: string;
  categories: HomeCategory[];
  onCategoryPress?: (category: HomeCategory) => void;
}

export function CategorySection({
  title,
  categories,
  onCategoryPress,
}: CategorySectionProps) {
  return (
    <View style={styles.container}>
      <AppText variant="heading">{title}</AppText>

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={item.name}
            onPress={() => onCategoryPress?.(item)}
            style={styles.item}
          >
            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <AppText variant="category" align="center">
              {item.name}
            </AppText>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.xxl,
  },

  list: {
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },

  item: {
    width: 88,
    alignItems: 'center',
  },

  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },

  image: {
    width: 64,
    height: 64,
  },
});
