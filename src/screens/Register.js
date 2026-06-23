import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useStore } from '../store/useStore';

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    width: '100%',
    marginBottom: 32,
  },
  termsRow: {
    marginTop: 4,
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  termsLabel: {
    flex: 1,
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
    fontWeight: '500',
  },
  linkText: {
    color: '#059669',
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
    borderTopColor: '#f3f4f6',
    paddingTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  signInLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
});
