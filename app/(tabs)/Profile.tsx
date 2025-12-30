import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
  Linking,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/utils/constant";
import ScreenWrapper from "@/components/ScreenWrapper";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const user = {
    name: "Rajesh Kumar",
    email: "admin@tvsagency.com",
    role: "Admin",
    agency: "TVS Super Showroom",
    location: "Mumbai, Maharashtra",
    phone: "+91 9876543210",
    joinDate: "2023-01-15",
    totalSales: 128,
    totalRevenue: "₹45,80,000",
    performance: "94%",
  };

  const menuSections = [
    {
      title: "Business",
      items: [
        {
          id: 1,
          title: "Reports & Analytics",
          icon: "bar-chart",
          iconType: "feather",
          color: colors.info,
          onPress: () => Alert.alert("Reports", "Coming soon!"),
        },
        {
          id: 2,
          title: "Sales History",
          icon: "receipt",
          iconType: "material",
          color: colors.success,
          onPress: () => Alert.alert("Sales History", "Coming soon!"),
        },
        {
          id: 3,
          title: "Business Settings",
          icon: "settings",
          iconType: "ionicons",
          color: colors.secondary,
          onPress: () => Alert.alert("Settings", "Coming soon!"),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          id: 4,
          title: "Notifications",
          icon: "notifications",
          iconType: "ionicons",
          color: colors.primary,
          type: "switch",
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 5,
          title: "Dark Mode",
          icon: "moon",
          iconType: "feather",
          color: colors.text,
          type: "switch",
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          id: 6,
          title: "Export Data",
          icon: "download",
          iconType: "feather",
          color: colors.warning,
          onPress: handleExportData,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          id: 7,
          title: "Help & Support",
          icon: "help-circle",
          iconType: "ionicons",
          color: colors.info,
          onPress: () => Linking.openURL("mailto:support@tvsagency.com"),
        },
        {
          id: 8,
          title: "Rate App",
          icon: "star",
          iconType: "ionicons",
          color: colors.warning,
          onPress: () => Alert.alert("Rate App", "Coming soon!"),
        },
        {
          id: 9,
          title: "About",
          icon: "information-circle",
          iconType: "ionicons",
          color: colors.textLight,
          onPress: () =>
            Alert.alert(
              "About TVS Bike Inventory",
              "Version 1.0.0\n\nA complete inventory management solution for TVS bike dealerships.\n\n© 2024 TVS Agency. All rights reserved."
            ),
        },
      ],
    },
  ];

  async function handleExportData() {
    setLoading(true);
    try {
      // TODO: Generate and export data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert("Success", "Data exported successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to export data");
    } finally {
      setLoading(false);
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please grant camera roll permissions"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          // TODO: Implement logout logic
          router.replace("/login");
        },
      },
    ]);
  };

  const renderIcon = (icon: string, type: string, color: string) => {
    const size = 22;

    switch (type) {
      case "ionicons":
        return <Ionicons name={icon as any} size={size} color={color} />;
      case "fontawesome5":
        return <FontAwesome5 name={icon as any} size={size} color={color} />;
      case "feather":
        return <Feather name={icon as any} size={size} color={color} />;
      default:
        return <MaterialIcons name={icon as any} size={size} color={color} />;
    }
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={pickImage}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Text>
                </View>
              )}
              <View style={styles.editImageButton}>
                <Feather name="camera" size={16} color={colors.white} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileRole}>{user.role}</Text>
            <Text style={styles.profileAgency}>{user.agency}</Text>
          </View>
        </View>

        {/* User Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: `${colors.primary}20` },
              ]}
            >
              <FontAwesome5
                name="shopping-cart"
                size={20}
                color={colors.primary}
              />
            </View>
            <Text style={styles.statNumber}>{user.totalSales}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>

          <View style={styles.statItem}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: `${colors.success}20` },
              ]}
            >
              <MaterialIcons
                name="attach-money"
                size={24}
                color={colors.success}
              />
            </View>
            <Text style={styles.statNumber}>{user.totalRevenue}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>

          <View style={styles.statItem}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: `${colors.warning}20` },
              ]}
            >
              <Ionicons name="trending-up" size={24} color={colors.warning} />
            </View>
            <Text style={styles.statNumber}>{user.performance}</Text>
            <Text style={styles.statLabel}>Performance</Text>
          </View>
        </View>

        {/* User Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textLight}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="call-outline"
                size={20}
                color={colors.textLight}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{user.phone}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.textLight}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{user.location}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.textLight}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Joined On</Text>
              <Text style={styles.detailValue}>
                {formatJoinDate(user.joinDate)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => Alert.alert("Edit Profile", "Coming soon!")}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuItems}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={item.onPress}
                  disabled={item.type === "switch"}
                >
                  <View style={styles.menuItemLeft}>
                    <View
                      style={[
                        styles.menuItemIcon,
                        { backgroundColor: item.color },
                      ]}
                    >
                      {renderIcon(item.icon, item.iconType, colors.white)}
                    </View>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  {item.type === "switch" ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: colors.border, true: item.color }}
                      thumbColor={colors.white}
                    />
                  ) : (
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.textLight}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>TVS Bike Inventory v1.0.0</Text>
          <Text style={styles.appCopyright}>
            © 2024 TVS Agency. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    padding: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.white,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.white,
  },
  profileAvatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.primary,
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 2,
  },
  profileAgency: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: -30,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: 4,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  detailIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
  },
  editProfileButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  menuSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  menuItems: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.danger,
  },
  appInfo: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: colors.textLight,
  },
};
