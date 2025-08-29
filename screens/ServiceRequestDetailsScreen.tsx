import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
// import SignatureCapture from 'react-native-signature-capture';

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
  const [signature, setSignature] = useState(serviceRequest.signature || '');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioPath, setAudioPath] = useState(serviceRequest.audioFeedback || '');
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoPath, setVideoPath] = useState(serviceRequest.videoFeedback || '');
  // const signatureRef = useRef<SignatureCapture>(null);

  const statusOptions = [
    'Pending',
    'In Progress',
    'Completed',
    'Cancelled',
    'On Hold'
  ];

  const handleSignatureSave = (result: any) => {
    setSignature(result.encoded);
  };

  // const handleSignatureClear = () => {
  //   signatureRef.current?.resetImage();
  //   setSignature('');
  // };


  const handleVideoRecording = () => {
    setIsRecordingVideo(!isRecordingVideo);
    Alert.alert('Video Recording', isRecordingVideo ? 'Video recording stopped' : 'Video recording started');
  };

  const handleSubmit = async () => {
    const updateData = {
      comments,
      status,
      signature,
      audioFeedback: audioPath,
      videoFeedback: videoPath,
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
          'Authorization': `Bearer ${token}`, // Assuming token is available
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Service request updated successfully!',
        });
        navigation.navigate('Home'); // Redirect to the list page
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
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

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Signature:</Text>
          <View style={styles.signatureContainer}>
            {/* <SignatureCapture
              ref={signatureRef}
              style={styles.signaturePad}
              onSaveEvent={handleSignatureSave}
              saveImageFileInExtStorage={false}
              showNativeButtons={false}
              showTitleLabel={false}
              backgroundColor="#ffffff"
              strokeColor="#000000"
              minStrokeWidth={4}
              maxStrokeWidth={4}
            /> */}
            <View style={styles.signatureButtons}>
              {/* <TouchableOpacity
                style={[styles.signatureButton, { backgroundColor: colors.primary }]}
                onPress={() => signatureRef.current?.saveImage()}
              >
                <Text style={styles.buttonText}>Save Signature</Text>
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                style={[styles.signatureButton, { backgroundColor: colors.error }]}
                onPress={handleSignatureClear}
              >
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity> */}
            </View>
          </View>
          {signature && <Text style={styles.mediaStatus}>Signature captured</Text>}
        </View>

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
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  value: {
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
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
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  signatureContainer: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    marginBottom: 8,
  },
  signaturePad: {
    height: 200,
    backgroundColor: '#ffffff',
  },
  signatureButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
  },
  signatureButton: {
    padding: 8,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  mediaButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mediaStatus: {
    fontSize: 12,
    color: '#28a745',
    fontStyle: 'italic',
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ServiceRequestDetailsScreen;
