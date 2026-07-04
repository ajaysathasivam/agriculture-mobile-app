import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTheme } from '../store/useThemeStore';

export const Toast = ({ 
  isOpen, 
  message, 
  type = 'success', 
  onClose,
  duration = 3000 
}) => {
  const { colors, fontScale } = useTheme();

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
      case 'success': return colors.toastSuccessText;
      case 'warning': return colors.toastWarningText;
      case 'error': return colors.toastErrorText;
      case 'info': return colors.toastInfoText;
      default: return colors.toastSuccessText;
    }
  };

  const getStyle = () => {
    switch(type) {
      case 'success': return { backgroundColor: colors.toastSuccessBg, borderColor: colors.border };
      case 'warning': return { backgroundColor: colors.toastWarningBg, borderColor: colors.border };
      case 'error': return { backgroundColor: colors.toastErrorBg, borderColor: colors.border };
      case 'info': return { backgroundColor: colors.toastInfoBg, borderColor: colors.border };
      default: return { backgroundColor: colors.toastSuccessBg, borderColor: colors.border };
    }
  };

  return (
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
      <Text style={[styles.text, { color: colors.text, fontSize: fontScale(13) }]}>{message}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontWeight: '600',
    lineHeight: 18,
  },
});

