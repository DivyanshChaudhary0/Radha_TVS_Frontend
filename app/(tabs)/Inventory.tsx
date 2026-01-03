import { bikeApi } from "@/api/bikeApi";
import BikeCard from "@/components/BikeCard";
import BikeFormModal from "@/components/BikeFormModal";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { Bike } from "@/utils/types";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const InventoryScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const { bikes, setBikes } = useAuth();

  const fetchBikes = async (): Promise<void> => {
    try {
      const data = await bikeApi.getAll();
      setBikes(data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch bikes. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = (): void => {
    setRefreshing(true);
    fetchBikes();
  };

  const handleAddBike = (): void => {
    setSelectedBike(null);
    setModalVisible(true);
  };

  const handleEditBike = (bike: Bike): void => {
    setSelectedBike(bike);
    setModalVisible(true);
  };

  const handleDeleteBike = async (id: string): Promise<void> => {
    try {
      await bikeApi.deleteBike(id);
      Toast.show({
        type: "success",
        text1: "Bike deleted successfully",
      });
      fetchBikes();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to delete bike. Please try again.",
      });
    }
  };

  const handleSubmitBike = async (
    bikeData: Omit<Bike, "_id" | "brand" | "createdAt" | "updatedAt">
  ): Promise<void> => {
    try {
      if (selectedBike) {
        await bikeApi.updateBike(selectedBike._id, bikeData);
        Toast.show({
          type: "success",
          text1: "Bike updated successfully",
        });
      } else {
        const newBikeData = {
          ...bikeData,
          brand: "TVS" as const,
        };
        await bikeApi.createBike(newBikeData);
        Toast.show({
          type: "success",
          text1: "Bike added successfully",
        });
      }
      fetchBikes();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `Failed to ${
          selectedBike ? "update" : "add"
        } bike. Please try again.`,
      });
    }
  };

  const getStats = () => {
    const totalBikes = bikes.length;
    const inStock = bikes.filter((bike) => bike.status === "IN_STOCK").length;
    const sold = bikes.filter((bike) => bike.status === "SOLD").length;
    const totalStock = bikes.reduce((sum, bike) => sum + bike.stock, 0);
    const totalValue = bikes.reduce(
      (sum, bike) => sum + bike.sellingPrice * bike.stock,
      0
    );

    return { totalBikes, inStock, sold, totalStock, totalValue };
  };

  const stats = getStats();

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading inventory...</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>TVS Bike Inventory</Text>
            <Text style={styles.headerSubtitle}>Manage your bike stock</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Ionicons name="refresh" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="directions-bike" size={24} color="#2196F3" />
            <Text style={styles.statNumber}>{stats.totalBikes}</Text>
            <Text style={styles.statLabel}>Models</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="inventory" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>{stats.inStock}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="warehouse" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>{stats.totalStock}</Text>
            <Text style={styles.statLabel}>Total Stock</Text>
          </View>
        </View>

        {/* Inventory Title */}
        <View style={styles.inventoryHeader}>
          <Text style={styles.inventoryTitle}>Bike Inventory</Text>
          <Text style={styles.inventoryCount}>({bikes.length} bikes)</Text>
        </View>

        {/* Bike List */}
        <FlatList
          data={bikes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BikeCard
              bike={item}
              onEdit={handleEditBike}
              onDelete={handleDeleteBike}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#2196F3"]}
              tintColor="#2196F3"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="directions-bike" size={64} color="#DDD" />
              <Text style={styles.emptyText}>No bikes in inventory</Text>
              <Text style={styles.emptySubtext}>
                Add your first bike to get started
              </Text>
            </View>
          }
          contentContainerStyle={[
            styles.listContent,
            bikes.length === 0 && styles.emptyListContent,
          ]}
        />

        {/* Add Bike Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddBike}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Bike</Text>
        </TouchableOpacity>

        {/* Bike Form Modal */}
        <BikeFormModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleSubmitBike}
          initialData={selectedBike}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#2196F3",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    backgroundColor: "#2196F3",
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  refreshButton: {
    padding: 8,
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: -12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    marginHorizontal: 4,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 6,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  inventoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  inventoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  inventoryCount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#AAA",
    marginTop: 8,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default InventoryScreen;
