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
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useStore } from '../store/useStore';
import { useTheme } from '../store/useThemeStore';

// Registration Validation Schema
const registerSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .test('is-two-words', 'Please enter your full first and last name', (value) => {
      return value && value.trim().split(/\s+/).length >= 2;
    }),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Please confirm your password'),
});

export const Register = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const triggerToast = useStore((state) => state.triggerToast);
  const { colors, fontScale } = useTheme();
  const styles = getStyles(colors, fontScale);

  const handleRegisterSubmit = (values) => {
    // Agree to terms check
    if (!agreeTerms) {
      triggerToast('You must agree to the terms and conditions.', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      triggerToast('Account created successfully!', 'success');
      
      setTimeout(() => {
        onNavigate('login');
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
          initialValues={{ fullName: 'John Miller', email: 'farmer@sprout.com', password: 'password123', confirmPassword: 'password123' }}
          validationSchema={registerSchema}
          onSubmit={handleRegisterSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Header Title */}
              <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join Sprout and start tracking your crop fields.</Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                <Input
                  label="Full Name"
                  placeholder="e.g. John Miller"
                  value={values.fullName}
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  error={touched.fullName && errors.fullName}
                  leftIcon={<MaterialIcons name="person" size={18} color="#9ca3af" />}
                />

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
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={18} color="#9ca3af" />
                    </TouchableOpacity>
                  }
                />

                <Input
                  label="Confirm Password"
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  error={touched.confirmPassword && errors.confirmPassword}
                  leftIcon={<MaterialIcons name="lock" size={18} color="#9ca3af" />}
                />

                {/* Terms checkbox */}
                <View style={styles.termsRow}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer} 
                    onPress={() => setAgreeTerms(!agreeTerms)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
                      {agreeTerms && <MaterialIcons name="check" size={12} color="#ffffff" />}
                    </View>
                    <Text style={styles.termsLabel}>
                      I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>.
                    </Text>
                  </TouchableOpacity>
                </View>

                <Button 
                  onPress={handleSubmit} 
                  isLoading={isLoading}
                  style={styles.submitButton}
                >
                  Create Sprout Account
                </Button>
              </View>

              {/* Navigation Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => onNavigate('login')}>
                  <Text style={styles.signInLink}>Sign In</Text>
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
    marginTop: 20,
    marginBottom: 24,
  },
  logoBadge: {
    width: 60,
    height: 60,
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
    fontSize: fontScale(30),
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
    fontSize: fontScale(12.5),
    color: colors.subtext,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
    marginBottom: 24,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    fontSize: fontScale(11.5),
    color: colors.subtext,
    fontWeight: '500',
    flex: 1,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '700',
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
    marginTop: 16,
  },
  footerText: {
    fontSize: fontScale(12),
    color: colors.subtext,
    fontWeight: '500',
  },
  signInLink: {
    fontSize: fontScale(12),
    fontWeight: '700',
    color: colors.primary,
  },
});
