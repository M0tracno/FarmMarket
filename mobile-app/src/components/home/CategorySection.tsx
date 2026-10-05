import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components';
import {
  COLORS,
  FONT_SIZE,
  LINE_HEIGHT,
  SPACING,
  useResponsive,
} from '@/theme';
import type { HomeCategory } from '@/types/home';

interface CategorySectionProps {
  title: string;
  categories: HomeCategory[];
  onCategoryPress?: (category: HomeCategory) => void;
  onViewAllPress?: () => void;
  marginTop?: number;
}

export function CategorySection({
  title,
  categories,
  onCategoryPress,
  onViewAllPress,
  marginTop = SPACING.xxl,
}: CategorySectionProps) {
  const { home } = useResponsive();

  return (
    <View
      style={[
        styles.container,
        {
          marginTop,
        },
      ]}
    >
      {/* Section Header */}
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
          accessibilityRole="button"
          accessibilityLabel="View all categories"
          onPress={onViewAllPress}
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

      {/* Categories */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => (
          <View style={{ width: home.categoryGap }} />
        )}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={item.name}
            onPress={() => onCategoryPress?.(item)}
            style={[
              styles.item,
              {
                width: home.categoryCardWidth,
              },
            ]}
          >
            <View
              style={[
                styles.imageContainer,
                {
                  width: home.categoryImageContainerSize,
                  height: home.categoryImageContainerSize,
                  borderRadius: home.categoryCardRadius,
                },
              ]}
            >
              <Image
                source={item.image}
                style={[
                  styles.image,
                  {
                    width: home.categoryImageSize,
                    height: home.categoryImageSize,
                  },
                ]}
                resizeMode="contain"
              />
            </View>

            <AppText
              variant="category"
              align="center"
              numberOfLines={1}
              style={[
                styles.categoryName,
                {
                  fontSize: home.categoryFontSize,
                  lineHeight: home.categoryLineHeight,
                },
              ]}
            >
              {item.name}
            </AppText>
          </Pressable>
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
    color: COLORS.text.primary,
  },

  viewAll: {
    color: COLORS.info,
  },

  list: {
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },

  item: {
    alignItems: 'center',
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.categoryBackground,
    marginBottom: SPACING.sm,
  },

  image: {
    resizeMode: 'contain',
  },

  categoryName: {
    color: COLORS.text.primary,
  },
});
