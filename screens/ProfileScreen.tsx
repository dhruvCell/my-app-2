import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TopBar from '../components/TopBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { lightColors, Spacing, BorderRadius, FontSizes, Shadows, Gradients } from '../styles/theme';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Signup: undefined;
  Profile: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Theme and Language Contexts
  const { theme, colors, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

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

  const quickActions = [
    { icon: 'edit', label: 'Edit Profile', action: () => console.log('Edit Profile') },
    { icon: 'settings', label: 'Settings', action: () => console.log('Settings') },
    { icon: 'notifications', label: 'Notifications', action: () => console.log('Notifications') },
    { icon: 'help', label: 'Help Center', action: () => console.log('Help') },
  ];

  const stats = [
    { label: 'Projects', value: '12', icon: 'folder' },
    { label: 'Tasks', value: '47', icon: 'check-circle' },
    { label: 'Achievements', value: '5', icon: 'star' },
  ];

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <TopBar />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.cover} />
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name ? getUserInitials(user.name) : 'US'}
              </Text>
            </View>
          </View>
        </View>

        {/* User Info Section */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <Text style={styles.userBio}>Senior Developer • React Native Expert</Text>
          
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Icon name={stat.icon} size={20} color={colors.primary} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionButton}
                onPress={action.action}
              >
                <View style={styles.actionIcon}>
                <Icon name={action.icon} size={24} color={colors.primary} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.accountCard}>
            <View style={styles.accountItem}>
              <Icon name="security" size={20} color={colors.textSecondary} />
              <Text style={styles.accountText}>Privacy & Security</Text>
              <Icon name="chevron-right" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.divider} />
            <View style={styles.accountItem}>
              <Icon name="language" size={20} color={colors.textSecondary} />
              <Text style={styles.accountText}>Language</Text>
              <TouchableOpacity onPress={() => setLanguage(language === 'en' ? 'es' : 'en')}>
                <Text style={styles.accountValue}>{language === 'en' ? 'English' : 'Español'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.accountItem}>
              <Icon name="dark-mode" size={20} color={colors.textSecondary} />
              <Text style={styles.accountText}>Dark Mode</Text>
              <TouchableOpacity onPress={toggleTheme}>
                <Icon name={theme === 'light' ? 'toggle-off' : 'toggle-on'} size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          {showLogoutConfirm ? (
            <View style={styles.confirmCard}>
              <Text style={styles.confirmTitle}>Are you sure?</Text>
              <Text style={styles.confirmMessage}>You'll need to sign in again to access your account.</Text>
              <View style={styles.confirmButtons}>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.cancelButton]}
                  onPress={() => setShowLogoutConfirm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.logoutConfirmButton]}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutConfirmText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => setShowLogoutConfirm(true)}
            >
              <Icon name="logout" size={20} color={colors.error} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
  );
};

// Move styles inside the component to access the colors variable
const getStyles = (colors: typeof lightColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: 200,
    position: 'relative',
  },
  cover: {
    height: 140,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.round,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.surface,
    ...Shadows.lg,
  },
  avatarText: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  userInfo: {
    alignItems: 'center',
    padding: Spacing.lg,
    marginTop: Spacing.xl,
  },
  userName: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  userBio: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: Spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  actionButton: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  actionIcon: {
    marginBottom: Spacing.sm,
  },
  actionLabel: {
    fontSize: FontSizes.sm,
    color: colors.text,
    fontWeight: '500',
  },
  accountCard: {
    backgroundColor: colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  accountText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: colors.text,
    marginLeft: Spacing.md,
  },
  accountValue: {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: Spacing.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
    gap: Spacing.sm,
  },
  logoutButtonText: {
    fontSize: FontSizes.md,
    color: colors.error,
    fontWeight: '500',
  },
  confirmCard: {
    backgroundColor: colors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.md,
  },
  confirmTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: Spacing.sm,
  },
  confirmMessage: {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  confirmButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.divider,
  },
  logoutConfirmButton: {
    backgroundColor: colors.error,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: '500',
  },
  logoutConfirmText: {
    color: colors.surface,
    fontWeight: '500',
  },
  footerSpacer: {
    height: Spacing.xxl,
  },
});

export default ProfileScreen;
