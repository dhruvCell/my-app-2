import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  Profile: undefined;
  CreateServiceRequest: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const TopBar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToCreateServiceRequest = () => {
    navigation.navigate('CreateServiceRequest');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.leftSection}>
        <Text style={[styles.logo, { color: colors.primary }]}>MyApp</Text>
      </View>
      
      <View style={styles.rightSection}>
        {isLoggedIn && user ? (
          <View style={styles.userSection}>
            <TouchableOpacity 
              onPress={navigateToCreateServiceRequest} 
              style={[styles.button, { backgroundColor: colors.primary, marginRight: 8 }]}
            >
              <Text style={[styles.buttonText, { color: colors.surface }]}>New Service</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={navigateToProfile} 
              style={[styles.userInitialsCircle, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.userInitialsText, { color: colors.surface }]}>
                {getUserInitials(user.name)}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={handleLogin} style={[styles.button, { backgroundColor: colors.primary }]}>
              <Text style={[styles.buttonText, { color: colors.surface }]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignup} style={[styles.button, styles.signupButton, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
              <Text style={[styles.buttonText, styles.signupButtonText, { color: colors.primary }]}>Signup</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInitialsCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitialsText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#6366f1',
  },
  signupButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  signupButtonText: {
    color: '#6366f1',
  },
});

export default TopBar;
