import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface, IconButton } from 'react-native-paper';
import i18nService from '../services/i18nService';
import notificationService from '../services/notification';

interface TimeDisplayProps {
  time: number;
  isRunning: boolean;
  onStartStop: () => void;
  onReset: () => void;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  time,
  isRunning,
  onStartStop,
  onReset,
}) => {
  const notificationIntervalRef = useRef<NodeJS.Timeout>();

  // Bildirim gönderme işlevi
  const sendTimerNotification = async () => {
    try {
      await notificationService.sendActiveTimerNotification(time);
    } catch (error) {
      console.error('Zamanlayıcı bildirimi gönderilemedi:', error);
    }
  };

  // Zamanlayıcı bildirimi için useEffect
  useEffect(() => {
    if (isRunning) {
      // İlk bildirimi 30 dakika sonra gönder
      notificationIntervalRef.current = setInterval(() => {
        sendTimerNotification();
      }, 30 * 60 * 1000); // 30 dakika
    }

    return () => {
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
      }
    };
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Surface style={styles.surface} elevation={4}>
      <Text variant="displayLarge" style={styles.time}>
        {formatTime(time)}
      </Text>
      <View style={styles.controls}>
        <IconButton
          icon="refresh"
          size={24}
          onPress={onReset}
          disabled={isRunning}
        />
        <Button
          mode="contained"
          onPress={onStartStop}
          style={styles.startButton}
        >
          {isRunning ? i18nService.t('stop') : i18nService.t('start')}
        </Button>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  time: {
    marginVertical: 16,
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  startButton: {
    minWidth: 120,
  },
});

export default TimeDisplay; 