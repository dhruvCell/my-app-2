import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Signature from 'react-native-signature-canvas';
import Toast from 'react-native-toast-message';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { BorderRadius, FontSizes, Spacing } from '../styles/theme';

const signatureWebStyle = `
.m-signature-pad {
  box-shadow: none; 
  border: none; 
  height: 100%;
  margin: 0;
  padding: 0;
}
.m-signature-pad--body {
  border: none;
  height: 80%;
}
.m-signature-pad--footer {
  display: flex !important; 
  justify-content: center;
  align-items: center;
  gap: 2rem;
  
  height: 20%;
  background-color: #f8f9fa;
  margin-left: -3rem;
}
.m-signature-pad--footer button {
  padding: 8px 24px;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.m-signature-pad--footer button:first-child {
  background-color: #dc3545;
  color: white;
}
.m-signature-pad--footer button:first-child:hover {
  background-color: #c82333;
}
.m-signature-pad--footer button:last-child {
  background-color: #28a745;
  color: white;
}
.m-signature-pad--footer button:last-child:hover {
  background-color: #218838;
}
body,html { width: 100%; height: 100%; margin:0; }
canvas {
  border-radius: 12px;
  border: 1px solid #ccc;
  touch-action: none;
  will-change: transform;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}
`;

interface ServiceRequest {
  _id: string;
  serviceName: string;
  customerName: string;
  phone: string;
  email: string;
  companyName: string;
  scheduledDateTime: string;
  assignedTo: string;
  status: string;
  comments?: string;
  signature?: string;
  audioFeedback?: string;
  videoFeedback?: string;
}

type RootStackParamList = {
  ServiceRequestDetails: { serviceRequest: ServiceRequest };
};

const ServiceRequestDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const { token } = useAuth();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootStackParamList, 'ServiceRequestDetails'>>();

  let serviceRequest: ServiceRequest;
  try {
    serviceRequest = route.params?.serviceRequest || {
      _id: '',
      serviceName: 'Sample Service',
      customerName: 'Sample Customer',
      phone: '000-0000',
      email: 'sample@example.com',
      companyName: 'Sample Company',
      scheduledDateTime: '2024-01-01 00:00',
      assignedTo: 'Sample Technician',
      status: 'Pending'
    };
  } catch (error) {
    Alert.alert('Error', 'Failed to load service request details');
    console.error('Error loading service request:', error);
    return null;
  }

  const [comments, setComments] = useState(serviceRequest.comments || '');
  const [status, setStatus] = useState(serviceRequest.status);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoPath, setVideoPath] = useState(serviceRequest.videoFeedback || '');
  const [signature, setSignature] = useState(serviceRequest.signature || '');
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureKey, setSignatureKey] = useState(1);

  const statusOptions = [
    'Pending',
    'In Progress',
    'Completed',
    'Cancelled',
    'On Hold'
  ];

  const handleVideoRecording = () => {
    setIsRecordingVideo(!isRecordingVideo);
    Alert.alert('Video Recording', isRecordingVideo ? 'Video recording stopped' : 'Video recording started');
  };

  // Signature callbacks
  const handleSignature = (sig: string) => {
    console.log('Signature captured:', sig ? 'Base64 string received' : 'Empty signature');
    setSignature(sig); // base64 string
  };
  const handleClear = () => {
    setSignature('');
    setSignatureKey(prevKey => prevKey + 1);
  };
  const handleBegin = () => {
    console.log('Signature drawing started');
    setIsDrawing(true); // Disable scrolling while drawing
    // Could add visual feedback here if needed
  };
  const handleEnd = () => {
    console.log('Signature drawing ended');
    setIsDrawing(false); // Re-enable scrolling after drawing
    // Could add visual feedback here if needed
  };

  const handleSubmit = async () => {
    console.log('Submitting signature:', signature ? 'Signature exists' : 'No signature');
    const updateData = {
      comments,
      status,
      videoFeedback: videoPath,
      signature, // include signature
    };

    if (!serviceRequest._id) {
      Alert.alert('Error', 'Service request ID is missing');
      return;
    }

    try {
      const response = await fetch(`http://192.168.86.42:3002/api/service-requests/${serviceRequest._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Service request updated successfully!',
        });
        navigation.navigate('Home'); 
      } else if (response.status === 403) {
        Toast.show({
          type: 'error',
          text1: 'You do not have permission to update this service request.',
        });
      } else {
        Alert.alert('Error', data.message || 'Failed to update service request');
      }
    } catch (error) {
      console.error('Error updating service request:', error);
      Alert.alert('Error', 'Failed to update service request. Please try again.');
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      scrollEnabled={!isDrawing} // Disable scrolling while drawing signature
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Service Request Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: colors.text }]}>Service Name:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{serviceRequest.serviceName}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: colors.text }]}>Customer:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{serviceRequest.customerName}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: colors.text }]}>Phone:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{serviceRequest.phone}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: colors.text }]}>Email:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{serviceRequest.email}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: colors.text }]}>Company:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{serviceRequest.companyName}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: colors.text }]}>Scheduled:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{serviceRequest.scheduledDateTime}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: colors.text }]}>Assigned To:</Text>
          <Text style={[styles.value, { color: colors.text }]}>{serviceRequest.assignedTo}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Update Service Request</Text>
        
        {/* Status Options */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Status:</Text>
          <View style={styles.statusContainer}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.statusOption,
                  status === option && styles.statusOptionSelected,
                  { borderColor: colors.primary }
                ]}
                onPress={() => setStatus(option)}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === option && styles.statusTextSelected,
                    { color: status === option ? '#fff' : colors.text }
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Comments */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Comments:</Text>
          <TextInput
            style={[
              styles.textInput,
              { 
                borderColor: colors.border,
                color: colors.text,
                backgroundColor: colors.background
              }
            ]}
            placeholder="Enter your comments here..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            value={comments}
            onChangeText={setComments}
          />
        </View>

        {/* Signature Pad */}
{/* Signature Pad */}
<View style={styles.inputGroup}>
  <Text style={[styles.label, { color: colors.text }]}>Signature:</Text>
  
  <View style={styles.signatureContainer}>
    <Signature
      key={signatureKey}
      onOK={handleSignature}
      onClear={handleClear}
      onBegin={handleBegin}
      onEnd={handleEnd}
      descriptionText="Sign above"
      clearText="Clear"
      confirmText="Save"
      penColor="#000"
      dotSize={2}
      minWidth={2.0}
      maxWidth={3.5}
      webStyle={signatureWebStyle}
      autoClear={false}
    />
  </View>

  

  {signature ? (
    <View style={{ marginTop: Spacing.sm }}>
      <Text style={{ color: colors.text }}>Preview:</Text>
      <Image
        source={{ uri: signature }}
        style={{
          width: '100%',
          height: 150,
          resizeMode: 'contain',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: BorderRadius.md,
        }}
      />
    </View>
  ) : null}
</View>



        {/* Video Feedback */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Video Feedback:</Text>
          <TouchableOpacity
            style={[
              styles.mediaButton,
              { backgroundColor: isRecordingVideo ? colors.error : colors.primary }
            ]}
            onPress={handleVideoRecording}
          >
            <Text style={styles.buttonText}>
              {isRecordingVideo ? 'Stop Recording' : 'Record Video'}
            </Text>
          </TouchableOpacity>
          {videoPath && <Text style={styles.mediaStatus}>Video recorded: {videoPath}</Text>}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary }
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.md },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: FontSizes.xl, fontWeight: 'bold', marginBottom: Spacing.md },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: '#f8f9fa',
    borderRadius: BorderRadius.md,
  },
  label: { fontWeight: 'bold', fontSize: FontSizes.sm },
  value: { fontSize: FontSizes.sm },
  inputGroup: { marginBottom: Spacing.md },
  statusContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statusOption: {
    padding: Spacing.sm,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    minWidth: 100,
    alignItems: 'center',
  },
  statusOptionSelected: { backgroundColor: '#007bff' },
  statusText: { fontSize: FontSizes.xs },
  statusTextSelected: { color: '#fff', fontWeight: 'bold' },
  textInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.sm,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  signatureContainer: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    height: 300,
    width: '100%',
  },
  mediaButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  mediaStatus: { fontSize: FontSizes.xs, color: '#28a745', fontStyle: 'italic' },
  submitButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: FontSizes.md },
});

export default ServiceRequestDetailsScreen;
