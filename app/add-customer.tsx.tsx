import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/utils/constant";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function AddCustomerScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    try {
      // TODO: Make API call to save customer
      console.log("Customer data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Success", "Customer added successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
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
          <View
            style={{
              backgroundColor: colors.primary,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.white,
                marginLeft: 16,
              }}
            >
              Add New Customer
            </Text>
          </View>

          {/* Form */}
          <View style={{ padding: 20 }}>
            {/* Name */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.textSecondary,
                  marginBottom: 8,
                }}
              >
                Full Name *
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: errors.name ? colors.danger : colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: colors.text,
                }}
                placeholder="Enter customer name"
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
              />
              {errors.name && (
                <Text
                  style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}
                >
                  {errors.name}
                </Text>
              )}
            </View>

            {/* Email */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.textSecondary,
                  marginBottom: 8,
                }}
              >
                Email Address *
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: errors.email ? colors.danger : colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: colors.text,
                }}
                placeholder="customer@example.com"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text
                  style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}
                >
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Phone */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.textSecondary,
                  marginBottom: 8,
                }}
              >
                Phone Number *
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: errors.phone ? colors.danger : colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: colors.text,
                }}
                placeholder="9876543210"
                value={formData.phone}
                onChangeText={(text) =>
                  handleChange("phone", text.replace(/\D/g, ""))
                }
                keyboardType="phone-pad"
                maxLength={10}
              />
              {errors.phone && (
                <Text
                  style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}
                >
                  {errors.phone}
                </Text>
              )}
            </View>

            {/* Address */}
            <View style={{ marginBottom: 30 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.textSecondary,
                  marginBottom: 8,
                }}
              >
                Address *
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: errors.address ? colors.danger : colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: colors.text,
                  minHeight: 100,
                  textAlignVertical: "top",
                }}
                placeholder="Enter complete address"
                value={formData.address}
                onChangeText={(text) => handleChange("address", text)}
                multiline
                numberOfLines={4}
              />
              {errors.address && (
                <Text
                  style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}
                >
                  {errors.address}
                </Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                padding: 18,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                opacity: loading ? 0.7 : 1,
              }}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Saving...
                </Text>
              ) : (
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Add Customer
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
