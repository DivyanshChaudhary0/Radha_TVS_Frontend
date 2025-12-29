
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ScreenWrapper = ({ style, children }: any) => {
  return (
    <SafeAreaView style={[{ flex: 1 }, style]} edges={["bottom", "top"]}>
      <StatusBar barStyle={"dark-content"} backgroundColor={"transparent"} />
      {children}
    </SafeAreaView>
  );
};

export default ScreenWrapper;
