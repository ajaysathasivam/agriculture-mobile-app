import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useStore } from '../store/useStore';

const soilTypes = [
  { id: 'red', nameTamil: 'செம்மண்', nameEnglish: 'Red Soil', color: '#b45309', description: 'Iron-rich, highly porous, and well-drained. Optimal for groundnuts, millets, ragi, and fruit orchards.' },
  { id: 'brown', nameTamil: 'பழுப்பு நிற மண்', nameEnglish: 'Brown Soil / Laterite', color: '#78350f', description: 'Highly leached porous clay. Ideal for plantation crops like tea, coffee, cashew, and coconut.' },
  { id: 'black', nameTamil: 'கரிசல் மண்', nameEnglish: 'Black Soil / Cotton Soil', color: '#1c1917', description: 'High moisture retention, clayey texture. Best suited for cotton, sugarcane, wheat, and citrus fruits.' },
  { id: 'grey', nameTamil: 'சாம்பல் நிற மண்', nameEnglish: 'Grey Soil / Peat Soil', color: '#78716c', description: 'Organic-rich water-logged peat clay. Suitable for intensive rice cultivation and marshy zone crops.' },
  { id: 'alluvial', nameTamil: 'வண்டல் மண்', nameEnglish: 'Alluvial Soil', color: '#d4d4d8', description: 'Extremely fertile river silt loam. Perfect for paddy, wheat, sugarcane, pulses, and oilseeds.' },
  { id: 'other', nameTamil: 'இதர வகை', nameEnglish: 'Other Types / Misc', color: '#a8a29e', description: 'Sandy, gravelly, saline, or mixed soils suited for specialized cropping, forestry, or local plants.' }
];

