import { dashboardApi } from "@/api/dashboardApi";
import QuickAction from "@/components/QuickAction";
import ScreenWrapper from "@/components/ScreenWrapper";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/utils/constant";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DashboardStats {
  totalBikes: number;
  inStock: number;
  soldToday: number;
  revenueToday: number;
  bikesSoldToday: number;
  lowStock: number;
  totalCustomers: number;
  weeklySales: any[];
  paymentMethods: any[];
}

interface RecentActivity {
  type: "sale" | "stock" | "customer" | "alert";
  message: string;
  time: string;
}

export default function DashboardScreen() {
  const { isLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBikes: 0,
    inStock: 0,
    soldToday: 0,
    revenueToday: 0,
    bikesSoldToday: 0,
    lowStock: 0,
    totalCustomers: 0,
    weeklySales: [],
    paymentMethods: [],
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );

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
    try {
      setLoading(true);
      const response = await dashboardApi.getStatics();

      if (response.success) {
        setStats(response.data.stats);
        setRecentActivities(response.data.recentActivities);
      }
    } catch (err) {
      console.log("Error fetching dashboard data:", err);
      setStats({
        totalBikes: 45,
        inStock: 32,
        soldToday: 5,
        revenueToday: 625000,
        bikesSoldToday: 5,
        lowStock: 3,
        totalCustomers: 128,
        weeklySales: [],
        paymentMethods: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
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

  if (isLoading || loading) {
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
          </View>

          <View style={{ marginTop: 12 }}>
            {recentActivities.map((activity, index) => (
              <TouchableOpacity
                key={index}
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

        {/* Additional Stats Section (Optional) */}
        {stats.lowStock > 0 && (
          <View
            style={[
              styles.card,
              {
                margin: 16,
                marginTop: 0,
                backgroundColor: colors.warningLight,
                borderWidth: 1,
                borderColor: colors.warning,
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
                    { fontWeight: "600", color: colors.text },
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
                  restocking
                </Text>
              </View>
            </View>
          </View>
        )}
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
