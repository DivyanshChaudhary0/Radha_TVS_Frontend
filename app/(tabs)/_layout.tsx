import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="Dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Inventory"
        options={{
          title: "Inventory",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="directions-bike" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Sell"
        options={{
          title: "Sell",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="cash-register" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Customers"
        options={{
          title: "Customers",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
