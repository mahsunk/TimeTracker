import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { Button, IconButton, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import i18nService from '../services/i18nService';
import { CustomTheme } from '../services/theme';

interface DateTimeInputsProps {
  startDateTime: Date;
  endDateTime: Date;
  onStartChange: (date: Date) => void;
  onEndChange: (date: Date) => void;
}

const DateTimeInputs: React.FC<DateTimeInputsProps> = ({
  startDateTime,
  endDateTime,
  onStartChange,
  onEndChange,
}) => {
  const theme = useTheme() as CustomTheme;
  const colors = theme.colors.extended;
  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDate(Platform.OS === 'ios');
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(startDateTime.getHours(), startDateTime.getMinutes());
      onStartChange(newDate);
    }
  };

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartTime(Platform.OS === 'ios');
    if (selectedDate) {
      const newDate = new Date(startDateTime);
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      onStartChange(newDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDate(Platform.OS === 'ios');
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(endDateTime.getHours(), endDateTime.getMinutes());
      onEndChange(newDate);
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndTime(Platform.OS === 'ios');
    if (selectedDate) {
      const newDate = new Date(endDateTime);
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      onEndChange(newDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.groupLabel}>{i18nService.t('startTime')}</Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowStartDate(true)}
          >
            <IconButton 
              icon="calendar"
              size={24}
              iconColor={colors.primary.main}
            />
            <Text style={styles.dateValue}>
              {format(startDateTime, 'dd.MM.yyyy', { locale: tr })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowStartTime(true)}
          >
            <IconButton 
              icon="clock-outline"
              size={24}
              iconColor={colors.primary.main}
            />
            <Text style={styles.dateValue}>
              {format(startDateTime, 'HH:mm', { locale: tr })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.groupLabel}>{i18nService.t('endTime')}</Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowEndDate(true)}
          >
            <IconButton 
              icon="calendar"
              size={24}
              iconColor={colors.primary.main}
            />
            <Text style={styles.dateValue}>
              {format(endDateTime, 'dd.MM.yyyy', { locale: tr })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowEndTime(true)}
          >
            <IconButton 
              icon="clock-outline"
              size={24}
              iconColor={colors.primary.main}
            />
            <Text style={styles.dateValue}>
              {format(endDateTime, 'HH:mm', { locale: tr })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showStartDate && (
        <DateTimePicker
          value={startDateTime}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
        />
      )}

      {showStartTime && (
        <DateTimePicker
          value={startDateTime}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartTimeChange}
        />
      )}

      {showEndDate && (
        <DateTimePicker
          value={endDateTime}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
        />
      )}

      {showEndTime && (
        <DateTimePicker
          value={endDateTime}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 12,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateValue: {
    fontSize: 16,
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
  },
});

export default DateTimeInputs; 