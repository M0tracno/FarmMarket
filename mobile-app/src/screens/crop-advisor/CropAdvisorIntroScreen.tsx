import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import { router } from 'expo-router';
import { AppButton, AppIcon, AppText } from '@/components';

import {
  COLORS,
  FONT_FAMILY,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SIZES,
  SPACING,
} from '@/theme';

const ASSETS = {
  advisor: require('../../../assets/images/crop-advisor/advisor.png'),
  decorations: require('../../../assets/images/crop-advisor/decorations.png'),
  farmer: require('../../../assets/images/crop-advisor/farmer.png'),
} as const;

const COPY = {
  title: 'Crop Advisor',
  description:
    'Facing a crop problem? Upload photos or videos and get expert guidance to keep your crops healthy and productive.',
  continue: 'Continue',
} as const;

interface ScreenHeaderProps {
  onBack: () => void;
}

function ScreenHeader({ onBack }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={10}
        onPress={onBack}
        style={styles.backButton}
      >
        <AppIcon name="back" size="md" color={COLORS.text.primary} />
      </Pressable>
    </View>
  );
}

interface CropAdvisorIntroScreenProps {
  onContinue: () => void;
}

export function CropAdvisorIntroScreen({ onContinue }: CropAdvisorIntroScreenProps) {
  const { width } = useWindowDimensions();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      <ScreenHeader onBack={handleBack} />

      <View style={styles.introBody}>
        <ImageBackground
          source={ASSETS.decorations}
          resizeMode="stretch"
          style={[styles.decorations, { width }]}
        />

        <View style={styles.introCopy}>
          <AppText
            variant="title"
            align="center"
            style={styles.introTitle}
          >
            {COPY.title}
          </AppText>

          <AppText
            variant="body"
            align="center"
            style={styles.introDescription}
          >
            {COPY.description}
          </AppText>
        </View>

        <Image
          source={ASSETS.advisor}
          resizeMode="contain"
          style={styles.advisorImage}
        />

        <Image
          source={ASSETS.farmer}
          resizeMode="contain"
          style={styles.farmerImage}
        />

        <AppButton
          title={COPY.continue}
          onPress={onContinue}
          fullWidth
          style={[styles.purpleButton, styles.introButton]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: SIZES.headerHeight,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
    zIndex: 5,
  },

  backButton: {
    position: 'absolute',
    left: SPACING.lg,
    width: SIZES.iconButton,
    height: SIZES.smallIconButton,
    alignItems: 'center',
    justifyContent: 'center',
  },

  introBody: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.cropAdvisorBackground,
  },

  decorations: {
    position: 'absolute',
    top: -11,
    bottom: -11,
    left: 0,
    height: '110%',
  },

  introCopy: {
    position: 'absolute',
    top: 101,
    left: SPACING.lg,
    right: SPACING.lg,
    zIndex: 2,
  },

  introTitle: {
    fontSize: FONT_SIZE.xxl,
    lineHeight: LINE_HEIGHT.xxl,
    fontFamily: FONT_FAMILY.semiBold,
  },

  introDescription: {
    marginTop: 14,
    paddingHorizontal: 53,
    fontSize: FONT_SIZE.sm,
    lineHeight: 18,
  },

  advisorImage: {
    position: 'absolute',
    left: 1,
    bottom: 45,
    width: 340,
    height: 430,
    zIndex: 2,
  },

  farmerImage: {
    position: 'absolute',
    right: 9,
    bottom: 72,
    width: 300,
    height: 300,
    zIndex: 3,
  },

  purpleButton: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.cropAdvisor,
  },

  introButton: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.lg,
    width: 'auto',
    bottom: 25,
    zIndex: 6,
  },
});
