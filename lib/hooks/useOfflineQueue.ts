import { useState, useEffect, useCallback } from 'react';
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_QUEUE_KEY = 'rider_offline_queue';

export interface QueuedAction {
  id: string;
  type: 'UPDATE_ORDER_STATUS' | 'ASSIGN_ORDER' | 'UPDATE_LOCATION';
  payload: any;
  timestamp: number;
  retries: number;
}

export const useOfflineQueue = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [queuedActions, setQueuedActions] = useState<QueuedAction[]>([]);

  // Check network status
  useEffect(() => {
    const checkNetworkStatus = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsOnline(networkState.isConnected ?? true);
    };

    checkNetworkStatus();
    const interval = setInterval(checkNetworkStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Load queued actions from storage
  useEffect(() => {
    const loadQueue = async () => {
      try {
        const stored = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
        if (stored) {
          setQueuedActions(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading offline queue:', error);
      }
    };

    loadQueue();
  }, []);

  // Save queue to storage
  const saveQueue = async (queue: QueuedAction[]) => {
    try {
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
      setQueuedActions(queue);
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  };

  // Add action to queue
  const queueAction = useCallback(async (type: QueuedAction['type'], payload: any) => {
    const action: QueuedAction = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      payload,
      timestamp: Date.now(),
      retries: 0
    };

    const newQueue = [...queuedActions, action];
    await saveQueue(newQueue);
    return action.id;
  }, [queuedActions]);

  // Remove action from queue
  const removeAction = useCallback(async (actionId: string) => {
    const newQueue = queuedActions.filter(a => a.id !== actionId);
    await saveQueue(newQueue);
  }, [queuedActions]);

  // Clear all queued actions
  const clearQueue = useCallback(async () => {
    await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
    setQueuedActions([]);
  }, []);

  return {
    isOnline,
    queuedActions,
    queueAction,
    removeAction,
    clearQueue
  };
};
