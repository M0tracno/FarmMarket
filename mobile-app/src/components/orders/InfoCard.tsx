import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import {
  colors,
  fonts,
  lineHeight,
  radii,
  spacing,
  type,
} from '../../../themes';

export function InfoCard({ children, minHeight, afterGap = 0, paddingTop = 14, paddingBottom = 6 }: { children: React.ReactNode; minHeight?: number; afterGap?: number; paddingTop?: number; paddingBottom?: number }) {
  return (
    <View style={[styles.band, { marginBottom: afterGap }]}>
      <View style={[styles.card, { paddingTop, paddingBottom }, minHeight ? { minHeight } : null]}>{children}</View>
    </View>
  );
}

export function KeyValue({
  label,
  value,
  strong = false,
  labelStyle,
  valueStyle,
}: {
  label: string;
  value: string;
  strong?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <Text style={[styles.value, strong && styles.total, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    backgroundColor: colors.bandPurple,
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: type.sm,
    lineHeight: lineHeight.sm,
  },
  value: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: type.sm,
    lineHeight: lineHeight.sm,
    textAlign: 'right',
  },
  total: {
    color: colors.black,
    fontFamily: fonts.semiBold,
    fontSize: type.md,
    lineHeight: lineHeight.md,
  },
});
