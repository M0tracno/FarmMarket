import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="title">Home</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
