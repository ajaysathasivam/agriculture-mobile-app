import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const Toast = ({ 
  isOpen, 
  message, 
  type = 'success', 
  onClose,
  duration = 3000 
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);

  if (!isOpen) return null;

  const getIconName = () => {
    switch(type) {
      case 'success': return 'check-circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return 'check-circle';
    }
  };

  const getIconColor = () => {
    switch(type) {
      case 'success': return '#059669';
      case 'warning': return '#d97706';
      case 'error': return '#dc2626';
      case 'info': return '#2563eb';
      default: return '#059669';
    }
  };

  const getStyle = () => {
    switch(type) {
      case 'success': return styles.success;
      case 'warning': return styles.warning;
      case 'error': return styles.error;
      case 'info': return styles.info;
      default: return styles.success;
    }
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={[styles.toast, getStyle()]} 
        onPress={onClose}
        activeOpacity={0.9}
      >
        <MaterialIcons 
          name={getIconName()} 
          size={20} 
          color={getIconColor()} 
          style={styles.icon}
        />
        <Text style={styles.text}>{message}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
  },
  success: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  warning: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  error: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
  },
  info: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    lineHeight: 18,
  },
});
