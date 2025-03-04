import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface, IconButton, Portal, Modal } from 'react-native-paper';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { router } from 'expo-router';
import { storageService } from '../services/storage';
import { TimeEntry } from '../types';
import i18nService from '../services/i18nService';
import WorkTimeForm from '../components/WorkTimeForm';

export default function Home() {
  const [showWorkTimeModal, setShowWorkTimeModal] = useState(false);
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    average: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const entries = await storageService.getTimeEntries();
      
      // Bugünün başlangıcı
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Haftanın başlangıcı
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      // Bugünkü toplam süre
      const todayTotal = entries
        .filter(entry => new Date(entry.startTime) >= today)
        .reduce((sum, entry) => sum + entry.duration, 0);

      // Haftalık toplam süre
      const weekTotal = entries
        .filter(entry => new Date(entry.startTime) >= weekStart)
        .reduce((sum, entry) => sum + entry.duration, 0);

      // Son 7 günün ortalaması
      const last7Days = entries
        .filter(entry => {
          const entryDate = new Date(entry.startTime);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return entryDate >= sevenDaysAgo;
        });

      const averagePerDay = last7Days.length > 0 
        ? Math.floor(last7Days.reduce((sum, entry) => sum + entry.duration, 0) / 7)
        : 0;

      setStats({
        today: todayTotal,
        week: weekTotal,
        average: averagePerDay
      });
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}s ${minutes}d`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return i18nService.t('goodNight');
    if (hour < 12) return i18nService.t('goodMorning');
    if (hour < 17) return i18nService.t('goodAfternoon');
    if (hour < 22) return i18nService.t('goodEvening');
    return i18nService.t('goodNight');
  };

  const handleSaveWorkTime = async (entry: TimeEntry) => {
    try {
      await storageService.saveTimeEntry(entry);
      setShowWorkTimeModal(false);
    } catch (error) {
      console.error('Çalışma saati kaydedilemedi:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hoşgeldin Kartı */}
      <Surface style={styles.welcomeCard} elevation={4}>
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeLeft}>
            <IconButton 
              icon="hand-wave" 
              size={32}
              iconColor="#3B82F6"
              style={styles.welcomeIcon}
            />
            <View style={styles.welcomeTexts}>
              <Text style={styles.welcomeText}>{getGreeting()}</Text>
              <Text style={styles.dateText}>
                {format(new Date(), 'dd MMMM yyyy, EEEE', { locale: tr })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <IconButton 
              icon="clock-time-four"
              size={20}
              iconColor="#3B82F6"
              style={styles.statIcon}
            />
            <View style={styles.statTexts}>
              <Text style={styles.statLabel}>{i18nService.t('todayStats')}</Text>
              <Text style={styles.statValue}>{formatDuration(stats.today)}</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <IconButton 
              icon="calendar-check"
              size={20}
              iconColor="#10B981"
              style={styles.statIcon}
            />
            <View style={styles.statTexts}>
              <Text style={styles.statLabel}>{i18nService.t('thisWeekStats')}</Text>
              <Text style={styles.statValue}>{formatDuration(stats.week)}</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <IconButton 
              icon="chart-areaspline"
              size={20}
              iconColor="#8B5CF6"
              style={styles.statIcon}
            />
            <View style={styles.statTexts}>
              <Text style={styles.statLabel}>{i18nService.t('averageStats')}</Text>
              <Text style={styles.statValue}>{formatDuration(stats.average)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.welcomeFooter}>
          <Text style={styles.welcomeSubtext}>
            {i18nService.t('whatWouldYouLikeToDoToday')}
          </Text>
        </View>
      </Surface>

      {/* Hızlı Başlat Kartları */}
      <View style={styles.quickStartGrid}>
        <TouchableOpacity
          style={[styles.quickStartCard, { backgroundColor: '#EBF5FF' }]}
          onPress={() => router.push('/(modals)/timer')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
            <IconButton 
              icon="timer-outline"
              size={32}
              iconColor="#3B82F6"
              style={styles.quickStartIcon}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.quickStartTitle, { color: '#3B82F6' }]}>
              {i18nService.t('timerCard')}
            </Text>
            <Text style={styles.quickStartDesc}>
              {i18nService.t('timerDescription')}
            </Text>
          </View>
          <View style={[styles.startButton, { backgroundColor: '#3B82F6' }]}>
            <IconButton 
              icon="play"
              size={20}
              iconColor="#FFFFFF"
              style={styles.startIcon}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickStartCard, { backgroundColor: '#F0FDF4' }]}
          onPress={() => router.push('/(modals)/manual')}
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#DCFCE7' }]}>
            <IconButton 
              icon="pencil-outline"
              size={32}
              iconColor="#10B981"
              style={styles.quickStartIcon}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.quickStartTitle, { color: '#10B981' }]}>
              {i18nService.t('manualCard')}
            </Text>
            <Text style={styles.quickStartDesc}>
              {i18nService.t('manualDescription')}
            </Text>
          </View>
          <View style={[styles.startButton, { backgroundColor: '#10B981' }]}>
            <IconButton 
              icon="plus"
              size={20}
              iconColor="#FFFFFF"
              style={styles.startIcon}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Çalışma Saati Modalı */}
      <Portal>
        <Modal
          visible={showWorkTimeModal}
          onDismiss={() => setShowWorkTimeModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <WorkTimeForm
            onSave={handleSaveWorkTime}
            onClose={() => setShowWorkTimeModal(false)}
          />
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  welcomeCard: {
    margin: 16,
    padding: 20,
    borderRadius: 24,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  welcomeIcon: {
    margin: 0,
    marginRight: 16,
    backgroundColor: '#EBF5FF',
    borderRadius: 16,
    padding: 8,
  },
  welcomeTexts: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  statIcon: {
    margin: 0,
    marginRight: 4,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statTexts: {
    flex: 1,
    minWidth: 0,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 6,
  },
  welcomeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#64748B',
    flex: 1,
    fontWeight: '500',
  },
  quickStartGrid: {
    flexDirection: 'row',
    margin: 16,
    marginTop: 0,
    gap: 16,
  },
  quickStartCard: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickStartIcon: {
    margin: 0,
  },
  cardContent: {
    marginBottom: 16,
  },
  quickStartTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  quickStartDesc: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    lineHeight: 20,
  },
  startButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  startIcon: {
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    margin: 0,
    backgroundColor: 'white',
  },
}); 