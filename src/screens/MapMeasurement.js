import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from '../components/Button';
import { useStore } from '../store/useStore';
import { LeafletHTML } from '../components/MapWebView/LeafletHTML';

export const MapMeasurement = ({ onNavigate }) => {
  const webviewRef = useRef(null);
  const [area, setArea] = useState(0);
  const [pinsPlaced, setPinsPlaced] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  const setOnboardingState = useStore(state => state.setOnboardingState);
  const triggerToast = useStore(state => state.triggerToast);

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ready') {
        // Map is loaded
      } else if (data.type === 'polygon_complete') {
        setArea(data.acres);
        setPinsPlaced(data.coordinates.length - 1); // coordinates has last point repeating
      } else if (data.type === 'polygon_removed') {
        setArea(0);
        setPinsPlaced(0);
      }
    } catch (e) {
      console.warn("Error parsing map message", e);
    }
  };

  const handleClear = () => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
    setArea(0);
    setPinsPlaced(0);
    triggerToast('Map cleared.', 'info');
  };

  const handleSave = () => {
    setOnboardingState({
      measuredArea: `${area} Acres`,
      measurementMethod: 'map'
    });
    triggerToast('Field boundaries saved successfully!', 'success');
    setTimeout(() => {
      onNavigate('land-wizard-step2');
    }, 1500);
  };

  const fetchSuggestions = async (query) => {
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SproutAgricultureApp'
        }
      });
      const data = await response.json();
      setSuggestions(data || []);
    } catch (error) {
      console.warn("Error fetching geocoding suggestions", error);
    }
  };

  const handleSelectSuggestion = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    
    if (webviewRef.current && !isNaN(lat) && !isNaN(lon)) {
      webviewRef.current.postMessage(
        JSON.stringify({
          type: 'set_center',
          latitude: lat,
          longitude: lon,
          name: item.name || item.display_name.split(',')[0]
        })
      );
    }
    // Set search query to display name (shortened) and clear suggestions
    setSearchQuery(item.display_name.split(',')[0]);
    setSuggestions([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('land-wizard')} style={styles.backButton}>
          <MaterialIcons name="close" size={24} color="#6b7280" />
        </TouchableOpacity>
        
        <View style={styles.searchBarContainer}>
          <MaterialIcons name="search" size={18} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search village, town, land..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              fetchSuggestions(text);
            }}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                setSearchQuery('');
                setSuggestions([]);
              }} 
              style={styles.clearButton}
            >
              <MaterialIcons name="clear" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.mapContainer}>
        <WebView
          ref={webviewRef}
          source={{ html: LeafletHTML }}
          style={styles.webview}
          onMessage={handleMessage}
          scrollEnabled={false}
          bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          geolocationEnabled={true}
        />
        
        {/* Floating Acreage Card */}
        <View style={styles.floatingPanel}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>Acreage Calculator</Text>
              <Text style={styles.panelSub}>Trace field perimeter on map</Text>
            </View>
            <View style={styles.panelStats}>
              {area > 0 ? (
                <>
                  <Text style={styles.areaText}>{area} Acres</Text>
                  <Text style={styles.perimeterText}>Calculated</Text>
                </>
              ) : (
                <View style={styles.pinsBadge}>
                  <Text style={styles.pinsBadgeText}>{pinsPlaced} pins</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.actionsRow}>
            <Button variant="outline" size="sm" style={styles.halfBtn} onPress={handleClear}>
              Clear Map
            </Button>
            <Button size="sm" style={styles.halfBtn} disabled={area === 0} onPress={handleSave}>
              Save Boundary
            </Button>
          </View>
        </View>
      </View>

      {/* Floating Search Suggestions Dropdown Overlay placed outside mapContainer to avoid WebView touch blocking */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item) => (
            <TouchableOpacity
              key={item.place_id || `${item.lat}-${item.lon}-${Math.random()}`}
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.suggestionText} numberOfLines={1}>
                {item.display_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 4,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginLeft: 12,
    height: 40,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
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
  suggestionsContainer: {
    position: 'absolute',
    top: 68,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 99,
    zIndex: 9999,
    maxHeight: 220,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  suggestionText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  floatingPanel: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  panelTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  panelSub: {
    fontSize: 11,
    color: '#6b7280',
  },
  panelStats: {
    alignItems: 'flex-end',
  },
  areaText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#059669',
  },
  perimeterText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  pinsBadge: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pinsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfBtn: {
    flex: 1,
  }
});
