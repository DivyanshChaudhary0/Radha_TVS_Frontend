// app/(tabs)/Dashboard.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/utils/constant";
import ScreenWrapper from "@/components/ScreenWrapper";
import StatCard from "@/components/StatCard";
import QuickAction from "@/components/QuickAction";

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalBikes: 0,
    inStock: 0,
    soldToday: 0,
    revenueToday: 0,
    lowStock: 0,
    totalCustomers: 0,
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "sale",
      message: "TVS Apache RTR 200 sold to Rajesh Kumar",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "stock",
      message: "Added 5 units of TVS Raider 125",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "customer",
      message: "New customer registered: Priya Sharma",
      time: "6 hours ago",
    },
    {
      id: 4,
      type: "alert",
      message: "Low stock alert: TVS Jupiter",
      time: "1 day ago",
    },
  ]);

  const quickActions = [
    {
      id: 1,
      title: "Add Bike",
      icon: "add-circle",
      color: colors.primary,
      onPress: () => router.push("/(tabs)/Inventory"),
    },
    {
      id: 2,
      title: "Quick Sale",
      icon: "cash",
      color: colors.success,
      onPress: () => router.push("/(tabs)/Sell"),
    },
    {
      id: 3,
      title: "Add Customer",
      icon: "person-add",
      color: colors.secondary,
      onPress: () => router.push("/(tabs)/Customers"),
    },
    {
      id: 4,
      title: "View Reports",
      icon: "bar-chart",
      color: colors.info,
      onPress: () => router.push("/(tabs)/Profile"),
    },
  ];

  const fetchDashboardData = async () => {
    // TODO: Replace with actual API calls
    setStats({
      totalBikes: 45,
      inStock: 32,
      soldToday: 5,
      revenueToday: 625000,
      lowStock: 3,
      totalCustomers: 128,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "sale":
        return (
          <FontAwesome5 name="shopping-cart" size={16} color={colors.success} />
        );
      case "stock":
        return (
          <MaterialIcons name="inventory" size={16} color={colors.primary} />
        );
      case "customer":
        return <Ionicons name="person" size={16} color={colors.secondary} />;
      case "alert":
        return <Ionicons name="warning" size={16} color={colors.warning} />;
      default:
        return (
          <Ionicons name="notifications" size={16} color={colors.textLight} />
        );
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.primary, padding: 20 },
          ]}
        >
          <View style={styles.rowBetween}>
            <View>
              <Text
                style={[styles.h2, { color: colors.white, marginBottom: 4 }]}
              >
                Welcome, Admin! 👋
              </Text>
              <Text style={[styles.body2, { color: "rgba(255,255,255,0.9)" }]}>
                Here's your business overview
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.white}
              />
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  backgroundColor: colors.danger,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  3
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={[styles.h3, { marginTop: 8, marginBottom: 16 }]}>
            Quick Actions
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {quickActions.map((action) => (
              <QuickAction
                key={action.id}
                title={action.title}
                icon={action.icon}
                color={action.color}
                onPress={action.onPress}
              />
            ))}
          </View>
        </View>

        {/* Stats Overview */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={[styles.h3, { marginBottom: 16 }]}>Overview</Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <StatCard
              title="Total Bikes"
              value={stats.totalBikes.toString()}
              icon="directions-bike"
              color={colors.primary}
              style={{ width: "48%", marginBottom: 16 }}
            />
            <StatCard
              title="In Stock"
              value={stats.inStock.toString()}
              icon="checkmark-circle"
              color={colors.success}
              style={{ width: "48%", marginBottom: 16 }}
            />
            <StatCard
              title="Sold Today"
              value={stats.soldToday.toString()}
              icon="trending-up"
              color={colors.secondary}
              style={{ width: "48%", marginBottom: 16 }}
            />
            <StatCard
              title="Revenue Today"
              value={`₹${(stats.revenueToday / 1000).toFixed(1)}K`}
              icon="cash"
              color={colors.warning}
              style={{ width: "48%", marginBottom: 16 }}
            />
          </View>
        </View>

        {/* Recent Activities */}
        <View style={[styles.card, { margin: 16 }]}>
          <View style={styles.rowBetween}>
            <Text style={styles.h3}>Recent Activities</Text>
            <TouchableOpacity>
              <Text style={[styles.body2, { color: colors.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 12 }}>
            {recentActivities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.row,
                  {
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.divider,
                  },
                ]}
              >
                <View style={{ marginRight: 12 }}>
                  {getActivityIcon(activity.type)}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.body2}>{activity.message}</Text>
                  <Text style={[styles.caption, { marginTop: 2 }]}>
                    {activity.time}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textLight}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Low Stock Alert */}
        {stats.lowStock > 0 && (
          <View
            style={[
              styles.card,
              {
                margin: 16,
                marginTop: 0,
                backgroundColor: colors.warningLight,
              },
            ]}
          >
            <View style={styles.row}>
              <Ionicons
                name="warning"
                size={24}
                color={colors.warning}
                style={{ marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.body1,
                    { color: colors.text, fontWeight: "600" },
                  ]}
                >
                  Low Stock Alert
                </Text>
                <Text
                  style={[
                    styles.body2,
                    { color: colors.textSecondary, marginTop: 4 },
                  ]}
                >
                  {stats.lowStock} bike{stats.lowStock > 1 ? "s" : ""} need
                  restocking.
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.warning,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 6,
                }}
                onPress={() => router.push("/(tabs)/Inventory")}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  View
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Performance Metrics */}
        <View style={[styles.card, { margin: 16, marginTop: 0 }]}>
          <Text style={styles.h3}>Performance Metrics</Text>
          <View style={{ marginTop: 12 }}>
            <View style={[styles.rowBetween, { marginBottom: 12 }]}>
              <Text style={styles.body2}>Monthly Sales Target</Text>
              <Text
                style={[
                  styles.body2,
                  { color: colors.success, fontWeight: "600" },
                ]}
              >
                75%
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: colors.divider,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: "75%",
                  height: "100%",
                  backgroundColor: colors.success,
                  borderRadius: 4,
                }}
              />
            </View>

            <View
              style={[styles.rowBetween, { marginTop: 20, marginBottom: 12 }]}
            >
              <Text style={styles.body2}>Customer Satisfaction</Text>
              <Text
                style={[
                  styles.body2,
                  { color: colors.primary, fontWeight: "600" },
                ]}
              >
                92%
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: colors.divider,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: "92%",
                  height: "100%",
                  backgroundColor: colors.primary,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  h1: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  body1: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 16,
  },
});
