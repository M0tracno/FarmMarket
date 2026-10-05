import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, lineHeight, spacing, type } from '../../../themes';

const backImage = require('../images/Arrow 3.png');

export function Header({
  title,
  help = false,
  helpOrderId,
  backRoute,
}: {
  title: string;
  help?: boolean;
  helpOrderId?: string;
  backRoute?: string;
}) {
  return (
    <View>
      <View style={styles.header}>
        <View style={styles.left}>
          <Pressable
            onPress={() => backRoute ? router.replace(backRoute as never) : router.back()}
            hitSlop={spacing.md}
            accessibilityLabel="Go back"
          >
            <Image source={backImage} style={styles.backIcon} resizeMode="contain" />
          </Pressable>
          {help && <Text style={styles.title}>{title}</Text>}
        </View>
        {!help && <Text pointerEvents="none" style={[styles.title, styles.centerTitle]}>{title}</Text>}
        {help && (
          <Pressable
            onPress={() => router.push({ pathname: '/(main)/help-centre', params: helpOrderId ? { orderId: helpOrderId } : {} })}
            hitSlop={spacing.sm}
            accessibilityLabel="Open Help Centre"
          >
            <Text style={styles.help}>Need Help?</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    zIndex: 2,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backIcon: { width: 23, height: 15 },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: type.md,
    lineHeight: lineHeight.md,
    color: colors.black,
  },
  help: {
    fontFamily: fonts.bold,
    fontSize: type.sm,
    lineHeight: lineHeight.sm,
    color: colors.purple,
  },
  centerTitle: { position: 'absolute', left: 0, right: 0, textAlign: 'center' },
});
