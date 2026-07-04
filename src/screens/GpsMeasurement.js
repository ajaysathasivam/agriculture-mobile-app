import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from '../components/Button';
import { useStore } from '../store/useStore';
import { GpsTrackerHTML } from '../components/MapWebView/GpsTrackerHTML';

export const GpsMeasurement = ({ onNavigate }) => {
  const webviewRef = useRef(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [distance, setDistance] = useState(0);
  const [calculatedArea, setCalculatedArea] = useState(0);
  const [gpsAccuracy, setGpsAccuracy] = useState('Acquiring...');
  const [pointsCount, setPointsCount] = useState(0);

  const setOnboardingState = useStore(state => state.setOnboardingState);
  const triggerToast = useStore(state => state.triggerToast);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ready') {
        webviewRef.current?.postMessage(
          JSON.stringify({ type: 'request_initial_location' })
        );
      } else if (data.type === 'update_metrics') {
        setDistance(data.distance);
        setCalculatedArea(data.area);
        setPointsCount(data.pointsCount);
        if (data.accuracy > 0) {
          setGpsAccuracy(`±${data.accuracy}m`);
        } else {
          setGpsAccuracy('Acquiring...');
        }
      } else if (data.type === 'simulation_complete') {
        setIsTracking(false);
        triggerToast('GPS simulation walk completed successfully!', 'success');
      } else if (data.type === 'gps_unsupported') {
        triggerToast('GPS not supported in this environment.', 'warning');
      } else if (data.type === 'gps_permission_denied') {
        triggerToast('Location permission denied. Please allow GPS access.', 'warning');
      }
    } catch (e) {
      console.warn("Error parsing GPS message", e);
    }
  };

  const handleStartStop = () => {
    if (isTracking) {
      setIsTracking(false);
      webviewRef.current?.postMessage(
        JSON.stringify({ type: 'pause_tracking' })
      );
      triggerToast('GPS walk paused.', 'info');
    } else {
      setIsTracking(true);
      webviewRef.current?.postMessage(
        JSON.stringify({
          type: 'start_tracking',
          simulate: isSimulated
        })
      );
      triggerToast(
        isSimulated 
          ? 'Demo Simulation started. Walking perimeter...'
          : 'GPS tracking active. Please walk your field perimeter.', 
        'success'
      );
    }
  };

  const handleReset = () => {
    setIsTracking(false);
    setDistance(0);
    setCalculatedArea(0);
    setPointsCount(0);
    setGpsAccuracy('Acquiring...');
    
    webviewRef.current?.postMessage(
      JSON.stringify({ type: 'reset_tracking' })
    );
    triggerToast('Reset walking tracker path.', 'info');
  };

  const handleToggleSimulation = (value) => {
    setIsSimulated(value);
    setIsTracking(false);
    setDistance(0);
    setCalculatedArea(0);
    setPointsCount(0);
    
    webviewRef.current?.postMessage(
      JSON.stringify({ type: 'reset_tracking' })
    );
    
    webviewRef.current?.postMessage(
      JSON.stringify({
        type: 'toggle_simulation',
        enabled: value
      })
    );
    
    triggerToast(
      value 
        ? 'Switched to Demo Simulation Mode.' 
        : 'Switched to Real GPS Mode.', 
      'info'
    );
  };

  const handleSave = () => {
    setOnboardingState({
      measuredArea: `${calculatedArea} Acres`,
      measurementMethod: 'gps'
    });
    triggerToast('Walk boundary saved!', 'success');
    setTimeout(() => {
      onNavigate('land-wizard-step2');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('land-wizard')} style={styles.backButton}>
          <MaterialIcons name="close" size={24} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GPS Walking Tracker</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      {/* Main Map View */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webviewRef}
          source={{ html: GpsTrackerHTML }}
          style={styles.webview}
          onMessage={handleMessage}
          scrollEnabled={false}
          bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          geolocationEnabled={true}
        />
        
        {/* Floating Telemetry & Controls Panel */}
        <View style={styles.floatingPanel}>
          {/* Signal Indicator & Demo Switch */}
          <View style={styles.panelHeader}>
            <View style={styles.statusCol}>
              <View style={styles.signalRow}>
                <View style={[
                  styles.signalDot, 
                  { backgroundColor: isTracking ? (isSimulated ? '#f59e0b' : '#059669') : '#9ca3af' }
                ]} />
                <Text style={styles.signalText}>
                  {isTracking 
                    ? (isSimulated ? 'SIMULATOR ACTIVE' : 'GPS ACTIVE') 
                    : 'STANDBY'}
                </Text>
              </View>
              <Text style={styles.accText}>
                {isTracking ? `Acc: ${gpsAccuracy} • ${pointsCount} points` : 'Ready to track'}
              </Text>
            </View>
            
            {/* Demo Simulation Mode Toggle */}
            <View style={styles.demoToggleContainer}>
              <Text style={styles.demoToggleLabel}>Demo Mode</Text>
              <Switch
                value={isSimulated}
                onValueChange={handleToggleSimulation}
                trackColor={{ false: '#d1d5db', true: '#fef3c7' }}
                thumbColor={isSimulated ? '#f59e0b' : '#f3f4f6'}
                ios_backgroundColor="#d1d5db"
              />
            </View>
          </View>

          {/* Live Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Distance Walked</Text>
              <Text style={styles.metricValue}>{distance}m</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Calculated Area</Text>
              <Text style={[styles.metricValue, { color: '#059669' }]}>
                {calculatedArea} Acres
              </Text>
            </View>
          </View>

          {/* Buttons Controls */}
          <View style={styles.controlsRow}>
            <Button 
              variant="outline" 
              size="sm" 
              style={styles.halfBtn} 
              onPress={handleReset}
            >
              Reset
            </Button>
            <Button 
              size="sm" 
              style={[
                styles.halfBtn, 
                isTracking && { backgroundColor: '#ef4444', borderColor: '#ef4444' }
              ]} 
              onPress={handleStartStop}
            >
              {isTracking ? 'Pause Walk' : distance > 0 ? 'Resume Walk' : 'Start Tracking'}
            </Button>
          </View>

          {/* Save Button inside floating panel */}
          {distance > 0 && !isTracking && (
            <Button 
              style={styles.saveBtn} 
              onPress={handleSave}
              disabled={calculatedArea === 0 && distance < 10}
            >
              Save Walked Area ({calculatedArea} Ac)
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#ffffff',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1f2937',
  },
  backButton: {
    padding: 8,
  },
  backButtonPlaceholder: {
    width: 40,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#e5e7eb',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  floatingPanel: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statusCol: {
    flexDirection: 'column',
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  signalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  signalText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#374151',
  },
  accText: {
    fontSize: 9,
    color: '#6b7280',
    fontWeight: '600',
  },
  demoToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  demoToggleLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 14,
    padding: 12,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1f2937',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfBtn: {
    flex: 1,
  },
  saveBtn: {
    marginTop: 12,
    backgroundColor: '#059669',
    borderColor: '#059669',
  }
});
