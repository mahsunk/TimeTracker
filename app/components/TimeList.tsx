import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, List, IconButton } from 'react-native-paper';
import { TimeEntry } from '../types';
import i18nService from '../services/i18nService';

interface TimeListProps {
  timeEntries: TimeEntry[];
  onTimeEdit: (timeEntry: TimeEntry) => void;
  onTimeDelete: (timeEntry: TimeEntry) => void;
}

const TimeList: React.FC<TimeListProps> = ({
  timeEntries,
  onTimeEdit,
  onTimeDelete,
}) => {
  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}${i18nService.t('hours')} ${minutes}${i18nService.t('minutes')}`;
  };

  return (
    <Surface style={styles.surface} elevation={2}>
      <Text variant="titleMedium" style={styles.title}>
        {i18nService.t('timer')}
      </Text>
      <List.Section>
        {timeEntries.map((entry) => (
          <List.Item
            key={entry.id}
            title={formatDuration(entry.duration)}
            description={entry.notes}
            right={(props) => (
              <View {...props} style={styles.actions}>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => onTimeEdit(entry)}
                />
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => onTimeDelete(entry)}
                />
              </View>
            )}
          />
        ))}
      </List.Section>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    margin: 16,
    borderRadius: 8,
  },
  title: {
    padding: 16,
  },
  actions: {
    flexDirection: 'row',
  },
});

export default TimeList; 