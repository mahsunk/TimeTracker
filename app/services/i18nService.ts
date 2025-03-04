import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import { storageService } from '@/services/storage';

export type Language = 'tr' | 'en';

export const translations = {
  tr: {
    // Genel
    save: 'Kaydet',
    cancel: 'İptal',
    delete: 'Sil',
    edit: 'Düzenle',
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    unknownProject: 'Bilinmeyen Proje',
    unknownCategory: 'Bilinmeyen Kategori',
    hours: 'saat',
    minutes: 'dakika',
    hourShort: 's',
    minuteShort: 'dk',
    activeFilters: 'Aktif Filtreler',
    statistics: 'İstatistikler',
    totalTime: 'Toplam Süre',
    entries: 'Kayıtlar',
    avgTime: 'Ortalama Süre',
    noEntries: 'Kayıt bulunamadı',
    week: 'Hafta',
    month: 'Ay',
    customDate: 'Özel Tarih',
    loadError: 'Yükleme hatası',
    dateError: 'Tarih hatası',
    saveError: 'Kaydetme hatası',
    timeSelection: 'Zaman Seçimi',
    notes: 'Notlar',
    startDate: 'Başlangıç Tarihi',
    endDate: 'Bitiş Tarihi',
    addNote: 'Not ekle',
    start: 'Başlat',
    stop: 'Durdur',
    selectProject: 'Proje Seç',
    project: 'Proje',
    category: 'Kategori',
    timer: 'Zamanlayıcı',

    // Ana sayfa
    home: 'Ana Sayfa',
    timerCard: 'Zamanlayıcı',
    timerDescription: 'Süreyi otomatik hesapla',
    manualCard: 'Manuel Giriş',
    manualDescription: 'Süreyi manuel gir',
    
    // Raporlar
    reports: 'Raporlar',
    workReports: 'Çalışma Raporları',
    
    // Ayarlar
    settings: 'Ayarlar',
    appearance: 'Görünüm',
    darkMode: 'Karanlık Mod',
    darkModeDesc: 'Karanlık temayı etkinleştir',
    language: 'Dil',
    languageDesc: 'Uygulama dilini değiştir',
    notifications: 'Bildirimler',
    notificationsDesc: 'Bildirim ayarlarını yönet',
    dailyReminder: 'Günlük Hatırlatıcı',
    dailyReminderDesc: 'Her gün belirli bir saatte hatırlatma al',
    reminderTime: 'Hatırlatma Zamanı',
    inactivityReminder: 'Hareketsizlik Hatırlatıcısı',
    inactivityDesc: 'Belirli bir süre hareketsiz kalındığında uyar',
    warningDuration: 'Uyarı Süresi',
    goalReminder: 'Hedef Hatırlatıcısı',
    goalReminderDesc: 'Günlük hedefine ulaştığında bildirim al',
    dailyGoal: 'Günlük Hedef',
    autoSync: 'Otomatik Senkronizasyon',
    autoSyncDesc: 'Verileri otomatik olarak senkronize et',
    exportData: 'Verileri Dışa Aktar',
    dataManagement: 'Veri Yönetimi',
    dangerZone: 'Tehlikeli Bölge',
    clearData: 'Verileri Temizle',
    about: 'Hakkında',
    version: 'Versiyon',
    privacyPolicy: 'Gizlilik Politikası',
    userGuide: 'Kullanım Kılavuzu',
    settingsSubtitle: 'Uygulama ayarlarını özelleştir',
    appearanceSubtitle: 'Görünüm ve dil ayarları',
    notificationsSubtitle: 'Bildirim tercihleri',
    dataManagementSubtitle: 'Veri yedekleme ve silme',
    dangerZoneSubtitle: 'Dikkat! Bu işlemler geri alınamaz',
    aboutSubtitle: 'Uygulama bilgileri',

    // Proje formu
    newProject: 'Yeni Proje',
    editProject: 'Projeyi Düzenle',
    projectName: 'Proje Adı',
    projectDescription: 'Açıklama',
    projectColor: 'Proje Rengi',
    selectColor: 'Renk Seç',
    select: 'Seç',
    projectNameRequired: 'Proje adı zorunludur',
    projectNameTooLong: 'Proje adı çok uzun (en fazla 50 karakter)',
    projectDescTooLong: 'Açıklama çok uzun (en fazla 200 karakter)',
    projectSaveError: 'Proje kaydedilirken bir hata oluştu',

    // Kategori formu
    newCategory: 'Yeni Kategori',
    editCategory: 'Kategoriyi Düzenle',
    categoryName: 'Kategori Adı',
    categoryIcon: 'Kategori İkonu',
    selectIcon: 'İkon Seç',
    categoryNameRequired: 'Kategori adı zorunludur',
    categoryNameTooLong: 'Kategori adı çok uzun (en fazla 30 karakter)',
    categorySaveError: 'Kategori kaydedilirken bir hata oluştu',

    // Zaman düzenleme formu
    newTimeEntry: 'Yeni Zaman Kaydı',
    editTimeEntry: 'Zamanı Düzenle',
    startTime: 'Başlangıç Zamanı',
    endTime: 'Bitiş Zamanı',
    timeNote: 'Not',
    invalidTimeRange: 'Bitiş zamanı başlangıç zamanından sonra olmalıdır',
    projectRequired: 'Proje seçimi zorunludur',
    categoryRequired: 'Kategori seçimi zorunludur',
    timeEntrySaveError: 'Zaman kaydı kaydedilirken bir hata oluştu',

    // Greetings
    goodMorning: 'Günaydın',
    goodAfternoon: 'İyi günler',
    goodEvening: 'İyi akşamlar',
    goodNight: 'İyi geceler',
    whatWouldYouLikeToDoToday: 'Bugün neler yapmak istersin?',
    
    // Time Display
    activeTimer: 'Zamanlayıcı Aktif',
    timerRunningFor: 'Çalışmanız {hours} saat {minutes} dakikadır devam ediyor.',
    minimumDuration: 'Süre en az 1 dakika olmalıdır',
    
    // Manual Mode
    selectStartEndTime: 'Başlangıç ve bitiş zamanını seç',
    
    // Quick Date Selector
    todayButton: 'Bugün',
    yesterdayButton: 'Dün',
    weekButton: 'Hafta',
    customButton: 'Özel',
    customDateSelection: 'Özel Tarih Seçimi',
    
    // Stats
    todayStats: 'Bugün',
    thisWeekStats: 'Bu Hafta',
    averageStats: 'Ortalama',
    
    // Reports
    dateRange: 'Tarih Aralığı',
    filters: 'Filtreler',
    thisWeekFilter: 'Bu Hafta',
    thisMonthFilter: 'Bu Ay',
    invalidDate: 'Geçersiz Tarih',
  },
  en: {
    // General
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    unknownProject: 'Unknown Project',
    unknownCategory: 'Unknown Category',
    hours: 'hours',
    minutes: 'minutes',
    hourShort: 'h',
    minuteShort: 'm',
    activeFilters: 'Active Filters',
    statistics: 'Statistics',
    totalTime: 'Total Time',
    entries: 'Entries',
    avgTime: 'Average Time',
    noEntries: 'No entries found',
    week: 'Week',
    month: 'Month',
    customDate: 'Custom Date',
    loadError: 'Loading error',
    dateError: 'Date error',
    saveError: 'Save error',
    timeSelection: 'Time Selection',
    notes: 'Notes',
    startDate: 'Start Date',
    endDate: 'End Date',
    addNote: 'Add note',
    start: 'Start',
    stop: 'Stop',
    selectProject: 'Select Project',
    project: 'Project',
    category: 'Category',
    timer: 'Timer',

    // Home
    home: 'Home',
    timerCard: 'Timer',
    timerDescription: 'Calculate time automatically',
    manualCard: 'Manual Entry',
    manualDescription: 'Enter time manually',
    
    // Reports
    reports: 'Reports',
    workReports: 'Work Reports',
    
    // Settings
    settings: 'Settings',
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Enable dark theme',
    language: 'Language',
    languageDesc: 'Change application language',
    notifications: 'Notifications',
    notificationsDesc: 'Manage notification settings',
    dailyReminder: 'Daily Reminder',
    dailyReminderDesc: 'Get reminded at a specific time each day',
    reminderTime: 'Reminder Time',
    inactivityReminder: 'Inactivity Reminder',
    inactivityDesc: 'Get warned when inactive for a period',
    warningDuration: 'Warning Duration',
    goalReminder: 'Goal Reminder',
    goalReminderDesc: 'Get notified when you reach your daily goal',
    dailyGoal: 'Daily Goal',
    autoSync: 'Auto Sync',
    autoSyncDesc: 'Automatically synchronize data',
    exportData: 'Export Data',
    dataManagement: 'Data Management',
    dangerZone: 'Danger Zone',
    clearData: 'Clear Data',
    about: 'About',
    version: 'Version',
    privacyPolicy: 'Privacy Policy',
    userGuide: 'User Guide',
    settingsSubtitle: 'Customize application settings',
    appearanceSubtitle: 'Appearance and language settings',
    notificationsSubtitle: 'Notification preferences',
    dataManagementSubtitle: 'Data backup and deletion',
    dangerZoneSubtitle: 'Warning! These actions cannot be undone',
    aboutSubtitle: 'Application information',

    // Proje formu
    newProject: 'New Project',
    editProject: 'Edit Project',
    projectName: 'Project Name',
    projectDescription: 'Description',
    projectColor: 'Project Color',
    selectColor: 'Select Color',
    select: 'Select',
    projectNameRequired: 'Project name is required',
    projectNameTooLong: 'Project name is too long (max 50 characters)',
    projectDescTooLong: 'Description is too long (max 200 characters)',
    projectSaveError: 'Failed to save project',

    // Kategori formu
    newCategory: 'New Category',
    editCategory: 'Edit Category',
    categoryName: 'Category Name',
    categoryIcon: 'Category Icon',
    selectIcon: 'Select Icon',
    categoryNameRequired: 'Category name is required',
    categoryNameTooLong: 'Category name is too long (max 30 characters)',
    categorySaveError: 'Failed to save category',

    // Time edit form
    newTimeEntry: 'New Time Entry',
    editTimeEntry: 'Edit Time',
    startTime: 'Start Time',
    endTime: 'End Time',
    timeNote: 'Note',
    invalidTimeRange: 'End time must be after start time',
    projectRequired: 'Project selection is required',
    categoryRequired: 'Category selection is required',
    timeEntrySaveError: 'Failed to save time entry',

    // Greetings
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    goodNight: 'Good Night',
    whatWouldYouLikeToDoToday: 'What would you like to do today?',
    
    // Time Display
    activeTimer: 'Timer Active',
    timerRunningFor: 'Your work has been continuing for {hours} hours {minutes} minutes.',
    minimumDuration: 'Duration must be at least 1 minute',
    
    // Manual Mode
    selectStartEndTime: 'Select start and end time',
    
    // Quick Date Selector
    todayButton: 'Today',
    yesterdayButton: 'Yesterday',
    weekButton: 'Week',
    customButton: 'Custom',
    customDateSelection: 'Custom Date Selection',
    
    // Stats
    todayStats: 'Today',
    thisWeekStats: 'This Week',
    averageStats: 'Average',
    
    // Reports
    dateRange: 'Date Range',
    filters: 'Filters',
    thisWeekFilter: 'This Week',
    thisMonthFilter: 'This Month',
    invalidDate: 'Invalid Date',
  },
};

