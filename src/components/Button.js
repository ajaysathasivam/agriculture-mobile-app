import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

export const Button = ({ 
  children, 
  onPress, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false, 
  style, 
  textStyle 
}) => {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      style={[
        styles.button,
        isPrimary && styles.primary,
        isOutline && styles.outline,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        size === 'sm' && styles.sm,
        style
      ]}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={isPrimary ? '#ffffff' : '#059669'} 
          size="small" 
        />
      ) : (
        <Text style={[
          styles.text,
          isPrimary && styles.textPrimary,
          isOutline && styles.textOutline,
          isGhost && styles.textGhost,
          disabled && styles.textDisabled,
          size === 'sm' && styles.textSm,
          textStyle
        ]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    transition: 'all 0.2s',
  },
  sm: {
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  primary: {
    backgroundColor: '#059669', // Primary Green
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#059669',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: '#e5e7eb',
    borderColor: '#e5e7eb',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  textSm: {
    fontSize: 12,
    fontWeight: '600',
  },
  textPrimary: {
    color: '#ffffff',
  },
  textOutline: {
    color: '#059669',
  },
  textGhost: {
    color: '#059669',
  },
  textDisabled: {
    color: '#9ca3af',
  },
});
