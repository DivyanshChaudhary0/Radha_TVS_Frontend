import { customerApi } from "@/api/customerApi";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/utils/constant";
import { Customer } from "@/utils/types";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
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
import Toast from "react-native-toast-message";

export default function CustomersScreen() {
  const { customers, setCustomers, sales } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
  );

  const handleAddCustomer = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setErrors({});
    setIsAddModalVisible(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setErrors({});
    setIsEditModalVisible(true);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Invalid phone number (10 digits required)";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isEdit: boolean = false) => {
    if (!validateForm()) return;

    try {
      if (isEdit && selectedCustomer) {
        const res = await customerApi.editCustomer(
          selectedCustomer._id,
          formData
        );
        if (res) {
          setCustomers(
            customers.map((c) =>
              c._id === selectedCustomer._id
                ? { ...c, ...formData, updatedAt: new Date().toISOString() }
                : c
            )
          );
        }
        Alert.alert("Success", "Customer updated successfully!");
      } else {
        const newCustomer: Customer = {
          _id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
        };

        try {
          const res = await customerApi.addCustomer(newCustomer);
          setCustomers([newCustomer, ...customers]);
          Toast.show({
            type: "success",
            text1: "Customer created successfully!",
            text1Style: {
              fontSize: 16,
            },
          });
        } catch (err) {
          console.log(err);
        }
      }

      // Close modal
      if (isEdit) {
        setIsEditModalVisible(false);
        setSelectedCustomer(null);
      } else {
        setIsAddModalVisible(false);
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
      setErrors({});
    } catch (error) {
      Alert.alert("Error", `Failed to ${isEdit ? "update" : "add"} customer`);
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    console.log("customerId", customerId);
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await customerApi.deleteCustomer(customerId);
              console.log("delete response", res);
              if (res.success) {
                setCustomers(customers.filter((c) => c._id !== customerId));
                Alert.alert("Success", "Customer deleted successfully!");
              }
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Failed to delete customer",
              });
              Alert.alert("Error", "Failed to delete customer");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <View style={styles.customerCard}>
      <View style={styles.customerHeader}>
        <View style={styles.customerAvatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.customerEmail}>{item.email}</Text>
          <Text style={styles.customerPhone}>{item.phone}</Text>
        </View>
        <View style={styles.customerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditCustomer(item)}
          >
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteCustomer(item._id)}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.customerDetails}>
        <View style={styles.detailRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.textLight}
          />
          <Text style={styles.detailText}>{item.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.textLight}
          />
          <Text style={styles.detailText}>
            Added: {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.viewSalesButton}
        onPress={() => {
          router.push({
            pathname: "/customer-sales",
            params: { id: item._id },
          });
        }}
      >
        <Text style={styles.viewSalesText}>View Sales History</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderInput = (
    label: string,
    field: keyof typeof formData,
    placeholder: string,
    keyboardType: any = "default",
    length?: any
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label} *</Text>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(text) => {
          setFormData((prev) => ({ ...prev, [field]: text }));
          if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
          }
        }}
        keyboardType={keyboardType}
        maxLength={length}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Customers</Text>
            <Text style={styles.subtitle}>Manage your customer database</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddCustomer}
          >
            <Ionicons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers by name, email, or phone..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textLight}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: `${colors.primary}20` },
              ]}
            >
              <Ionicons name="people" size={24} color={colors.primary} />
            </View>
            <Text style={styles.statNumber}>{customers.length}</Text>
            <Text style={styles.statLabel}>Total Customers</Text>
          </View>
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: `${colors.success}20` },
              ]}
            >
              <FontAwesome5
                name="shopping-cart"
                size={20}
                color={colors.success}
              />
            </View>
            <Text style={styles.statNumber}>{sales?.length}</Text>
            <Text style={styles.statLabel}>Total Sales</Text>
          </View>
        </View>

        {/* Customer List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading customers...</Text>
          </View>
        ) : filteredCustomers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={64} color={colors.border} />
            <Text style={styles.emptyText}>
              {searchQuery ? "No customers found" : "No customers yet"}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={handleAddCustomer}
              >
                <Text style={styles.emptyButtonText}>Add First Customer</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredCustomers}
            renderItem={renderCustomerItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </ScrollView>

      {/* Add Customer Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <CustomerModal
          title="Add New Customer"
          onClose={() => setIsAddModalVisible(false)}
          onSubmit={() => handleSubmit(false)}
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          renderInput={renderInput}
        />
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsEditModalVisible(false);
          setSelectedCustomer(null);
        }}
      >
        <CustomerModal
          title="Edit Customer"
          onClose={() => {
            setIsEditModalVisible(false);
            setSelectedCustomer(null);
          }}
          onSubmit={() => handleSubmit(true)}
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          renderInput={renderInput}
        />
      </Modal>
    </ScreenWrapper>
  );
}

// Customer Modal Component
const CustomerModal = ({
  title,
  onClose,
  onSubmit,
  formData,
  setFormData,
  errors,
  setErrors,
  renderInput,
}: any) => (
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{title}</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
        {renderInput("Full Name", "name", "Enter customer name")}
        {renderInput(
          "Email Address",
          "email",
          "customer@example.com",
          "email-address"
        )}
        {renderInput("Phone Number", "phone", "9876543210", "phone-pad", 10)}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Address *</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors.address && styles.inputError,
            ]}
            placeholder="Enter complete address"
            value={formData.address}
            onChangeText={(text: string) => {
              setFormData((prev: any) => ({ ...prev, address: text }));
              if (errors.address) {
                setErrors((prev: any) => ({ ...prev, address: "" }));
              }
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.modalFooter}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Text style={styles.submitButtonText}>Save Customer</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    margin: 16,
    marginTop: -12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  customerCard: {
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
  customerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  customerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  customerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  customerDetails: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  viewSalesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  viewSalesText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
    marginRight: 8,
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
    maxHeight: "90%",
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
  modalBody: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: 12,
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
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  submitButton: {
    flex: 2,
    padding: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});
