
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const colors = {
  primary: '#2196F3',
  primaryLight: '#E3F2FD',
  primaryDark: '#1976D2',
  
  // Secondary colors
  secondary: '#FF9800',
  secondaryLight: '#FFF3E0',
  secondaryDark: '#F57C00',
  
  // Status colors
  success: '#4CAF50',
  successLight: '#E8F5E9',
  danger: '#F44336',
  dangerLight: '#FFEBEE',
  warning: '#FFC107',
  warningLight: '#FFF8E1',
  info: '#00BCD4',
  infoLight: '#E0F7FA',
  
  // Neutral colors
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#9E9E9E',
  border: '#E0E0E0',
  divider: '#EEEEEE',
  background: '#F5F5F5',
  card: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  
  // Specific use cases
  tabBar: '#FFFFFF',
  header: '#2196F3',
  shadow: 'rgba(0, 0, 0, 0.08)',
};