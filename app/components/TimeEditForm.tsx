import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TextInput, Button, Portal, Modal, Text, Surface, IconButton, Menu } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimeInputs from './DateTimeInputs';
import { TimeEntry } from '../types';
import { storageService } from '../services/storage';
import i18nService from '../services/i18nService';

interface TimeEditFormProps {
  timeEntry: TimeEntry;
  onSubmit: (entry: TimeEntry) => void;
  onDismiss: () => void;
  visible: boolean;
}

export const TimeEditForm: React.FC<TimeEditFormProps> = ({
  timeEntry,
  onSubmit,
  onDismiss,
  visible,
}) => {
  const [startTime, setStartTime] = useState(new Date(timeEntry.startTime));
  const [endTime, setEndTime] = useState(new Date(timeEntry.endTime));
  const [note, setNote] = useState(timeEntry.notes || '');
  const [isBreak, setIsBreak] = useState(timeEntry.type === 'break');
  const [breakDuration, setBreakDuration] = useState(timeEntry.breakDuration || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = i18nService.t;

  const handleSave = () => {
    const updatedEntry: TimeEntry = {
      ...timeEntry,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
      breakDuration: breakDuration,
      notes: note,
      updatedAt: new Date().toISOString(),
      type: isBreak ? 'break' : 'work'
    };

    onSubmit(updatedEntry);
  };

  const handleDismiss = () => {
    setStartTime(new Date());
    setEndTime(new Date());
    setNote('');
    onDismiss();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (event.type === 'set') {
        if (event.nativeEvent.timestamp === 'start') {
          setStartTime(selectedDate);
        } else {
          setEndTime(selectedDate);
        }
      }
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Surface style={styles.surface} elevation={2}>
          <View style={styles.header}>
            <Text variant="titleLarge">
              {t('editTimeEntry')}
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={handleDismiss}
            />
          </View>

          <View style={styles.form}>
            <View style={styles.timeContainer}>
              <DateTimeInputs
                startDateTime={startTime}
                endDateTime={endTime}
                onStartChange={setStartTime}
                onEndChange={setEndTime}
              />
            </View>

            <TextInput
              mode="outlined"
              label={t('timeNote')}
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <View style={styles.buttons}>
              <Button
                mode="outlined"
                onPress={handleDismiss}
                style={styles.button}
              >
                {t('cancel')}
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={styles.button}
              >
                {t('save')}
              </Button>
            </View>
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
  },
  surface: {
    borderRadius: 8,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  button: {
    minWidth: 100,
  },
});

export default TimeEditForm; 