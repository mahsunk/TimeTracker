import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Text, Surface, IconButton, Divider, ActivityIndicator, Portal, Modal, SegmentedButtons, Button, useTheme } from 'react-native-paper';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, addMonths, isWithinInterval, addWeeks, subWeeks, parseISO, startOfDay, endOfDay, addDays } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { storageService } from '../services/storage';
import { TimeEntry } from '../types';
import i18nService from '../services/i18nService';
import ManualMode from '../components/ManualMode';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CustomTheme } from '../services/theme';

const FilterChip = ({ label, selected, onPress, icon }: { label: string; selected: boolean; onPress: () => void; icon: string }) => {
  const theme = useTheme() as CustomTheme;
  const colors = theme.colors.extended;
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.filterChip,
        selected && styles.filterChipSelected,
        { backgroundColor: selected ? colors.primary.main : theme.colors.surface }
      ]}
    >
      <IconButton 
        icon={icon}
        size={20}
        iconColor={selected ? theme.colors.surface : colors.neutral[600]}
        style={styles.filterIcon}
      />
      <Text style={[
        styles.filterChipText,
        selected && styles.filterChipTextSelected,
        { color: selected ? theme.colors.surface : colors.neutral[700] }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const ReportsScreen = () => {
  const theme = useTheme() as CustomTheme;
  const colors = theme.colors.extended;
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  type PeriodType = 'week' | 'month' | 'customDate';
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('week');
  const [customDateRange, setCustomDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: new Date(),
    end: new Date()
  });
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const entriesData = await storageService.getTimeEntries();
      setTimeEntries(entriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEntries = () => {
    let filteredEntries = [...timeEntries];
    const now = new Date();

    switch (selectedPeriod) {
      case 'week':
        const weekStart = startOfWeek(selectedWeek, { locale: i18nService.getLanguage() === 'tr' ? tr : enUS });
        const weekEnd = endOfWeek(selectedWeek, { locale: i18nService.getLanguage() === 'tr' ? tr : enUS });
        filteredEntries = timeEntries.filter(entry => {
          const entryDate = parseISO(entry.startTime);
          return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
        });
        break;
      case 'month':
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        filteredEntries = timeEntries.filter(entry => {
          const entryDate = parseISO(entry.startTime);
          return isWithinInterval(entryDate, { start: monthStart, end: monthEnd });
        });
        break;
      case 'customDate':
        if (customDateRange.start && customDateRange.end) {
          const startDate = startOfDay(customDateRange.start);
          const endDate = endOfDay(customDateRange.end);
          filteredEntries = timeEntries.filter(entry => {
            const entryDate = parseISO(entry.startTime);
            return isWithinInterval(entryDate, { start: startDate, end: endDate });
          });
        }
        break;
    }

    return filteredEntries;
  };

  const isPeriodSelected = (period: PeriodType) => selectedPeriod === period;

  const renderFilterSection = () => (
    <Surface style={[styles.filterSection, { backgroundColor: theme.colors.surface }]} elevation={2}>
      <View style={styles.filterHeader}>
        <View style={styles.filterTitleContainer}>
          <IconButton 
            icon="filter-variant" 
            size={24}
            iconColor={colors.primary.main}
            style={styles.filterIcon}
          />
          <Text style={[styles.filterSectionTitle, { color: theme.colors.onSurface }]}>
            {i18nService.t('activeFilters')}
          </Text>
        </View>
        <IconButton
          icon="tune-variant"
          size={24}
          onPress={() => setShowFilterModal(true)}
          style={styles.moreFiltersButton}
        />
      </View>
      
      {selectedPeriod === 'week' && (
        <View style={styles.weekNavigator}>
          <IconButton
            icon="chevron-left"
            size={24}
            iconColor={colors.primary.main}
            onPress={() => setSelectedWeek(subWeeks(selectedWeek, 1))}
            style={styles.weekNavButton}
          />
          <Text style={[styles.weekText, { color: colors.primary.main }]}>
            {format(selectedWeek, 'dd MMM', { locale: i18nService.getLanguage() === 'tr' ? tr : enUS })} - 
            {format(addDays(selectedWeek, 6), 'dd MMM', { locale: i18nService.getLanguage() === 'tr' ? tr : enUS })}
          </Text>
          <IconButton
            icon="chevron-right"
            size={24}
            iconColor={colors.primary.main}
            onPress={() => setSelectedWeek(addWeeks(selectedWeek, 1))}
            style={styles.weekNavButton}
          />
        </View>
      )}

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterChipsScroll}
        contentContainerStyle={styles.filterChipsContent}
      >
        <FilterChip
          label={i18nService.t('week')}
          selected={isPeriodSelected('week')}
          onPress={() => setSelectedPeriod('week')}
          icon="calendar-week"
        />
        <FilterChip
          label={i18nService.t('month')}
          selected={isPeriodSelected('month')}
          onPress={() => setSelectedPeriod('month')}
          icon="calendar-month"
        />
        <FilterChip
          label={i18nService.t('customDate')}
          selected={isPeriodSelected('customDate')}
          onPress={() => setSelectedPeriod('customDate')}
          icon="calendar-range"
        />
      </ScrollView>
    </Surface>
  );

  const renderStats = () => {
    const filteredEntries = getFilteredEntries();
    const totalDuration = calculateTotalDuration(filteredEntries);
    const avgDuration = filteredEntries.length > 0 ? totalDuration / filteredEntries.length : 0;

    return (
      <Surface style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]} elevation={2}>
        <View style={styles.statsHeader}>
          <View style={styles.statsTitleContainer}>
            <IconButton
              icon="chart-box"
              size={24}
              iconColor={colors.primary.main}
              style={styles.statsIcon}
            />
            <Text style={[styles.statsTitle, { color: theme.colors.onSurface }]}>
              {i18nService.t('statistics')}
            </Text>
          </View>
          <View style={styles.statsDateRange}>
            <Text style={styles.statsDateText}>
              {selectedPeriod === 'week' ? `${format(startOfWeek(new Date(), { locale: i18nService.getLanguage() === 'tr' ? tr : enUS }), 'dd MMM')} - ${format(endOfWeek(new Date(), { locale: i18nService.getLanguage() === 'tr' ? tr : enUS }), 'dd MMM')}` :
               selectedPeriod === 'month' ? format(new Date(), 'MMMM yyyy', { locale: i18nService.getLanguage() === 'tr' ? tr : enUS }) :
               customDateRange.start && customDateRange.end ? `${format(customDateRange.start, 'dd MMM')} - ${format(customDateRange.end, 'dd MMM')}` : ''}
            </Text>
          </View>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <IconButton
                icon="clock-outline"
                size={24}
                iconColor={colors.primary.main}
                style={styles.statCardIcon}
              />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                {i18nService.t('totalTime')}
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                {formatDuration(totalDuration).formatted}
              </Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <IconButton
                icon="format-list-bulleted"
                size={24}
                iconColor={colors.primary.main}
                style={styles.statCardIcon}
              />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                {i18nService.t('entries')}
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                {filteredEntries.length}
              </Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <IconButton
                icon="chart-timeline-variant"
                size={24}
                iconColor={colors.primary.main}
                style={styles.statCardIcon}
              />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                {i18nService.t('avgTime')}
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                {formatDuration(avgDuration).formatted}
              </Text>
            </View>
          </View>
        </View>
      </Surface>
    );
  };

  const renderEntries = () => {
    const filteredEntries = getFilteredEntries();
    
    if (filteredEntries.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{i18nService.t('noEntries')}</Text>
        </View>
      );
    }

    return (
      <Surface style={[styles.entriesContainer, { backgroundColor: theme.colors.surface }]} elevation={2}>
        <ScrollView style={styles.entriesList}>
          {filteredEntries.map((entry) => (
            <TouchableOpacity 
              key={entry.id}
              onPress={() => handleEditEntry(entry)}
            >
              <Surface 
                style={[styles.entryCard, { backgroundColor: theme.colors.surface }]} 
                elevation={1}
              >
                <View style={styles.entryHeader}>
                  <View style={styles.headerContent}>
                    <View style={styles.leftContent}>
                      <View style={styles.dateSection}>
                        <View style={styles.datePart}>
                          <Text style={[styles.dayNumber, { color: colors.primary.main }]}>
                            {format(parseISO(entry.startTime), 'd', { locale: i18nService.getLanguage() === 'tr' ? tr : enUS })}
                          </Text>
                          <View style={styles.monthYearContainer}>
                            <Text style={[styles.monthText, { color: colors.neutral[600] }]}>
                              {format(parseISO(entry.startTime), 'MMMM', { locale: i18nService.getLanguage() === 'tr' ? tr : enUS })}
                            </Text>
                            <Text style={[styles.yearText, { color: colors.neutral[500] }]}>
                              {format(parseISO(entry.startTime), 'yyyy', { locale: i18nService.getLanguage() === 'tr' ? tr : enUS })}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={[styles.timeContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                        <IconButton 
                          icon="clock-outline"
                          size={18}
                          iconColor={colors.primary.main}
                          style={styles.timeIcon}
                        />
                        <Text style={[styles.timeText, { color: theme.colors.onSurface }]}>
                          {format(parseISO(entry.startTime), 'HH:mm')} - {format(parseISO(entry.endTime), 'HH:mm')}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rightContent}>
                      <View style={styles.timeInfoContainer}>
                        <View style={styles.dayRow}>
                          <Text style={[styles.dayName, { 
                            color: colors.primary.main,
                            fontSize: 16,
                            fontWeight: '700'
                          }]}>
                            {format(parseISO(entry.startTime), 'EEEE', { locale: i18nService.getLanguage() === 'tr' ? tr : enUS })}
                          </Text>
                        </View>
                        <View style={styles.durationRow}>
                          <Text style={[styles.durationText, { color: '#333' }]}>
                            <Text style={styles.durationNumber}>{formatDuration(entry.duration).hours}</Text>
                            <Text style={styles.durationUnit}>{i18nService.t('hourShort')}</Text>
                            <Text style={styles.durationSeparator}>{" : "}</Text>
                            <Text style={styles.durationNumber}>{formatDuration(entry.duration).minutes}</Text>
                            <Text style={styles.durationUnit}>{i18nService.t('minuteShort')}</Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                {entry.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={[styles.notesText, { color: theme.colors.onSurfaceVariant }]}>
                      {entry.notes}
                    </Text>
                  </View>
                )}
                <View style={styles.entryFooter}>
                  <View style={styles.badgeContainer}>
                    {entry.type === 'break' && (
                      <View style={[styles.badge, { backgroundColor: colors.warning.light }]}>
                        <Text style={[styles.badgeText, { color: colors.warning.main }]}>Mola</Text>
                      </View>
                    )}
                    {entry.isOvertime && (
                      <View style={[styles.badge, { backgroundColor: colors.error.light }]}>
                        <Text style={[styles.badgeText, { color: colors.error.main }]}>Fazla Mesai</Text>
                      </View>
                    )}
                  </View>
                </View>
              </Surface>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Surface>
    );
  };

  const calculateTotalDuration = (entries: TimeEntry[]) => {
    return entries.reduce((total, entry) => total + entry.duration, 0);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return {
      hours: hours.toString(),
      minutes: minutes.toString().padStart(2, '0'),
      formatted: `${hours} ${i18nService.t('hours')} ${minutes} ${i18nService.t('minutes')}`
    };
  };

  const renderFilterModal = () => (
    <Portal>
      <Modal
        visible={showFilterModal}
        onDismiss={() => setShowFilterModal(false)}
        contentContainerStyle={[
          styles.filterModal,
          Platform.OS === 'android' ? styles.modalAndroid : styles.modalIOS,
          { backgroundColor: theme.colors.surface }
        ]}
      >
        <View style={[styles.filterModalHeader, { borderBottomColor: theme.colors.outline }]}>
          <IconButton
            icon="close"
            size={24}
            onPress={() => setShowFilterModal(false)}
            style={styles.closeButton}
          />
          <Text style={[styles.filterTitle, { color: theme.colors.onSurface }]}>
            {i18nService.t('filters')}
          </Text>
        </View>
        <ScrollView>
          {/* Tarih Filtreleri */}
          <View style={styles.filterCategories}>
            <Text style={[styles.filterCategoryTitle, { color: theme.colors.onSurface }]}>
              {i18nService.t('dateRange')}
            </Text>
            <View style={styles.filterOptionsGrid}>
              <TouchableOpacity
                style={[
                  styles.filterGridItem,
                  { backgroundColor: theme.colors.surface },
                  selectedPeriod === 'week' && styles.filterGridItemSelected
                ]}
                onPress={() => setSelectedPeriod('week')}
              >
                <IconButton icon="calendar-week" size={24} />
                <Text style={styles.filterGridText}>{i18nService.t('thisWeekFilter')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterGridItem,
                  { backgroundColor: theme.colors.surface },
                  selectedPeriod === 'month' && styles.filterGridItemSelected
                ]}
                onPress={() => setSelectedPeriod('month')}
              >
                <IconButton icon="calendar-month" size={24} />
                <Text style={styles.filterGridText}>{i18nService.t('thisMonthFilter')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterGridItem,
                  { backgroundColor: theme.colors.surface },
                  selectedPeriod === 'customDate' && styles.filterGridItemSelected
                ]}
                onPress={() => setSelectedPeriod('customDate')}
              >
                <IconButton icon="calendar-range" size={24} />
                <Text style={styles.filterGridText}>{i18nService.t('customButton')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Özel Tarih Seçimi */}
          {selectedPeriod === 'customDate' && (
            <View style={styles.customDateSection}>
              <Text style={styles.customDateTitle}>{i18nService.t('customDateSelection')}</Text>
              <View style={styles.datePickerContainer}>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <IconButton
                    icon="calendar"
                    size={24}
                    iconColor={colors.primary.main}
                  />
                  <View>
                    <Text style={styles.datePickerLabel}>{i18nService.t('startDate')}</Text>
                    <Text style={styles.datePickerValue}>
                      {format(customDateRange.start || new Date(), 'dd.MM.yyyy', { locale: i18nService.getLanguage() === 'tr' ? tr : enUS })}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <IconButton
                    icon="calendar"
                    size={24}
                    iconColor={colors.primary.main}
                  />
                  <View>
                    <Text style={styles.datePickerLabel}>{i18nService.t('endDate')}</Text>
                    <Text style={styles.datePickerValue}>
                      {format(customDateRange.end || new Date(), 'dd.MM.yyyy', { locale: i18nService.getLanguage() === 'tr' ? tr : enUS })}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {showStartDatePicker && (
                <DateTimePicker
                  value={customDateRange.start || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowStartDatePicker(false);
                    if (selectedDate) {
                      setCustomDateRange(prev => ({ ...prev, start: selectedDate }));
                    }
                  }}
                />
              )}

              {showEndDatePicker && (
                <DateTimePicker
                  value={customDateRange.end || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowEndDatePicker(false);
                    if (selectedDate) {
                      setCustomDateRange(prev => ({ ...prev, end: selectedDate }));
                    }
                  }}
                />
              )}
            </View>
          )}
        </ScrollView>

        <Button
          mode="contained"
          onPress={() => setShowFilterModal(false)}
          style={styles.applyButton}
          contentStyle={styles.applyButtonContent}
        >
          Uygula
        </Button>
      </Modal>
    </Portal>
  );

  const handleEditEntry = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setShowEditModal(true);
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await storageService.deleteTimeEntry(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const renderEditModal = () => (
    <Portal>
      <Modal
        visible={showEditModal}
        onDismiss={() => {
          setShowEditModal(false);
          setSelectedEntry(null);
        }}
        contentContainerStyle={[
          styles.editModal,
          { backgroundColor: theme.colors.surface }
        ]}
      >
        {selectedEntry && (
          <ManualMode
            editEntry={selectedEntry}
            onClose={() => {
              setShowEditModal(false);
              setSelectedEntry(null);
              loadData();
            }}
            onDelete={() => handleDeleteEntry(selectedEntry.id)}
          />
        )}
      </Modal>
    </Portal>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderFilterSection()}
      {renderStats()}
      {renderEntries()}
      {renderFilterModal()}
      {renderEditModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  filterSection: {
    margin: 12,
    marginBottom: 6,
    borderRadius: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  moreFiltersButton: {
    marginRight: -8,
  },
  filterChipsScroll: {
    paddingVertical: 6,
  },
  filterChipsContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterIcon: {
    margin: 0,
    width: 32,
    height: 32,
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginRight: 8,
  },
  filterChipTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
  },
  filterCategories: {
    padding: 16,
  },
  filterCategoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  filterOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterGridItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  filterGridItemSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterGridText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  filterGridTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  customDateSection: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F8F8F8',
  },
  customDateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  applyButton: {
    margin: 16,
    borderRadius: 12,
  },
  applyButtonContent: {
    height: 48,
  },
  filterModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    margin: 0,
  },
  filterTitle: {
    flex: 1,
    textAlign: 'center',
    marginRight: 48,
    color: '#333',
  },
  statsContainer: {
    margin: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsIcon: {
    margin: 0,
    marginRight: 6,
  },
  statsDateRange: {
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statsDateText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statCardIcon: {
    margin: 0,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 6,
  },
  statContent: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  entryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  entryContent: {
    flex: 1,
  },
  entryDuration: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  entryNotes: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  entryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    flex: 1,
    maxHeight: Platform.OS === 'android' ? '100%' : '80%',
  },
  modalAndroid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 0,
    marginTop: 0,
  },
  modalIOS: {
    maxHeight: '80%',
  },
  deleteModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  deleteTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteMessage: {
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  deleteButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  deleteButton: {
    margin: 0,
  },
  sortSection: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  sortHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sortTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  sortButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortButton: {
    flex: 1,
  },
  directionButton: {
    margin: 0,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  timeSeparator: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
  },
  dateIcon: {
    margin: 0,
    marginRight: 8,
  },
  durationIcon: {
    marginRight: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearButton: {
    marginLeft: 8,
  },
  clearDataModal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  clearDataModalContent: {
    alignItems: 'center',
  },
  clearDataIcon: {
    margin: 0,
    marginBottom: 16,
  },
  clearDataTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  clearDataMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  clearDataButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  clearDataButton: {
    flex: 1,
  },
  clearDataConfirmButton: {
    borderColor: '#FF5252',
  },
  datePickerContainer: {
    gap: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  datePickerLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  datePickerValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateMonth: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  dateYear: {
    fontSize: 12,
    marginTop: 2,
  },
  editModal: {
    margin: 0,
    padding: 0,
    flex: 1,
    backgroundColor: 'white',
  },
  entriesContainer: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  entriesList: {
    padding: 12,
  },
  entryCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  entryHeader: {
    padding: 12,
    backgroundColor: 'white',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  leftContent: {
    flex: 1,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  datePart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2563EB',
  },
  monthYearContainer: {
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    textTransform: 'capitalize',
  },
  yearText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  timeIcon: {
    margin: 0,
    marginRight: 4,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  timeInfoContainer: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
    minWidth: 120,
  },
  dayRow: {
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    width: '100%',
    alignItems: 'center',
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    textTransform: 'capitalize',
  },
  durationRow: {
    alignItems: 'center',
  },
  durationText: {
    textAlign: 'center',
  },
  durationNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#334155',
  },
  durationUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 1,
  },
  durationSeparator: {
    fontSize: 20,
    fontWeight: '600',
    color: '#334155',
    marginHorizontal: 2,
  },
  notesContainer: {
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  entryFooter: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  weekNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  weekNavButton: {
    margin: 0,
  },
  weekText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 8,
  },
});

export default ReportsScreen; 