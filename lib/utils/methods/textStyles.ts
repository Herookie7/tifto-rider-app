/**
 * Text style utilities adapted from customer app
 * Provides consistent typography styles
 */

import { scale } from './scaling';

export const textStyles = {
  H1: {
    fontSize: scale(35),
  },
  H2: {
    fontSize: scale(24),
  },
  H3: {
    fontSize: scale(20),
  },
  H4: {
    fontSize: scale(16),
  },
  H5: {
    fontSize: scale(14),
  },
  Normal: {
    fontSize: scale(12),
  },
  Small: {
    fontSize: scale(10),
  },
  Smaller: {
    fontSize: scale(8),
  },
  Regular: {
    fontFamily: 'Inter', // Using Inter font (rider app uses Inter)
  },
  Bold: {
    fontWeight: '500' as const,
  },
  Bolder: {
    fontWeight: '700' as const,
  },
  Center: {
    textAlign: 'center' as const,
  },
  Right: {
    textAlign: 'right' as const,
  },
  Left: {
    textAlign: 'left' as const,
  },
  UpperCase: {
    textTransform: 'uppercase' as const,
  },
  LineOver: {
    textDecorationLine: 'line-through' as const,
  },
  B700: {
    fontWeight: '700' as const,
  },
  TextItalic: {
    fontStyle: 'italic' as const,
  },
};

