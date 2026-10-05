import { ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../../../themes';
import { Header } from '../../components/orders/Header';
import { OrderCard } from '../../components/orders/OrderCard';
import { useOrders } from '../../hooks/useOrder';

export function OrdersScreen() {
  const orders = useOrders();
  return (
    <View style={styles.page}>
      <Header title="My Orders" backRoute="/(main)/home" />
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {orders.map((order) => <OrderCard key={order.id} order={order} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.white }, list: { flex: 1 } });
