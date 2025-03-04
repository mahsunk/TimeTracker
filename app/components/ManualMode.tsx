import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { Text, Button, Surface, IconButton, Portal, Dialog, Switch, Chip, useTheme } from 'react-native-paper';
import { format, isWithinInterval, parseISO, differenceInHours, differenceInMinutes } from 'date-fns';
import { storageService } from '../services/storage';
import { TimeEntry, WorkSettings } from '../types';
import { nanoid } from 'nanoid/non-secure';
import i18nService from '../services/i18nService';
import NotesInput from './NotesInput';
import DateTimeInputs from './DateTimeInputs';
import DurationDisplay from './DurationDisplay';
import { CustomTheme } from '../services/theme';

interface ManualModeProps {
  onClose: () => void;
  editEntry?: TimeEntry;
  onDelete?: () => void;
}

const ManualMode: React.FC<ManualModeProps> = ({ onClose, editEntry, onDelete }) => {
  const theme = useTheme() as CustomTheme;
  const colors = theme.colors.extended;
  const [startDateTime, setStartDateTime] = useState(editEntry ? new Date(editEntry.startTime) : new Date());
  const [endDateTime, setEndDateTime] = useState(editEntry ? new Date(editEntry.endTime) : new Date());
  const [note, setNote] = useState(editEntry?.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Yeni state'ler
  const [workSettings, setWorkSettings] = useState<WorkSettings | null>(null);
  const [isBreak, setIsBreak] = useState(editEntry?.type === 'break' || false);
  const [isOvertime, setIsOvertime] = useState(editEntry?.isOvertime || false);
  const [isLunchBreak, setIsLunchBreak] = useState(false);
  const [breakDuration, setBreakDuration] = useState(editEntry?.breakDuration || 0);
  const [showBreakInput, setShowBreakInput] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (workSettings) {
      checkTimeStatus();
    }
  }, [startDateTime, endDateTime, workSettings]);

  const loadData = async () => {
    try {
      setLoading(true);
      const settings = await storageService.getSettings();
      setWorkSettings(settings.workSettings);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(i18nService.t('loadError'));
    } finally {
      setLoading(false);
    }
  };

  const checkTimeStatus = () => {
    if (!workSettings) return;

    // Fazla mesai kontrolü
    const workStart = parseISO(`${format(startDateTime, 'yyyy-MM-dd')}T${workSettings.workStartTime}:00`);
    const workEnd = parseISO(`${format(startDateTime, 'yyyy-MM-dd')}T${workSettings.workEndTime}:00`);
    const duration = differenceInHours(endDateTime, startDateTime);
    setIsOvertime(duration > workSettings.overtimeThreshold);

    // Öğle molası kontrolü
    const lunchStart = parseISO(`${format(startDateTime, 'yyyy-MM-dd')}T${workSettings.lunchBreakStart}:00`);
    const lunchEnd = parseISO(`${format(startDateTime, 'yyyy-MM-dd')}T${workSettings.lunchBreakEnd}:00`);
    
    const isInLunchBreak = isWithinInterval(startDateTime, { start: lunchStart, end: lunchEnd }) ||
                          isWithinInterval(endDateTime, { start: lunchStart, end: lunchEnd });
    setIsLunchBreak(isInLunchBreak);

    if (isInLunchBreak && !isBreak) {
      setIsBreak(true);
    }
  };

  const validateForm = (): boolean => {
    if (endDateTime.getTime() <= startDateTime.getTime()) {
      setError(i18nService.t('dateError'));
      return false;
    }
    
    const duration = differenceInMinutes(endDateTime, startDateTime);
    if (duration < 1) {
      setError(i18nService.t('minimumDuration'));
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const timeEntry: TimeEntry = {
        id: editEntry?.id || nanoid(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        duration: Math.floor((endDateTime.getTime() - startDateTime.getTime()) / 1000),
        breakDuration: breakDuration,
        notes: note,
        createdAt: editEntry?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: isBreak ? 'break' : 'work',
        isOvertime,
      };

      console.log('Saving time entry:', timeEntry);
      await storageService.saveTimeEntry(timeEntry);
      console.log('Time entry saved successfully');
      
      if (global.refreshReports) {
        console.log('Refreshing reports...');
        global.refreshReports();
      }

      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Error saving time entry:', error);
      setError(i18nService.t('saveError'));
      setLoading(false);
    }
  };

  const formatBreakDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}s ${mins}d`;
    }
    return `${mins}d`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      paddingTop: Platform.OS === 'ios' ? 54 : 16,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    titleContainer: {
      flex: 1,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: -0.5,
      color: theme.colors.onSurface,
    },
    subtitle: {
      fontSize: 15,
      marginTop: 4,
      letterSpacing: -0.2,
      color: theme.colors.onSurfaceVariant,
    },
    closeButton: {
      borderRadius: 14,
      width: 44,
      height: 44,
      backgroundColor: colors.neutral[100],
    },
    deleteButton: {
      borderRadius: 14,
      width: 44,
      height: 44,
      backgroundColor: colors.error.light,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    section: {
      marginBottom: 20,
      borderRadius: 28,
      overflow: 'hidden',
      backgroundColor: theme.colors.surface,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    iconContainer: {
      width: 56,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 18,
      marginRight: 16,
      backgroundColor: theme.colors.surface,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    sectionTitleContainer: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      letterSpacing: -0.3,
      color: theme.colors.onSurface,
    },
    sectionSubtitle: {
      fontSize: 14,
      marginTop: 4,
      letterSpacing: -0.2,
      lineHeight: 20,
      color: theme.colors.onSurfaceVariant,
    },
    sectionContent: {
      padding: 20,
      backgroundColor: theme.colors.surface,
    },
    durationCard: {
      borderRadius: 20,
      padding: 20,
      marginTop: 16,
      backgroundColor: colors.primary.light,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary.dark,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    errorCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 20,
      marginBottom: 16,
      marginHorizontal: 4,
      backgroundColor: colors.error.light,
      ...Platform.select({
        ios: {
          shadowColor: colors.error.dark,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    errorIconContainer: {
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
      marginRight: 16,
      backgroundColor: theme.colors.surface,
    },
    errorText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      letterSpacing: -0.2,
      lineHeight: 22,
      color: colors.error.dark,
    },
    footer: {
      padding: 20,
      paddingBottom: Platform.OS === 'ios' ? 34 : 20,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outline,
      backgroundColor: theme.colors.surface,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    saveButton: {
      borderRadius: 20,
      backgroundColor: colors.primary.main,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary.dark,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    saveButtonContent: {
      height: 58,
    },
    saveButtonLabel: {
      fontSize: 17,
      fontWeight: '600',
      letterSpacing: -0.3,
      color: theme.colors.onPrimary,
    },
    dialogText: {
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: -0.2,
      color: theme.colors.onSurfaceVariant,
    },
    dialogButton: {
      marginLeft: 12,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
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
      backgroundColor: colors.error.light,
      borderColor: colors.error.main,
    },
    lunchChip: {
      backgroundColor: colors.success.light,
      borderColor: colors.success.main,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.onSurface,
    },
    breakControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    breakDurationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.input,
      borderRadius: 8,
      padding: 4,
    },
    breakDurationDisplay: {
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    breakDurationText: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.neutral[700],
    },
  });

  return (
    <View style={styles.container}>
      <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={2}>
        <IconButton 
          icon="close"
          size={24}
          onPress={() => {
            setError(null);
            onClose();
          }}
          style={[styles.closeButton, { backgroundColor: colors.neutral[100] }]}
          iconColor={colors.neutral[600]}
        />
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Manuel Giriş</Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>Zaman kaydı oluştur</Text>
        </View>
        {editEntry && onDelete && (
          <IconButton 
            icon="delete-outline" 
            size={24}
            iconColor={colors.error.main}
            style={[styles.deleteButton, { backgroundColor: colors.error.light }]}
            onPress={() => setShowDeleteDialog(true)}
          />
        )}
      </Surface>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <View style={[styles.sectionHeader, { 
            backgroundColor: colors.primary.light,
            borderBottomColor: colors.primary.light 
          }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
              <IconButton 
                icon="calendar-clock"
                size={24}
                iconColor={colors.primary.default}
              />
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                {i18nService.t('timeSelection')}
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                {i18nService.t('selectStartEndTime')}
              </Text>
            </View>
          </View>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <DateTimeInputs 
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              onStartChange={setStartDateTime}
              onEndChange={setEndDateTime}
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
              <View style={styles.breakControls}>
                <Switch
                  value={isBreak}
                  onValueChange={(value) => {
                    setIsBreak(value);
                    if (!value) {
                      setBreakDuration(0);
                    }
                    setShowBreakInput(value);
                  }}
                />
                {isBreak && (
                  <View style={styles.breakDurationContainer}>
                    <IconButton 
                      icon="minus"
                      size={20}
                      onPress={() => setBreakDuration(prev => Math.max(0, prev - 15))}
                      disabled={breakDuration <= 0}
                    />
                    <TouchableOpacity 
                      onPress={() => setShowBreakInput(true)}
                      style={styles.breakDurationDisplay}
                    >
                      <Text style={styles.breakDurationText}>
                        {formatBreakDuration(breakDuration)}
                      </Text>
                    </TouchableOpacity>
                    <IconButton 
                      icon="plus"
                      size={20}
                      onPress={() => setBreakDuration(prev => Math.min(480, prev + 15))}
                      disabled={breakDuration >= 480}
                    />
                  </View>
                )}
              </View>
            </View>

            <Surface style={[styles.durationCard, { backgroundColor: colors.primary.light }]} elevation={1}>
              <DurationDisplay 
                startDateTime={startDateTime}
                endDateTime={endDateTime}
                breakDuration={breakDuration}
              />
            </Surface>
          </View>
        </Surface>

        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <View style={[styles.sectionHeader, { 
            backgroundColor: colors.warning.light,
            borderBottomColor: colors.warning.light 
          }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
              <IconButton 
                icon="note-text-outline"
                size={24}
                iconColor={colors.warning.default}
              />
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>{i18nService.t('notes')}</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>Notlarını ekle</Text>
            </View>
          </View>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <NotesInput 
              value={note}
              onChange={setNote}
            />
          </View>
        </Surface>

        {error && (
          <Surface style={[styles.errorCard, { backgroundColor: colors.error.light }]} elevation={1}>
            <View style={[styles.errorIconContainer, { backgroundColor: theme.colors.surface }]}>
              <IconButton 
                icon="alert-circle"
                size={24}
                iconColor={colors.error.main}
              />
            </View>
            <Text style={[styles.errorText, { color: colors.error.dark }]}>{error}</Text>
          </Surface>
        )}
      </ScrollView>

      <Surface style={[styles.footer, { 
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.outline 
      }]} elevation={2}>
        <Button 
          mode="contained"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          contentStyle={styles.saveButtonContent}
          style={[styles.saveButton, { backgroundColor: colors.primary.default }]}
          labelStyle={[styles.saveButtonLabel, { color: theme.colors.background }]}
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </Surface>

      <Portal>
        <Dialog 
          visible={showDeleteDialog} 
          onDismiss={() => setShowDeleteDialog(false)}
          style={{ backgroundColor: theme.colors.surface }}
        >
          <Dialog.Title style={{ color: theme.colors.onSurface }}>Silme Onayı</Dialog.Title>
          <Dialog.Content>
            <Text style={[styles.dialogText, { color: theme.colors.onSurfaceVariant }]}>
              Bu zaman kaydını silmek istediğinizden emin misiniz?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setShowDeleteDialog(false)}
              textColor={theme.colors.onSurfaceVariant}
              style={styles.dialogButton}
            >
              İptal
            </Button>
            <Button 
              onPress={() => {
                setShowDeleteDialog(false);
                onDelete?.();
              }}
              textColor={colors.error.main}
              style={styles.dialogButton}
            >
              Sil
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default ManualMode; 