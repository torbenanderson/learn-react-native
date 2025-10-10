/**
 * Design System - Design Tokens
 * 
 * Centralized design tokens for consistent styling throughout the app.
 * Following atomic design principles with reusable constants.
 */

export const Colors = {
  // Primary Brand Colors
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  primaryLight: '#60a5fa',
  
  // Semantic Colors
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  error: '#ef4444',
  errorLight: '#fee2e2',
  info: '#3b82f6',
  infoLight: '#dbeafe',
  
  // Neutral Grays
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Background Colors
  background: '#f3f4f6',
  backgroundDark: '#111827',
  surface: '#ffffff',
  surfaceDark: '#1f2937',
  
  // Text Colors
  textPrimary: '#1f2937',
  textPrimaryDark: '#f9fafb',
  textSecondary: '#6b7280',
  textSecondaryDark: '#9ca3af',
  textTertiary: '#9ca3af',
  textTertiaryDark: '#6b7280',
  
  // Envelope Colors (Preset options)
  envelopeBlue: '#3b82f6',
  envelopeGreen: '#10b981',
  envelopeYellow: '#f59e0b',
  envelopePurple: '#8b5cf6',
  envelopeRed: '#ef4444',
  envelopePink: '#ec4899',
  envelopeIndigo: '#6366f1',
  envelopeTeal: '#14b8a6',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 40,
  },
  weights: {
    normal: '400' as '400',
    medium: '500' as '500',
    semibold: '600' as '600',
    bold: '700' as '700',
    extrabold: '800' as '800',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
};

export const Layout = {
  // Standard container padding
  containerPadding: Spacing.lg,
  
  // Card dimensions
  cardPadding: Spacing.md,
  cardBorderRadius: BorderRadius.lg,
  
  // Button dimensions
  buttonHeight: 48,
  buttonBorderRadius: BorderRadius.lg,
  buttonPaddingHorizontal: Spacing.lg,
  
  // Input dimensions
  inputHeight: 48,
  inputBorderRadius: BorderRadius.md,
  inputPaddingHorizontal: Spacing.md,
  
  // List item dimensions
  listItemHeight: 72,
  listItemPadding: Spacing.md,
};

// Preset color combinations for envelopes
export const EnvelopePresets = [
  { name: 'Blue', color: Colors.envelopeBlue, icon: '💙' },
  { name: 'Green', color: Colors.envelopeGreen, icon: '💚' },
  { name: 'Yellow', color: Colors.envelopeYellow, icon: '💛' },
  { name: 'Purple', color: Colors.envelopePurple, icon: '💜' },
  { name: 'Red', color: Colors.envelopeRed, icon: '❤️' },
  { name: 'Pink', color: Colors.envelopePink, icon: '💗' },
  { name: 'Indigo', color: Colors.envelopeIndigo, icon: '💙' },
  { name: 'Teal', color: Colors.envelopeTeal, icon: '💚' },
];

// Common envelope icons
export const EnvelopeIcons = [
  '🏠', // Home/Rent
  '🛒', // Groceries
  '⛽', // Gas/Transportation
  '🎬', // Entertainment
  '🍔', // Dining/Food
  '💊', // Healthcare
  '👕', // Clothing
  '🎓', // Education
  '💰', // Savings
  '📱', // Phone/Utilities
  '🚗', // Car
  '✈️', // Travel
  '🎁', // Gifts
  '🐕', // Pets
  '🏋️', // Fitness
  '📚', // Books
];

