import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { RADIUS, SPACING } from '@/theme';

interface CategoryHeroBannerProps {
  image: ImageSourcePropType;
  title?: string;
  subtitle?: string;
}

export function CategoryHeroBanner({ image }: CategoryHeroBannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bannerWrapper}>
        <Image source={image} style={styles.bannerImage} resizeMode="cover" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  bannerWrapper: {
    width: '100%',
    aspectRatio: 350 / 110,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
});
