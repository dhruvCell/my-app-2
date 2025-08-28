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

const SignupScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all fields',
      });
      return;
    }
  
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Passwords do not match',
      });
      return;
    }
  
    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Password must be at least 6 characters long',
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch('http://192.168.86.42:3002/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        Toast.show({
          type: 'success',
          text1: 'Account created successfully!',
        });

        // After signup, navigate to login screen - user will login there
  
        // Navigate after small delay
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2: data.message || 'Something went wrong',
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    Alert.alert('Social Signup', `Sign up with ${provider} clicked`);
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
            <FontAwesome name="user-plus" size={60} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign up to get started</Text>
        </View>

        {/* Form Section */}
        <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>
          {/* Name Input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <FontAwesome name="user" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Full Name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

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

          {/* Confirm Password Input */}
            <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <FontAwesome name="lock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <FontAwesome
                name={showConfirmPassword ? 'eye-slash' : 'eye'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signupButton, { backgroundColor: colors.primary }, isLoading && { opacity: 0.6 }]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={[styles.signupButtonText, { color: colors.surface }]}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Terms and Conditions */}
          <Text style={[styles.termsText, { color: colors.textSecondary }]}>
            By signing up, you agree to our{' '}
            <Text style={[styles.termsLink, { color: colors.primary }]}>Terms of Service</Text> and{' '}
            <Text style={[styles.termsLink, { color: colors.primary }]}>Privacy Policy</Text>.
          </Text>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or sign up with</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
          </View>

          {/* Social Signup Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => handleSocialSignup('Google')}
            >
              <FontAwesome name="google" size={20} color="#DB4437" />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => handleSocialSignup('Facebook')}
            >
              <FontAwesome name="facebook" size={20} color="#4267B2" />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign In Section */}
        <View style={styles.signInContainer}>
          <Text style={[styles.signInText, { color: colors.textSecondary }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.signInLink, { color: colors.primary }]}>Sign In</Text>
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
  signupButton: {
    borderRadius: BorderRadius.md,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  signupButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
  termsText: {
    textAlign: 'center',
    fontSize: FontSizes.sm,
    marginBottom: Spacing.lg,
  },
  termsLink: {
    fontWeight: '500',
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  signInText: {
    fontSize: FontSizes.sm,
  },
  signInLink: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  socialButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '500',
  },
});

export default SignupScreen;
