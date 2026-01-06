import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/utils/constant";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

const Index = () => {
  const { user, isLoading, token } = useAuth();

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (!user || !token) {
    return <Redirect href="/(auth)/Login" />;
  }

  return <Redirect href="/(tabs)/Dashboard" />;
};

export default Index;
