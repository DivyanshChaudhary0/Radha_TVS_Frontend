import { saleApi } from "@/api/saleApi";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/utils/constant";
import { Bike, Customer } from "@/utils/types";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SellScreen() {
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [quantity, setQuantity] = useState("1");
  const [discount, setDiscount] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "upi" | "cheque"
  >("cash");
  const [isBikeModalVisible, setIsBikeModalVisible] = useState(false);
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { bikes, customers } = useAuth();

  const calculateSubtotal = () => {
    if (!selectedBike) return 0;
    const price = selectedBike.sellingPrice;
    const qty = parseInt(quantity) || 1;
    return price * qty;
  };

  const calculateDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    const discountPercent = parseFloat(discount) || 0;
    return (subtotal * discountPercent) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    return subtotal - discountAmount;
  };

  const calculateGrandTotal = () => {
    return calculateTotal();
  };

  const handleSell = () => {
    if (!selectedBike) {
      Alert.alert("Error", "Please select a bike");
      return;
    }

    if (!selectedCustomer) {
      Alert.alert("Error", "Please select a customer");
      return;
    }

    if (parseInt(quantity) > selectedBike.stock) {
      Alert.alert("Error", "Insufficient stock available");
      return;
    }

    const saleData = {
      bikeId: selectedBike._id,
      customerId: selectedCustomer._id,
      quantity: parseInt(quantity),
      discountAmount: calculateDiscountAmount(),
      discountPercentage: parseFloat(discount),
      paymentMethod,
      saleDate: new Date().toISOString(),
    };

    Alert.alert(
      "Confirm Sale",
      `Are you sure you want to sell ${quantity} unit(s) of ${
        selectedBike.model
      } to ${
        selectedCustomer.name
      } for ₹${calculateGrandTotal().toLocaleString()}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: async () => {
            try {
              setLoading(true);
              const res = await saleApi.createSale(saleData);
              console.log(res);
              setLoading(false);
              Alert.alert("Success", "Sale completed successfully!", [
                {
                  text: "OK",
                  onPress: () => {
                    setSelectedBike(null);
                    setSelectedCustomer(null);
                    setQuantity("1");
                    setDiscount("0");
                    setPaymentMethod("cash");
                  },
                },
              ]);
            } catch (err) {
              setLoading(false);
              Alert.alert("Error", "Sale Error!");
            }
          },
        },
      ]
    );
  };

  const renderBikeItem = ({ item }: { item: Bike }) => (
    <TouchableOpacity
      style={[
        styles.bikeItem,
        selectedBike?._id === item._id && styles.selectedItem,
      ]}
      onPress={() => {
        setSelectedBike(item);
        setIsBikeModalVisible(false);
      }}
    >
      <View style={styles.bikeInfo}>
        <Text style={styles.bikeModel}>{item.model}</Text>
        <Text style={styles.bikeColor}>Color: {item.color}</Text>
        <Text style={styles.bikeStock}>Stock: {item.stock}</Text>
      </View>
      <View style={styles.bikePrice}>
        <Text style={styles.priceText}>
          ₹{item.sellingPrice.toLocaleString()}
        </Text>
        <Text style={styles.priceLabel}>Selling Price</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={[
        styles.customerItem,
        selectedCustomer?._id === item._id && styles.selectedItem,
      ]}
      onPress={() => {
        setSelectedCustomer(item);
        setIsCustomerModalVisible(false);
      }}
    >
      <View style={styles.customerAvatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerPhone}>{item.phone}</Text>
        <Text style={styles.customerEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const paymentMethods = [
    { id: "cash", label: "Cash", icon: "cash" },
    { id: "card", label: "Card", icon: "card" },
    { id: "upi", label: "UPI", icon: "phone-portrait" },
  ];

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>New Sale</Text>
          <Text style={styles.subtitle}>Create a new bike sale invoice</Text>
        </View>

        {/* Select Bike Card */}
        <View style={{ ...styles.card, marginTop: 16 }}>
          <View style={styles.cardHeader}>
            <MaterialIcons
              name="directions-bike"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.cardTitle}>Select Bike</Text>
          </View>

          {selectedBike ? (
            <View style={styles.selectedItemContainer}>
              <View style={styles.selectedItemInfo}>
                <Text style={styles.selectedItemTitle}>
                  {selectedBike.model}
                </Text>
                <Text style={styles.selectedItemSubtitle}>
                  {selectedBike.color} • {selectedBike.engineCC} CC
                </Text>
                <Text style={styles.selectedItemPrice}>
                  ₹{selectedBike.sellingPrice.toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => setIsBikeModalVisible(true)}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setIsBikeModalVisible(true)}
            >
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.selectButtonText}>Select Bike</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Select Customer Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Select Customer</Text>
          </View>

          {selectedCustomer ? (
            <View style={styles.selectedItemContainer}>
              <View style={styles.customerAvatar}>
                <Text style={styles.avatarText}>
                  {selectedCustomer.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.selectedItemInfo}>
                <Text style={styles.selectedItemTitle}>
                  {selectedCustomer.name}
                </Text>
                <Text style={styles.selectedItemSubtitle}>
                  {selectedCustomer.phone}
                </Text>
                <Text style={styles.selectedItemSubtitle}>
                  {selectedCustomer.email}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => setIsCustomerModalVisible(true)}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setIsCustomerModalVisible(true)}
            >
              <Ionicons
                name="person-add-outline"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.selectButtonText}>Select Customer</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sale Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="receipt" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Sale Details</Text>
          </View>

          {/* Quantity */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  const qty = parseInt(quantity) || 1;
                  if (qty > 1) setQuantity((qty - 1).toString());
                }}
              >
                <Ionicons name="remove" size={20} color={colors.text} />
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                maxLength={3}
              />
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  const qty = parseInt(quantity) || 1;
                  if (selectedBike && qty < selectedBike.stock) {
                    setQuantity((qty + 1).toString());
                  }
                }}
              >
                <Ionicons name="add" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            {selectedBike && (
              <Text style={styles.helperText}>
                Available stock: {selectedBike.stock} units
              </Text>
            )}
          </View>

          {/* Discount */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Discount (%)</Text>
            <View style={styles.discountContainer}>
              <TextInput
                style={styles.discountInput}
                value={discount}
                onChangeText={setDiscount}
                keyboardType="numeric"
                maxLength={5}
                placeholder="0"
              />
              <Text style={styles.percentSymbol}>%</Text>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Payment Method</Text>
            <View style={styles.paymentMethodsContainer}>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodButton,
                    paymentMethod === method.id && styles.selectedPaymentMethod,
                  ]}
                  onPress={() => setPaymentMethod(method.id as any)}
                >
                  <Ionicons
                    name={method.icon as any}
                    size={20}
                    color={
                      paymentMethod === method.id ? colors.white : colors.text
                    }
                  />
                  <Text
                    style={[
                      styles.paymentMethodText,
                      paymentMethod === method.id &&
                        styles.selectedPaymentMethodText,
                    ]}
                  >
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Invoice Summary Card */}
        <View style={[styles.card, { backgroundColor: colors.primaryLight }]}>
          <View style={styles.cardHeader}>
            <FontAwesome5
              name="file-invoice-dollar"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.cardTitle}>Invoice Summary</Text>
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Unit Price</Text>
              <Text style={styles.summaryValue}>
                ₹{selectedBike?.sellingPrice.toLocaleString() || "0"}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Quantity</Text>
              <Text style={styles.summaryValue}>{quantity}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ₹{calculateSubtotal().toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                - ₹{calculateDiscountAmount().toLocaleString()}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>
                ₹{calculateTotal().toLocaleString()}
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>
                ₹{calculateGrandTotal().toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={() => {
              setSelectedBike(null);
              setSelectedCustomer(null);
              setQuantity("1");
              setDiscount("0");
              setPaymentMethod("cash");
            }}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.sellButton,
              (!selectedBike || !selectedCustomer) && styles.disabledButton,
            ]}
            onPress={handleSell}
            disabled={!selectedBike || !selectedCustomer || loading}
          >
            {loading ? (
              <Text style={styles.sellButtonText}>Processing...</Text>
            ) : (
              <>
                <FontAwesome5
                  name="cash-register"
                  size={20}
                  color={colors.white}
                />
                <Text style={styles.sellButtonText}>Complete Sale</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bike Selection Modal */}
      <Modal
        visible={isBikeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsBikeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Bike</Text>
              <TouchableOpacity onPress={() => setIsBikeModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={bikes}
              renderItem={renderBikeItem}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <MaterialIcons
                    name="directions-bike"
                    size={48}
                    color={colors.border}
                  />
                  <Text style={styles.emptyListText}>No bikes available</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Customer Selection Modal */}
      <Modal
        visible={isCustomerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCustomerModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Customer</Text>
              <TouchableOpacity
                style={styles.addCustomerButton}
                onPress={() => {
                  setIsCustomerModalVisible(false);
                  router.push("/add-customer");
                }}
              >
                <Ionicons name="add" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={customers}
              renderItem={renderCustomerItem}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Ionicons name="people" size={48} color={colors.border} />
                  <Text style={styles.emptyListText}>No customers found</Text>
                  <TouchableOpacity
                    style={styles.addCustomerButton}
                    onPress={() => {
                      setIsCustomerModalVisible(false);
                      router.push("/add-customer");
                    }}
                  >
                    <Text style={styles.addCustomerButtonText}>
                      Add New Customer
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  card: {
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 12,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
    borderRadius: 8,
    backgroundColor: `${colors.primary}10`,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: 8,
  },
  selectedItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
  },
  selectedItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  selectedItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  selectedItemSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  selectedItemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 4,
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityInput: {
    flex: 1,
    height: 40,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  helperText: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  percentSymbol: {
    position: "absolute",
    right: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  paymentMethodsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  paymentMethodButton: {
    flex: 1,
    minWidth: "22%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    gap: 6,
  },
  selectedPaymentMethod: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentMethodText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedPaymentMethodText: {
    color: colors.white,
    fontWeight: "600",
  },
  summaryContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
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
  grandTotalRow: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  grandTotalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  actionsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  resetButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  sellButton: {
    backgroundColor: colors.success,
  },
  disabledButton: {
    backgroundColor: colors.textLight,
    opacity: 0.6,
  },
  sellButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  bikeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  bikeInfo: {
    flex: 1,
  },
  bikeModel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  bikeColor: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  bikeStock: {
    fontSize: 12,
    color: colors.textLight,
  },
  bikePrice: {
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  customerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 12,
    color: colors.textLight,
  },
  selectedItem: {
    backgroundColor: colors.primaryLight,
  },
  emptyList: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyListText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 16,
  },
  addCustomerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 6,
  },
  addCustomerButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
});
