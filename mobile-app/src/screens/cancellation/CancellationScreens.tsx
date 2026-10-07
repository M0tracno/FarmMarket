import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CANCELLATION_REASONS } from '../../constants/orders';
import { useOrder } from '../../hooks/useOrder';
import type { FarmOrder } from '../../types/order';
import {
  colors,
  fonts,
  lineHeight,
  radii,
  spacing,
  type,
} from '../../../themes';
import { Header } from '../../components/orders/Header';
import { ProductBag } from '../../components/orders/ProductBag';
import { KeyValue } from '../../components/orders/InfoCard';

const cancellationDetails: Record<string, string[]> = {
  'Ordered by mistake': ['Ordered by mistake'],
  'Change in requirement': ['Requirement changed', 'No longer required'],
  'Found a better price': ['Found a better price'],
  'Delivery taking too long': ['Delivery taking too long'],
  Other: ['Other'],
};

const packedStatusDot = require('../../components/images/Rectangle 66.png');

function CancellationProductCard({ order }: { order: FarmOrder }) {
  return (
    <View style={styles.product}>
      <ProductBag small />
      <View style={styles.copy}>
        <Text style={styles.productName}>{order.product}</Text>
        <View style={styles.statusRow}>
          <Image source={packedStatusDot} style={styles.greenDot} resizeMode="contain" />
          <Text style={styles.productStatus}>{order.status}</Text>
        </View>
      </View>
      <Pressable
        onPress={() => router.push({ pathname: '/(main)/product' as never, params: { product: order.product } })}
        hitSlop={spacing.sm}
        accessibilityLabel="Open product"
      >
        <Ionicons name="chevron-forward-outline" size={22} color={colors.black} />
      </Pressable>
    </View>
  );
}

function CancellationReasonList({
  expandedReason,
  selectedReason,
  onToggle,
  onSelect,
}: {
  expandedReason: string | null;
  selectedReason: string | null;
  onToggle: (reason: string) => void;
  onSelect: (reason: string) => void;
}) {
  return (
    <>
      {CANCELLATION_REASONS.map((reason) => (
        <View key={reason}>
          <Pressable style={styles.reason} onPress={() => onToggle(reason)}>
            <Text style={styles.reasonText}>{reason}</Text>
            <Ionicons
              name={expandedReason === reason ? 'chevron-down-outline' : 'chevron-forward-outline'}
              size={20}
              color={colors.black}
            />
          </Pressable>
          {expandedReason === reason && (
            <View style={styles.reasonOptions}>
              <Text style={styles.reasonHint}>Select the reason that best applies</Text>
              {cancellationDetails[reason].map((detail) => (
                <Pressable key={detail} style={styles.detailOption} onPress={() => onSelect(detail)}>
                  <Text style={styles.detailText}>{detail}</Text>
                  <Ionicons
                    name={selectedReason === detail ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={selectedReason === detail ? colors.purple : colors.black}
                  />
                </Pressable>
              ))}
            </View>
          )}
        </View>
      ))}
    </>
  );
}

function CancellationDetails({ order, reason, success = false }: { order: FarmOrder; reason: string; success?: boolean }) {
  const labelStyle = success ? styles.successDetailLabel : styles.confirmDetailLabel;
  const valueStyle = success ? styles.successDetailValue : styles.confirmDetailValue;
  const amountStyle = success ? styles.successAmount : styles.confirmAmount;
  return (
    <View style={styles.details}>
      <KeyValue label="Order ID" value={order.id} labelStyle={labelStyle} valueStyle={valueStyle} />
      <KeyValue
        label="Product"
        value={`${order.product} (${order.weight})`}
        labelStyle={labelStyle}
        valueStyle={valueStyle}
      />
      <KeyValue label="Reason" value={reason} labelStyle={labelStyle} valueStyle={valueStyle} />
      <KeyValue label="Refund Amount" value={order.amount} strong={success} labelStyle={labelStyle} valueStyle={amountStyle} />
      <KeyValue label="Request Date" value={order.requestDate} labelStyle={labelStyle} valueStyle={valueStyle} />
    </View>
  );
}

export function CancelOrderScreen() {
  const order = useOrder();
  const [expandedReason, setExpandedReason] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [note, setNote] = useState('');
  return (
    <View style={styles.page}>
      <Header title="Cancel Order" backRoute={`/(main)/order-detail?orderId=${encodeURIComponent(order.id)}`} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.orderMeta}>
          <Text style={styles.meta}>
            <Text style={styles.metaLabel}>Order ID </Text>{order.id}
          </Text>
          <Text style={styles.meta}>
            <Text style={styles.metaLabel}>Sold to </Text>{order.deliveryAddress.name}
          </Text>
        </View>
        <CancellationProductCard order={order} />
        <Text style={styles.heading}>Why do you want to cancel?</Text>
        <CancellationReasonList
          expandedReason={expandedReason}
          selectedReason={selectedReason}
          onToggle={(reason) => {
            setExpandedReason((current) => current === reason ? null : reason);
            setSelectedReason(null);
          }}
          onSelect={setSelectedReason}
        />
        <Text style={styles.noteLabel}>Additional Note (Optional)</Text>
        <View style={styles.note}>
          <TextInput
            placeholder="Write a reason (optional)"
            placeholderTextColor={colors.placeholder}
            selectionColor={colors.purple}
            selectionHandleColor={colors.purple}
            cursorColor={colors.purple}
            underlineColorAndroid="transparent"
            multiline
            maxLength={5000}
            value={note}
            onChangeText={setNote}
            style={[styles.noteInput, { outlineWidth: 0, outlineColor: 'transparent', backgroundColor: 'transparent' }]}
          />
          <Text style={styles.counter}>{note.length}/5000</Text>
        </View>
      </ScrollView>
      <Pressable
        style={[styles.primaryButton, styles.cancelPrimaryButton, !selectedReason && styles.disabledButton]}
        disabled={!selectedReason}
        onPress={() => {
          if (selectedReason) {
            router.push({
              pathname: '/(main)/confirm-cancellation',
              params: { reason: selectedReason, orderId: order.id },
            });
          }
        }}
      >
        <Text style={styles.primaryText}>Confirm Cancellation</Text>
      </Pressable>
    </View>
  );
}

