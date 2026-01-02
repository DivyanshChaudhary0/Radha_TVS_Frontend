
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors } from "@/utils/constant";
import { Sale } from "@/utils/types";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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
  const { id } = useLocalSearchParams();
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

  // Mock customer data - Replace with API call
  useEffect(() => {
    fetchCustomerAndSales();
  }, [id]);

  const fetchCustomerAndSales = async () => {
    try {
      // TODO: Replace with actual API calls

      // Mock customer data based on ID
      const mockCustomer = {
        _id: id as string,
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        phone: "+91 9876543210",
        address: "Mumbai, Maharashtra",
        createdAt: "2024-01-15T10:30:00Z",
      };

      // Mock sales data
      const mockSales: Sale[] = [
        {
          _id: "1",
          bikeId: "1",
          customerId: id as string,
          bikeModel: "TVS Apache RTR 200",
          customerName: "Rajesh Kumar",
          quantity: 1,
          unitPrice: 150000,
          discount: 5000,
          tax: 27000,
          total: 172000,
          paymentMethod: "upi",
          date: "2024-01-20T14:30:00Z",
          createdAt: "2024-01-20T14:30:00Z",
        },
        {
          _id: "2",
          bikeId: "2",
          customerId: id as string,
          bikeModel: "TVS Raider 125",
          customerName: "Rajesh Kumar",
          quantity: 2,
          unitPrice: 95000,
          discount: 10000,
          tax: 34200,
          total: 218400,
          paymentMethod: "card",
          date: "2024-01-25T11:15:00Z",
          createdAt: "2024-01-25T11:15:00Z",
        },
        {
          _id: "3",
          bikeId: "3",
          customerId: id as string,
          bikeModel: "TVS Jupiter",
          customerName: "Rajesh Kumar",
          quantity: 1,
          unitPrice: 85000,
          discount: 3000,
          tax: 14760,
          total: 96760,
          paymentMethod: "cash",
          date: "2024-02-01T16:45:00Z",
          createdAt: "2024-02-01T16:45:00Z",
        },
      ];

      setCustomer(mockCustomer);
      setSales(mockSales);

      // Calculate stats
      const totalSales = mockSales.length;
      const totalAmount = mockSales.reduce((sum, sale) => sum + sale.total, 0);
      const averageSale = totalSales > 0 ? totalAmount / totalSales : 0;
      const lastSaleDate =
        mockSales.length > 0 ? mockSales[mockSales.length - 1].date : "";

      setTotalStats({
        totalSales,
        totalAmount,
        averageSale,
        lastSaleDate,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to load customer sales data");
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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
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

  const handleViewInvoice = (sale: Sale) => {
    Alert.alert(
      "Invoice Details",
      `Bike: ${sale.bikeModel}\nQuantity: ${
        sale.quantity
      }\nUnit Price: ${formatCurrency(
        sale.unitPrice
      )}\nDiscount: ${formatCurrency(sale.discount)}\nTax: ${formatCurrency(
        sale.tax
      )}\nTotal: ${formatCurrency(
        sale.total
      )}\nPayment: ${sale.paymentMethod.toUpperCase()}\nDate: ${formatDate(
        sale.date
      )}`,
      [
        { text: "Close", style: "cancel" },
        {
          text: "Print Invoice",
          onPress: () => console.log("Print invoice:", sale._id),
        },
        {
          text: "Share",
          onPress: () => console.log("Share invoice:", sale._id),
        },
      ]
    );
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

  const renderSaleItem = ({ item }: { item: Sale }) => (
    <TouchableOpacity
      style={styles.saleCard}
      onPress={() => handleViewInvoice(item)}
      activeOpacity={0.7}
    >
      <View style={styles.saleHeader}>
        <View style={styles.saleInfo}>
          <Text style={styles.saleModel}>{item.bikeModel}</Text>
          <View style={styles.saleMeta}>
            <Text style={styles.saleQuantity}>Qty: {item.quantity}</Text>
            <Text style={styles.saleSeparator}>•</Text>
            <View style={styles.paymentMethod}>
              {getPaymentMethodIcon(item.paymentMethod)}
              <Text style={styles.paymentText}>
                {item.paymentMethod.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.saleDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.saleAmount}>
          <Text style={styles.totalAmount}>{formatCurrency(item.total)}</Text>
          <Text style={styles.unitPrice}>
            {formatCurrency(item.unitPrice)} each
          </Text>
        </View>
      </View>

      <View style={styles.saleDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Unit Price</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(item.unitPrice)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Discount</Text>
            <Text style={[styles.detailValue, { color: colors.success }]}>
              -{formatCurrency(item.discount)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Tax</Text>
            <Text style={styles.detailValue}>+{formatCurrency(item.tax)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.saleActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleViewInvoice(item)}
        >
          <Ionicons name="receipt-outline" size={18} color={colors.primary} />
          <Text style={styles.actionText}>Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push({pathname: "/edit-sales", params: { id }})}
        >
          <Ionicons name="create-outline" size={18} color={colors.warning} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteSale(item._id)}
        >
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
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
                <Text style={styles.avatarText}>{customer.name.charAt(0)}</Text>
              </View>
              <View style={styles.customerDetails}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.customerPhone}>{customer.phone}</Text>
                <Text style={styles.customerEmail}>{customer.email}</Text>
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
              {new Date(customer?.createdAt || "").getFullYear()}
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
            keyExtractor={(item) => item._id}
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
              // Generate report for this customer
              Alert.alert(
                "Generate Report",
                "Customer report will be generated"
              );
            }}
          >
            <Ionicons
              name="download-outline"
              size={24}
              color={colors.success}
            />
            <Text style={styles.quickActionText}>Export Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => {
              // Contact customer
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
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Customer Since:</Text>
            <Text style={styles.summaryValue}>
              {new Date(customer?.createdAt || "").toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
              })}
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
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
    paddingTop: 8,
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
    marginTop: -30,
    marginBottom: 16,
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
