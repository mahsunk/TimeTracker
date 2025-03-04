import { Language } from '../services/i18nService';
import { ThemeType } from '../services/theme';

export interface TimeEntry {
  id: string;
  startTime: string;  // ISO string formatında tarih
  endTime: string;    // ISO string formatında tarih
  duration: number;   // Saniye cinsinden süre
  breakDuration?: number; // Dakika cinsinden mola süresi
  notes?: string;
  createdAt: string;  // ISO string formatında tarih
  updatedAt: string;  // ISO string formatında tarih
  type?: 'work' | 'break'; // Çalışma veya mola
  isOvertime?: boolean;    // Fazla mesai
}

export interface NotificationSettings {
  dailyReminder: boolean;
  dailyReminderTime: string;
}

export interface WorkSettings {
  workStartTime: string;
  workEndTime: string;
  overtimeThreshold: number;
  lunchBreakStart: string;
  lunchBreakEnd: string;
  defaultBreakDuration: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  autoSync: boolean;
  notificationSettings: NotificationSettings;
  workSettings: WorkSettings;
}

const types = {
  TIME_ENTRY: 'TimeEntry',
  SETTINGS: 'Settings',
} as const;

export const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'tr',
  notifications: true,
  autoSync: true,
  notificationSettings: {
    dailyReminder: true,
    dailyReminderTime: '09:00'
  },
  workSettings: {
    workStartTime: '09:00',
    workEndTime: '17:00',
    overtimeThreshold: 1800,
    lunchBreakStart: '12:00',
    lunchBreakEnd: '13:00',
    defaultBreakDuration: 15
  }
};

declare global {
  var showReportsFilter: (() => void) | undefined;
  var refreshReports: (() => void) | undefined;
  var onThemeChange: ((theme: ThemeType) => void) | undefined;
}

export { defaultSettings as default }; 