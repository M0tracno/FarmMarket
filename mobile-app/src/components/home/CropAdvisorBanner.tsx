import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components';
import { COLORS, SPACING, useResponsive } from '@/theme';

interface CropAdvisorBannerProps {
  onPress?: () => void;
}

export function CropAdvisorBanner({ onPress }: CropAdvisorBannerProps) {
  const { home } = useResponsive();

  return (
    <View
      style={[
        styles.container,
        {
          height: home.cropAdvisorHeight,
          marginHorizontal: home.headerHorizontalPadding,
          borderRadius: home.cropAdvisorRadius,
        },
      ]}
    >
      {/* Keep the exact working image implementation */}
      <Image
        source={require('../../../assets/images/crop-advisor.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Text is placed ON TOP of the image */}
      <View style={styles.content}>
        <AppText
          variant="heading"
          style={[
            styles.title,
            {
              fontSize: home.cropAdvisorTitleSize,
              lineHeight: home.cropAdvisorTitleLineHeight,
            },
          ]}
        >
          Get Expert Advice for{'\n'}Better Yields
        </AppText>

        <AppText
          variant="body"
          style={[
            styles.description,
            {
              fontSize: home.cropAdvisorDescriptionSize,
              lineHeight: home.cropAdvisorDescriptionLineHeight,
            },
          ]}
        >
          Upload photos of your crops, get expert{'\n'}
          advice and showcase your farm.
        </AppText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Try Crop Advisor"
          onPress={onPress}
          style={[
            styles.button,
            {
              height: home.cropAdvisorButtonHeight,
              borderRadius: home.cropAdvisorButtonRadius,
            },
          ]}
        >
          <AppText
            variant="bodyMedium"
            style={[
              styles.buttonText,
              {
                fontSize: home.cropAdvisorButtonFontSize,
                lineHeight: home.cropAdvisorButtonLineHeight,
              },
            ]}
          >
            Try Crop Advisor
          </AppText>

          <AppText style={styles.arrow}>→</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  content: {
    position: 'absolute',
    left: SPACING.md,
    top: SPACING.md,
    width: '52%',
  },

  title: {
    color: COLORS.text.primary,
    fontWeight: '600',
  },

  description: {
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },

  button: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.info,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },

  buttonText: {
    color: COLORS.text.inverse,
  },

  arrow: {
    color: COLORS.text.inverse,
    fontSize: 18,
    marginLeft: SPACING.sm,
  },
});
