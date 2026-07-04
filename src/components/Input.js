import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../store/useThemeStore';

export const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { colors, fontScale } = useTheme();

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[
          styles.label, 
          { color: colors.subtext, fontSize: fontScale(10) }
        ]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputWrapper,
        { backgroundColor: colors.background, borderColor: colors.border },
        isFocused && { borderColor: colors.primary, backgroundColor: colors.card },
        error && styles.inputWrapperError
      ]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.textInput, 
            { color: colors.text, fontSize: fontScale(14) }
          ]}
          placeholderTextColor={colors.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          {...props}
        />
        
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      
      {error && (
        <Text style={[
          styles.errorText, 
          { fontSize: fontScale(11) }
        ]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputWrapperError: {
    borderColor: '#ef4444',
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontWeight: '500',
    paddingVertical: 0,
  },
  iconLeft: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRight: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4,
  },
});

