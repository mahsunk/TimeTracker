import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ScrollView, Animated } from 'react-native';
import { Text, Button, Surface, IconButton, Portal, Dialog, Switch, useTheme, TextInput } from 'react-native-paper';
import { storageService } from '../services/storage';
import { TimeEntry } from '../types';
import { nanoid } from 'nanoid/non-secure';
import i18nService from '../services/i18nService';
import NotesInput from './NotesInput';
import { format } from 'date-fns';
import { CustomTheme } from '../services/theme';
import { tr } from 'date-fns/locale';

interface TimerModeProps {
  onClose: () => void;
}

const TimerMode: React.FC<TimerModeProps> = ({ onClose }) => {
  const theme = useTheme() as CustomTheme;
  const colors = theme.colors.extended;
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [totalBreakDuration, setTotalBreakDuration] = useState(0);
  const [breakHistory, setBreakHistory] = useState<{startTime: Date, endTime: Date}[]>([]);

  // Animasyon değerleri
  const [scaleAnim] = useState(new Animated.Value(1));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);

      // Nabız animasyonu
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      setStartTime(new Date());
      setIsRunning(true);
      setError(null);

      // Başlat butonu animasyonu
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error starting timer:', error);
      setError('Zamanlayıcı başlatılamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleBreakToggle = (value: boolean) => {
    setIsBreak(value);
    if (value) {
      setBreakStartTime(new Date());
    } else if (breakStartTime) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - breakStartTime.getTime()) / 1000 / 60);
      setTotalBreakDuration(prev => prev + duration);
      setBreakHistory(prev => [...prev, {startTime: breakStartTime, endTime}]);
      setBreakStartTime(null);
    }
  };

  const handleStop = async () => {
    if (!startTime) return;
    
    try {
      setLoading(true);
      // Eğer molada iken durdurulursa, son molayı da ekle
      let finalBreakDuration = totalBreakDuration;
      if (isBreak && breakStartTime) {
        const endTime = new Date();
        const lastBreakDuration = Math.floor((endTime.getTime() - breakStartTime.getTime()) / 1000 / 60);
        finalBreakDuration += lastBreakDuration;
        setBreakHistory(prev => [...prev, {startTime: breakStartTime, endTime}]);
      }

      const endTime = new Date();
      const timeEntry: TimeEntry = {
        id: nanoid(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
        breakDuration: finalBreakDuration,
        notes: note,
        createdAt: startTime.toISOString(),
        updatedAt: endTime.toISOString(),
        type: isBreak ? 'break' : 'work',
        isOvertime: false
      };
      await storageService.saveTimeEntry(timeEntry);
      setIsRunning(false);
      pulseAnim.setValue(1);
      // Mola durumlarını sıfırla
      setIsBreak(false);
      setBreakStartTime(null);
      setTotalBreakDuration(0);
      setBreakHistory([]);
      
      // Ana ekrana dön
      onClose();
    } catch (error) {
      console.error('Error stopping timer:', error);
      setError('Zamanlayıcı durdurulamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShowResetDialog(false);
    setIsRunning(false);
    setTime(0);
    setStartTime(null);
    setNote('');
    pulseAnim.setValue(1);
  };

  const formatBreakHistory = () => {
    return breakHistory.map((break_, index) => (
      <View key={index} style={styles.breakHistoryItem}>
        <Text style={styles.breakTimeText}>
          {format(break_.startTime, 'HH:mm')} - {format(break_.endTime, 'HH:mm')}
        </Text>
        <Text style={styles.breakDurationText}>
          {Math.floor((break_.endTime.getTime() - break_.startTime.getTime()) / 1000 / 60)}d
        </Text>
      </View>
    ));
  };

  const handleStartStop = isRunning ? handleStop : handleStart;

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
    content: {
      flex: 1,
      padding: 16,
    },
    timerSection: {
      marginBottom: 24,
      alignItems: 'center',
    },
    timerCard: {
      padding: 32,
      borderRadius: 28,
      alignItems: 'center',
      width: '100%',
      backgroundColor: theme.colors.surface,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    timerText: {
      fontSize: 48,
      fontWeight: '700',
      letterSpacing: 2,
      color: theme.colors.onSurface,
    },
    startTimeText: {
      fontSize: 14,
      marginTop: 8,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
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
    actionButton: {
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
    actionButtonContent: {
      height: 58,
    },
    actionButtonLabel: {
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
    breakSection: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
    },
    breakHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    breakTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.onSurface,
    },
    activeBreak: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      marginBottom: 16,
      backgroundColor: colors.warning.light,
    },
    activeBreakInfo: {
      marginLeft: 12,
    },
    activeBreakText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.warning.dark,
      marginBottom: 4,
    },
    activeBreakTime: {
      fontSize: 13,
      color: colors.neutral[600],
    },
    breakHistory: {
      marginTop: 16,
    },
    breakHistoryTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.neutral[600],
      marginBottom: 8,
    },
    breakHistoryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    breakTimeText: {
      fontSize: 13,
      color: colors.neutral[600],
    },
    breakDurationText: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.warning.dark,
    },
    totalBreak: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outline,
    },
    totalBreakLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurface,
    },
    totalBreakDuration: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.warning.dark,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Zamanlayıcı</Text>
          <Text style={styles.subtitle}>Çalışma sürenizi ölçün</Text>
        </View>
        <IconButton
          icon="close"
          size={24}
          onPress={onClose}
          style={styles.closeButton}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.timerSection, { transform: [{ scale: pulseAnim }] }]}>
          <Surface style={[styles.timerCard, { 
            backgroundColor: isRunning ? colors.success.light : theme.colors.surface 
          }]} elevation={3}>
            <Text style={[styles.timerText, { 
              color: isRunning ? colors.success.dark : theme.colors.onSurface,
              fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
            }]}>
              {formatTime(time)}
            </Text>
            {startTime && (
              <Text style={[styles.startTimeText, { color: theme.colors.onSurfaceVariant }]}>
                Başlangıç: {startTime.toLocaleTimeString()}
              </Text>
            )}
          </Surface>
        </Animated.View>

        {isRunning && (
          <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={2}>
            <View style={[styles.sectionHeader, { 
              backgroundColor: colors.warning.light,
              borderBottomColor: colors.warning.light 
            }]}>
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
                <IconButton 
                  icon="coffee"
                  size={24}
                  iconColor={colors.warning.default}
                />
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Mola</Text>
                <Text style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                  Çalışmaya ara ver
                </Text>
              </View>
            </View>
            <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.breakHeader}>
                <Text style={styles.breakTitle}>Mola Durumu</Text>
                <Switch
                  value={isBreak}
                  onValueChange={handleBreakToggle}
                  color={colors.warning.main}
                />
              </View>
              
              {isBreak && breakStartTime && (
                <View style={[styles.activeBreak, { backgroundColor: colors.warning.light }]}>
                  <IconButton 
                    icon="timer-sand"
                    size={24}
                    iconColor={colors.warning.dark}
                  />
                  <View style={styles.activeBreakInfo}>
                    <Text style={styles.activeBreakText}>Mola Devam Ediyor</Text>
                    <Text style={styles.activeBreakTime}>
                      Başlangıç: {format(breakStartTime, 'HH:mm')}
                    </Text>
                  </View>
                </View>
              )}
              
              {breakHistory.length > 0 && (
                <View style={styles.breakHistory}>
                  <Text style={styles.breakHistoryTitle}>Mola Geçmişi</Text>
                  {formatBreakHistory()}
                  <View style={styles.totalBreak}>
                    <Text style={styles.totalBreakLabel}>Toplam Mola</Text>
                    <Text style={styles.totalBreakDuration}>{totalBreakDuration}d</Text>
                  </View>
                </View>
              )}
            </View>
          </Surface>
        )}

        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={2}>
          <View style={[styles.sectionHeader, { 
            backgroundColor: colors.primary.light,
            borderBottomColor: colors.primary.light 
          }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.surface }]}>
              <IconButton 
                icon="note-text"
                size={24}
                iconColor={colors.primary.default}
              />
            </View>
            <View style={styles.sectionTitleContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Not</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Açıklama ekle
              </Text>
            </View>
          </View>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <NotesInput 
              value={note}
              onChange={setNote}
            />
          </View>
        </Surface>
      </ScrollView>

      {error && (
        <Surface style={[styles.errorCard, { backgroundColor: colors.error.light }]} elevation={1}>
          <View style={[styles.errorIconContainer, { backgroundColor: theme.colors.surface }]}>
            <IconButton 
              icon="alert-circle"
              size={24}
              iconColor={colors.error.default}
            />
          </View>
          <Text style={[styles.errorText, { color: colors.error.dark }]}>{error}</Text>
        </Surface>
      )}

      <Surface style={[styles.footer, { backgroundColor: theme.colors.surface }]} elevation={2}>
        <Button
          mode="contained"
          onPress={handleStartStop}
          loading={loading}
          style={[styles.actionButton, { 
            backgroundColor: isRunning ? colors.error.main : colors.success.main 
          }]}
          contentStyle={styles.actionButtonContent}
          labelStyle={styles.actionButtonLabel}
        >
          {isRunning ? 'Durdur' : 'Başlat'}
        </Button>
      </Surface>

      <Portal>
        <Dialog visible={showResetDialog} onDismiss={() => setShowResetDialog(false)}>
          <Dialog.Title>Zamanlayıcıyı Sıfırla</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Zamanlayıcıyı sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowResetDialog(false)}>İptal</Button>
            <Button 
              onPress={handleReset}
              style={[styles.dialogButton, { backgroundColor: colors.error.main }]}
              textColor="white"
            >
              Sıfırla
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default TimerMode; 