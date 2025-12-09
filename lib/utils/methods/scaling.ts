/**
 * Scaling utilities adapted from customer app
 * Provides responsive scaling based on screen dimensions
 */

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

/**
 * Scale size based on screen width
 * @param size - The size to scale
 * @returns Scaled size
 */
export const scale = (size: number): number => {
  return Math.round((width / guidelineBaseWidth) * size);
};

/**
 * Scale size based on screen height
 * @param size - The size to scale
 * @returns Scaled size
 */
export const verticalScale = (size: number): number => {
  return Math.round((height / guidelineBaseHeight) * size);
};

/**
 * Moderate scale - scales with a factor for fine-tuning
 * @param size - The size to scale
 * @param factor - Scaling factor (default: 0.5)
 * @returns Scaled size
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return Math.round(size + (scale(size) - size) * factor);
};

