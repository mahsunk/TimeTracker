import { storageService } from './storage';
import { apiService } from './api';

class SyncService {
  private isSyncing = false;
  private lastSyncTime: string | null = null;

  async sync(): Promise<void> {
    if (this.isSyncing) {
      console.log('Senkronizasyon zaten devam ediyor');
      return;
    }

    try {
      this.isSyncing = true;

      // Yerel verileri al
      const localData = await storageService.exportData();

      // API ile senkronize et
      const syncedData = await apiService.syncAll(localData);

      // Senkronize edilmiş verileri yerel depoya kaydet
      await storageService.importData(syncedData);

      this.lastSyncTime = new Date().toISOString();
      console.log('Senkronizasyon başarılı:', this.lastSyncTime);
    } catch (error) {
      console.error('Senkronizasyon hatası:', error);
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  async syncProjects(): Promise<void> {
    try {
      const projects = await storageService.getProjects();
      const syncedProjects = await apiService.syncProjects(projects);
      await Promise.all(syncedProjects.map(p => storageService.saveProject(p)));
    } catch (error) {
      console.error('Proje senkronizasyon hatası:', error);
      throw error;
    }
  }

  async syncCategories(): Promise<void> {
    try {
      const categories = await storageService.getCategories();
      const syncedCategories = await apiService.syncCategories(categories);
      await Promise.all(syncedCategories.map(c => storageService.saveCategory(c)));
    } catch (error) {
      console.error('Kategori senkronizasyon hatası:', error);
      throw error;
    }
  }

  async syncTimeEntries(): Promise<void> {
    try {
      const timeEntries = await storageService.getTimeEntries();
      const syncedTimeEntries = await apiService.syncTimeEntries(timeEntries);
      await Promise.all(syncedTimeEntries.map(t => storageService.saveTimeEntry(t)));
    } catch (error) {
      console.error('Zaman kaydı senkronizasyon hatası:', error);
      throw error;
    }
  }

  getLastSyncTime(): string | null {
    return this.lastSyncTime;
  }

  isCurrentlySyncing(): boolean {
    return this.isSyncing;
  }
}

export const syncService = new SyncService();
export default syncService; 