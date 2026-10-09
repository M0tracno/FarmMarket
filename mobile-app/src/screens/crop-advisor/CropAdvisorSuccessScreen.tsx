import React, { useMemo } from 'react';
import { router } from 'expo-router';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';

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

const DEFAULT_CALL_WINDOW = '2 hours';
const DEFAULT_PHONE_NUMBER = '+91 12345 67890';

const ASSETS = {
  warning: require('../../../assets/images/crop-advisor/warning-circle.png'),
  phone: require('../../../assets/images/crop-advisor/phone-call.png'),
  clock: require('../../../assets/images/crop-advisor/clock-countdown.png'),
  check: require('../../../assets/images/crop-advisor/check-circle-fill.png'),
} as const;

const COPY = {
  title: 'Submitted Successfully',
  requestTitle: 'Request Submitted!',
  description:
    'Thank you! Our agriculture expert has received your request and will review it.',
  callWithin: 'We will call you within',
  receiveCall: 'You will receive a call on',
  whatsapp: 'We will share the time with you on WhatsApp and SMS.',
  done: 'Done',
} as const;

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
}

function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
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

      <AppText variant="bodyMedium" align="center" style={styles.headerTitle}>
        {title}
      </AppText>
    </View>
  );
}

export interface CropAdvisorSuccessScreenProps {
  phoneNumber?: string;
  onBack: () => void;
  onDone: () => void;
}

interface SuccessRowProps {
  icon: ImageSourcePropType;
  label: string;
  value: string;
}

function SuccessRow({ icon, label, value }: SuccessRowProps) {
  return (
    <View style={styles.successRow}>
      <Image source={icon} style={styles.successRowIcon} resizeMode="contain" />

      <View style={styles.successRowCopy}>
        <AppText variant="body" style={styles.successLabel}>
          {label}
        </AppText>

        <AppText variant="bodyMedium" color={COLORS.cropAdvisor}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

export function CropAdvisorSuccessScreen({ phoneNumber: phoneNumberProp, onBack, onDone }: CropAdvisorSuccessScreenProps) {
  const phoneNumber = useMemo(
    () => phoneNumberProp?.trim() || DEFAULT_PHONE_NUMBER,
    [phoneNumberProp],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      <ScreenHeader title={COPY.title} onBack={onBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.successContent}
      >
        <Image source={ASSETS.check} style={styles.checkIcon} resizeMode="contain" />

        <AppText
          variant="heading"
          align="center"
          style={styles.requestTitle}
        >
          {COPY.requestTitle}
        </AppText>

        <AppText
          variant="body"
          align="center"
          style={styles.successDescription}
        >
          {COPY.description}
        </AppText>

        <View style={styles.successCard}>
          <SuccessRow
            icon={ASSETS.clock}
            label={COPY.callWithin}
            value={DEFAULT_CALL_WINDOW}
          />

          <SuccessRow
            icon={ASSETS.phone}
            label={COPY.receiveCall}
            value={phoneNumber}
          />
        </View>

        <View style={styles.whatsappCard}>
          <Image
            source={ASSETS.warning}
            style={styles.successRowIcon}
            resizeMode="contain"
          />

          <AppText
            variant="caption"
            color={COLORS.cropAdvisor}
            style={styles.whatsappText}
          >
            {COPY.whatsapp}
          </AppText>
        </View>

        <AppButton
          title={COPY.done}
          onPress={() => router.replace('/(main)')}
          fullWidth
          size="small"
          style={styles.doneButton}
        />
      </ScrollView>
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

  headerTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.md,
  },

  successContent: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 42,
    paddingBottom: SPACING.xxxl,
  },

  checkIcon: {
    width: 144,
    height: 144,
  },

  requestTitle: {
    marginTop: 14,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
    fontFamily: FONT_FAMILY.bold,
  },

  successDescription: {
    marginTop: 8,
    maxWidth: 330,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },

  successCard: {
    width: '100%',
    minHeight: 188,
    marginTop: 45,
    paddingHorizontal: 28,
    paddingVertical: 26,
    borderWidth: 1,
    borderColor: COLORS.cropAdvisorBorder,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    justifyContent: 'space-between',
  },

  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  successRowIcon: {
    width: 40,
    height: 40,
    flexShrink: 0,
  },

  successRowCopy: {
    flex: 1,
    marginLeft: SPACING.xl,
  },

  successLabel: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    marginBottom: 2,
  },

  whatsappCard: {
    width: '100%',
    minHeight: 80,
    marginTop: SPACING.md,
    paddingHorizontal: 28,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cropAdvisorBorder,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.cropAdvisorBackground,
  },

  whatsappText: {
    flex: 1,
    marginLeft: SPACING.xl,
    fontSize: FONT_SIZE.xs,
    lineHeight: 16,
    fontFamily: FONT_FAMILY.medium,
  },

  doneButton: {
    width: '100%',
    marginTop: 76,
    height: SIZES.smallButtonHeight,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.cropAdvisor,
  },
});
