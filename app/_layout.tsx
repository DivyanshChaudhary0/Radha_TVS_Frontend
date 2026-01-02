import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import Login from "./(auth)/Login";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Main />
      </Stack>
    </AuthProvider>
  );
}

const Main = () => {
  const { user, isLoading, token } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user || !token) {
    return <Login />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Toast />
    </Stack>
  );
};
