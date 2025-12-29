

import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import Typo from "./Typo";

type Props = {
  icon?: React.ReactElement;
  title?: string;
  style?: ViewStyle;
  onPress?: () => void;
  rightIcon?: React.ReactElement;
  onRightIconPress?: () => void;
};

const Header = ({
  icon,
  title,
  style,
  onPress,
  rightIcon,
  onRightIconPress,
}: Props) => {
  return (
    <View
      style={{
        height: 60,
        backgroundColor: "#094770",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        ...style,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16,}}>
        <TouchableOpacity onPress={onPress}>{icon && icon}</TouchableOpacity>

        <View>
          <Typo color="white" fontWeight={500} size={16} style={{}}>
            {title}
          </Typo>
        </View>
      </View>

      <TouchableOpacity onPress={onRightIconPress}>
        {rightIcon && rightIcon}
      </TouchableOpacity>
    </View>             
  );
};

export default Header;
