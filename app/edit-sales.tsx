import ScreenWrapper from "@/components/ScreenWrapper";
import { colors } from "@/utils/constant";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function EditSaleScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [sale, setSale] = useState<any>(null);
  const [formData, setFormData] = useState({
    quantity: "",
    discount: "",
    paymentMethod: "cash",
  });

  useEffect(() => {
    fetchSaleData();
  }, [id]);

  const fetchSaleData = async () => {
    try {
      // TODO: Replace with API call
      const mockSale = {
        _id: id,
        bikeModel: "TVS Apache RTR 200",
        customerName: "Rajesh Kumar",
        quantity: 1,
        unitPrice: 150000,
        discount: 5000,
        tax: 27000,
        total: 172000,
        paymentMethod: "upi",
        date: "2024-01-20T14:30:00Z",
      };
      
      setSale(mockSale);
      setFormData({
        quantity: mockSale.quantity.toString(),
        discount: mockSale.discount.toString(),
        paymentMethod: mockSale.paymentMethod,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to load sale data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.quantity || !formData.discount) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Update sale API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        "Success",
        "Sale updated successfully!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update sale");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !sale) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Loading sale data...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={{
            backgroundColor: colors.primary,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
          }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <Text style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.white,
              marginLeft: 16,
            }}>
              Edit Sale
            </Text>
          </View>

          {/* Sale Info */}
          <View style={{ padding: 20 }}>
            <View style={{ 
              backgroundColor: colors.primaryLight, 
              borderRadius: 12, 
              padding: 16,
              marginBottom: 24 
            }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
                Sale Information
              </Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                <Text style={{ flex: 1, color: colors.textSecondary }}>Bike Model:</Text>
                <Text style={{ fontWeight: "600", color: colors.text }}>{sale?.bikeModel}</Text>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                <Text style={{ flex: 1, color: colors.textSecondary }}>Customer:</Text>
                <Text style={{ fontWeight: "600", color: colors.text }}>{sale?.customerName}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ flex: 1, color: colors.textSecondary }}>Unit Price:</Text>
                <Text style={{ fontWeight: "600", color: colors.text }}>
                  ₹{sale?.unitPrice?.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Edit Form */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.textSecondary, marginBottom: 8 }}>
                Quantity
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: colors.text,
                }}
                value={formData.quantity}
                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                keyboardType="numeric"
                placeholder="Enter quantity"
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.textSecondary, marginBottom: 8 }}>
                Discount (₹)
              </Text>
              <TextInput
                style={{
                  backgroundColor: colors.white,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 16,
                  color: colors.text,
                }}
                value={formData.discount}
                onChangeText={(text) => setFormData({ ...formData, discount: text })}
                keyboardType="numeric"
                placeholder="Enter discount amount"
              />
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.textSecondary, marginBottom: 8 }}>
                Payment Method
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {["cash", "card", "upi", "cheque"].map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: formData.paymentMethod === method 
                        ? colors.primary 
                        : colors.background,
                      borderWidth: 1,
                      borderColor: formData.paymentMethod === method 
                        ? colors.primary 
                        : colors.border,
                      alignItems: "center",
                    }}
                    onPress={() => setFormData({ ...formData, paymentMethod: method })}
                  >
                    <Text style={{
                      color: formData.paymentMethod === method 
                        ? colors.white 
                        : colors.textSecondary,
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}>
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Update Button */}
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                padding: 18,
                borderRadius: 12,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
              onPress={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <Text style={{ color: colors.white, fontSize: 16, fontWeight: "600" }}>
                  Updating...
                </Text>
              ) : (
                <Text style={{ color: colors.white, fontSize: 16, fontWeight: "600" }}>
                  Update Sale
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}