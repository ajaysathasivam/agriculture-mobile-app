import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { Login } from './src/screens/Login';
import { Register } from './src/screens/Register';
import { Button } from './src/components/Button';
import { Toast } from './src/components/Toast';
import { useStore } from './src/store/useStore';

import { LandWizard } from './src/screens/LandWizard';
import { MapMeasurement } from './src/screens/MapMeasurement';
import { GpsMeasurement } from './src/screens/GpsMeasurement';
import { Dashboard } from './src/screens/Dashboard';

export default function App() {
  // Local toggle for navigation between Login and Register when unauthenticated
  const [currentScreen, setCurrentScreen] = useState('login');

  // Zustand Store Hooks
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const hasCompletedWizard = useStore((state) => state.hasCompletedWizard);
  const logoutAction = useStore((state) => state.logout);

  // Global Queue Toast State
  const toasts = useStore((state) => state.toasts);
  const removeToastAction = useStore((state) => state.removeToast);
  const triggerToastAction = useStore((state) => state.triggerToast);

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
      ) : !hasCompletedWizard ? (
        <>
          {(currentScreen === 'login' || currentScreen === 'register' || currentScreen === 'land-wizard' || currentScreen === 'dashboard') && (
            <LandWizard step={1} onNavigate={setCurrentScreen} />
          )}
          {currentScreen === 'map-measure' && <MapMeasurement onNavigate={setCurrentScreen} />}
          {currentScreen === 'gps-measure' && <GpsMeasurement onNavigate={setCurrentScreen} />}
          {currentScreen === 'land-wizard-step2' && <LandWizard step={2} onNavigate={setCurrentScreen} />}
          {currentScreen === 'land-wizard-step3' && <LandWizard step={3} onNavigate={setCurrentScreen} />}
          {currentScreen === 'land-wizard-finalize' && <LandWizard step={4} onNavigate={setCurrentScreen} />}
        </>
      ) : (
        <Dashboard onNavigate={setCurrentScreen} />
      )}

      {/* Global Stacked Toasts Container */}
      <View style={styles.toastsContainer} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            isOpen={true}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToastAction(toast.id)}
          />
        ))}
      </View>
      
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
  homeIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
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
  toastsContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
});
