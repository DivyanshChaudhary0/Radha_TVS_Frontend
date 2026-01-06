import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)/Login" />
        <Stack.Screen name="add-customer" />
        <Stack.Screen name="customer-sales" />
        <Stack.Screen name="edit-sales" />
        <Toast />
      </Stack>
    </AuthProvider>
  );
}
