import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { colors, fonts, lineHeight, spacing, type } from '../../../themes';
import { useOrder } from '../../hooks/useOrder';
import { Header } from '../../components/orders/Header';
import { ProductBag } from '../../components/orders/ProductBag';
import { OrderTimeline } from '../../components/orders/OrderTimeline';
import { InfoCard, KeyValue } from '../../components/orders/InfoCard';

const caretRightImage = require('../../components/images/caret-right (1) 8.png');

export function OrderDetailScreen() {
  const order = useOrder();
  const isDelivered = order.status === 'Delivered';
  const phoneDigits = order.deliveryAddress.phone.replace(/\D/g, '');
  const phoneLabel = order.deliveryAddress.phone.replace(phoneDigits, '');
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Header title="My Orders" help helpOrderId={order.id} backRoute="/(main)/orders" />
      <View style={styles.deliveredBand}>
        <Text style={styles.delivered}>{order.status}</Text>
      </View>
      <View style={styles.productBand}>
        <View style={styles.product}>
          <View style={styles.productMain}>
            <View style={styles.productArt}><ProductBag small /></View>
            <View style={styles.copy}>
              <Text style={styles.productName} numberOfLines={1}>
                {order.product}
              </Text>
              <Text style={styles.price}>{order.price}</Text>
              <Text style={styles.meta}>{order.weight}</Text>
            </View>
            <View style={styles.caretSlot}>
              <Pressable
                onPress={() => router.push({ pathname: '/(main)/product' as never, params: { product: order.product } })}
                hitSlop={spacing.sm}
                accessibilityLabel="Open product"
              >
                <Image source={caretRightImage} style={styles.caret} resizeMode="contain" />
              </Pressable>
            </View>
          </View>
          <Text style={styles.date}>{order.deliveredAt}</Text>
        </View>
      </View>
      <OrderTimeline
        events={order.events}
        deliveryText={order.deliveryTimelineLabel}
        allCompleted={isDelivered}
      />
      <Text style={styles.eligible}>
        Eligible products can be returned or exchanged within{' '}
        <Text style={styles.link}>4 days of delivery</Text>
      </Text>
      <InfoCard minHeight={124} afterGap={18}>
        <Text style={styles.cardTitle}>Delivery Address</Text>
        <Text style={styles.bold}>{order.deliveryAddress.name}</Text>
        <Text style={styles.address}>{order.deliveryAddress.lines}</Text>
        <Text style={styles.phone}>
          {phoneLabel}<Text style={styles.phoneDigits}>{phoneDigits}</Text>
        </Text>
      </InfoCard>
      <InfoCard minHeight={130} afterGap={19} paddingTop={9} paddingBottom={3}>
        <Text style={[styles.cardTitle, styles.summaryTitle]}>Order Summary</Text>
        <KeyValue label="Order ID" value={order.id} />
        <KeyValue label="Order Date" value={order.date} />
        <KeyValue label="Payment Method" value={order.paymentMethod} />
        <KeyValue label="Total Amount" value={order.price} strong />
      </InfoCard>
      {!isDelivered && (
        <Pressable
          style={styles.cancelButton}
          onPress={() => router.push({ pathname: '/(main)/cancel-order', params: { orderId: order.id } })}
        >
          <Text style={styles.cancelButtonText}>Cancel Order</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.white },
  content: { paddingBottom: 0 },
  cancelButton: {
    height: 48,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.purple,
    backgroundColor: colors.palePurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: { color: colors.purple, fontFamily: fonts.bold, fontSize: type.lg },
  deliveredBand: {
    height: 50,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  delivered: {
    color: colors.green,
    fontFamily: fonts.semiBold,
    fontSize: type.xxl,
    lineHeight: lineHeight.xl,
  },
  productBand: {
    backgroundColor: colors.bandPurple,
    paddingHorizontal: spacing.lg,
    paddingVertical: 17,
  },
  product: {
    height: 110,
    paddingHorizontal: spacing.lg,
    paddingRight: spacing.sm,
    paddingTop: 10,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  productMain: { height: 74, flexDirection: 'row', alignItems: 'center' },
  productArt: { transform: [{ translateY: -5 }] },
  copy: { flex: 1, minWidth: 0, marginLeft: 33, transform: [{ translateY: -3 }] },
  caretSlot: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', transform: [{ translateY: 5 }] },
  caret: { width: 20, height: 20 },
  productName: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: type.md,
  },
  price: {
    color: colors.purple,
    fontFamily: fonts.semiBold,
    fontSize: type.sm,
    marginTop: spacing.xs,
  },
  meta: { color: colors.secondaryText, fontFamily: fonts.medium, fontSize: type.xs, marginTop: 2 },
  date: {
    color: colors.secondaryText,
    fontFamily: fonts.regular,
    fontSize: type.xs,
    lineHeight: lineHeight.sm,
    marginTop: 6,
    marginLeft: -9,
  },
  eligible: {
    color: colors.black,
    fontFamily: fonts.regular,
    fontSize: type.sm,
    lineHeight: lineHeight.sm,
    marginTop: 16,
    marginBottom: 10,
    marginHorizontal: spacing.lg,
  },
  link: { color: colors.policyLink, fontFamily: fonts.bold },
  cardTitle: {
    color: colors.black,
    fontFamily: fonts.bold,
    fontSize: type.sm,
    marginBottom: spacing.sm,
  },
  summaryTitle: { fontFamily: fonts.bold },
  bold: { color: colors.black, fontFamily: fonts.medium, fontSize: type.xs },
  address: {
    color: colors.issueText,
    fontFamily: fonts.regular,
    fontSize: type.sm,
    lineHeight: lineHeight.sm,
    marginTop: spacing.xs,
  },
  phone: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: type.sm,
    lineHeight: lineHeight.sm,
    marginTop: spacing.xs,
  },
  phoneDigits: { color: colors.black, fontFamily: fonts.bold },
});
