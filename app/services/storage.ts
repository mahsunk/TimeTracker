import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimeEntry, AppSettings } from '@/types';
import { defaultSettings } from '@/types';

const STORAGE_KEYS = {
  TIME_ENTRIES: '@timetracker:time_entries',
  SETTINGS: '@timetracker:settings',
} as const;

class StorageService {
  // Time Entries
  async getTimeEntries(): Promise<TimeEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting time entries:', error);
      return [];
    }
  }

  async saveTimeEntry(timeEntry: TimeEntry): Promise<void> {
    try {
      const entries = await this.getTimeEntries();
      const index = entries.findIndex(e => e.id === timeEntry.id);
      
      if (index !== -1) {
        entries[index] = timeEntry;
      } else {
        entries.push(timeEntry);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving time entry:', error);
      throw error;
    }
  }

  async deleteTimeEntry(id: string): Promise<void> {
    try {
      const entries = await this.getTimeEntries();
      const filteredEntries = entries.filter(entry => entry.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(filteredEntries));
    } catch (error) {
      console.error('Error deleting time entry:', error);
      throw error;
    }
  }

  // Settings
  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : defaultSettings;
    } catch (error) {
      console.error('Error getting settings:', error);
      return defaultSettings;
    }
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  // Clear All Data
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Get All Data
  async getAllData(): Promise<{[key: string]: any}> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const allData = await AsyncStorage.multiGet(allKeys);
      return allData.reduce((acc: {[key: string]: any}, [key, value]: [string, string | null]) => {
        if (value) {
          try {
            acc[key] = JSON.parse(value);
          } catch {
            acc[key] = value;
          }
        }
        return acc;
      }, {});
    } catch (error) {
      console.error('getAllData error:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
export default storageService; 