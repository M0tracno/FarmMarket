import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, AppText } from '@/components';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface HomeHeaderProps {
  location: string;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export function HomeHeader({
  location,
  onNotificationPress,
  onProfilePress,
}: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <AppIcon name="location" size="sm" color={COLORS.primary} />

        <View style={styles.locationText}>
          <AppText variant="caption" color={COLORS.text.secondary}>
            Deliver to
          </AppText>

          <AppText variant="bodyMedium" numberOfLines={1}>
            {location}
          </AppText>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={onNotificationPress}
          style={styles.actionButton}
        >
          <AppIcon name="notifications" size="md" />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Profile"
          onPress={onProfilePress}
          style={styles.actionButton}
        >
          <AppIcon name="profile" size="md" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
  },

  locationText: {
    flex: 1,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  actionButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
