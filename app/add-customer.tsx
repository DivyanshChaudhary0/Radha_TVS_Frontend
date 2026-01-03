// app/add-customer.tsx
import { customerApi } from "@/api/customerApi";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/utils/constant";
import { Customer } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddCustomerScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setCustomers } = useAuth();

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

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    const newCustomer: Customer = {
      _id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await customerApi.addCustomer(newCustomer);
      setCustomers((prev: any) => [...prev, res]);
      Alert.alert("Success", "Customer added successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
      setErrors({});
    } catch (error) {
      Alert.alert("Error", "Failed to add customer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const renderInput = (
    label: string,
    field: keyof typeof formData,
    placeholder: string,
    keyboardType: any = "default"
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label} *</Text>
      <TextInput
        style={[styles.input, errors[field] && styles.inputError]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(text) => handleChange(field, text)}
        keyboardType={keyboardType}
        autoCapitalize={field === "email" ? "none" : "words"}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: colors.background }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Customer</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {renderInput("Full Name", "name", "Enter customer name")}
            {renderInput(
              "Email Address",
              "email",
              "customer@example.com",
              "email-address"
            )}

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="9876543210"
                value={formData.phone}
                onChangeText={(text) =>
                  handleChange("phone", text.replace(/\D/g, ""))
                }
                keyboardType="phone-pad"
                maxLength={10}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            {/* Address Input */}
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
                onChangeText={(text) => handleChange("address", text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.submitButtonText}>Saving...</Text>
              ) : (
                <Text style={styles.submitButtonText}>Add Customer</Text>
              )}
            </TouchableOpacity>

            {/* Additional Info */}
            <View style={styles.infoCard}>
              <Ionicons
                name="information-circle"
                size={20}
                color={colors.info}
              />
              <Text style={styles.infoText}>
                Customer information will be saved securely and can be used for
                future sales and communication.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
  },
  formContainer: {
    padding: 20,
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
  submitButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: colors.infoLight,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.info,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
});
