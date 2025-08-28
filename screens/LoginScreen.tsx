import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { BorderRadius, FontSizes, Shadows, Spacing } from '../styles/theme';

const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all fields',
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch('http://192.168.86.42:3002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        Toast.show({
          type: 'success',
          text1: 'Login successful!',
        });

        login({ name: data.user.name, email: data.user.email }, data.token); // Update authentication state with token

        // Navigate after short delay
        setTimeout(() => {
          navigation.navigate('Home');
        }, 1500);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: data.message || 'Invalid credentials',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Social Login', `Login with ${provider} clicked`);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.surface }]}>
            <FontAwesome name="user-circle" size={60} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to your account</Text>
        </View>

        {/* Form Section */}
        <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>
          {/* Email Input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <FontAwesome name="envelope" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Email address"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <FontAwesome name="lock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <FontAwesome
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }, isLoading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={[styles.loginButtonText, { color: colors.surface }]}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or continue with</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => handleSocialLogin('Google')}
            >
              <FontAwesome name="google" size={20} color="#DB4437" />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => handleSocialLogin('Facebook')}
            >
              <FontAwesome name="facebook" size={20} color="#4267B2" />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Section */}
        <View style={styles.signUpContainer}>
          <Text style={[styles.signUpText, { color: colors.textSecondary }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.signUpLink, { color: colors.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
  },
  formContainer: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: FontSizes.md,
  },
  eyeIcon: {
    padding: Spacing.sm,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    fontSize: FontSizes.sm,
  },
  loginButton: {
    borderRadius: BorderRadius.md,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  loginButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.sm,
    fontSize: FontSizes.sm,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  socialButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  signUpText: {
    fontSize: FontSizes.sm,
  },
  signUpLink: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});

export default LoginScreen;