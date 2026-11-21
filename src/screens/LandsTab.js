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
import { useTheme } from '../store/useThemeStore';

export const LandsTab = ({ onNavigate, onAddField }) => {
  const lands = useStore(state => state.lands);
  const removeLand = useStore(state => state.removeLand);
  const triggerToast = useStore(state => state.triggerToast);
  const { colors, fontScale } = useTheme();
  const styles = getStyles(colors, fontScale);

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

      <Button style={styles.registerBtn} onPress={() => onAddField && onAddField()}>
        ＋ Register New Field
      </Button>
    </ScrollView>
  );
};

const getStyles = (colors, fontScale) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    fontSize: fontScale(10),
    fontWeight: '900',
    color: colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldCountText: {
    fontSize: fontScale(9),
    color: colors.primary,
    fontWeight: '700',
  },
  landCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
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
    fontSize: fontScale(13),
    fontWeight: '800',
    color: colors.text,
  },
  landAreaText: {
    fontSize: fontScale(14),
    fontWeight: '900',
    color: colors.primary,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
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
    fontSize: fontScale(7.5),
    fontWeight: '850',
    color: colors.subtext,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: fontScale(10),
    fontWeight: '700',
    color: colors.text,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: fontScale(32),
  },
  emptyTitle: {
    fontSize: fontScale(12.5),
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: fontScale(10.5),
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 15,
    marginTop: 4,
    paddingHorizontal: 8,
  },
  registerBtn: {
    marginTop: 8,
  }
});

