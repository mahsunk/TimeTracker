import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import i18nService from '../services/i18nService';

interface DurationDisplayProps {
  startDateTime: Date;
  endDateTime: Date;
  breakDuration?: number;
}

const DurationDisplay: React.FC<DurationDisplayProps> = ({
  startDateTime,
  endDateTime,
  breakDuration = 0
}) => {
  const totalSeconds = Math.floor((endDateTime.getTime() - startDateTime.getTime()) / 1000);
  const netSeconds = totalSeconds - (breakDuration * 60); // Mola süresini çıkar

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}${i18nService.t('hours')} ${minutes}${i18nService.t('minutes')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.durationItem}>
        <Text style={styles.label}>Toplam Süre</Text>
        <Text style={styles.value}>{formatDuration(totalSeconds)}</Text>
      </View>

      {breakDuration > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.durationItem}>
            <Text style={styles.label}>Mola</Text>
            <Text style={[styles.value, { color: '#EF4444' }]}>
              -{Math.floor(breakDuration / 60)}s {breakDuration % 60}d
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.durationItem}>
            <Text style={styles.label}>Net Süre</Text>
            <Text style={[styles.value, { color: '#10B981' }]}>{formatDuration(netSeconds)}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  durationItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E2E8F0',
  },
});

export default DurationDisplay; 