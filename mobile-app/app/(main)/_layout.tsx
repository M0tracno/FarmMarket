import { Tabs } from 'expo-router';
import { colors } from '../../themes';

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.purple,
        tabBarInactiveTintColor: colors.black,
        tabBarStyle: {
          height: 84,
          paddingTop: 10,
          backgroundColor: colors.cream,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="advisor" options={{ title: 'Advisor' }} />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />

      <Tabs.Screen
        name="cart"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />

      <Tabs.Screen
        name="order-detail"
        options={{ href: null, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="help-centre"
        options={{ href: null, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="help-upload"
        options={{ href: null, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="return-success"
        options={{ href: null, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="cancel-order"
        options={{ href: null, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="confirm-cancellation"
        options={{ href: null, tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen
        name="cancellation-success"
        options={{ href: null, tabBarStyle: { display: 'none' } }}
      />
    </Tabs>
  );
}