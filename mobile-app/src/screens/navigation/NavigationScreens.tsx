import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing, type } from '../../../themes';
import { Header } from '../../components/orders/Header';

function DestinationScreen({ title }: { title: string }) {
  return <View style={styles.page}><Header title={title} /><View style={styles.content}><Text style={styles.title}>{title}</Text></View></View>;
}

export function AdvisorScreen() {
  return <DestinationScreen title="Advisor" />;
}

export function ProfileScreen() {
  return <DestinationScreen title="Profile" />;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.white },
  content: { flex: 1, padding: spacing.lg },
  title: { color: colors.black, fontFamily: fonts.medium, fontSize: type.lg },
});