export const LandWizard = ({ step = 1, onNavigate, onFinish, onCancel, isAddMode = false }) => {
  const [landName, setLandName] = useState('My Agricultural Land');
  const [landNameError, setLandNameError] = useState('');
  
  // Get global store state & actions
  const measuredArea = useStore(state => state.measuredArea);
  const measurementMethod = useStore(state => state.measurementMethod);
  const selectedLandType = useStore(state => state.selectedLandType);
  const selectedSoilType = useStore(state => state.selectedSoilType);
  
  const setOnboardingState = useStore(state => state.setOnboardingState);
  const resetOnboardingState = useStore(state => state.resetOnboardingState);
  const setHasCompletedWizard = useStore(state => state.setHasCompletedWizard);
  const addLand = useStore(state => state.addLand);
  const triggerToast = useStore(state => state.triggerToast);

  const handleNextStep2 = () => {
    if (!selectedLandType) {
      triggerToast('Please select a land type.', 'warning');
      return;
    }
    onNavigate('land-wizard-step3');
  };

  const handleNextStep3 = () => {
    if (!selectedSoilType) {
      triggerToast('Please select a soil type.', 'warning');
      return;
    }
    onNavigate('land-wizard-finalize');
  };

  const saveLandToStore = () => {
    const newLand = {
      id: Math.random().toString(36).substring(2, 9),
      name: landName,
      area: measuredArea || '10.0 Acres',
      landType: selectedLandType,
      soilType: selectedSoilType,
      measurementMethod: measurementMethod
    };
    addLand(newLand);
  };

  const handleSaveAndAddAnother = () => {
    if (!landName.trim()) {
      setLandNameError('Land name is required to finalize.');
      return;
    }
    setLandNameError('');
    saveLandToStore();
    triggerToast(`Land "${landName}" added! Configure next land.`, 'success');
    
    setTimeout(() => {
      resetOnboardingState();
      setLandName('My Agricultural Land');
      onNavigate('land-wizard');
    }, 1200);
  };

  const handleFinishSetup = () => {
    if (!landName.trim()) {
      setLandNameError('Land name is required to finalize.');
      return;
    }
    setLandNameError('');
    saveLandToStore();
    triggerToast('Field registered successfully!', 'success');
    
    setTimeout(() => {
      resetOnboardingState();
      if (isAddMode && onFinish) {
        // Return to dashboard's My Lands tab
        onFinish();
      } else {
        // Initial onboarding — mark wizard done, App.js handles the navigation
        setHasCompletedWizard(true);
      }
    }, 1500);
  };

  const getLandTypeLabel = (type) => {
    if (type === 'wetland') return 'நஞ்சை நிலம் (Wetland)';
    if (type === 'dryland') return 'புஞ்சை நிலம் (Dryland)';
    if (type === 'garden') return 'தோட்டம் / தோட்டக்கால் (Garden Land)';
    return 'Not Selected';
  };

  const getSoilTypeLabel = (id) => {
    const soil = soilTypes.find(s => s.id === id);
    return soil ? `${soil.nameTamil} (${soil.nameEnglish})` : 'Not Selected';
  };

  // Dynamic header logic
  const getHeaderTitle = () => {
    if (step === 1) return 'Step 1: Land Size Setup';
    if (step === 2) return 'Step 2: Land Type Selection';
    if (step === 3) return 'Step 3: Soil Type Selection';
    if (step === 4) return 'Step 4: Preview & Finalize';
    return 'Setup';
  };

  const handleBack = () => {
    if (step === 4) onNavigate('land-wizard-step3');
    else if (step === 3) onNavigate('land-wizard-step2');
    else if (step === 2) onNavigate('land-wizard');
    else if (step === 1 && isAddMode && onCancel) onCancel(); // Cancel add-field flow
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {(step > 1 || isAddMode) ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons 
              name={step === 1 && isAddMode ? "close" : "arrow-back-ios"} 
              size={18} 
              color="#6b7280" 
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Step 1: Land Size Setup */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.titleCenter}>
              <Text style={styles.emojiIcon}>🗺️</Text>
              <Text style={styles.mainTitle}>Measure Your Farm</Text>
              <Text style={styles.subTitle}>To start mapping monitoring zones and moisture alerts, we need to determine the boundaries and total acreage of your field.</Text>
            </View>

            <View style={styles.optionsList}>
              <TouchableOpacity style={styles.optionCard} onPress={() => onNavigate('map-measure')} activeOpacity={0.7}>
                <View style={[styles.iconBox, { backgroundColor: '#d1fae5' }]}>
                  <Text style={styles.optionEmoji}>📍</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Map Marker Selection</Text>
                  <Text style={styles.optionDesc}>Locate your land on a satellite map and drop pins around the borders to calculate boundary size.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionCard} onPress={() => onNavigate('gps-measure')} activeOpacity={0.7}>
                <View style={[styles.iconBox, { backgroundColor: '#d1fae5' }]}>
                  <Text style={styles.optionEmoji}>🚶‍♂️</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>GPS Walking Tracker</Text>
                  <Text style={styles.optionDesc}>Walk along the perimeter of your field. Sprout will record your path via GPS to estimate acreage.</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 2: Land Type Selection */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.titleCenter}>
              <Text style={styles.mainTitle}>Select Land Type</Text>
              <Text style={styles.subTitle}>Different soil/water profiles determine what crops can be monitored. Choose your land category:</Text>
            </View>

            <View style={styles.optionsList}>
              <TouchableOpacity 
                style={[styles.selectionCard, selectedLandType === 'wetland' && styles.selectionCardActive]} 
                onPress={() => setOnboardingState({ selectedLandType: 'wetland' })}
                activeOpacity={0.8}
              >
                <View style={[styles.typeIconBox, { backgroundColor: '#e0f2fe' }]}>
                  <Text style={styles.typeEmoji}>💧</Text>
                </View>
                <View style={styles.typeTextContainer}>
                  <View style={styles.typeHeaderRow}>
                    <Text style={styles.typeTitle}>நஞ்சை நிலம் (Wetland)</Text>
                    {selectedLandType === 'wetland' && <MaterialIcons name="check-circle" size={16} color="#059669" />}
                  </View>
                  <Text style={styles.typeDesc}>Abundant water supply. Ideal for water-intensive crops like paddy, sugarcane, and banana.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.selectionCard, selectedLandType === 'dryland' && styles.selectionCardActive]} 
                onPress={() => setOnboardingState({ selectedLandType: 'dryland' })}
                activeOpacity={0.8}
              >
                <View style={[styles.typeIconBox, { backgroundColor: '#fef3c7' }]}>
                  <Text style={styles.typeEmoji}>☀️</Text>
                </View>
                <View style={styles.typeTextContainer}>
                  <View style={styles.typeHeaderRow}>
                    <Text style={styles.typeTitle}>புஞ்சை நிலம் (Dryland)</Text>
                    {selectedLandType === 'dryland' && <MaterialIcons name="check-circle" size={16} color="#059669" />}
                  </View>
                  <Text style={styles.typeDesc}>Rain-fed farming. Optimized for millets, pulses, oilseeds, cotton, and low-water crops.</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.selectionCard, selectedLandType === 'garden' && styles.selectionCardActive]} 
                onPress={() => setOnboardingState({ selectedLandType: 'garden' })}
                activeOpacity={0.8}
              >
                <View style={[styles.typeIconBox, { backgroundColor: '#ecfccb' }]}>
                  <Text style={styles.typeEmoji}>🌱</Text>
                </View>
                <View style={styles.typeTextContainer}>
                  <View style={styles.typeHeaderRow}>
                    <Text style={styles.typeTitle}>தோட்டம் (Garden Land)</Text>
                    {selectedLandType === 'garden' && <MaterialIcons name="check-circle" size={16} color="#059669" />}
                  </View>
                  <Text style={styles.typeDesc}>Highly irrigated garden system. Excellent for vegetables, coconut groves, and cash crops.</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 3: Soil Type Selection */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <View style={styles.titleCenter}>
              <Text style={styles.mainTitle}>Select Soil Type</Text>
              <Text style={styles.subTitle}>Identify the predominant soil type of your field to configure nutrient alerts and mapping algorithms:</Text>
            </View>

            <View style={styles.optionsList}>
              {soilTypes.map(soil => (
                <TouchableOpacity 
                  key={soil.id}
                  style={[styles.selectionCard, selectedSoilType === soil.id && styles.selectionCardActive]} 
                  onPress={() => setOnboardingState({ selectedSoilType: soil.id })}
                  activeOpacity={0.8}
                >
                  <View style={[styles.typeIconBox, { backgroundColor: soil.color, opacity: 0.8 }]}>
                    <Text style={styles.typeEmoji}>🪨</Text>
                  </View>
                  <View style={styles.typeTextContainer}>
                    <View style={styles.typeHeaderRow}>
                      <Text style={styles.typeTitle}>{soil.nameTamil} ({soil.nameEnglish})</Text>
                      {selectedSoilType === soil.id && <MaterialIcons name="check-circle" size={16} color="#059669" />}
                    </View>
                    <Text style={styles.typeDesc}>{soil.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 4: Preview and Finalize Setup */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <View style={styles.titleCenter}>
              <Text style={styles.mainTitle}>Confirm & Finalize</Text>
              <Text style={styles.subTitle}>Verify your farm configuration details before saving.</Text>
            </View>

            <View style={styles.previewCard}>
              <View style={styles.previewMap}>
                <Text style={styles.previewEmoji}>🗺️</Text>
                <Text style={styles.previewAreaText}>{measuredArea || 'Area unknown'}</Text>
                <Text style={styles.previewMethodText}>Method: {measurementMethod || 'None'}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}>🌾</Text>
                <View>
                  <Text style={styles.summaryLabel}>LAND TYPE</Text>
                  <Text style={styles.summaryValue}>{getLandTypeLabel(selectedLandType)}</Text>
                </View>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}>🪨</Text>
                <View>
                  <Text style={styles.summaryLabel}>SOIL PROFILE</Text>
                  <Text style={styles.summaryValue}>{getSoilTypeLabel(selectedSoilType)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Input
                label="Field / Land Identifier Name"
                placeholder="e.g. Primary Paddy Field"
                value={landName}
                onChangeText={(text) => {
                  setLandName(text);
                  if (landNameError) setLandNameError('');
                }}
                error={landNameError}
              />
            </View>

          </View>
        )}

      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        {step === 1 && (
          <Button variant="ghost" onPress={() => setHasCompletedWizard(true)}>
            Skip Setup (Go to Dashboard)
          </Button>
        )}
        {step === 2 && (
          <Button onPress={handleNextStep2} disabled={!selectedLandType}>
            Continue to Soil Selection
          </Button>
        )}
        {step === 3 && (
          <Button onPress={handleNextStep3} disabled={!selectedSoilType}>
            Continue to Preview
          </Button>
        )}
        {step === 4 && (
          <View style={styles.finalButtonsRow}>
            <Button variant="outline" style={styles.halfBtn} onPress={handleSaveAndAddAnother}>
              ＋ Add Another Land
            </Button>
            <Button style={styles.halfBtn} onPress={handleFinishSetup}>
              Finish Setup
            </Button>
          </View>
        )}
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
    width: 34,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  stepContainer: {
    flex: 1,
  },
  titleCenter: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emojiIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  optionsList: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 2,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  selectionCard: {
    flexDirection: 'row',
    padding: 14,
    borderWidth: 2,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  selectionCardActive: {
    borderColor: '#059669',
    backgroundColor: '#ecfdf5',
  },
  typeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  typeEmoji: {
    fontSize: 24,
  },
  typeTextContainer: {
    flex: 1,
  },
  typeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  typeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  typeDesc: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 16,
  },
  previewCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 20,
  },
  previewMap: {
    height: 140,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  previewEmoji: {
    fontSize: 32,
    opacity: 0.5,
  },
  previewAreaText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1f2937',
    marginTop: 8,
  },
  previewMethodText: {
    fontSize: 11,
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  inputContainer: {
    marginTop: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    backgroundColor: '#ffffff',
  },
  finalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfBtn: {
    flex: 1,
  }
});
