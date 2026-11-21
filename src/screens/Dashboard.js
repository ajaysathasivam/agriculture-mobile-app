import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '../store/useThemeStore';

// Import sub tab screens
import { HomeTab } from './HomeTab';
import { TodoTab } from './TodoTab';
import { LandsTab } from './LandsTab';
import { ProfileTab } from './ProfileTab';

// Import wizard screens for the "Add New Field" flow
import { LandWizard } from './LandWizard';
import { MapMeasurement } from './MapMeasurement';
import { GpsMeasurement } from './GpsMeasurement';

export const Dashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'todo' | 'lands' | 'profile'
  
  // Controls the "Register New Field" wizard overlay inside the dashboard
  // null means dashboard is showing; a string means a wizard screen is active
  const [addLandScreen, setAddLandScreen] = useState(null);
  // null | 'land-wizard' | 'land-wizard-step2' | 'land-wizard-step3' | 'land-wizard-finalize' | 'map-measure' | 'gps-measure'

  const { colors, fontScale } = useTheme();
  const styles = getStyles(colors, fontScale);

  // Called when user taps "Register New Field" from LandsTab
  const handleStartAddField = () => {
    setAddLandScreen('land-wizard');
  };

  // Internal navigate handler for the wizard overlay
  const handleAddLandNavigate = (screen) => {
    setAddLandScreen(screen);
  };

  // Called when the wizard finishes (Finish Setup button)
  // Returns user to the My Lands tab
  const handleAddLandFinish = () => {
    setAddLandScreen(null);
    setActiveTab('lands');
  };

  // Called when user cancels out of the add-field wizard
  const handleAddLandCancel = () => {
    setAddLandScreen(null);
    setActiveTab('lands');
  };

  // If a wizard screen is active, render it full-screen instead of the dashboard
  if (addLandScreen) {
    if (addLandScreen === 'map-measure') {
      return (
        <MapMeasurement
          onNavigate={(screen) => {
            // After map measurement, go back to wizard step 1
            if (screen === 'land-wizard') {
              setAddLandScreen('land-wizard');
            } else {
              setAddLandScreen(screen);
            }
          }}
        />
      );
    }

    if (addLandScreen === 'gps-measure') {
      return (
        <GpsMeasurement
          onNavigate={(screen) => {
            if (screen === 'land-wizard') {
              setAddLandScreen('land-wizard');
            } else {
              setAddLandScreen(screen);
            }
          }}
        />
      );
    }

    // All land-wizard steps
    const wizardStepMap = {
      'land-wizard': 1,
      'land-wizard-step2': 2,
      'land-wizard-step3': 3,
      'land-wizard-finalize': 4,
    };
    const step = wizardStepMap[addLandScreen] || 1;

    return (
      <LandWizard
        step={step}
        onNavigate={handleAddLandNavigate}
        onFinish={handleAddLandFinish}
        onCancel={handleAddLandCancel}
        isAddMode={true}
      />
    );
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab onNavigate={onNavigate} />;
      case 'todo':
        return <TodoTab />;
      case 'lands':
        return <LandsTab onNavigate={onNavigate} onAddField={handleStartAddField} />;
      case 'profile':
        return <ProfileTab onNavigate={onNavigate} />;
      default:
        return <HomeTab onNavigate={onNavigate} />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Sprout Farm Overview';
      case 'todo':
        return 'Farm Activities Checklist';
      case 'lands':
        return 'Registered Fields';
      case 'profile':
        return 'Farmer settings Profile';
      default:
        return 'Sprout Dashboard';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <MaterialIcons name="agriculture" size={22} color={colors.primary} />
          <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        </View>
      </View>

      {/* Main content body */}
      <View style={styles.body}>
        {renderActiveTabContent()}
      </View>

      {/* Bottom Tab Bar Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('home')}
          activeOpacity={0.8}
        >
          <MaterialIcons 
            name="home" 
            size={24} 
            color={activeTab === 'home' ? colors.primary : colors.subtext} 
          />
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('todo')}
          activeOpacity={0.8}
        >
          <MaterialIcons 
            name="assignment" 
            size={24} 
            color={activeTab === 'todo' ? colors.primary : colors.subtext} 
          />
          <Text style={[styles.tabLabel, activeTab === 'todo' && styles.tabLabelActive]}>
            Todo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('lands')}
          activeOpacity={0.8}
        >
          <MaterialIcons 
            name="map" 
            size={24} 
            color={activeTab === 'lands' ? colors.primary : colors.subtext} 
          />
          <Text style={[styles.tabLabel, activeTab === 'lands' && styles.tabLabelActive]}>
            My Lands
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.8}
        >
          <MaterialIcons 
            name="person" 
            size={24} 
            color={activeTab === 'profile' ? colors.primary : colors.subtext} 
          />
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (colors, fontScale) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 52,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: fontScale(14),
    fontWeight: '800',
    color: colors.text,
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    height: 56,
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: fontScale(9),
    fontWeight: '700',
    color: colors.subtext,
  },
  tabLabelActive: {
    color: colors.primary,
  }
});
