import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Updates from 'expo-updates';
import i18nService from './i18nService';

// Bildirim tipleri için enum
export enum NotificationType {
  ACTIVE_TIMER = 'active_timer',
  BACKUP_REMINDER = 'backup_reminder',
  SYNC_STATUS = 'sync_status',
  APP_UPDATE = 'app_update',
  WEEKLY_REPORT = 'weekly_report'
}

class NotificationService {
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted for notifications');
      }

      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

      Notifications.addNotificationReceivedListener(notification => {
        console.log('Bildirim alındı:', notification);
      });

      Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Bildirime tıklandı:', response);
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Bildirim servisi başlatılamadı:', error);
      throw error;
    }
  }

  cleanup() {
    Notifications.dismissAllNotificationsAsync();
    Notifications.cancelAllScheduledNotificationsAsync();
  }

  // 1. Aktif Zamanlayıcı Bildirimi
  async sendActiveTimerNotification(duration: number): Promise<string> {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    
    return this.sendNotification(
      i18nService.t('activeTimer'),
      i18nService.t('timerRunningFor', { hours, minutes }),
      { type: NotificationType.ACTIVE_TIMER }
    );
  }

  // 2. Yedekleme Hatırlatması
  async scheduleBackupReminder(intervalHours: number = 24): Promise<string> {
    return this.scheduleNotification(
      'Yedekleme Hatırlatması',
      'Verilerinizi yedekleme zamanı geldi.',
      {
        seconds: intervalHours * 3600,
        repeats: true
      },
      { type: NotificationType.BACKUP_REMINDER }
    );
  }

  // 3. Senkronizasyon Durumu
  async sendSyncStatusNotification(status: 'success' | 'error', message: string): Promise<string> {
    const title = status === 'success' ? 'Senkronizasyon Başarılı' : 'Senkronizasyon Hatası';
    
    return this.sendNotification(
      title,
      message,
      { type: NotificationType.SYNC_STATUS }
    );
  }

  // 4. Uygulama Güncelleme Bildirimi
  async checkAndNotifyUpdate(): Promise<string | null> {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        return this.sendNotification(
          'Güncelleme Mevcut',
          'Uygulamanın yeni bir sürümü mevcut. Güncellemek için tıklayın.',
          { type: NotificationType.APP_UPDATE }
        );
      }
      return null;
    } catch (error) {
      console.error('Güncelleme kontrolü başarısız:', error);
      return null;
    }
  }

  // 5. Haftalık Performans Raporu
  async scheduleWeeklyReport(dayOfWeek: number = 1, hour: number = 9): Promise<string> {
    return this.scheduleNotification(
      'Haftalık Performans Raporu',
      'Geçen haftanın çalışma istatistikleri hazır.',
      {
        weekday: dayOfWeek, // 1 = Pazartesi
        hour: hour,
        minute: 0,
        repeats: true
      },
      { type: NotificationType.WEEKLY_REPORT }
    );
  }

  // Temel bildirim gönderme fonksiyonu
  async sendNotification(title: string, body: string, data?: any): Promise<string> {
    if (!this.isInitialized) await this.init();

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data
        },
        trigger: null, // Anlık bildirim için
      });
      return 'sent';
    } catch (error) {
      console.error('Bildirim gönderilemedi:', error);
      throw error;
    }
  }

  // Zamanlanmış bildirim gönderme fonksiyonu
  async scheduleNotification(title: string, body: string, trigger: any, data?: any): Promise<string> {
    if (!this.isInitialized) await this.init();

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data
        },
        trigger,
      });
      return 'scheduled';
    } catch (error) {
      console.error('Bildirim zamanlanamadı:', error);
      throw error;
    }
  }

  async cancelNotification(id: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(id);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export const notificationService = new NotificationService();
export default notificationService; 