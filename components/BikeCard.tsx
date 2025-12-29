
import { BikeCardProps } from "@/utils/types";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const BikeCard: React.FC<BikeCardProps> = ({ bike, onEdit, onDelete }) => {
  const getStatusColor = (status: "IN_STOCK" | "SOLD"): string => {
    return status === "IN_STOCK" ? "#4CAF50" : "#F44336";
  };

  const getStatusText = (status: "IN_STOCK" | "SOLD"): string => {
    return status === "IN_STOCK" ? "Available" : "Sold";
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Bike",
      `Are you sure you want to delete ${bike.model}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => onDelete(bike._id),
          style: "destructive",
        },
      ]
    );
  };
  
  const calculateProfit = (): number => {
    return bike.sellingPrice - bike.purchasePrice;
  };

  const profit = calculateProfit();

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>{bike.brand}</Text>
            <Text style={styles.model}>{bike.model}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(bike.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(bike.status)}</Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <MaterialIcons name="color-lens" size={18} color="#666" />
              <Text style={styles.detailText}>{bike.color}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="speedometer" size={18} color="#666" />
              <Text style={styles.detailText}>{bike.engineCC} CC</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <MaterialIcons name="inventory" size={18} color="#666" />
              <Text style={styles.detailText}>Stock: {bike.stock}</Text>
            </View>

            <View style={styles.detailItem}>
              <MaterialIcons name="attach-money" size={18} color="#666" />
              <Text style={styles.detailText}>
                Profit: ₹{profit.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Cost</Text>
            <Text style={styles.costPrice}>
              ₹{bike.purchasePrice.toLocaleString()}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Selling</Text>
            <Text style={styles.sellingPrice}>
              ₹{bike.sellingPrice.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(bike)}
          >
            <MaterialIcons name="edit" size={18} color="#2196F3" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={18} color="#F44336" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  brand: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  model: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  priceSection: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  priceItem: {
    flex: 1,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  costPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  sellingPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: "#E0E0E0",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    flex: 0.48,
    justifyContent: "center",
  },
  editButton: {
    borderColor: "#2196F3",
    backgroundColor: "#E3F2FD",
  },
  deleteButton: {
    borderColor: "#F44336",
    backgroundColor: "#FFEBEE",
  },
  editButtonText: {
    marginLeft: 6,
    color: "#2196F3",
    fontWeight: "600",
    fontSize: 14,
  },
  deleteButtonText: {
    marginLeft: 6,
    color: "#F44336",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default BikeCard;
