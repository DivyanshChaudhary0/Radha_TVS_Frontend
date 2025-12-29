import { Image, View } from "react-native";
import Typo from "./Typo";

const UserProfileIcon = (user: any) => {
  const profileUrl = user?.photoUrl || user?.profileUrl;
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "?";

  if (!profileUrl) {
    return (
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#EEF0FF",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typo color="#094770" fontWeight={"800"} size={20}>
          {firstLetter}
        </Typo>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: profileUrl }}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: "cover",
        borderWidth: 1,
        borderColor: "white",
      }}
    />
  );
};

export default UserProfileIcon;