export function ConfirmCancellationScreen() {
  const order = useOrder();
  const { reason = order.cancellationReason } = useLocalSearchParams<{
    reason?: string;
  }>();
  return (
    <View style={styles.page}>
      <Header title="Confirm Cancellation" backRoute={`/(main)/cancel-order?orderId=${encodeURIComponent(order.id)}`} />
      <View style={[styles.warning, styles.confirmWarning]}>
        <Image
          source={require('../../components/images/warning 1.png')}
          style={styles.warningIcon}
        />
        <Text style={styles.warningText}>
          Please review your details before{`\n`}confirming
        </Text>
      </View>
      <CancellationDetails order={order} reason={reason} />
      <View style={styles.confirmActions}>
        <Text style={styles.policy}>
          Your order will be canceled and refund will be initiated{`\n`}as per
          our policy.
        </Text>
        <Pressable
          style={[styles.primaryButton, styles.confirmButton]}
          onPress={() =>
            router.replace({
              pathname: '/(main)/cancellation-success',
              params: { reason, orderId: order.id },
            })
          }
        >
          <Text style={styles.confirmPrimaryText}>Yes, Cancel Order</Text>
        </Pressable>
        <Pressable
          style={[styles.secondaryButton, styles.confirmButton]}
          onPress={() => router.replace({ pathname: '/(main)/cancel-order', params: { orderId: order.id } })}
        >
          <Text style={styles.confirmSecondaryText}>Go Back</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function CancellationSuccessScreen() {
  const order = useOrder();
  const { reason = order.cancellationReason } = useLocalSearchParams<{
    reason?: string;
  }>();
  return (
    <View style={styles.page}>
      <Header title="Cancellation Confirmed" backRoute="/(main)/home" />
      <View style={styles.successContent}>
        <Image
          source={require('../../components/images/check-circle-fill 1.png')}
          style={styles.successIcon}
        />
        <Text style={styles.successMessage}>
          Your order has been{`\n`}cancelled successfully
        </Text>
        <CancellationDetails order={order} reason={reason} success />
      </View>
      <Pressable
        style={[styles.secondaryButton, styles.successOrdersButton]}
        onPress={() => router.replace('/(main)/orders')}
      >
        <Text style={styles.secondaryText}>View My Orders</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  meta: {
    color: colors.black,
    fontFamily: fonts.regular,
    fontSize: type.xs,
    lineHeight: lineHeight.xs,
  },
  metaLabel: { color: colors.black, fontFamily: fonts.semiBold },
  product: {
    height: 83,
    borderRadius: radii.md,
    backgroundColor: colors.cardSurface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  copy: { flex: 1, marginLeft: spacing.lg },
  productStatus: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: type.xs,
    lineHeight: lineHeight.xs,
  },
  productName: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: type.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  greenDot: {
    width: 8,
    height: 8,
    marginRight: spacing.sm,
  },
  heading: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: type.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  reason: {
    height: 32,
    marginBottom: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reasonText: {
    color: colors.muted,
    fontFamily: fonts.semiBold,
    fontSize: type.sm,
  },
  reasonOptions: {
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.palePurple,
  },
  reasonHint: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: type.xs,
    marginBottom: spacing.xs,
  },
  detailOption: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailText: {
    color: colors.black,
    fontFamily: fonts.medium,
    fontSize: type.sm,
  },
  noteLabel: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: type.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  note: {
    height: 132,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  noteInput: {
    color: colors.black,
    fontFamily: fonts.regular,
    fontSize: type.sm,
    lineHeight: lineHeight.sm,
    flex: 1,
    textAlignVertical: 'top',
  },
  counter: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: type.sm,
    textAlign: 'right',
  },
  warning: {
    height: 94,
    backgroundColor: colors.warningSurface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
    elevation: 1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  confirmWarning: { marginTop: spacing.xxl },
  warningIcon: { width: 34, height: 34 },
  warningText: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: type.md,
    lineHeight: lineHeight.md,
  },
  details: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  confirmActions: {
    marginTop: 'auto',
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  policy: {
    color: colors.black,
    fontFamily: fonts.regular,
    fontSize: type.md,
    lineHeight: lineHeight.md,
    textAlign: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  primaryButton: {
    height: 48,
    marginHorizontal: spacing.lg,
    borderRadius: radii.sm,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: { height: 44 },
  confirmPrimaryText: {
    color: colors.white,
    fontFamily: fonts.semiBold,
    fontSize: type.lg,
  },
  confirmSecondaryText: {
    color: colors.purple,
    fontFamily: fonts.bold,
    fontSize: type.lg,
  },
  confirmDetailLabel: { fontFamily: fonts.semiBold, fontSize: type.productSubtext, lineHeight: lineHeight.sm },
  confirmDetailValue: { fontFamily: fonts.semiBold, fontSize: type.productSubtext, lineHeight: lineHeight.sm },
  confirmAmount: { color: colors.black, fontFamily: fonts.bold, fontSize: type.md, lineHeight: lineHeight.md },
  cancelPrimaryButton: { height: 44, marginBottom: spacing.md },
  disabledButton: { opacity: 0.45 },
  primaryText: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: type.lg,
  },
  secondaryButton: {
    height: 44,
    marginHorizontal: spacing.lg,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.purple,
    backgroundColor: colors.palePurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: colors.purple,
    fontFamily: fonts.bold,
    fontSize: type.lg,
  },
  successContent: { flex: 1 },
  successIcon: { width: 140, height: 140, alignSelf: 'center', marginTop: 48 },
  successMessage: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    textAlign: 'center',
    fontSize: type.lg,
    lineHeight: lineHeight.lg,
    marginTop: 34,
  },
  successDetailLabel: {
    fontFamily: fonts.semiBold,
    fontSize: type.md,
    lineHeight: lineHeight.md,
  },
  successDetailValue: {
    fontFamily: fonts.semiBold,
    fontSize: type.md,
    lineHeight: lineHeight.md,
  },
  successAmount: {
    fontFamily: fonts.bold,
    fontSize: type.md,
    lineHeight: lineHeight.md,
  },
  successOrdersButton: { marginBottom: spacing.xl },
});
