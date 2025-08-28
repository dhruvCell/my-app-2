import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { AuthProvider } from '../../contexts/AuthContext';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import CreateServiceRequestScreen from '../../screens/CreateServiceRequestScreen';
import MainHomeScreen from '../../screens/HomeScreen';
import LoginScreen from '../../screens/LoginScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import ServiceRequestDetailsScreen from '../../screens/ServiceRequestDetailsScreen';
import SignupScreen from '../../screens/SignupScreen';
const Stack = createNativeStackNavigator();
export default function AppHomeScreen() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            {/* <NavigationContainer> */}
              <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="Home" component={MainHomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="ServiceRequestDetails" component={ServiceRequestDetailsScreen} />
                <Stack.Screen name="CreateServiceRequest" component={CreateServiceRequestScreen} />
              </Stack.Navigator>
            {/* </NavigationContainer> */}
            <Toast />
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

