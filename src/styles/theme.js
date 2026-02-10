import { Platform } from 'react-native';

export const colors = {
  // Dark mode friendly palette
  background: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceLight: '#242424',
  primary: '#4A9EFF',
  primaryDark: '#3A7ECC',
  secondary: '#FF6B6B',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textDisabled: '#666666',
  border: '#2A2A2A',
  success: '#4CAF50',
  warning: '#FFA726',
  error: '#F44336',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    color: colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.text,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: colors.textSecondary,
  },
  tokenNumber: {
    fontSize: 96,
    fontWeight: '700',
    lineHeight: 112,
    color: colors.primary,
  },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const touchTarget = {
  minHeight: 44,
  minWidth: 44,
};

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  touchTarget,
};

