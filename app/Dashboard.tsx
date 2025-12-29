
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import UserProfileIcon from "@/components/UserProfileIcon";
import UserProfile from "@/components/UserProfileModal";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";

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

      <UserProfile isVisible={isVisible} setIsVisible={setIsVisible}  />
    </ScreenWrapper>
  );
};

export default Dashboard;
