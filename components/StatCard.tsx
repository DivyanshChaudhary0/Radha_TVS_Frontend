// components/StatCard.tsx
import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { colors } from "@/utils/constant";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  style?: ViewStyle;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  style,
}) => {
  const renderIcon = () => {
    // Determine icon type based on icon name
    if (icon === "directions-bike") {
      return <MaterialIcons name="directions-bike" size={24} color={color} />;
    } else if (icon === "checkmark-circle") {
      return <Ionicons name="checkmark-circle" size={24} color={color} />;
    } else if (icon === "trending-up") {
      return <Ionicons name="trending-up" size={24} color={color} />;
    } else if (icon === "cash") {
      return <FontAwesome5 name="money-bill-wave" size={20} color={color} />;
    } else {
      return <Ionicons name="stats-chart" size={24} color={color} />;
    }
  };

  return (
    <View style={[styles.card, style]}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        {renderIcon()}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
});

export default StatCard;
