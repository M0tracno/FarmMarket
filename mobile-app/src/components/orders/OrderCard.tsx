import { router } from 'expo-router';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import type { FarmOrder } from '../../types/order';
import {
  colors,
  fonts,
  lineHeight,
  radii,
  spacing,
  type,
} from '../../../themes';
import { ProductBag } from './ProductBag';

const reviewImage = require('../images/Group 102.png');
const caretRightImage = require('../images/caret-right (1) 8.png');

export function OrderCard({ order }: { order: FarmOrder }) {
  const { width } = useWindowDimensions();
  const compact = width < 360;
  return (
    <View style={styles.card}>
      <Pressable
        style={styles.productRow}
        onPress={() => router.push({ pathname: '/(main)/order-detail', params: { orderId: order.id } })}
      >
        <View style={styles.productFrame}>
          <ProductBag small />
        </View>
        <View style={styles.copy}>
          <Text style={styles.delivered}>{order.status}</Text>
          <Text style={styles.meta}>{order.deliveredAt}</Text>
          <View style={styles.nameRow}>
            <Text style={[styles.productName, compact && styles.compactName]} numberOfLines={1}>
              {order.product}
            </Text>
            <Text style={[styles.weight, compact && styles.compactWeight]}>{order.weight}</Text>
          </View>
        </View>
        <Image
          source={caretRightImage}
          style={[styles.caret, compact && styles.compactCaret]}
          resizeMode="contain"
        />
      </Pressable>
      {order.status === 'Delivered' && (
        <Pressable
          style={styles.reviewRow}
          onPress={() =>
            router.push({
              pathname: '/(main)/reviews' as never,
              params: { orderId: order.id },
            })
          }
        >
          <Image
            source={reviewImage}
            style={styles.reviewImage}
            resizeMode="contain"
          />
          <Text style={styles.review}>View Review</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.xl,
    backgroundColor: colors.palePurple,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  productRow: {
    height: 110,
    marginHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productFrame: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, minWidth: 0, marginLeft: spacing.md },
  delivered: {
    color: colors.green,
    fontFamily: fonts.bold,
    fontSize: type.sm,
    lineHeight: lineHeight.sm,
  },
  meta: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: type.xs,
    lineHeight: lineHeight.xs,
  },
  nameRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    alignItems: 'baseline',
    minWidth: 0,
  },
  productName: {
    flexShrink: 1,
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: type.md,
    lineHeight: lineHeight.md,
  },
  compactName: { fontSize: type.sm },
  weight: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: type.sm,
    lineHeight: lineHeight.sm,
    marginLeft: 19,
    flexShrink: 0,
  },
  compactWeight: { marginLeft: spacing.sm },
  reviewRow: {
    height: 41,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  reviewImage: { width: 96, height: 18 },
  caret: { width: 40, height: 40, marginLeft: spacing.sm },
  compactCaret: { width: 30, height: 30, marginLeft: spacing.xs },
  review: {
    color: colors.purple,
    fontFamily: fonts.bold,
    fontSize: type.sm,
    lineHeight: lineHeight.sm,
  },
});
