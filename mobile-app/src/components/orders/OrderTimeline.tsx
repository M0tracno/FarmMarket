import { Image, StyleSheet, Text, View } from 'react-native';
import type { OrderEvent } from '../../types/order';
import { colors, fonts, lineHeight, type } from '../../../themes';

const statusDot = require('../images/Rectangle 59.png');
const checkCircle = require('../images/check-circle-fill (1) 1.png');

export function OrderTimeline({
  events,
  deliveryText,
  allCompleted = false,
}: {
  events: OrderEvent[];
  deliveryText: string;
  allCompleted?: boolean;
}) {
  return (
    <View style={styles.timeline}>
      <View style={styles.deliveryTitle}>
        <Image
          source={checkCircle}
          resizeMode="contain"
          style={[styles.check, { tintColor: colors.timelineCompleted }]}
        />
        <Text style={styles.deliveryText}>{deliveryText}</Text>
      </View>
      {events.map((event, index) => (
        <View style={styles.event} key={event.name}>
          <View style={styles.markerColumn}>
            {events[index + 1] && (
              <Connector completed={allCompleted || events[index + 1].completed} />
            )}
            <Image
              source={statusDot}
              resizeMode="contain"
              style={styles.dot}
              tintColor={getStatusColor(allCompleted || event.completed)}
            />
          </View>
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.date}>{event.date}</Text>
        </View>
      ))}
    </View>
  );
}

function Connector({ completed }: { completed: boolean }) {
  return <View style={[styles.connector, { backgroundColor: getStatusColor(completed) }]} />;
}

function getStatusColor(completed: boolean) {
  return completed ? colors.timelineCompleted : colors.gray60;
}

const styles = StyleSheet.create({
  timeline: { paddingHorizontal: 16, paddingTop: 7 },
  deliveryTitle: { height: 40, flexDirection: 'row', alignItems: 'center', gap: 10 },
  markerColumn: { width: 20, height: '100%', alignItems: 'center', justifyContent: 'center' },
  connector: { position: 'absolute', top: 37, width: 5, height: 44 },
  check: { width: 20, height: 20 },
  deliveryText: { color: colors.black, fontFamily: fonts.semiBold, fontSize: type.md, lineHeight: lineHeight.md },
  event: { height: 59, flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 16, height: 16 },
  eventName: { color: colors.black, fontFamily: fonts.semiBold, fontSize: type.timeline, lineHeight: lineHeight.md },
  date: { color: colors.secondaryText, fontFamily: fonts.medium, fontSize: type.productSubtext, lineHeight: lineHeight.sm, marginLeft: 4 },
});
