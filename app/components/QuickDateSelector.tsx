import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Button, Portal, Modal, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import i18nService from '../services/i18nService';

interface QuickDateSelectorProps {
  onSelect?: (startDate: Date, endDate: Date) => void;
}

const QuickDateSelector: React.FC<QuickDateSelectorProps> = ({ onSelect }) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const handleToday = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    onSelect?.(startOfDay, now);
  };

  const handleYesterday = () => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
    onSelect?.(startOfYesterday, endOfYesterday);
  };

  const handleLastWeek = () => {
    const now = new Date();
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const startOfLastWeek = new Date(lastWeek.getFullYear(), lastWeek.getMonth(), lastWeek.getDate());
    onSelect?.(startOfLastWeek, now);
  };

  const handleCustom = () => {
    setShowCustomModal(true);
  };

  const handleCustomConfirm = () => {
    onSelect?.(customStartDate, customEndDate);
    setShowCustomModal(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Button
          mode="outlined"
          onPress={handleToday}
          icon="calendar-today"
          style={styles.button}
        >
          {i18nService.t('todayButton')}
        </Button>
        <Button
          mode="outlined"
          onPress={handleYesterday}
          icon="calendar-arrow-left"
          style={styles.button}
        >
          {i18nService.t('yesterdayButton')}
        </Button>
        <Button
          mode="outlined"
          onPress={handleLastWeek}
          icon="calendar-week"
          style={styles.button}
        >
          {i18nService.t('weekButton')}
        </Button>
        <Button
          mode="outlined"
          onPress={handleCustom}
          icon="calendar-search"
          style={styles.button}
        >
          {i18nService.t('customButton')}
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showCustomModal}
          onDismiss={() => setShowCustomModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>{i18nService.t('customDateSelection')}</Text>
          
          <View style={styles.dateGroup}>
            <Text style={styles.dateLabel}>{i18nService.t('startDate')}</Text>
            <Button
              mode="outlined"
              onPress={() => setShowStartDate(true)}
              icon="calendar"
              style={styles.dateButton}
            >
              {formatDate(customStartDate)}
            </Button>
          </View>

          <View style={styles.dateGroup}>
            <Text style={styles.dateLabel}>{i18nService.t('endDate')}</Text>
            <Button
              mode="outlined"
              onPress={() => setShowEndDate(true)}
              icon="calendar"
              style={styles.dateButton}
            >
              {formatDate(customEndDate)}
            </Button>
          </View>

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setShowCustomModal(false)}
              style={styles.modalButton}
            >
              {i18nService.t('cancel')}
            </Button>
            <Button
              mode="contained"
              onPress={handleCustomConfirm}
              style={styles.modalButton}
            >
              {i18nService.t('ok')}
            </Button>
          </View>

          {showStartDate && (
            <DateTimePicker
              value={customStartDate}
              mode="date"
              onChange={(event, date) => {
                setShowStartDate(false);
                date && setCustomStartDate(date);
              }}
            />
          )}

          {showEndDate && (
            <DateTimePicker
              value={customEndDate}
              mode="date"
              onChange={(event, date) => {
                setShowEndDate(false);
                date && setCustomEndDate(date);
              }}
            />
          )}
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    flex: 1,
    minWidth: '45%',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dateButton: {
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 20,
  },
  modalButton: {
    minWidth: 100,
  },
});

export default QuickDateSelector; 