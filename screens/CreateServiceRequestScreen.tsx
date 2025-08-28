import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface CreateServiceRequestScreenProps {
  navigation: any;
}

interface FormData {
  serviceName: string;
  customerName: string;
  phone: string;
  email: string;
  companyName: string;
  scheduledDateTime: string;
  assignedTo: string;
  status: string;
}

const CreateServiceRequestScreen: React.FC<CreateServiceRequestScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, token } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    serviceName: '',
    customerName: '',
    phone: '',
    email: '',
    companyName: '',
    scheduledDateTime: '',
    assignedTo: '',
    status: 'Pending'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert('Error', 'Please login to create service requests');
      return;
    }

    // Validate required fields
    if (!formData.serviceName || !formData.customerName || !formData.phone || !formData.email || !formData.companyName || !formData.scheduledDateTime || !formData.assignedTo) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://192.168.86.42:3002/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Service request created successfully!');
        // Navigate to Home screen instead of going back
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', data.message || 'Failed to create service request');
      }
    } catch (error) {
      console.error('Error creating service request:', error);
      Alert.alert('Error', 'Failed to create service request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fields: (keyof FormData)[] = [
    'serviceName', 
    'customerName', 
    'phone', 
    'email', 
    'companyName', 
    'scheduledDateTime', 
    'assignedTo'
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Create Service Request</Text>
      
      {fields.map((field) => (
        <View key={field} style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}:
          </Text>
          <TextInput
            style={[
              styles.textInput,
              { 
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.background
              }
            ]}
            placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            placeholderTextColor={colors.textSecondary}
            value={formData[field]}
            onChangeText={(text) => handleInputChange(field, text)}
          />
        </View>
      ))}

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Status:</Text>
        <View style={styles.statusContainer}>
          {['Pending', 'In Progress', 'Completed', 'Cancelled', 'On Hold'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusOption,
                formData.status === status && styles.statusOptionSelected,
                { borderColor: colors.primary }
              ]}
              onPress={() => handleInputChange('status', status)}
            >
              <Text
                style={[
                  styles.statusText,
                  formData.status === status && styles.statusTextSelected,
                  { color: formData.status === status ? '#fff' : colors.text }
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: colors.primary },
          isLoading && { opacity: 0.6 }
        ]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.submitButtonText}>
          {isLoading ? 'Creating...' : 'Create Service Request'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  statusOptionSelected: {
    backgroundColor: '#007bff',
  },
  statusText: {
    fontSize: 12,
  },
  statusTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateServiceRequestScreen;
