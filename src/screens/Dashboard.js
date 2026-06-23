import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Platform,
  StatusBar
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Import sub tab screens
import { HomeTab } from './HomeTab';
import { LandsTab } from './LandsTab';
import { ProfileTab } from './ProfileTab';

export const Dashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'lands' | 'profile'

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab onNavigate={onNavigate} />;
      case 'lands':
        return <LandsTab onNavigate={onNavigate} />;
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
          <MaterialIcons name="agriculture" size={22} color="#059669" />
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
            color={activeTab === 'home' ? '#059669' : '#9ca3af'} 
          />
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('lands')}
          activeOpacity={0.8}
        >
          <MaterialIcons 
            name="landscape" 
            size={24} 
            color={activeTab === 'lands' ? '#059669' : '#9ca3af'} 
          />
          <Text style={[styles.tabLabel, activeTab === 'lands' && styles.tabLabelActive]}>
            Fields
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
            color={activeTab === 'profile' ? '#059669' : '#9ca3af'} 
          />
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 52,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1f2937',
  },
  body: {
    flex: 1,
  },
  tabBar: {
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9ca3af',
  },
  tabLabelActive: {
    color: '#059669',
  }
});
