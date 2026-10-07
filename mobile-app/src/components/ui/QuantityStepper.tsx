import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { CART_CONFIG, CART_COPY, type CartCopy } from '@/constants/config';
import { CART_TYPOGRAPHY, COLORS, RADIUS, SIZES, UI } from '@/theme';

interface QuantityStepperProps {
  copy?: CartCopy;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  min = CART_CONFIG.MIN_QUANTITY_PER_ITEM,
  max = CART_CONFIG.MAX_QUANTITY_PER_ITEM,
  copy = CART_COPY,
}: QuantityStepperProps) {
  const canDecrement = quantity > min;
  const canIncrement = quantity < max;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onIncrement}
        disabled={!canIncrement}
        accessibilityState={{ disabled: !canIncrement }}
        style={[styles.button, styles.buttonLeft]}
        accessibilityRole="button"
        accessibilityLabel={copy.increaseQuantity}
      >
        <AppText
          variant="bodyMedium"
          color={COLORS.text.dark}
          style={styles.symbolText}
        >
          {copy.increment}
        </AppText>
      </Pressable>

      <View style={styles.countContainer}>
        <AppText
          variant="bodyMedium"
          color={COLORS.text.inverse}
          style={styles.countText}
        >
          {quantity}
        </AppText>
      </View>

      <Pressable
        onPress={onDecrement}
        disabled={!canDecrement}
        accessibilityState={{ disabled: !canDecrement }}
        style={[styles.button, styles.buttonRight]}
        accessibilityRole="button"
        accessibilityLabel={copy.decreaseQuantity}
      >
        <AppText
          variant="bodyMedium"
          color={COLORS.text.dark}
          style={styles.symbolText}
        >
          {copy.decrement}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZES.stepperWidth,
    height: SIZES.stepperHeight,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: UI.borderWidth,
    borderColor: COLORS.stepperGreen,
    borderRadius: RADIUS.xs,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  button: {
    flex: 1,
    height: SIZES.stepperHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  buttonLeft: { borderRightWidth: UI.borderWidth, borderRightColor: COLORS.stepperGreen },
  buttonRight: { borderLeftWidth: UI.borderWidth, borderLeftColor: COLORS.stepperGreen },
  countContainer: {
    flex: 1,
    height: SIZES.stepperHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.stepperGreen,
  },
  symbolText: { ...CART_TYPOGRAPHY.quantitySymbol },
  countText: { ...CART_TYPOGRAPHY.quantity },
});
