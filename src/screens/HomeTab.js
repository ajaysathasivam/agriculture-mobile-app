import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from '../components/Button';
import { useStore } from '../store/useStore';
import { useTheme } from '../store/useThemeStore';
import { cropsDatabase, getDurationInDays, getActiveMilestone } from '../data/crops';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const HomeTab = ({ onNavigate }) => {
  const lands = useStore(state => state.lands);
  const plantedCrops = useStore(state => state.plantedCrops);
  const updatePlantedCropDays = useStore(state => state.updatePlantedCropDays);
  const addJournalLog = useStore(state => state.addJournalLog);
  const triggerToast = useStore(state => state.triggerToast);
  const { colors, fontScale } = useTheme();
  const styles = getStyles(colors, fontScale);

  const [expandedIndex, setExpandedIndex] = useState(0);
  const [journalNote, setJournalNote] = useState('');

  // Calculate total acreage
  const totalAcreage = lands.reduce((sum, land) => {
    const val = parseFloat(land.area) || 0;
    return sum + val;
  }, 0).toFixed(1);

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

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleAdjustDays = (index, delta, totalDays) => {
    const crop = plantedCrops[index];
    const newDays = Math.max(1, Math.min(totalDays, crop.elapsedDays + delta));
    updatePlantedCropDays(index, newDays);
  };

  const handleAddLog = (index, currentDay) => {
    if (!journalNote.trim()) {
      triggerToast('Please write a note before logging.', 'warning');
      return;
    }
    const newEntry = {
      day: currentDay,
      date: new Date().toLocaleDateString(),
      note: journalNote
    };
    addJournalLog(index, newEntry);
    setJournalNote('');
    triggerToast(`Farming activity logged for Day ${currentDay}!`, 'success');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      
      {/* Weather Widget */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherHeader}>
          <View>
            <Text style={styles.weatherLabel}>CURRENT WEATHER</Text>
            <Text style={styles.weatherLocation}>Tambaram, TN</Text>
            <Text style={styles.weatherSub}>Partly Cloudy • 15% Rain Prob</Text>
          </View>
          <View style={styles.weatherRight}>
            <Text style={styles.weatherTemp}>32°C</Text>
            <View style={styles.weatherBadge}>
              <Text style={styles.weatherBadgeText}>Humidity: 68%</Text>
            </View>
          </View>
        </View>
        <View style={styles.weatherDivider} />
        <View style={styles.weatherFooter}>
          <Text style={styles.weatherFooterItem}>🌬️ Wind: 14 km/h</Text>
          <Text style={styles.weatherFooterItem}>☀️ UV Index: High (7)</Text>
          <Text style={styles.weatherFooterItem}>💧 Soil Moist: 42%</Text>
        </View>
      </View>

      {/* Farm Stats Overview */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Registered Area</Text>
          <Text style={styles.statValue}>{totalAcreage} Acres</Text>
          <Text style={styles.statSub}>across {lands.length} field{lands.length === 1 ? '' : 's'}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Moisture Status</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>Optimal</Text>
          <Text style={styles.statSub}>Zone alerts cleared</Text>
        </View>
      </View>

      {/* Soil Analytics Card */}
      {lands.length > 0 && (
        <View style={styles.analyticsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Live Soil Diagnostics</Text>
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>Field: {lands[0].name}</Text>
            </View>
          </View>

          {/* NPK Values Bars */}
          <View style={styles.npkContainer}>
            <View style={styles.npkRow}>
              <View style={styles.npkLabelCol}>
                <Text style={styles.npkName}>Nitrogen (N)</Text>
                <Text style={styles.npkPercent}>65%</Text>
              </View>
              <View style={styles.npkBarContainer}>
                <View style={[styles.npkBar, { width: '65%', backgroundColor: colors.primary }]} />
              </View>
            </View>

            <View style={styles.npkRow}>
              <View style={styles.npkLabelCol}>
                <Text style={styles.npkName}>Phosphorus (P)</Text>
                <Text style={styles.npkPercent}>48%</Text>
              </View>
              <View style={styles.npkBarContainer}>
                <View style={[styles.npkBar, { width: '48%', backgroundColor: '#f59e0b' }]} />
              </View>
            </View>

            <View style={styles.npkRow}>
              <View style={styles.npkLabelCol}>
                <Text style={styles.npkName}>Potassium (K)</Text>
                <Text style={styles.npkPercent}>72%</Text>
              </View>
              <View style={styles.npkBarContainer}>
                <View style={[styles.npkBar, { width: '72%', backgroundColor: '#0ea5e9' }]} />
              </View>
            </View>
          </View>

          {/* Dynamic Moisture Charts */}
          <View style={styles.moistureChartContainer}>
            <Text style={styles.chartTitle}>Recent Soil Moisture Levels (%)</Text>
            <View style={styles.chartBarsRow}>
              {[
                { day: 'Mon', val: 45 },
                { day: 'Tue', val: 40 },
                { day: 'Wed', val: 38 },
                { day: 'Thu', val: 42 },
                { day: 'Fri', val: 45 },
                { day: 'Sat', val: 42 }
              ].map((mVal, mIdx) => (
                <View key={mIdx} style={styles.chartBarCol}>
                  <Text style={styles.barValText}>{mVal.val}%</Text>
                  <View style={styles.chartBarTrack}>
                    <View style={[styles.chartBarFill, { height: `${mVal.val}%` }]} />
                  </View>
                  <Text style={styles.barDayText}>{mVal.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Sprout Soil Insight */}
      {lands.length > 0 ? (
        <View style={styles.insightCard}>
          <Text style={styles.insightEmoji}>💡</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Sprout Soil Insight</Text>
            <Text style={styles.insightDesc}>
              Based on your <Text style={styles.insightBold}>{getLandTypeLabel(lands[0].landType)}</Text> setup with <Text style={styles.insightBold}>{getSoilTypeLabel(lands[0].soilType)}</Text>, we recommend scheduling drip irrigation tomorrow morning at 6:00 AM to prevent soil surface drying.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.noFieldCard}>
          <Text style={styles.noFieldEmoji}>🗺️</Text>
          <Text style={styles.noFieldTitle}>No fields registered yet</Text>
          <Text style={styles.noFieldDesc}>
            Register your land boundaries via GPS walk or map measurement to unlock automated weather reports, soil alerts, and crop recipes.
          </Text>
          <Button size="sm" style={styles.noFieldBtn} onPress={() => onNavigate('land-wizard')}>
            Setup First Land
          </Button>
        </View>
      )}

      {/* Local Mandi Prices */}
      <View style={styles.mandiSection}>
        <View style={styles.mandiHeader}>
          <Text style={styles.sectionTitle}>Local Mandi Price Index</Text>
          <Text style={styles.updateTime}>1h ago</Text>
        </View>
        <View style={styles.mandiGrid}>
          {[
            { name: '🌾 Paddy (Rice)', rate: '₹2,150', unit: 'Quintal', change: '+2.4%', up: true },
            { name: '🥜 Groundnut', rate: '₹6,820', unit: 'Quintal', change: '-0.8%', up: false },
            { name: 'Tomato (🍅)', rate: '₹1,900', unit: 'Crate', change: '+5.1%', up: true },
            { name: 'Brinjal (🍆)', rate: '₹2,450', unit: 'Quintal', change: '+1.2%', up: true }
          ].map((item, idx) => (
            <View key={idx} style={styles.mandiCard}>
              <View style={styles.mandiInfo}>
                <Text style={styles.mandiName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.mandiPriceRow}>
                  <Text style={styles.mandiRate}>{item.rate}</Text>
                  <Text style={styles.mandiUnit}>/{item.unit}</Text>
                </View>
              </View>
              <View style={[styles.changeBadge, { backgroundColor: item.up ? colors.toastSuccessBg : colors.toastErrorBg, borderColor: colors.border }]}>
                <Text style={[styles.changeText, { color: item.up ? colors.toastSuccessText : colors.toastErrorText }]}>{item.change}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Active Crop Stepper */}
      <View style={styles.trackerSection}>
        <Text style={styles.sectionTitle}>Active Crop Lifecycle Tracker</Text>
        
        {plantedCrops.length > 0 ? (
          plantedCrops.map((planted, index) => {
            const field = lands.find(l => l.id === planted.landId);
            const cropInfo = cropsDatabase.find(c => c.id === planted.cropId);
            if (!field || !cropInfo) return null;

            const isExpanded = expandedIndex === index;
            const totalDays = getDurationInDays(cropInfo.duration);
            const progressPercent = Math.min(100, Math.round((planted.elapsedDays / totalDays) * 100));
            const activeMilestone = getActiveMilestone(cropInfo.milestones, planted.elapsedDays);
            const isReadyToHarvest = planted.elapsedDays >= totalDays;

            return (
              <View 
                key={index} 
                style={[
                  styles.cropItemCard, 
                  isExpanded && styles.cropItemCardExpanded
                ]}
              >
                {/* Header tap toggler */}
                <TouchableOpacity 
                  onPress={() => toggleExpand(index)} 
                  style={styles.cropHeaderTap}
                  activeOpacity={0.8}
                >
                  <View style={styles.cropHeaderLeft}>
                    <View style={styles.cropIconBox}>
                      <Text style={styles.cropEmojiIcon}>{cropInfo.icon}</Text>
                    </View>
                    <View>
                      <Text style={styles.cropNameTitle}>{cropInfo.nameEnglish} • {field.name}</Text>
                      <Text style={styles.cropDaysSub}>
                        Day {planted.elapsedDays} of {totalDays} ({progressPercent}%) • {field.area}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cropHeaderRight}>
                    {isReadyToHarvest ? (
                      <View style={styles.harvestReadyBadge}>
                        <Text style={styles.harvestReadyText}>HARVEST 🌾</Text>
                      </View>
                    ) : (
                      <View style={styles.sownBadge}>
                        <Text style={styles.sownText}>SOWN</Text>
                      </View>
                    )}
                    <MaterialIcons 
                      name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={20} 
                      color="#9ca3af" 
                    />
                  </View>
                </TouchableOpacity>

                {/* Collapsed progress line */}
                {!isExpanded && (
                  <View style={styles.progressBarMinTrack}>
                    <View style={[styles.progressBarMinFill, { width: `${progressPercent}%` }]} />
                  </View>
                )}

                {/* Expanded contents */}
                {isExpanded && (
                  <View style={styles.expandedContent}>
                    
                    {/* Simulator Growth Controller */}
                    <View style={styles.simulatorPanel}>
                      <View style={styles.simulatorHeader}>
                        <Text style={styles.sownDateText}>Sown Date: {planted.sownDate}</Text>
                        <Text style={styles.simulatorDayIndicator}>Day {planted.elapsedDays} / {totalDays}</Text>
                      </View>
                      
                      <View style={styles.progressBarMaxTrack}>
                        <View style={[styles.progressBarMaxFill, { width: `${progressPercent}%` }]} />
                      </View>

                      {/* Adjust buttons */}
                      <View style={styles.adjustRow}>
                        <TouchableOpacity 
                          style={styles.adjustBtn} 
                          onPress={() => handleAdjustDays(index, -10, totalDays)}
                        >
                          <Text style={styles.adjustBtnText}>-10 Days</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.adjustBtn} 
                          onPress={() => handleAdjustDays(index, -1, totalDays)}
                        >
                          <Text style={styles.adjustBtnText}>-1 Day</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.adjustBtn} 
                          onPress={() => handleAdjustDays(index, 1, totalDays)}
                        >
                          <Text style={styles.adjustBtnText}>+1 Day</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.adjustBtn} 
                          onPress={() => handleAdjustDays(index, 10, totalDays)}
                        >
                          <Text style={styles.adjustBtnText}>+10 Days</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.simTipText}>
                        Simulate timeline speed using days adjustment buttons
                      </Text>
                    </View>

                    {/* Active Stage Indicator */}
                    {activeMilestone && (
                      <View style={styles.activeMilestoneCard}>
                        <View style={styles.activeMilestoneBadge}>
                          <Text style={styles.activeMilestoneBadgeText}>CURRENT STAGE: DAY {activeMilestone.day}</Text>
                        </View>
                        <Text style={styles.activeMilestoneTitle}>{activeMilestone.title}</Text>
                        <Text style={styles.activeMilestoneDesc}>{activeMilestone.description}</Text>
                      </View>
                    )}

                    {/* Stepper Timeline Checklist */}
                    <View style={styles.timelineStepper}>
                      <Text style={styles.stepperSectionTitle}>Timeline Checklist</Text>
                      <View style={styles.timelineStepperBody}>
                        
                        {cropInfo.milestones.map((m, mIdx) => {
                          const isCompleted = planted.elapsedDays > m.day;
                          const isActive = activeMilestone?.day === m.day;
                          
                          return (
                            <View key={mIdx} style={styles.stepRow}>
                              
                              {/* Step indicator dot/icon */}
                              <View style={styles.stepDotContainer}>
                                <View style={[
                                  styles.stepDot,
                                  isCompleted && styles.stepDotCompleted,
                                  isActive && styles.stepDotActive
                                ]}>
                                  {isCompleted ? (
                                    <MaterialIcons name="check" size={10} color={colors.primaryText} />
                                  ) : (
                                    <Text style={[styles.stepDotText, isActive && { color: colors.primary }]}>{m.day}</Text>
                                  )}
                                </View>
                                {mIdx < cropInfo.milestones.length - 1 && (
                                  <View style={[styles.stepLine, isCompleted && styles.stepLineCompleted]} />
                                )}
                              </View>


                              {/* Step text content */}
                              <View style={styles.stepContentTextCol}>
                                <Text style={[
                                  styles.stepTitle,
                                  isCompleted && styles.stepTitleCompleted,
                                  isActive && styles.stepTitleActive
                                ]}>
                                  Day {m.day}: {m.title}
                                </Text>
                                <Text style={[styles.stepDesc, isCompleted && styles.stepDescCompleted]}>
                                  {m.description}
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>

                    {/* Journal Logs Section */}
                    <View style={styles.journalCard}>
                      <View style={styles.journalHeader}>
                        <Text style={styles.journalTitle}>📖 Field Sowing Journal</Text>
                        <View style={styles.journalCountBadge}>
                          <Text style={styles.journalCountText}>{(planted.journalLogs || []).length} logs</Text>
                        </View>
                      </View>

                      {/* Entries List */}
                      <View style={styles.journalLogsList}>
                        {(planted.journalLogs || []).map((entry, eIdx) => (
                          <View key={eIdx} style={styles.journalEntryItem}>
                            <View style={styles.journalEntryMeta}>
                              <Text style={styles.journalEntryDay}>Day {entry.day}</Text>
                              <Text style={styles.journalEntryDate}>{entry.date}</Text>
                            </View>
                            <Text style={styles.journalEntryNote}>{entry.note}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Add new entry input */}
                      <View style={styles.addJournalInputRow}>
                        <TextInput
                          style={styles.journalTextInput}
                          placeholder="Log current farm observation..."
                          placeholderTextColor="#9ca3af"
                          value={journalNote}
                          onChangeText={setJournalNote}
                        />
                        <TouchableOpacity 
                          style={styles.addJournalBtn}
                          onPress={() => handleAddLog(index, planted.elapsedDays)}
                        >
                          <Text style={styles.addJournalBtnText}>Log</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.noActiveCropsCard}>
            <Text style={styles.noActiveCropsText}>No active crops currently monitored.</Text>
            <Text style={styles.noActiveCropsSub}>Add a field sowing log from the Recipes list to start tracking.</Text>
          </View>
        )}
      </View>
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
    gap: 20,
  },
  weatherCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  weatherLabel: {
    fontSize: fontScale(9),
    fontWeight: '900',
    color: colors.primaryLight,
    letterSpacing: 1.5,
  },
  weatherLocation: {
    fontSize: fontScale(18),
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  weatherSub: {
    fontSize: fontScale(11),
    color: colors.primaryLight,
    marginTop: 4,
    fontWeight: '550',
  },
  weatherRight: {
    alignItems: 'flex-end',
  },
  weatherTemp: {
    fontSize: fontScale(28),
    fontWeight: '900',
    color: '#ffffff',
  },
  weatherBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
  },
  weatherBadgeText: {
    fontSize: fontScale(9),
    fontWeight: '700',
    color: '#ffffff',
  },
  weatherDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 12,
  },
  weatherFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherFooterItem: {
    fontSize: fontScale(9),
    fontWeight: '700',
    color: colors.primaryLight,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  statLabel: {
    fontSize: fontScale(9),
    fontWeight: '850',
    color: colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: fontScale(16),
    fontWeight: '900',
    color: colors.text,
    marginTop: 4,
  },
  statSub: {
    fontSize: fontScale(9),
    fontWeight: '600',
    color: colors.subtext,
    marginTop: 2,
  },
  analyticsCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: fontScale(12),
    fontWeight: '900',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardBadgeText: {
    fontSize: fontScale(9),
    fontWeight: '700',
    color: colors.text,
  },
  npkContainer: {
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  npkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  npkLabelCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '32%',
    alignItems: 'center',
  },
  npkName: {
    fontSize: fontScale(10),
    fontWeight: '800',
    color: colors.text,
  },
  npkPercent: {
    fontSize: fontScale(10),
    fontWeight: '900',
    color: colors.text,
  },
  npkBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginLeft: 12,
    overflow: 'hidden',
  },
  npkBar: {
    height: '105%',
    borderRadius: 3,
  },
  moistureChartContainer: {
    marginTop: 20,
  },
  chartTitle: {
    fontSize: fontScale(10),
    fontWeight: '850',
    color: colors.subtext,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  chartBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingTop: 16,
    paddingHorizontal: 10,
    paddingBottom: 8,
    height: 90,
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValText: {
    fontSize: fontScale(8),
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  chartBarTrack: {
    width: 8,
    height: 48,
    backgroundColor: colors.border,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBarFill: {
    width: '105%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  barDayText: {
    fontSize: fontScale(8),
    fontWeight: '700',
    color: colors.subtext,
    marginTop: 4,
  },
  insightCard: {
    backgroundColor: colors.toastWarningBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  insightEmoji: {
    fontSize: fontScale(20),
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: fontScale(12),
    fontWeight: '800',
    color: colors.toastWarningText,
  },
  insightDesc: {
    fontSize: fontScale(10.5),
    color: colors.text,
    lineHeight: 16,
    marginTop: 2,
    fontWeight: '550',
  },
  insightBold: {
    fontWeight: '900',
  },
  noFieldCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  noFieldEmoji: {
    fontSize: fontScale(32),
  },
  noFieldTitle: {
    fontSize: fontScale(13),
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  noFieldDesc: {
    fontSize: fontScale(11),
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 6,
    paddingHorizontal: 8,
  },
  noFieldBtn: {
    marginTop: 16,
    width: '60%',
  },
  mandiSection: {
    gap: 10,
  },
  mandiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: fontScale(10),
    fontWeight: '850',
    color: colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  updateTime: {
    fontSize: fontScale(8.5),
    color: colors.subtext,
    fontWeight: '600',
  },
  mandiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mandiCard: {
    width: '48.5%',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mandiInfo: {
    flex: 1,
    marginRight: 4,
  },
  mandiName: {
    fontSize: fontScale(10),
    fontWeight: '800',
    color: colors.text,
  },
  mandiPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 3,
  },
  mandiRate: {
    fontSize: fontScale(12),
    fontWeight: '900',
    color: colors.text,
  },
  mandiUnit: {
    fontSize: fontScale(8),
    color: colors.subtext,
    fontWeight: '600',
  },
  changeBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  changeText: {
    fontSize: fontScale(8),
    fontWeight: '900',
  },
  trackerSection: {
    gap: 12,
  },
  cropItemCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  cropItemCardExpanded: {
    borderColor: colors.primary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cropHeaderTap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cropHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  cropIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cropEmojiIcon: {
    fontSize: fontScale(20),
  },
  cropNameTitle: {
    fontSize: fontScale(12),
    fontWeight: '800',
    color: colors.text,
  },
  cropDaysSub: {
    fontSize: fontScale(10),
    color: colors.subtext,
    marginTop: 2,
    fontWeight: '550',
  },
  cropHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  harvestReadyBadge: {
    backgroundColor: colors.toastWarningBg,
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  harvestReadyText: {
    fontSize: fontScale(8),
    fontWeight: '900',
    color: colors.toastWarningText,
  },
  sownBadge: {
    backgroundColor: colors.primaryLight,
    borderWidth: 0.5,
    borderColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  sownText: {
    fontSize: fontScale(8),
    fontWeight: '900',
    color: colors.primaryText === '#ffffff' ? colors.primary : colors.primaryText,
  },
  progressBarMinTrack: {
    height: 3,
    backgroundColor: colors.border,
    width: '100%',
  },
  progressBarMinFill: {
    height: '105%',
    backgroundColor: colors.primary,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cardElevated,
    padding: 16,
    gap: 16,
  },
  simulatorPanel: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  simulatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sownDateText: {
    fontSize: fontScale(9),
    color: colors.subtext,
    fontWeight: '600',
  },
  simulatorDayIndicator: {
    fontSize: fontScale(10),
    fontWeight: '800',
    color: colors.primary,
  },
  progressBarMaxTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarMaxFill: {
    height: '105%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  adjustRow: {
    flexDirection: 'row',
    gap: 6,
  },
  adjustBtn: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  adjustBtnText: {
    fontSize: fontScale(8.5),
    fontWeight: '800',
    color: colors.text,
  },
  simTipText: {
    fontSize: fontScale(7.5),
    color: colors.subtext,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  activeMilestoneCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  activeMilestoneBadge: {
    backgroundColor: colors.primaryLight,
    borderWidth: 0.5,
    borderColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  activeMilestoneBadgeText: {
    fontSize: fontScale(7.5),
    fontWeight: '900',
    color: colors.primaryText === '#ffffff' ? colors.primary : colors.primaryText,
  },
  activeMilestoneTitle: {
    fontSize: fontScale(11.5),
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  activeMilestoneDesc: {
    fontSize: fontScale(10),
    color: colors.text,
    lineHeight: 14,
  },
  timelineStepper: {
    gap: 10,
  },
  stepperSectionTitle: {
    fontSize: fontScale(9),
    fontWeight: '900',
    color: colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timelineStepperBody: {
    paddingLeft: 12,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
  },
  stepDotContainer: {
    alignItems: 'center',
  },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepDotCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepDotActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  stepDotText: {
    fontSize: fontScale(7),
    fontWeight: '800',
    color: colors.subtext,
  },
  stepLine: {
    width: 2,
    backgroundColor: colors.border,
    flex: 1,
    position: 'absolute',
    top: 18,
    bottom: -16,
    zIndex: 1,
  },
  stepLineCompleted: {
    backgroundColor: colors.primary,
  },
  stepContentTextCol: {
    flex: 1,
    paddingTop: 1,
  },
  stepTitle: {
    fontSize: fontScale(10.5),
    fontWeight: '700',
    color: colors.text,
  },
  stepTitleCompleted: {
    color: colors.subtext,
    textDecorationLine: 'line-through',
  },
  stepTitleActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  stepDesc: {
    fontSize: fontScale(9),
    color: colors.subtext,
    marginTop: 2.5,
    lineHeight: 13,
  },
  stepDescCompleted: {
    color: colors.subtext,
  },
  journalCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 12,
    gap: 10,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  journalTitle: {
    fontSize: fontScale(10),
    fontWeight: '900',
    color: colors.text,
    flex: 1,
  },
  journalCountBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  journalCountText: {
    fontSize: fontScale(8),
    fontWeight: '900',
    color: colors.primaryText === '#ffffff' ? colors.primary : colors.primaryText,
  },
  journalLogsList: {
    maxHeight: 120,
    overflow: 'scroll',
    gap: 8,
  },
  journalEntryItem: {
    backgroundColor: colors.background,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 8,
    gap: 2,
  },
  journalEntryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  journalEntryDay: {
    fontSize: fontScale(8.5),
    fontWeight: '900',
    color: colors.primary,
  },
  journalEntryDate: {
    fontSize: fontScale(8),
    color: colors.subtext,
    fontWeight: '600',
  },
  journalEntryNote: {
    fontSize: fontScale(9),
    color: colors.text,
    lineHeight: 13,
    marginTop: 1,
  },
  addJournalInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  journalTextInput: {
    flex: 1,
    height: 32,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: fontScale(10),
    color: colors.text,
  },
  addJournalBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  addJournalBtnText: {
    fontSize: fontScale(10),
    fontWeight: '800',
    color: colors.primaryText,
  },
  noActiveCropsCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  noActiveCropsText: {
    fontSize: fontScale(11.5),
    fontWeight: '700',
    color: colors.text,
  },
  noActiveCropsSub: {
    fontSize: fontScale(9.5),
    color: colors.subtext,
    textAlign: 'center',
    marginTop: 4,
  }
});

