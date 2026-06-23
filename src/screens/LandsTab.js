import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from '../components/Button';
import { useStore } from '../store/useStore';

export const LandsTab = ({ onNavigate }) => {
  const lands = useStore(state => state.lands);
  const removeLand = useStore(state => state.removeLand);
  const triggerToast = useStore(state => state.triggerToast);

  const getLandTypeLabel = (type) => {
    if (type === 'wetland') return 'நஞ்சை நிலம் (Wetland)';
    if (type === 'dryland') return 'புஞ்சை நிலம் (Dryland)';
    if (type === 'garden') return 'தோட்டம் (Garden Land)';
    return type;
  };

  const getSoilTypeLabel = (type) => {
    const soilMap = {
      red: 'செம்மண் (Red Soil)',
      brown: 'பழுப்பு மண் (Brown Soil)',
      black: 'கரிசல் மண் (Black Soil)',
      grey: 'சாம்பல் மண் (Grey Soil)',
      alluvial: 'வண்டல் மண் (Alluvial Soil)',
      other: 'இதர மண் (Miscellaneous)'
    };
    return soilMap[type] || type;
  };

  const handleDelete = (id, name) => {
    removeLand(id);
    triggerToast(`Deleted field "${name}".`, 'info');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Your Registered Fields</Text>
        <Text style={styles.fieldCountText}>{lands.length} active plots</Text>
      </View>

      {lands.length > 0 ? (
        lands.map((land) => (
          <View key={land.id} style={styles.landCard}>
            <View style={styles.landHeader}>
              <View style={styles.landTitleCol}>
                <Text style={styles.landName}>{land.name}</Text>
                <Text style={styles.landAreaText}>{land.area}</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteBtn}
                onPress={() => handleDelete(land.id, land.name)}
              >
                <MaterialIcons name="delete-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>LAND PROFILE</Text>
                <Text style={styles.detailValue}>{getLandTypeLabel(land.landType)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>SOIL TYPE</Text>
                <Text style={styles.detailValue}>{getSoilTypeLabel(land.soilType)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>MEASURE METHOD</Text>
                <Text style={styles.detailValue}>{land.measurementMethod === 'gps' ? '🚶‍♂️ GPS Walking' : '📍 Map Pins'}</Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🗺️</Text>
          <Text style={styles.emptyTitle}>No fields registered</Text>
          <Text style={styles.emptyDesc}>
            Setup your land boundary sizes to activate moisture monitors, sowing checklists, and crop predictions.
          </Text>
        </View>
      )}

      <Button style={styles.registerBtn} onPress={() => onNavigate('land-wizard')}>
        ＋ Register New Field
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldCountText: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '700',
  },
  landCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 24,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  landHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  landTitleCol: {
    flex: 1,
  },
  landName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1f2937',
  },
  landAreaText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#059669',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  detailsGrid: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 7.5,
    fontWeight: '850',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4b5563',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#374151',
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 10.5,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 15,
    marginTop: 4,
    paddingHorizontal: 8,
  },
  registerBtn: {
    marginTop: 8,
  }
});
