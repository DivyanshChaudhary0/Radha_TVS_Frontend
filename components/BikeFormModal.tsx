

import { BikeFormModalProps } from '@/utils/types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface FormData {
  model: string;
  color: string;
  engineCC: string;
  purchasePrice: string;
  sellingPrice: string;
  stock: string;
  status: 'IN_STOCK' | 'SOLD';
}

interface FormErrors {
  model?: string;
  color?: string;
  engineCC?: string;
  purchasePrice?: string;
  sellingPrice?: string;
  stock?: string;
}

const BikeFormModal: React.FC<BikeFormModalProps> = ({ 
  visible, 
  onClose, 
  onSubmit, 
  initialData 
}) => {
  const [formData, setFormData] = useState<FormData>({
    model: '',
    color: '',
    engineCC: '',
    purchasePrice: '',
    sellingPrice: '',
    stock: '0',
    status: 'IN_STOCK',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        model: initialData.model || '',
        color: initialData.color || '',
        engineCC: initialData.engineCC.toString() || '',
        purchasePrice: initialData.purchasePrice.toString() || '',
        sellingPrice: initialData.sellingPrice.toString() || '',
        stock: initialData.stock.toString() || '0',
        status: initialData.status || 'IN_STOCK',
      });
    } else {
      // Reset form for new bike
      setFormData({
        model: '',
        color: '',
        engineCC: '',
        purchasePrice: '',
        sellingPrice: '',
        stock: '0',
        status: 'IN_STOCK',
      });
    }
    setErrors({});
  }, [initialData, visible]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.color.trim()) newErrors.color = 'Color is required';
    
    if (!formData.engineCC.trim()) {
      newErrors.engineCC = 'Engine CC is required';
    } else if (isNaN(Number(formData.engineCC))) {
      newErrors.engineCC = 'Must be a valid number';
    }
    
    if (!formData.purchasePrice.trim()) {
      newErrors.purchasePrice = 'Purchase price is required';
    } else if (isNaN(Number(formData.purchasePrice))) {
      newErrors.purchasePrice = 'Must be a valid number';
    }
    
    if (!formData.sellingPrice.trim()) {
      newErrors.sellingPrice = 'Selling price is required';
    } else if (isNaN(Number(formData.sellingPrice))) {
      newErrors.sellingPrice = 'Must be a valid number';
    }
    
    if (formData.stock.trim() && isNaN(Number(formData.stock))) {
      newErrors.stock = 'Must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const bikeData = {
      model: formData.model.trim(),
      color: formData.color.trim(),
      engineCC: parseFloat(formData.engineCC),
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      stock: parseInt(formData.stock) || 0,
      status: formData.status,
      brand: 'TVS' as const,
    };

    onSubmit(bikeData);
    onClose();
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNumberChange = (field: keyof FormData, value: string) => {
    // Allow only numbers and decimal points
    const numericValue = value.replace(/[^0-9.]/g, '');
    handleChange(field, numericValue);
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      avoidKeyboard
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {initialData ? 'Edit Bike' : 'Add New Bike'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Model */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Model *</Text>
              <TextInput
                style={[styles.input, errors.model && styles.inputError]}
                value={formData.model}
                onChangeText={(text) => handleChange('model', text)}
                placeholder="Enter bike model"
              />
              {errors.model && <Text style={styles.errorText}>{errors.model}</Text>}
            </View>

            {/* Color */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Color *</Text>
              <TextInput
                style={[styles.input, errors.color && styles.inputError]}
                value={formData.color}
                onChangeText={(text) => handleChange('color', text)}
                placeholder="Enter color"
              />
              {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}
            </View>

            {/* Engine CC */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Engine CC *</Text>
              <TextInput
                style={[styles.input, errors.engineCC && styles.inputError]}
                value={formData.engineCC}
                onChangeText={(text) => handleNumberChange('engineCC', text)}
                placeholder="Enter engine CC"
                keyboardType="numeric"
              />
              {errors.engineCC && <Text style={styles.errorText}>{errors.engineCC}</Text>}
            </View>

            {/* Price Row */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Purchase Price *</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={[styles.input, styles.priceInput, errors.purchasePrice && styles.inputError]}
                    value={formData.purchasePrice}
                    onChangeText={(text) => handleNumberChange('purchasePrice', text)}
                    placeholder="0.00"
                    keyboardType="numeric"
                  />
                </View>
                {errors.purchasePrice && <Text style={styles.errorText}>{errors.purchasePrice}</Text>}
              </View>

              <View style={styles.halfInput}>
                <Text style={styles.label}>Selling Price *</Text>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currencySymbol}>₹</Text>
                  <TextInput
                    style={[styles.input, styles.priceInput, errors.sellingPrice && styles.inputError]}
                    value={formData.sellingPrice}
                    onChangeText={(text) => handleNumberChange('sellingPrice', text)}
                    placeholder="0.00"
                    keyboardType="numeric"
                  />
                </View>
                {errors.sellingPrice && <Text style={styles.errorText}>{errors.sellingPrice}</Text>}
              </View>
            </View>

            {/* Stock */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Stock Quantity</Text>
              <TextInput
                style={[styles.input, errors.stock && styles.inputError]}
                value={formData.stock}
                onChangeText={(text) => handleNumberChange('stock', text)}
                placeholder="Enter stock quantity"
                keyboardType="numeric"
              />
              {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
            </View>

            {/* Status */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusContainer}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.status === 'IN_STOCK' && styles.statusButtonActive
                  ]}
                  onPress={() => handleChange('status', 'IN_STOCK')}
                >
                  <Text style={[
                    styles.statusButtonText,
                    formData.status === 'IN_STOCK' && styles.statusButtonTextActive
                  ]}>
                    <MaterialIcons name="check-circle" size={16} />
                    {' In Stock'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.status === 'SOLD' && styles.statusButtonActive
                  ]}
                  onPress={() => handleChange('status', 'SOLD')}
                >
                  <Text style={[
                    styles.statusButtonText,
                    formData.status === 'SOLD' && styles.statusButtonTextActive
                  ]}>
                    <MaterialIcons name="local-shipping" size={16} />
                    {' Sold'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {initialData ? 'Update Bike' : 'Add Bike'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    paddingHorizontal: 20,
    maxHeight: '70%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  currencySymbol: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    paddingLeft: 0,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  statusButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default BikeFormModal;