class I18nService {
  private i18n: I18n;
  private initialized: boolean = false;
  private initPromise: Promise<void>;

  constructor() {
    this.i18n = new I18n(translations);
    this.i18n.enableFallback = true;
    this.i18n.defaultLocale = 'tr';
    this.initPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Önce cihaz dilini al
      const deviceLocale = Localization.locale.split('-')[0] as Language;
      
      // Kayıtlı dil ayarını kontrol et
      const settings = await storageService.getSettings();
      const savedLanguage = settings?.language as Language;

      // Kayıtlı dil varsa onu, yoksa cihaz dilini kullan
      const finalLocale = savedLanguage || deviceLocale || 'tr';
      
      this.i18n.locale = finalLocale;
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing i18n:', error);
      // Hata durumunda varsayılan dili kullan
      this.i18n.locale = 'tr';
      this.initialized = true;
    }
  }

  async waitForInit(): Promise<void> {
    return this.initPromise;
  }

  t(key: string, params = {}): string {
    if (!this.initialized) {
      console.warn('i18nService is not initialized yet, using default locale');
      return this.i18n.t(key, params);
    }
    return this.i18n.t(key, params);
  }

  async setLanguage(language: Language): Promise<void> {
    await this.waitForInit();
    try {
      const settings = await storageService.getSettings();
      if (settings) {
        await storageService.saveSettings({
          ...settings,
          language,
        });
        this.i18n.locale = language;
      }
    } catch (error) {
      console.error('Error setting language:', error);
    }
  }

  getLanguage(): string {
    return this.i18n.locale;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export default new I18nService(); 