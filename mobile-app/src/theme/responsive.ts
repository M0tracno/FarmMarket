import { useWindowDimensions } from 'react-native';

import { RADIUS } from './radius';
import { SPACING } from './spacing';
import { FONT_SIZE, LINE_HEIGHT } from './typography';

export const BREAKPOINTS = {
  small: 360,
  medium: 414,
  tablet: 768,
} as const;

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isSmall = width < BREAKPOINTS.small;
  const isMedium = width >= BREAKPOINTS.small && width < BREAKPOINTS.medium;
  const isLarge = width >= BREAKPOINTS.medium;
  const isTablet = width >= BREAKPOINTS.tablet;

  const wp = (percentage: number) => (width * percentage) / 100;

  const hp = (percentage: number) => (height * percentage) / 100;

  const scale = (size: number) => (width / BASE_WIDTH) * size;

  const verticalScale = (size: number) => (height / BASE_HEIGHT) * size;

  const moderateScale = (size: number, factor = 0.5) =>
    size + (scale(size) - size) * factor;

  const horizontalPadding = isTablet
    ? 32
    : Math.min(Math.max(width * 0.04, 16), 24);

  const home = {
    headerHorizontalPadding: horizontalPadding,

    headerVerticalPadding: isSmall ? SPACING.sm : SPACING.md,

    locationIconSize: isSmall ? 18 : 20,

    locationFontSize: isSmall ? FONT_SIZE.sm : FONT_SIZE.md,

    locationLineHeight: isSmall ? LINE_HEIGHT.sm : LINE_HEIGHT.md,

    headerActionSize: isSmall ? 40 : 44,

    searchHeight: isSmall ? 44 : 48,

    searchRadius: isSmall ? RADIUS.lg : RADIUS.xl,

    searchHorizontalPadding: isSmall ? SPACING.sm : SPACING.md,

    categoryGap: isSmall ? SPACING.sm : SPACING.md,

    categoryImageSize: isSmall ? 64 : 72,

    categoryCardWidth: isSmall ? 76 : 84,

    categoryCardRadius: isSmall ? RADIUS.md : RADIUS.lg,

    sectionSpacing: isSmall ? SPACING.xl : SPACING.xxl,
    walletHeight: isSmall ? 24 : 28,
    walletWidth: isSmall ? 46 : 50,
    walletHorizontalPadding: isSmall ? 6 : 8,
    walletRadius: isSmall ? 4 : 6,
    walletGap: isSmall ? 2 : 4,
    walletFontSize: isSmall ? 12 : 13,
    walletLineHeight: isSmall ? 16 : 18,
  };

  return {
    width,
    height,
    isSmall,
    isMedium,
    isLarge,
    isTablet,
    wp,
    hp,
    scale,
    verticalScale,
    moderateScale,
    horizontalPadding,
    home,
  };
}
