import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import UserProfileIcon from "@/components/UserProfileIcon";
import UserProfile from "@/components/UserProfileModal";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

const Dashboard = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <ScreenWrapper>
      <Header
        title="Dashboard"
        rightIcon={UserProfileIcon(user)}
        onRightIconPress={() => setIsVisible(!isVisible)}
      />
      <Typo>Dashboard</Typo>

      <TouchableOpacity onPress={() => router.push("/Inventory")}>
        <Typo>Inventory</Typo>
      </TouchableOpacity>

      <UserProfile isVisible={isVisible} setIsVisible={setIsVisible} />
    </ScreenWrapper>
  );
};

export default Dashboard;
