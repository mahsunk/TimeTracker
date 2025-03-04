import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isIOS: boolean = Platform.OS === 'ios';
export const isAndroid: boolean = Platform.OS === 'android';

export const metrics = {
  screenWidth: width,
  screenHeight: height,
  baseMargin: 10,
  basePadding: 10,
  baseRadius: 8,
} as const;

export const scale = (size: number): number => (width / 375) * size;
export const verticalScale = (size: number): number => (height / 812) * size; 