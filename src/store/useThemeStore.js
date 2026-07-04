import { create } from 'zustand';
import { Appearance } from 'react-native';
import { useState, useEffect } from 'react';

export const useThemeStore = create((set, get) => ({
  themeMode: 'light', // 'light' | 'dark' | 'system'
  pureBlack: false,
  colorTheme: 'forest', // 'forest' | 'clay' | 'wheat' | 'ocean' | 'grape'
  fontSize: 'medium', // 'small' | 'medium' | 'large' | 'extra-large'

  setThemeMode: (themeMode) => set({ themeMode }),
  setPureBlack: (pureBlack) => set({ pureBlack }),
  setColorTheme: (colorTheme) => set({ colorTheme }),
  setFontSize: (fontSize) => set({ fontSize }),
}));

export const useTheme = () => {
  const themeMode = useThemeStore((state) => state.themeMode);
  const pureBlack = useThemeStore((state) => state.pureBlack);
  const colorTheme = useThemeStore((state) => state.colorTheme);
  const fontSize = useThemeStore((state) => state.fontSize);
  
  const setThemeMode = useThemeStore((state) => state.setThemeMode);
  const setPureBlack = useThemeStore((state) => state.setPureBlack);
  const setColorTheme = useThemeStore((state) => state.setColorTheme);
  const setFontSize = useThemeStore((state) => state.setFontSize);

  // Keep track of the system scheme changes reactively
  const [systemScheme, setSystemScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  // Dynamic Theme Color Palettes based on selected Accent
  const PALETTES = {
    forest: {
      primary: '#059669',
      primaryLight: isDark ? (pureBlack ? '#022c22' : '#064e3b') : '#ecfdf5',
      primaryDark: '#047857',
    },
    clay: {
      primary: '#78350f',
      primaryLight: isDark ? (pureBlack ? '#290b00' : '#451a03') : '#ffedd5',
      primaryDark: '#b45309',
    },
    wheat: {
      primary: '#d97706',
      primaryLight: isDark ? (pureBlack ? '#271200' : '#78350f') : '#fef3c7',
      primaryDark: '#b45309',
    },
    ocean: {
      primary: '#0ea5e9',
      primaryLight: isDark ? (pureBlack ? '#072e42' : '#0c4a6e') : '#e0f2fe',
      primaryDark: '#0284c7',
    },
    grape: {
      primary: '#9333ea',
      primaryLight: isDark ? (pureBlack ? '#2c074f' : '#581c87') : '#f3e8ff',
      primaryDark: '#7e22ce',
    },
  };

  const activePalette = PALETTES[colorTheme] || PALETTES.forest;

  const colors = isDark ? {
    background: pureBlack ? '#000000' : '#111827',
    card: pureBlack ? '#0a0a0a' : '#1f2937',
    cardElevated: pureBlack ? '#141414' : '#374151',
    border: pureBlack ? '#1e1e1e' : '#374151',
    text: '#f9fafb',
    subtext: '#9ca3af',
    placeholder: '#4b5563',
    primary: activePalette.primary,
    primaryLight: activePalette.primaryLight,
    primaryDark: activePalette.primaryDark,
    primaryText: '#ffffff',
    toastSuccessBg: '#064e3b',
    toastSuccessText: '#34d399',
    toastWarningBg: '#78350f',
    toastWarningText: '#fbbf24',
    toastErrorBg: '#7f1d1d',
    toastErrorText: '#f87171',
    toastInfoBg: '#1e3a8a',
    toastInfoText: '#60a5fa',
    statusBar: 'light',
  } : {
    background: '#f9fafb',
    card: '#ffffff',
    cardElevated: '#ffffff',
    border: '#e5e7eb',
    text: '#111827',
    subtext: '#6b7280',
    placeholder: '#9ca3af',
    primary: activePalette.primary,
    primaryLight: activePalette.primaryLight,
    primaryDark: activePalette.primaryDark,
    primaryText: '#ffffff',
    toastSuccessBg: '#ecfdf5',
    toastSuccessText: '#065f46',
    toastWarningBg: '#fffbeb',
    toastWarningText: '#92400e',
    toastErrorBg: '#fef2f2',
    toastErrorText: '#991b1b',
    toastInfoBg: '#eff6ff',
    toastInfoText: '#1e40af',
    statusBar: 'dark',
  };

  // Font Multipliers for Accessibility / Font Size Increase
  const FONT_MULTIPLIERS = {
    'small': 0.85,
    'medium': 1.0,
    'large': 1.2,
    'extra-large': 1.35,
  };

  const multiplier = FONT_MULTIPLIERS[fontSize] || 1.2;

  const fontScale = (baseSize) => {
    return Math.round(baseSize * multiplier);
  };

  return {
    themeMode,
    pureBlack,
    colorTheme,
    fontSize,
    colors,
    fontScale,
    setThemeMode,
    setPureBlack,
    setColorTheme,
    setFontSize,
    isDark,
  };
};
