import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';

export const Register = ({ onNavigate }) => {
  const [fullName, setFullName] = useState('John Miller');
  const [email, setEmail] = useState('farmer@sprout.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Errors
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const triggerToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setIsToastOpen(true);
  };

  const handleRegister = () => {
    let isValid = true;

    // Full name validation
    if (!fullName) {
      setFullNameError('Full name is required');
      isValid = false;
    } else if (fullName.trim().split(' ').length < 2) {
      setFullNameError('Please enter your full first and last name');
      isValid = false;
    } else {
      setFullNameError('');
    }

    // Email validation
    if (!email) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    // Agree to terms check
    if (!agreeTerms) {
      triggerToast('You must agree to the terms and conditions.', 'warning');
      return;
    }

    if (!isValid) {
      triggerToast('Please correct the validation errors.', 'error');
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
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (fullNameError) setFullNameError('');
              }}
              error={fullNameError}
              leftIcon={<MaterialIcons name="person" size={18} color="#9ca3af" />}
            />

            <Input
              label="Email Address"
              placeholder="farmer@sprout.com"
              keyboardType="email-address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              error={emailError}
              leftIcon={<MaterialIcons name="email" size={18} color="#9ca3af" />}
            />

            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              error={passwordError}
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
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              error={confirmPasswordError}
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
              onPress={handleRegister} 
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
      </KeyboardAvoidingView>

      <Toast
        isOpen={isToastOpen}
        message={toastMessage}
        type={toastType}
        onClose={() => setIsToastOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
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
