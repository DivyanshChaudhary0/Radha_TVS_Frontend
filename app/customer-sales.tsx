import { customerApi } from "@/api/customerApi";
import { saleApi } from "@/api/saleApi";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors } from "@/utils/constant";
import { Sale } from "@/utils/types";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CustomerSalesScreen() {
  const { id }: any = useLocalSearchParams();
  const [customer, setCustomer] = useState<any>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalStats, setTotalStats] = useState({
    totalSales: 0,
    totalAmount: 0,
    averageSale: 0,
    lastSaleDate: "",
  });

  useEffect(() => {
    if (id) {
      fetchCustomerAndSales();
    }
  }, [id]);

  const fetchCustomerAndSales = async () => {
    try {
      setLoading(true);

      const customerResponse = await customerApi.getCustomerById(id);
    
      if (customerResponse.data) {
        setCustomer(customerResponse.data);
      } else if (customerResponse.success && customerResponse.data) {
        setCustomer(customerResponse.data);
      } else {
        setCustomer(customerResponse);
      }

      // 2. Fetch sales for this customer
      const salesResponse = await saleApi.getSalesByCustomerId(id);
      console.log("Sales API Response:", salesResponse);

      let salesData = [];

      // Handle different response structures
      if (Array.isArray(salesResponse)) {
        salesData = salesResponse;
      } else if (salesResponse.data && Array.isArray(salesResponse.data)) {
        salesData = salesResponse.data;
      } else if (salesResponse.success && Array.isArray(salesResponse.data)) {
        salesData = salesResponse.data;
      }

      setSales(salesData);

      // 3. Calculate statistics
      const totalSales = salesData.length;

      const totalAmount = salesData.reduce(
        (sum: number, sale: Sale) =>
          sum + (sale?.totalAmount || sale.total || 0),
        0
      );

      const averageSale = totalSales > 0 ? totalAmount / totalSales : 0;
      const lastSaleDate =
        totalSales > 0
          ? salesData[0]?.saleDate || salesData[0]?.date || ""
          : "";

      setTotalStats({
        totalSales,
        totalAmount,
        averageSale,
        lastSaleDate,
      });
    } catch (error: any) {
      console.error("Error fetching customer sales:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to load customer sales data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomerAndSales();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount: number) => {
    if (!amount && amount !== 0) return "₹0";
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const getPaymentMethodIcon = (method: string) => {
    if (!method)
      return <Ionicons name="card" size={16} color={colors.textLight} />;

    const methodLower = method.toLowerCase();
    switch (methodLower) {
      case "cash":
        return (
          <FontAwesome5
            name="money-bill-wave"
            size={16}
            color={colors.success}
          />
        );
      case "card":
        return (
          <FontAwesome5 name="credit-card" size={16} color={colors.primary} />
        );
      case "upi":
        return (
          <FontAwesome5 name="mobile-alt" size={16} color={colors.warning} />
        );
      case "cheque":
        return (
          <MaterialIcons name="description" size={16} color={colors.info} />
        );
      default:
        return <Ionicons name="card" size={16} color={colors.textLight} />;
    }
  };

  const handleDeleteSale = (saleId: string) => {
    Alert.alert(
      "Delete Sale",
      "Are you sure you want to delete this sale record? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // TODO: Delete sale API call
              setSales(sales.filter((s) => s._id !== saleId));
              Alert.alert("Success", "Sale record deleted successfully!");
            } catch (error) {
              Alert.alert("Error", "Failed to delete sale record");
            }
          },
        },
      ]
    );
  };

  const renderSaleItem = ({ item }: { item: any }) => {
    const bikeModel = item?.bikeId?.model || item?.bikeModel || "N/A";
    const unitPrice = item?.unitPrice || 0;
    const discount = item?.discountAmount || item.discount || 0;
    const tax = item?.taxAmount || item.tax || 0;
    const total = item.totalAmount || item.total || 0;
    const quantity = item?.quantity || 1;
    const paymentMethod = item?.paymentMethod || "N/A";
    const date = item?.saleDate || item?.date || "";

    return (
      <View
        style={styles.saleCard}
      >
        <View style={styles.saleHeader}>
          <View style={styles.saleInfo}>
            <Text style={styles.saleModel}>{bikeModel}</Text>
            <View style={styles.saleMeta}>
              <Text style={styles.saleQuantity}>Qty: {quantity}</Text>
              <Text style={styles.saleSeparator}>•</Text>
              <View style={styles.paymentMethod}>
                {getPaymentMethodIcon(paymentMethod)}
                <Text style={styles.paymentText}>
                  {paymentMethod.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={styles.saleDate}>{formatDate(date)}</Text>
          </View>
          <View style={styles.saleAmount}>
            <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
            <Text style={styles.unitPrice}>
              {formatCurrency(unitPrice)} each
            </Text>
          </View>
        </View>

        <View style={styles.saleDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Unit Price</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(unitPrice)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Discount</Text>
              <Text style={[styles.detailValue, { color: colors.success }]}>
                -{formatCurrency(discount)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Tax</Text>
              <Text style={styles.detailValue}>+{formatCurrency(tax)}</Text>
            </View>
          </View>
        </View>

      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading sales history...</Text>
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sales History</Text>
          </View>

          {customer && (
            <View style={styles.customerInfo}>
              <View style={styles.customerAvatar}>
                <Text style={styles.avatarText}>
                  {customer?.name?.charAt(0) || "C"}
                </Text>
              </View>
              <View style={styles.customerDetails}>
                <Text style={styles.customerName}>
                  {customer?.name || "Unknown Customer"}
                </Text>
                <Text style={styles.customerPhone}>
                  {customer?.phone || "No phone"}
                </Text>
                <Text style={styles.customerEmail}>
                  {customer?.email || "No email"}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
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
            <Text style={styles.statNumber}>{totalStats.totalSales}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>

          <View style={styles.statCard}>
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
            <Text style={styles.statNumber}>
              {formatCurrency(totalStats.totalAmount)}
            </Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: `${colors.warning}20` },
              ]}
            >
              <Ionicons name="trending-up" size={24} color={colors.warning} />
            </View>
            <Text style={styles.statNumber}>
              {formatCurrency(totalStats.averageSale)}
            </Text>
            <Text style={styles.statLabel}>Avg. Sale</Text>
          </View>
        </View>

        {/* Last Sale Info */}
        {totalStats.lastSaleDate && (
          <View style={styles.lastSaleCard}>
            <View style={styles.lastSaleHeader}>
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.textLight}
              />
              <Text style={styles.lastSaleTitle}>Last Purchase</Text>
            </View>
            <Text style={styles.lastSaleDate}>
              {formatDate(totalStats.lastSaleDate)}
            </Text>
            <Text style={styles.lastSaleText}>
              Customer loyalty since{" "}
              {new Date(customer?.createdAt || Date.now()).getFullYear()}
            </Text>
          </View>
        )}

        {/* Sales History Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sales History</Text>
          <Text style={styles.sectionSubtitle}>
            {sales.length} sale{sales.length !== 1 ? "s" : ""} found
          </Text>
        </View>

        {/* Sales List */}
        {sales.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome5 name="receipt" size={64} color={colors.border} />
            <Text style={styles.emptyText}>
              No sales found for this customer
            </Text>
            <Text style={styles.emptySubtext}>
              This customer hasn't made any purchases yet
            </Text>
            <TouchableOpacity
              style={styles.newSaleButton}
              onPress={() => router.push("/(tabs)/Sell")}
            >
              <Text style={styles.newSaleButtonText}>Create First Sale</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={sales}
            renderItem={renderSaleItem}
            keyExtractor={(item) => item._id || Math.random().toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push("/(tabs)/Sell")}
          >
            <Ionicons name="add-circle" size={24} color={colors.primary} />
            <Text style={styles.quickActionText}>New Sale</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => {
              Alert.alert("Contact Customer", `Call ${customer?.phone}?`, [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Call",
                  onPress: () => Linking.openURL(`tel:${customer?.phone}`),
                },
              ]);
            }}
          >
            <Ionicons name="call-outline" size={24} color={colors.warning} />
            <Text style={styles.quickActionText}>Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Sales Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Sales:</Text>
            <Text style={styles.summaryValue}>{totalStats.totalSales}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Revenue:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totalStats.totalAmount)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Average Sale Value:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totalStats.averageSale)}
            </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  customerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.white,
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  statCard: {
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
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  lastSaleCard: {
    backgroundColor: colors.infoLight,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.info,
  },
  lastSaleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  lastSaleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  lastSaleDate: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  lastSaleText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 20,
  },
  newSaleButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  newSaleButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  saleCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  saleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  saleInfo: {
    flex: 1,
  },
  saleModel: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
  },
  saleMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  saleQuantity: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  saleSeparator: {
    color: colors.textLight,
    marginHorizontal: 8,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  saleDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  saleAmount: {
    alignItems: "flex-end",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  unitPrice: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  saleDetails: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 11,
    color: colors.textLight,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  saleActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: colors.background,
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    gap: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  summaryCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 20,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
});
