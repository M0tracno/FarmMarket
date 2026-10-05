import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { BOTTOM_NAV_ITEMS } from '../../constants/orders';
import { colors, fonts, spacing, type } from '../../../themes';

const navImages = {
  Home: require('../images/home.png'),
  Advisor: require('../images/Advisor.png'),
  Profile: require('../images/profile.png'),
} as const;

const iconImages = {
  Home: { width: 29, height: 34 },
  Advisor: { width: 52, height: 30 },
  Profile: { width: 72, height: 37 },
} as const;

export function BottomNav({ activeTab }: { activeTab: string }) {
  return (
    <View style={styles.bar}>
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = item.label === activeTab;
        return (
          <Pressable
            style={styles.item}
            key={item.label}
            onPress={() => router.navigate(item.href)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={item.label}
          >
            {item.label === 'Orders' ? (
              <View style={styles.orderIcon}>
                <View style={[styles.cubeTop, isActive && styles.activeOutline]} />
                <View style={[styles.cubeEdge, styles.cubeLeft, isActive && styles.activeIcon]} />
                <View style={[styles.cubeEdge, styles.cubeRight, isActive && styles.activeIcon]} />
                <View style={[styles.cubeEdge, styles.cubeMiddle, isActive && styles.activeIcon]} />
                <View style={[styles.cubeBottom, styles.cubeBottomLeft, isActive && styles.activeIcon]} />
                <View style={[styles.cubeBottom, styles.cubeBottomRight, isActive && styles.activeIcon]} />
              </View>
            ) : (
              <Image
                source={navImages[item.label]}
                style={iconImages[item.label]}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 84,
    backgroundColor: colors.cream,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: spacing.sm,
  },
  item: { flex: 1, alignItems: 'center', gap: 4 },
  orderIcon: { width: 26, height: 30, alignItems: 'center', justifyContent: 'center' },
  cubeTop: {
    position: 'absolute',
    top: 3,
    width: 13,
    height: 13,
    borderWidth: 1.4,
    borderColor: colors.black,
    transform: [{ rotate: '45deg' }],
  },
  cubeEdge: {
    position: 'absolute',
    width: 1.5,
    height: 14,
    backgroundColor: colors.black,
  },
  cubeLeft: { left: 4, top: 14 },
  cubeRight: { right: 4, top: 14 },
  cubeMiddle: { left: 12, top: 14 },
  cubeBottom: { position: 'absolute', width: 11, height: 1.5, backgroundColor: colors.black, top: 25 },
  cubeBottomLeft: { left: 3, transform: [{ rotate: '28deg' }] },
  cubeBottomRight: { right: 3, transform: [{ rotate: '-28deg' }] },
  activeOutline: { borderColor: colors.purple },
  activeIcon: { backgroundColor: colors.purple },
  label: {
    fontFamily: fonts.regular,
    fontSize: type.xs,
    lineHeight: 14,
    color: colors.black,
  },
  activeLabel: { color: colors.purple },
});
