import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, IconButton, Surface, Switch, Chip } from 'react-native-paper';
import { nanoid } from 'nanoid/non-secure';
import { format, isWithinInterval, parseISO, differenceInHours, differenceInMinutes } from 'date-fns';
import DateTimeInputs from './DateTimeInputs';
import { TimeEntry, WorkSettings } from '../types';
import { storageService } from '../services/storage';

interface WorkTimeFormProps {
  onSave: (entry: TimeEntry) => void;
  onClose: () => void;
}

const WorkTimeForm: React.FC<WorkTimeFormProps> = ({ onSave, onClose }) => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isBreak, setIsBreak] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [workSettings, setWorkSettings] = useState<WorkSettings | null>(null);
  const [isOvertime, setIsOvertime] = useState(false);
  const [isLunchBreak, setIsLunchBreak] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (workSettings) {
      checkTimeStatus();
    }
  }, [startTime, endTime, workSettings]);

  const loadSettings = async () => {
    const settings = await storageService.getSettings();
    setWorkSettings(settings.workSettings);
  };

  const checkTimeStatus = () => {
    if (!workSettings) return;

    // Fazla mesai kontrolü
    const workStart = parseISO(`${format(startTime, 'yyyy-MM-dd')}T${workSettings.workStartTime}:00`);
    const workEnd = parseISO(`${format(startTime, 'yyyy-MM-dd')}T${workSettings.workEndTime}:00`);
    const duration = differenceInHours(endTime, startTime);
    setIsOvertime(duration > workSettings.overtimeThreshold);

    // Öğle molası kontrolü
    const lunchStart = parseISO(`${format(startTime, 'yyyy-MM-dd')}T${workSettings.lunchBreakStart}:00`);
    const lunchEnd = parseISO(`${format(startTime, 'yyyy-MM-dd')}T${workSettings.lunchBreakEnd}:00`);
    
    const isInLunchBreak = isWithinInterval(startTime, { start: lunchStart, end: lunchEnd }) ||
                          isWithinInterval(endTime, { start: lunchStart, end: lunchEnd });
    setIsLunchBreak(isInLunchBreak);

    if (isInLunchBreak && !isBreak) {
      setIsBreak(true);
    }
  };

  const handleSave = () => {
    if (endTime <= startTime) {
      setError('Bitiş zamanı başlangıç zamanından sonra olmalıdır');
      return;
    }

    const duration = differenceInMinutes(endTime, startTime);
    if (duration < 1) {
      setError('Süre en az 1 dakika olmalıdır');
      return;
    }

    const timeEntry: TimeEntry = {
      id: nanoid(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
      breakDuration: isBreak ? duration : 0,
      notes: notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: isBreak ? 'break' : 'work',
      isOvertime: false
    };

    onSave(timeEntry);
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <IconButton 
          icon="close"
          size={24}
          onPress={onClose}
          style={styles.closeButton}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Çalışma Saati Ekle</Text>
        </View>
      </Surface>

      <ScrollView style={styles.content}>
        <Surface style={styles.formCard} elevation={2}>
          <DateTimeInputs
            startDateTime={startTime}
            endDateTime={endTime}
            onStartChange={setStartTime}
            onEndChange={setEndTime}
          />

          <View style={styles.statusContainer}>
            {isOvertime && (
              <Chip 
                icon="clock-alert" 
                mode="outlined" 
                style={[styles.chip, styles.overtimeChip]}
              >
                Fazla Mesai
              </Chip>
            )}
            {isLunchBreak && (
              <Chip 
                icon="food" 
                mode="outlined" 
                style={[styles.chip, styles.lunchChip]}
              >
                Öğle Molası
              </Chip>
            )}
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Mola</Text>
            <Switch
              value={isBreak}
              onValueChange={setIsBreak}
              disabled={isLunchBreak}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notlar</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              style={styles.input}
              placeholder="Notlarınızı ekleyin"
              multiline
              numberOfLines={3}
            />
          </View>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </Surface>
      </ScrollView>

      <Surface style={styles.footer} elevation={2}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
        >
          Kaydet
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  closeButton: {
    margin: 0,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 16,
  },
  chip: {
    height: 32,
  },
  overtimeChip: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  lunchChip: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  saveButton: {
    borderRadius: 8,
  },
});

export default WorkTimeForm; 