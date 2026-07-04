import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../store/useThemeStore';

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
  const { colors, fontScale } = useTheme();
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
        isPrimary && { backgroundColor: colors.primary },
        isOutline && { borderColor: colors.primary, borderWidth: 1.5 },
        isGhost && styles.ghost,
        disabled && styles.disabled,
        size === 'sm' && styles.sm,
        style
      ]}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={isPrimary ? colors.primaryText : colors.primary} 
          size="small" 
        />
      ) : (
        <Text style={[
          styles.text,
          isPrimary && { color: colors.primaryText },
          isOutline && { color: colors.primary },
          isGhost && { color: colors.primary },
          disabled && styles.textDisabled,
          size === 'sm' && styles.textSm,
          { fontSize: fontScale(size === 'sm' ? 12 : 14) },
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
  },
  sm: {
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: '#e5e7eb',
    borderColor: '#e5e7eb',
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  textSm: {
    fontWeight: '600',
  },
  textDisabled: {
    color: '#9ca3af',
  },
});

