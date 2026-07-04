import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useStore } from '../store/useStore';
import { useTheme } from '../store/useThemeStore';

// Login Validation Schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const Login = ({ onNavigate }) => {
  const loginAction = useStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const triggerToast = useStore((state) => state.triggerToast);
  const { colors, fontScale } = useTheme();
  const styles = getStyles(colors, fontScale);

  const handleLoginSubmit = (values) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      triggerToast('Signed in successfully!', 'success');
      
      setTimeout(() => {
        loginAction({ name: 'John Miller', email: values.email });
      }, 1000);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Formik
          initialValues={{ email: 'farmer@sprout.com', password: 'password123' }}
          validationSchema={loginSchema}
          onSubmit={handleLoginSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Logo & Branding */}
              <View style={styles.header}>
                <View style={styles.logoBadge}>
                  <MaterialCommunityIcons name="sprout" size={32} color="#ffffff" />
                </View>
                <Text style={styles.logoText}>Sprout</Text>
                <Text style={styles.subtext}>SMART FARM PORTAL</Text>
                <Text style={styles.description}>
                  Access soil insights, monitor crop irrigation, and manage harvest yields.
                </Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                <Input
                  label="Email Address"
                  placeholder="farmer@sprout.com"
                  keyboardType="email-address"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email && errors.email}
                  leftIcon={<MaterialIcons name="email" size={18} color="#9ca3af" />}
                />

                <Input
                  label="Password"
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password && errors.password}
                  leftIcon={<MaterialIcons name="lock" size={18} color="#9ca3af" />}
                  rightIcon={
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <MaterialIcons 
                        name={showPassword ? "visibility-off" : "visibility"} 
                        size={18} 
                        color="#9ca3af" 
                      />
                    </TouchableOpacity>
                  }
                />

                {/* Extra Rows */}
                <View style={styles.rememberRow}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer} 
                    onPress={() => setRememberMe(!rememberMe)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && <MaterialIcons name="check" size={12} color="#ffffff" />}
                    </View>
                    <Text style={styles.checkboxLabel}>Remember me</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => triggerToast('Reset password link sent (simulated).', 'info')}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                <Button 
                  onPress={handleSubmit} 
                  isLoading={isLoading}
                  style={styles.submitButton}
                >
                  Sign In to Farm
                </Button>
              </View>

              {/* Navigation Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => onNavigate('register')}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (colors, fontScale) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoEmoji: {
    fontSize: fontScale(32),
  },
  logoText: {
    fontSize: fontScale(24),
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: fontScale(10),
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 2,
    marginTop: 4,
  },
  description: {
    fontSize: fontScale(13),
    color: colors.subtext,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
    marginBottom: 40,
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    fontSize: fontScale(12),
    color: colors.subtext,
    fontWeight: '600',
  },
  forgotText: {
    fontSize: fontScale(12),
    fontWeight: '700',
    color: colors.primary,
  },
  submitButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 24,
  },
  footerText: {
    fontSize: fontScale(12),
    color: colors.subtext,
    fontWeight: '500',
  },
  signUpLink: {
    fontSize: fontScale(12),
    fontWeight: '700',
    color: colors.primary,
  },
});
