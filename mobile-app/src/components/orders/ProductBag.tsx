import { Image, StyleSheet, View } from 'react-native';

const saafPacket = require('../images/saaf-fungicide-generated.png');

export function ProductBag({ small = false }: { small?: boolean }) {
  return (
    <View style={[styles.frame, small && styles.small]}>
      <Image source={saafPacket} style={styles.packet} resizeMode="stretch" />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: 38, height: 62, overflow: 'hidden' },
  small: { width: 38, height: 62 },
  packet: { position: 'absolute', width: 62, height: 93, left: -12, top: -18 },
});
