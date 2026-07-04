import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  LayoutAnimation,
  Modal,
  Alert,
  Switch
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from '../components/Button';
import { useStore } from '../store/useStore';
import { useTheme } from '../store/useThemeStore';
import { cropsDatabase } from '../data/crops';

const getLandTypeLabel = (type) => {
  if (type === 'wetland') return 'நஞ்சை நிலம் (Wetland)';
  if (type === 'dryland') return 'புஞ்சை நிலம் (Dryland)';
  if (type === 'garden') return 'தோட்டம் (Garden Land)';
  return type;
};

export const ProfileTab = ({ onNavigate }) => {
  const user = useStore(state => state.user);
  const lands = useStore(state => state.lands);
  const inventory = useStore(state => state.inventory);
  const customCrops = useStore(state => state.customCrops);
  const harvestHistory = useStore(state => state.harvestHistory);
  
  const updateUserProfile = useStore(state => state.updateUserProfile);
  const addCustomCrop = useStore(state => state.addCustomCrop);
  const removeCustomCrop = useStore(state => state.removeCustomCrop);
  const addPlantedCrop = useStore(state => state.addPlantedCrop);
  const triggerToast = useStore(state => state.triggerToast);
  const logoutAction = useStore(state => state.logout);
  const resetAppData = useStore(state => state.resetAppData);

  // Appearance states from custom theme store
  const { 
    themeMode, 
    pureBlack, 
    colorTheme, 
    fontSize,
    colors, 
    fontScale,
    isDark,
    setThemeMode, 
    setPureBlack, 
    setColorTheme,
    setFontSize
  } = useTheme();

  const styles = getStyles(colors, fontScale, isDark);


  // Sub-views state: 'main' | 'crops-list' | 'crop-create' | 'harvests-history' | 'inventory'
  const [subView, setSubView] = useState('main');

  // Modal / form states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Farmer');
  const [editEmail, setEditEmail] = useState(user?.email || 'farmer@sprout.com');

  // Sowing log modal state
  const [sowModalOpen, setSowModalOpen] = useState(false);
  const [sowCrop, setSowCrop] = useState(null);
  const [sowLandId, setSowLandId] = useState('');

  // Search filter inside crops list
  const [cropSearch, setCropSearch] = useState('');
  const [expandedCropId, setExpandedCropId] = useState(null);

  // New Custom Crop Form state
  const [formNameEnglish, setFormNameEnglish] = useState('');
  const [formNameTamil, setFormNameTamil] = useState('');
  const [formDuration, setFormDuration] = useState('90');
  const [formInstructions, setFormInstructions] = useState('');
  const [formLandType, setFormLandType] = useState('wetland');
  const [formSoilType, setFormSoilType] = useState('alluvial');

  // Inventory modal state
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [invItemName, setInvItemName] = useState('');
  const [invItemType, setInvItemType] = useState('seed');
  const [invItemQuantity, setInvItemQuantity] = useState('10');
  const [invItemUnit, setInvItemUnit] = useState('kg');
  const addInventoryItem = useStore(state => state.addInventoryItem);
  const removeInventoryItem = useStore(state => state.removeInventoryItem);

  const handleUpdateProfile = () => {
    updateUserProfile({ name: editName, email: editEmail });
    setEditProfileOpen(false);
    triggerToast('Profile updated successfully!', 'success');
  };

  const handleLogout = () => {
    logoutAction();
    onNavigate('login');
    triggerToast('Signed out successfully.', 'info');
  };

  // Combine standard + custom crops
  const allCrops = [...cropsDatabase, ...customCrops];
  const filteredCrops = allCrops.filter(c => 
    c.nameEnglish.toLowerCase().includes(cropSearch.toLowerCase()) || 
    c.nameTamil.includes(cropSearch)
  );

  const handleCreateCustomCrop = () => {
    if (!formNameEnglish.trim()) {
      triggerToast('Crop name is required', 'warning');
      return;
    }
    const newCrop = {
      id: `custom_${Math.random().toString(36).substring(2, 9)}`,
      nameEnglish: formNameEnglish,
      nameTamil: formNameTamil || formNameEnglish,
      landTypeCompatibility: [formLandType],
      soilTypeCompatibility: [formSoilType],
      recommendedInCurrentSeason: false,
      wateringRequirement: 'Moderate watering',
      duration: `${formDuration} Days`,
      instructions: formInstructions || 'No custom instruction provided.',
      icon: '🌱',
      isCustom: true,
      milestones: [
        { day: 1, title: 'Sowing/Planting', description: 'Prepare beds and sow custom crop seeds.' },
        { day: Math.round(parseInt(formDuration) / 2), title: 'Mid-Stage Weeding', description: 'Check soil nutrients and remove competing weeds.' },
        { day: parseInt(formDuration), title: 'Harvest Season', description: 'Harvest fully matured crop yields.' }
      ]
    };

    addCustomCrop(newCrop);
    setFormNameEnglish('');
    setFormNameTamil('');
    setFormDuration('90');
    setFormInstructions('');
    setSubView('crops-list');
    triggerToast(`Recipe "${newCrop.nameEnglish}" defined!`, 'success');
  };

  const handleOpenSowModal = (crop) => {
    if (lands.length === 0) {
      triggerToast('Please register a field first in the onboarding wizard!', 'warning');
      return;
    }
    setSowCrop(crop);
    setSowLandId(lands[0].id); // default selection
    setSowModalOpen(true);
  };

  const handleConfirmSow = () => {
    if (!sowLandId) return;
    
    const newPlanted = {
      landId: sowLandId,
      cropId: sowCrop.id,
      elapsedDays: 1,
      sownDate: new Date().toLocaleDateString(),
      journalLogs: [
        { day: 1, date: new Date().toLocaleDateString(), note: `Sowed ${sowCrop.nameEnglish} seeds in field. Sowing timeline tracking initialized.` }
      ]
    };
    
    addPlantedCrop(newPlanted);
    setSowModalOpen(false);
    triggerToast(`Sowing logged! Started tracking ${sowCrop.nameEnglish}.`, 'success');
    
    // Automatically switch subview back to main, and navigation will take user to home tab
    setSubView('main');
  };

  const handleAddInventoryItem = () => {
    if (!invItemName.trim()) {
      triggerToast('Item name is required', 'warning');
      return;
    }
    const newItem = {
      id: `inv-${Math.random().toString(36).substring(2, 9)}`,
      name: invItemName,
      type: invItemType,
      quantity: parseFloat(invItemQuantity) || 0,
      unit: invItemUnit,
      lastUpdated: new Date().toLocaleDateString()
    };
    addInventoryItem(newItem);
    setInvItemName('');
    setInvItemQuantity('10');
    setInventoryModalOpen(false);
    triggerToast(`Added "${newItem.name}" to inventory stock.`, 'success');
  };

  const handleDeleteInventory = (id, name) => {
    Alert.alert(
      'Delete Stock',
      `Are you sure you want to remove "${name}" from stock inventory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            removeInventoryItem(id);
            triggerToast(`Removed "${name}" from stock list.`, 'info');
          }
        }
      ]
    );
  };

  const handleDeleteCustomCrop = (id, name) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to remove custom recipe "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            removeCustomCrop(id);
            triggerToast(`Removed "${name}" recipe.`, 'info');
          }
        }
      ]
    );
  };

  const toggleCropExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCropId(expandedCropId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      
      {/* 1. Main View */}
      {subView === 'main' && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* User profile card */}
          <View style={styles.profileHeaderCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>{user?.avatar || '🧑‍🌾'}</Text>
            </View>
            <View style={styles.profileInfoText}>
              <Text style={styles.userName}>{user?.name || 'Farmer'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'farmer@sprout.com'}</Text>
            </View>
            <Button size="sm" variant="outline" style={styles.editBtn} onPress={() => setEditProfileOpen(true)}>
              Edit Profile Info
            </Button>
          </View>

          {/* Quick Menu items cards */}
          <View style={styles.menuGrid}>
            
            {/* Custom Recipes Card */}
            <View style={styles.menuItemCard}>
              <View style={styles.menuItemHeader}>
                <Text style={styles.menuItemTitle}>🌾 CROP RECIPE CREATOR</Text>
                <View style={styles.menuItemBadge}>
                  <Text style={styles.menuItemBadgeText}>{customCrops.length} custom</Text>
                </View>
              </View>
              <Text style={styles.menuItemDesc}>
                Define custom recipes with specialized milestones, fertilizers, and watering alerts.
              </Text>
              <View style={styles.menuItemBtnRow}>
                <Button style={styles.primaryMenuBtn} onPress={() => setSubView('crops-list')}>
                  <Text >View recipes</Text>
                </Button>
                <TouchableOpacity style={styles.secondaryMenuBtn} onPress={() => setSubView('crop-create')}>
                  <Text style={styles.secondaryMenuBtnText}>＋ Define new</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Inventory Stock Card */}
            <View style={styles.menuItemCard}>
              <View style={styles.menuItemHeader}>
                <Text style={styles.menuItemTitle}>📦 INPUT STOCK INVENTORY</Text>
                <View style={styles.menuItemBadge}>
                  <Text style={styles.menuItemBadgeText}>{inventory.length} items</Text>
                </View>
              </View>
              <Text style={styles.menuItemDesc}>
                Manage stock levels of seeds and organic/chemical fertilizers with automatic logs deductions.
              </Text>
              <TouchableOpacity style={styles.singleFullBtn} onPress={() => setSubView('inventory')}>
                <Text style={styles.singleFullBtnText}>Manage stock inventory</Text>
              </TouchableOpacity>
            </View>

            {/* Yield Archives Card */}
            <View style={styles.menuItemCard}>
              <View style={styles.menuItemHeader}>
                <Text style={styles.menuItemTitle}>📜 HISTORIC YIELD ARCHIVES</Text>
                <View style={styles.menuItemBadge}>
                  <Text style={styles.menuItemBadgeText}>{harvestHistory.length} cycles</Text>
                </View>
              </View>
              <Text style={styles.menuItemDesc}>
                Review final yields, dates, and historical journals recorded during your past harvest seasons.
              </Text>
              <TouchableOpacity style={styles.singleFullBtn} onPress={() => setSubView('harvests-history')}>
                <Text style={styles.singleFullBtnText}>View yield history archives</Text>
              </TouchableOpacity>
            </View>

            {/* Appearance Settings Card */}
            <View style={styles.menuItemCard}>
              <View style={styles.menuItemHeader}>
                <Text style={styles.menuItemTitle}>🎨 APPEARANCE SETTINGS</Text>
              </View>
              
              {/* Theme Mode Segmented Controller */}
              <View style={styles.settingOption}>
                <Text style={styles.settingOptionLabel}>Theme Mode</Text>
                <View style={styles.segmentedRow}>
                  {['system', 'light', 'dark'].map((mode) => (
                    <TouchableOpacity 
                      key={mode} 
                      style={[styles.segmentedBtn, themeMode === mode && styles.segmentedBtnActive]}
                      onPress={() => {
                        setThemeMode(mode);
                        triggerToast(`Theme mode changed to ${mode}!`, 'success');
                      }}
                    >
                      <Text style={[styles.segmentedBtnText, themeMode === mode && styles.segmentedBtnTextActive]}>
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Pure Black Switch */}
              <View style={styles.switchOptionRow}>
                <View style={styles.switchOptionTextCol}>
                  <Text style={styles.switchOptionTitle}>Pure Black Mode</Text>
                  <Text style={styles.switchOptionDesc}>Deep black canvas for OLED battery savings.</Text>
                </View>
                <Switch
                  value={pureBlack}
                  onValueChange={(val) => {
                    setPureBlack(val);
                    triggerToast(`Pure Black Mode ${val ? 'enabled' : 'disabled'}!`, 'info');
                  }}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={pureBlack ? colors.primary : colors.border}
                />
              </View>

              {/* Accent Color Palette */}
              <View style={styles.settingOption}>
                <Text style={styles.settingOptionLabel}>Agri Accent Color</Text>
                <View style={styles.paletteRow}>
                  {[
                    { id: 'forest', color: '#059669', name: 'Forest' },
                    { id: 'clay', color: '#78350f', name: 'Clay' },
                    { id: 'wheat', color: '#eab308', name: 'Wheat' },
                    { id: 'ocean', color: '#0ea5e9', name: 'Ocean' },
                    { id: 'grape', color: '#9333ea', name: 'Grape' }
                  ].map((theme) => (
                    <TouchableOpacity
                      key={theme.id}
                      style={[
                        styles.colorCircle, 
                        { backgroundColor: theme.color },
                        colorTheme === theme.id && styles.colorCircleActive
                      ]}
                      onPress={() => {
                        setColorTheme(theme.id);
                        triggerToast(`Theme color changed to ${theme.name}!`, 'success');
                      }}
                    >
                      {colorTheme === theme.id && (
                        <MaterialIcons name="check" size={14} color="#ffffff" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* App Font Size Segmented Controller */}
              <View style={styles.settingOption}>
                <Text style={styles.settingOptionLabel}>App Font Size</Text>
                <View style={styles.segmentedRow}>
                  {['small', 'medium', 'large', 'extra-large'].map((sz) => (
                    <TouchableOpacity 
                      key={sz} 
                      style={[styles.segmentedBtn, fontSize === sz && styles.segmentedBtnActive]}
                      onPress={() => {
                        setFontSize(sz);
                        triggerToast(`Font size changed to ${sz}!`, 'success');
                      }}
                    >
                      <Text style={[styles.segmentedBtnText, fontSize === sz && styles.segmentedBtnTextActive, { textTransform: 'capitalize' }]}>
                        {sz}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* About Sprout Card */}
            <View style={styles.menuItemCard}>
              <View style={styles.menuItemHeader}>
                <Text style={styles.menuItemTitle}>ℹ️ ABOUT SPROUT</Text>
              </View>
              
              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>App Version</Text>
                <Text style={styles.aboutValue}>v1.2.0 (Stable)</Text>
              </View>
              
              <View style={styles.aboutRow}>
                <Text style={styles.aboutLabel}>Source Code</Text>
                <TouchableOpacity onPress={() => triggerToast('Link clicked: github.com/sprout-agri/app', 'info')}>
                  <Text style={styles.aboutLinkText}>GitHub Repository 🔗</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.resetDivider} />
              
              <TouchableOpacity 
                style={styles.resetBtn}
                onPress={() => {
                  Alert.alert(
                    'Reset App Data',
                    'Are you sure you want to delete all registered lands, inventory logs, and custom crop recipes? This cannot be undone.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Reset Everything', 
                        style: 'destructive',
                        onPress: () => {
                          resetAppData();
                          setSubView('main');
                          triggerToast('All land records and custom recipes reset.', 'info');
                        }
                      }
                    ]
                  );
                }}
              >
                <Text style={styles.resetBtnText}>🗑️ Reset App Data</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Out Card */}
            <View style={styles.signOutCard}>
              <Button 
                variant="outline" 
                style={styles.signOutBtn} 
                textStyle={styles.signOutBtnText}
                onPress={handleLogout}
              >
                Sign Out from App
              </Button>
            </View>

          </View>
        </ScrollView>
      )}

      {/* 2. Sub-view: Crops Recipes list */}
      {subView === 'crops-list' && (
        <View style={styles.subContainer}>
          <View style={styles.subHeader}>
            <TouchableOpacity onPress={() => setSubView('main')} style={styles.subBackBtn}>
              <MaterialIcons name="arrow-back-ios" size={18} color={colors.subtext} />
            </TouchableOpacity>
            <Text style={styles.subHeaderTitle}>Crop Recipes Catalog</Text>
            <View style={styles.backButtonPlaceholder} />
          </View>
          
          <View style={styles.searchBarWrapper}>
            <MaterialIcons name="search" size={16} color={colors.subtext} style={styles.searchIcon} />
            <TextInput
              style={styles.searchBarInput}
              placeholder="Search crop recipes..."
              placeholderTextColor={colors.placeholder}
              value={cropSearch}
              onChangeText={setCropSearch}
            />
          </View>

          <ScrollView contentContainerStyle={styles.listScrollContent} showsVerticalScrollIndicator={false}>
            {filteredCrops.map((crop) => {
              const isExpanded = expandedCropId === crop.id;
              return (
                <View key={crop.id} style={[styles.cropListCard, isExpanded && styles.cropListCardActive]}>
                  
                  {/* Collapsed tap row */}
                  <TouchableOpacity onPress={() => toggleCropExpand(crop.id)} style={styles.cropListHeaderTap}>
                    <Text style={styles.cropListEmoji}>{crop.icon || '🌱'}</Text>
                    <View style={styles.cropListInfoCol}>
                      <Text style={styles.cropListTitle}>{crop.nameEnglish}</Text>
                      <Text style={styles.cropListSub}>{crop.nameTamil} • {crop.duration}</Text>
                    </View>
                    <View style={styles.cropListRightSide}>
                      {crop.isCustom ? (
                        <View style={styles.customCropRecipeBadge}>
                          <Text style={styles.customCropRecipeBadgeText}>CUSTOM</Text>
                        </View>
                      ) : null}
                      <MaterialIcons name={isExpanded ? "expand-less" : "expand-more"} size={20} color={colors.subtext} />
                    </View>
                  </TouchableOpacity>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <View style={styles.cropExpandedDetail}>
                      <Text style={styles.cropDetailDesc}>{crop.instructions}</Text>
                      
                      <View style={styles.detailsMetaGrid}>
                        <View style={styles.detailMetaItem}>
                          <Text style={styles.detailMetaLabel}>COMPATIBLE LAND</Text>
                          <Text style={styles.detailMetaVal}>{crop.landTypeCompatibility.join(', ')}</Text>
                        </View>
                        <View style={styles.detailMetaItem}>
                          <Text style={styles.detailMetaLabel}>SOIL TYPES</Text>
                          <Text style={styles.detailMetaVal}>{crop.soilTypeCompatibility.join(', ')}</Text>
                        </View>
                        <View style={styles.detailMetaItem}>
                          <Text style={styles.detailMetaLabel}>WATER PROFILE</Text>
                          <Text style={styles.detailMetaVal}>{crop.wateringRequirement || 'Moderate'}</Text>
                        </View>
                        {crop.yieldExpectancy ? (
                          <View style={styles.detailMetaItem}>
                            <Text style={styles.detailMetaLabel}>YIELD EXPECTANCY</Text>
                            <Text style={styles.detailMetaVal}>{crop.yieldExpectancy}</Text>
                          </View>
                        ) : null}
                      </View>

                      {/* Stepper Timeline Milestones info */}
                      <View style={styles.detailMilestonesBlock}>
                        <Text style={styles.detailSectionLabel}>Growth Stages Checklist</Text>
                        {crop.milestones?.map((m, idx) => (
                          <View key={idx} style={styles.mRowDetail}>
                            <View style={styles.mDotDetail}>
                              <Text style={styles.mDotText}>{m.day}</Text>
                            </View>
                            <View style={styles.mTextColDetail}>
                              <Text style={styles.mTitleDetail}>Day {m.day}: {m.title}</Text>
                              <Text style={styles.mDescDetail}>{m.description}</Text>
                            </View>
                          </View>
                        ))}
                      </View>

                      {/* Action buttons inside detail */}
                      <View style={styles.recipeCardActionRow}>
                        {crop.isCustom ? (
                          <TouchableOpacity 
                            style={styles.recipeDeleteBtn}
                            onPress={() => handleDeleteCustomCrop(crop.id, crop.nameEnglish)}
                          >
                            <Text style={styles.recipeDeleteText}>Delete Recipe</Text>
                          </TouchableOpacity>
                        ) : null}
                        
                        <TouchableOpacity 
                          style={styles.sowStartBtn}
                          onPress={() => handleOpenSowModal(crop)}
                        >
                          <Text style={styles.sowStartBtnText}>Start Sowing Tracking</Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* 3. Sub-view: Define Custom Crop Form */}
      {subView === 'crop-create' && (
        <View style={styles.subContainer}>
          <View style={styles.subHeader}>
            <TouchableOpacity onPress={() => setSubView('main')} style={styles.subBackBtn}>
              <MaterialIcons name="arrow-back-ios" size={18} color={colors.subtext} />
            </TouchableOpacity>
            <Text style={styles.subHeaderTitle}>Define Custom Crop Recipe</Text>
            <View style={styles.backButtonPlaceholder} />
          </View>
          
          <ScrollView contentContainerStyle={styles.formScrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Crop Identifier Name (English)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Basmati Paddy"
                placeholderTextColor={colors.placeholder}
                value={formNameEnglish}
                onChangeText={setFormNameEnglish}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Crop Name (Tamil/Regional)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. பாஸ்மதி நெல்"
                placeholderTextColor={colors.placeholder}
                value={formNameTamil}
                onChangeText={setFormNameTamil}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Total Growth Duration (Days)</Text>
              <TextInput
                style={styles.formInput}
                keyboardType="numeric"
                placeholder="e.g. 90"
                placeholderTextColor={colors.placeholder}
                value={formDuration}
                onChangeText={setFormDuration}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Instructions / Sowing Steps</Text>
              <TextInput
                style={[styles.formInput, styles.textAreaInput]}
                multiline
                numberOfLines={3}
                placeholder="Add primary steps for preparing nursery beds and transplanting..."
                placeholderTextColor={colors.placeholder}
                value={formInstructions}
                onChangeText={setFormInstructions}
              />
            </View>

            {/* Land/Soil Picker Selectors (clean toggle buttons) */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Suitable Land Profile</Text>
              <View style={styles.horizontalSelectRow}>
                {['wetland', 'dryland', 'garden'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.selectBtnPill, formLandType === type && styles.selectBtnPillActive]}
                    onPress={() => setFormLandType(type)}
                  >
                    <Text style={[styles.selectBtnPillText, formLandType === type && styles.selectBtnPillTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Predominant Soil Type</Text>
              <View style={styles.horizontalSelectRow}>
                {['alluvial', 'red', 'black', 'grey'].map((soil) => (
                  <TouchableOpacity
                    key={soil}
                    style={[styles.selectBtnPill, formSoilType === soil && styles.selectBtnPillActive]}
                    onPress={() => setFormSoilType(soil)}
                  >
                    <Text style={[styles.selectBtnPillText, formSoilType === soil && styles.selectBtnPillTextActive]}>
                      {soil}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Hint message */}
            <View style={styles.formTipCard}>
              <Text style={styles.formTipText}>
                💡 Sprout will automatically generate 3 milestones checklist based on the duration you input (Day 1: Planting, Mid-stage Weeding, and Final harvest).
              </Text>
            </View>

            <Button style={styles.saveRecipeBtn} onPress={handleCreateCustomCrop}>
              Create Crop Recipe
            </Button>
          </ScrollView>
        </View>
      )}

      {/* 4. Sub-view: Historic Yield Archives */}
      {subView === 'harvests-history' && (
        <View style={styles.subContainer}>
          <View style={styles.subHeader}>
            <TouchableOpacity onPress={() => setSubView('main')} style={styles.subBackBtn}>
              <MaterialIcons name="arrow-back-ios" size={18} color={colors.subtext} />
            </TouchableOpacity>
            <Text style={styles.subHeaderTitle}>Historic Yield Archives</Text>
            <View style={styles.backButtonPlaceholder} />
          </View>
          
          <ScrollView contentContainerStyle={styles.listScrollContent} showsVerticalScrollIndicator={false}>
            {harvestHistory.map((history) => (
              <View key={history.id} style={styles.historyCard}>
                <View style={styles.historyTopRow}>
                  <View style={styles.historyIconBox}>
                    <Text style={styles.historyEmoji}>{history.cropIcon}</Text>
                  </View>
                  <View>
                    <Text style={styles.historyTitle}>{history.cropName} • {history.landName}</Text>
                    <Text style={styles.historySub}>Yield Expectancy: {history.yieldEst}</Text>
                  </View>
                </View>
                <View style={styles.historyDivider} />
                <View style={styles.historyGrid}>
                  <View style={styles.historyGridItem}>
                    <Text style={styles.historyGridLabel}>SOWN DATE</Text>
                    <Text style={styles.historyGridVal}>{history.sownDate}</Text>
                  </View>
                  <View style={styles.historyGridItem}>
                    <Text style={styles.historyGridLabel}>HARVEST DATE</Text>
                    <Text style={styles.historyGridVal}>{history.harvestDate}</Text>
                  </View>
                  <View style={styles.historyGridItem}>
                    <Text style={styles.historyGridLabel}>GROWTH DURATION</Text>
                    <Text style={styles.historyGridVal}>{history.durationDays} Days</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 5. Sub-view: Input Stock Inventory */}
      {subView === 'inventory' && (
        <View style={styles.subContainer}>
          <View style={styles.subHeader}>
            <TouchableOpacity onPress={() => setSubView('main')} style={styles.subBackBtn}>
              <MaterialIcons name="arrow-back-ios" size={18} color={colors.subtext} />
            </TouchableOpacity>
            <Text style={styles.subHeaderTitle}>Input Stock Inventory</Text>
            <View style={styles.backButtonPlaceholder} />
          </View>

          <View style={styles.addInvBtnRow}>
            <TouchableOpacity style={styles.addInvButton} onPress={() => setInventoryModalOpen(true)}>
              <Text style={styles.addInvButtonText}>＋ Add Stock Item</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.listScrollContent} showsVerticalScrollIndicator={false}>
            {inventory.map((item) => (
              <View key={item.id} style={styles.invCard}>
                <View style={styles.invInfoCol}>
                  <View style={styles.invTitleRow}>
                    <Text style={styles.invName}>{item.name}</Text>
                    <View style={styles.invTypeBadge}>
                      <Text style={styles.invTypeBadgeText}>{item.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.invLastUpdated}>Updated: {item.lastUpdated}</Text>
                </View>
                <View style={styles.invActionsRow}>
                  <Text style={styles.invStockQty}>{item.quantity} {item.unit}</Text>
                  <TouchableOpacity 
                    style={styles.invDeleteBtn}
                    onPress={() => handleDeleteInventory(item.id, item.name)}
                  >
                    <MaterialIcons name="delete" size={18} color={colors.toastErrorText} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Modals overlays */}
      {/* A. Edit Profile Modal */}
      <Modal visible={editProfileOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile Info</Text>
            
            <View style={styles.modalInputGroup}>
              <Text style={styles.inputLabel}>Farmer Full Name</Text>
              <TextInput
                style={styles.formInput}
                value={editName}
                onChangeText={setEditName}
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.formInput}
                keyboardType="email-address"
                value={editEmail}
                onChangeText={setEditEmail}
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <Button variant="outline" style={styles.modalHalfBtn} onPress={() => setEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button style={styles.modalHalfBtn} onPress={handleUpdateProfile}>
                Save Changes
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* B. Confirm Sowing Dialog Modal */}
      <Modal visible={sowModalOpen} animationType="fade" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.sowDialogContent}>
            <Text style={styles.sowDialogTitle}>Sow Crop Tracker</Text>
            <Text style={styles.sowDialogSub}>
              Select which field/plot to start sowing <Text style={styles.boldText}>{sowCrop?.nameEnglish}</Text>:
            </Text>

            <View style={styles.landsPickerContainer}>
              {lands.map((land) => (
                <TouchableOpacity 
                  key={land.id} 
                  style={[
                    styles.landSowPill,
                    sowLandId === land.id && styles.landSowPillActive
                  ]}
                  onPress={() => setSowLandId(land.id)}
                >
                  <View style={styles.landSowLabelCol}>
                    <Text style={[styles.landSowName, sowLandId === land.id && styles.landSowNameActive]}>
                      {land.name}
                    </Text>
                    <Text style={styles.landSowSub}>
                      {getLandTypeLabel(land.landType)} • {land.area}
                    </Text>
                  </View>
                  {sowLandId === land.id && <MaterialIcons name="check-circle" size={18} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBtnRow}>
              <Button variant="outline" style={styles.modalHalfBtn} onPress={() => setSowModalOpen(false)}>
                Cancel
              </Button>
              <Button style={styles.modalHalfBtn} onPress={handleConfirmSow}>
                Start Tracking
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* C. Add Inventory Item Modal */}
      <Modal visible={inventoryModalOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Input Stock Item</Text>
            
            <View style={styles.modalInputGroup}>
              <Text style={styles.inputLabel}>Item Name</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. CO-51 Paddy Seeds"
                placeholderTextColor={colors.placeholder}
                value={invItemName}
                onChangeText={setInvItemName}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.inputLabel}>Item Type</Text>
              <View style={styles.horizontalSelectRow}>
                {['seed', 'fertilizer'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.selectBtnPill, invItemType === type && styles.selectBtnPillActive]}
                    onPress={() => setInvItemType(type)}
                  >
                    <Text style={[styles.selectBtnPillText, invItemType === type && styles.selectBtnPillTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.inputLabel}>Quantity</Text>
              <TextInput
                style={styles.formInput}
                keyboardType="numeric"
                value={invItemQuantity}
                onChangeText={setInvItemQuantity}
                placeholderTextColor={colors.placeholder}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.inputLabel}>Stock Unit</Text>
              <View style={styles.horizontalSelectRow}>
                {['kg', 'bags', 'liters'].map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[styles.selectBtnPill, invItemUnit === unit && styles.selectBtnPillActive]}
                    onPress={() => setInvItemUnit(unit)}
                  >
                    <Text style={[styles.selectBtnPillText, invItemUnit === unit && styles.selectBtnPillTextActive]}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalBtnRow}>
              <Button variant="outline" style={styles.modalHalfBtn} onPress={() => setInventoryModalOpen(false)}>
                Cancel
              </Button>
              <Button style={styles.modalHalfBtn} onPress={handleAddInventoryItem}>
                Add to Stock
              </Button>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const getStyles = (colors, fontScale, isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  subContainer: {
    flex: 1,
    backgroundColor: colors.card,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },
  profileHeaderCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarEmoji: {
    fontSize: fontScale(28),
  },
  avatarText: {
    fontSize: fontScale(24),
    fontWeight: '900',
    color: colors.primaryText === '#ffffff' ? colors.primary : colors.primaryText,
  },
  userName: {
    fontSize: fontScale(16),
    fontWeight: '800',
    color: colors.text,
  },
  userEmail: {
    fontSize: fontScale(11.5),
    color: colors.subtext,
    marginTop: 2,
    fontWeight: '550',
  },
  profileInfoText: {
    alignItems: 'center',
    marginBottom: 12,
  },
  editBtn: {
    marginTop: 12,
    width: '45%',
  },
  menuGrid: {
    gap: 16,
  },
  menuItemCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 4,
  },
  menuItemTitle: {
    fontSize: fontScale(12.5),
    fontWeight: '850',
    color: colors.text,
    letterSpacing: 0.5,
  },
  menuItemBadge: {
    backgroundColor: colors.primaryLight,
    borderWidth: 0.5,
    borderColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  menuItemBadgeText: {
    fontSize: fontScale(9),
    fontWeight: '900',
    color: colors.primary,
  },
  menuItemDesc: {
    fontSize: fontScale(11),
    color: colors.subtext,
    lineHeight: 16,
    fontWeight: '500',
  },
  menuItemBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  primaryMenuBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  primaryMenuBtnText: {
    fontSize: fontScale(11.5),
    fontWeight: '800',
    color: colors.primary,
  },
  secondaryMenuBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.cardElevated,
  },
  secondaryMenuBtnText: {
    fontSize: fontScale(11.5),
    fontWeight: '800',
    color: colors.text,
  },
  singleFullBtn: {
    backgroundColor: colors.cardElevated,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
    marginTop: 4,
  },
  singleFullBtnText: {
    fontSize: fontScale(11.5),
    fontWeight: '800',
    color: colors.text,
  },
  signOutCard: {
    marginTop: 8,
  },
  signOutBtn: {
    width: '100%',
    backgroundColor: 'transparent',
    borderColor: colors.toastErrorText,
    borderWidth: 1.5,
  },
  signOutBtnText: {
    color: colors.toastErrorText,
    fontSize: fontScale(14),
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subBackBtn: {
    padding: 4,
  },
  subHeaderTitle: {
    fontSize: fontScale(14),
    fontWeight: '850',
    color: colors.text,
  },
  backButtonPlaceholder: {
    width: 26,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardElevated,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginHorizontal: 16,
    marginVertical: 12,
    height: 38,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchBarInput: {
    flex: 1,
    fontSize: fontScale(12.5),
    fontWeight: '550',
    color: colors.text,
    paddingVertical: 0,
  },
  listScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
  cropListCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cropListCardActive: {
    borderColor: colors.primary,
  },
  cropListHeaderTap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  cropListEmoji: {
    fontSize: fontScale(20),
    marginRight: 12,
  },
  cropListInfoCol: {
    flex: 1,
  },
  cropListTitle: {
    fontSize: fontScale(13),
    fontWeight: '800',
    color: colors.text,
  },
  cropListSub: {
    fontSize: fontScale(11),
    color: colors.subtext,
    marginTop: 2,
    fontWeight: '550',
  },
  cropListRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customCropRecipeBadge: {
    backgroundColor: colors.toastInfoBg,
    borderWidth: 0.5,
    borderColor: colors.toastInfoText,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  customCropRecipeBadgeText: {
    fontSize: fontScale(9),
    fontWeight: '900',
    color: colors.toastInfoText,
  },
  cropExpandedDetail: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    padding: 14,
    gap: 12,
  },
  cropDetailDesc: {
    fontSize: fontScale(11.5),
    color: colors.text,
    lineHeight: 15,
  },
  detailsMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: colors.cardElevated,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 10,
  },
  detailMetaItem: {
    width: '48%',
    gap: 2,
  },
  detailMetaLabel: {
    fontSize: fontScale(9),
    fontWeight: '850',
    color: colors.subtext,
    textTransform: 'uppercase',
  },
  detailMetaVal: {
    fontSize: fontScale(11.5),
    fontWeight: '700',
    color: colors.text,
  },
  detailMilestonesBlock: {
    gap: 10,
    marginTop: 4,
  },
  detailSectionLabel: {
    fontSize: fontScale(10.5),
    fontWeight: '900',
    color: colors.subtext,
    textTransform: 'uppercase',
  },
  mRowDetail: {
    flexDirection: 'row',
    gap: 10,
  },
  mDotDetail: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  mDotText: {
    fontSize: fontScale(8),
    fontWeight: '800',
    color: '#ffffff',
  },
  mTextColDetail: {
    flex: 1,
  },
  mTitleDetail: {
    fontSize: fontScale(11.5),
    fontWeight: '800',
    color: colors.text,
  },
  mDescDetail: {
    fontSize: fontScale(10.5),
    color: colors.subtext,
    lineHeight: 12,
    marginTop: 1,
  },
  recipeCardActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  recipeDeleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.toastErrorBg === '#fef2f2' ? '#fee2e2' : colors.toastErrorText,
    backgroundColor: colors.toastErrorBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeDeleteText: {
    fontSize: fontScale(11.5),
    fontWeight: '800',
    color: colors.toastErrorText,
  },
  sowStartBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sowStartBtnText: {
    fontSize: fontScale(12),
    fontWeight: '800',
    color: colors.primaryText,
  },
  formScrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: fontScale(11),
    fontWeight: '850',
    color: colors.subtext,
    textTransform: 'uppercase',
  },
  formInput: {
    height: 38,
    backgroundColor: colors.cardElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: fontScale(12.5),
    color: colors.text,
    fontWeight: '550',
  },
  textAreaInput: {
    height: 70,
    textAlignVertical: 'top',
    paddingVertical: 8,
  },
  horizontalSelectRow: {
    flexDirection: 'row',
    gap: 8,
  },
  selectBtnPill: {
    flex: 1,
    height: 34,
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBtnPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectBtnPillText: {
    fontSize: fontScale(11.5),
    fontWeight: '800',
    color: colors.subtext,
    textTransform: 'capitalize',
  },
  selectBtnPillTextActive: {
    color: colors.primaryText,
  },
  formTipCard: {
    backgroundColor: colors.toastInfoBg,
    borderWidth: 0.5,
    borderColor: colors.toastInfoText,
    borderRadius: 12,
    padding: 12,
  },
  formTipText: {
    fontSize: fontScale(11),
    color: colors.toastInfoText,
    lineHeight: 14,
    fontWeight: '550',
  },
  saveRecipeBtn: {
    marginTop: 10,
  },
  historyCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  historyTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyEmoji: {
    fontSize: fontScale(18),
  },
  historyTitle: {
    fontSize: fontScale(12.5),
    fontWeight: '800',
    color: colors.text,
  },
  historySub: {
    fontSize: fontScale(11),
    color: colors.primary,
    marginTop: 2,
    fontWeight: '700',
  },
  historyDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  historyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyGridItem: {
    flex: 1,
    gap: 2,
  },
  historyGridLabel: {
    fontSize: fontScale(9),
    fontWeight: '850',
    color: colors.subtext,
    textTransform: 'uppercase',
  },
  historyGridVal: {
    fontSize: fontScale(11),
    fontWeight: '700',
    color: colors.text,
  },
  addInvBtnRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addInvButton: {
    backgroundColor: colors.primary,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addInvButtonText: {
    fontSize: fontScale(12.5),
    fontWeight: '800',
    color: colors.primaryText,
  },
  invCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invInfoCol: {
    flex: 1,
  },
  invTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  invName: {
    fontSize: fontScale(12.5),
    fontWeight: '800',
    color: colors.text,
  },
  invTypeBadge: {
    backgroundColor: colors.cardElevated,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  invTypeBadgeText: {
    fontSize: fontScale(9),
    fontWeight: '700',
    color: colors.subtext,
    textTransform: 'uppercase',
  },
  invLastUpdated: {
    fontSize: fontScale(10),
    color: colors.subtext,
    marginTop: 4,
    fontWeight: '600',
  },
  invActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  invStockQty: {
    fontSize: fontScale(13),
    fontWeight: '900',
    color: colors.primary,
  },
  invDeleteBtn: {
    padding: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: isDark ? 1 : 0,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: fontScale(15),
    fontWeight: '850',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  modalInputGroup: {
    gap: 6,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalHalfBtn: {
    flex: 1,
  },
  sowDialogContent: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    borderWidth: isDark ? 1 : 0,
    borderColor: colors.border,
  },
  sowDialogTitle: {
    fontSize: fontScale(15),
    fontWeight: '850',
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  sowDialogSub: {
    fontSize: fontScale(12),
    color: colors.subtext,
    lineHeight: 16,
  },
  boldText: {
    fontWeight: '800',
    color: colors.primary,
  },
  landsPickerContainer: {
    gap: 10,
    marginVertical: 4,
  },
  landSowPill: {
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  landSowPillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  landSowLabelCol: {
    flex: 1,
  },
  landSowName: {
    fontSize: fontScale(12.5),
    fontWeight: '800',
    color: colors.text,
  },
  landSowNameActive: {
    color: colors.primary,
  },
  landSowSub: {
    fontSize: fontScale(10.5),
    color: colors.subtext,
    marginTop: 2,
    fontWeight: '600',
  },
  settingOption: {
    gap: 6,
    marginVertical: 4,
  },
  settingOptionLabel: {
    fontSize: fontScale(9),
    fontWeight: '850',
    color: colors.subtext,
    textTransform: 'uppercase',
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: colors.cardElevated,
    borderRadius: 12,
    padding: 3,
  },
  segmentedBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentedBtnActive: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentedBtnText: {
    fontSize: fontScale(10.5),
    fontWeight: '700',
    color: colors.subtext,
    textTransform: 'capitalize',
  },
  segmentedBtnTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  switchOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  switchOptionTextCol: {
    flex: 1,
    marginRight: 12,
  },
  switchOptionTitle: {
    fontSize: fontScale(12.5),
    fontWeight: '800',
    color: colors.text,
  },
  switchOptionDesc: {
    fontSize: fontScale(10.5),
    color: colors.subtext,
    marginTop: 2,
    fontWeight: '550',
  },
  paletteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginVertical: 4,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleActive: {
    borderColor: colors.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  aboutLabel: {
    fontSize: fontScale(12),
    fontWeight: '700',
    color: colors.text,
  },
  aboutValue: {
    fontSize: fontScale(12),
    fontWeight: '600',
    color: colors.subtext,
  },
  aboutLinkText: {
    fontSize: fontScale(12),
    fontWeight: '700',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  resetDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  resetBtn: {
    backgroundColor: colors.toastErrorBg,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: fontScale(12),
    fontWeight: '850',
    color: colors.toastErrorText,
  }
});

