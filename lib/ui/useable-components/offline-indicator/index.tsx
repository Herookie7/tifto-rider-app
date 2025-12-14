import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApptheme } from '@/lib/context/global/theme.context';
import { useTranslation } from 'react-i18next';

interface OfflineIndicatorProps {
  isOnline: boolean;
  queuedActionsCount?: number;
}

export default function OfflineIndicator({ isOnline, queuedActionsCount = 0 }: OfflineIndicatorProps) {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (!isOnline) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }, [isOnline, fadeAnim]);

  if (isOnline && queuedActionsCount === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isOnline ? '#34C759' : '#FF3B30',
          opacity: fadeAnim
        }
      ]}
    >
      <Ionicons
        name={isOnline ? 'cloud-done' : 'cloud-offline'}
        size={16}
        color="#fff"
      />
      <Text style={styles.text}>
        {isOnline
          ? queuedActionsCount > 0
            ? t('Syncing {count} action(s)...', { count: queuedActionsCount })
            : t('Online')
          : t('You are offline. Actions will be synced when connection is restored.')}
      </Text>
      {queuedActionsCount > 0 && (
        <Text style={styles.count}>{queuedActionsCount}</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8
  },
  text: {
    color: '#fff',
    fontSize: 12,
    flex: 1
  },
  count: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  }
});
