import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Login } from './src/screens/Login';
import { Register } from './src/screens/Register';
import { Button } from './src/components/Button';
import { Toast } from './src/components/Toast';
import { useStore } from './src/store/useStore';

export default function App() {
  // Local toggle for navigation between Login and Register when unauthenticated
  const [currentScreen, setCurrentScreen] = useState('login');

  // Zustand Store Hooks
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const logoutAction = useStore((state) => state.logout);

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const triggerToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setIsToastOpen(true);
  };

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <>
          {currentScreen === 'login' && (
            <Login 
              onNavigate={setCurrentScreen} 
            />
          )}

          {currentScreen === 'register' && (
            <Register 
              onNavigate={setCurrentScreen}
            />
          )}
        </>
      ) : (
        <SafeAreaView style={styles.homeContainer}>
          <View style={styles.homeContent}>
            <Text style={styles.homeEmoji}>🧑‍🌾</Text>
            <Text style={styles.homeWelcome}>Welcome to Sprout!</Text>
            <Text style={styles.homeFarmerName}>{user?.name || 'Farmer'}</Text>
            <Text style={styles.homeSubtitle}>
              Your mobile farm assistant is ready. We will start migrating the fields and sowing logs next.
            </Text>
            
            <Button 
              variant="outline" 
              onPress={() => {
                logoutAction();
                triggerToast('Signed out successfully.', 'info');
              }}
              style={styles.logoutButton}
            >
              Sign Out
            </Button>
          </View>
        </SafeAreaView>
      )}

      <Toast
        isOpen={isToastOpen}
        message={toastMessage}
        type={toastType}
        onClose={() => setIsToastOpen(false)}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 24,
  },
  homeContent: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  homeEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  homeWelcome: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
  },
  homeFarmerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginTop: 4,
  },
  homeSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
    fontWeight: '500',
  },
  logoutButton: {
    width: '100%',
    marginTop: 32,
    borderColor: '#ef4444',
  },
});
