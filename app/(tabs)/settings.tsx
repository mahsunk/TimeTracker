import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { Text, Surface, IconButton, Switch, Button, ActivityIndicator, Snackbar, SegmentedButtons, TextInput, useTheme, Menu } from 'react-native-paper';
import { storageService } from '@/services/storage';
import { themeService, ThemeType, CustomTheme } from '@/services/theme';
import i18nService, { Language } from '@/services/i18nService';
import { AppSettings, WorkSettings, NotificationSettings, defaultSettings } from '@/types';
import { notificationService } from '@/services/notification';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Updates from 'expo-updates';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

type SettingsKey = keyof AppSettings;
type NotificationSettingsKey = keyof NotificationSettings;
type WorkSettingsKey = keyof WorkSettings;
type SettingPath = keyof AppSettings | `${keyof AppSettings}.${string}`;
type TranslationKey = Parameters<typeof i18nService.t>[0];

interface LanguageDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ value, onValueChange }) => {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const theme = useTheme() as CustomTheme;

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Button
          mode="outlined"
          onPress={openMenu}
          icon="translate"
          style={{ borderColor: theme.colors.outline }}
          contentStyle={{ height: 40, minWidth: 120 }}
        >
          {value === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}
        </Button>
      }
    >
      <Menu.Item 
        onPress={() => {
          onValueChange('tr');
          closeMenu();
        }} 
        title="🇹🇷 Türkçe"
        leadingIcon="flag"
      />
      <Menu.Item 
        onPress={() => {
          onValueChange('en');
          closeMenu();
        }} 
        title="🇬🇧 English"
        leadingIcon="flag"
      />
    </Menu>
  );
};

export default function Settings() {
  const theme = useTheme() as CustomTheme;
  const colors = theme.colors.extended;
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTimeKey, setSelectedTimeKey] = useState<string>('');
  const router = useRouter();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 16,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.colors.onBackground,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.surface,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.colors.onSurface,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginTop: 4,
    },
    card: {
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      marginBottom: 16,
      overflow: 'hidden',
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
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    iconContainer: {
      width: 48,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
      marginRight: 12,
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
    cardTitleContainer: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    cardSubtitle: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    cardContent: {
      padding: 16,
    },
    settingInfo: {
      flex: 1,
      marginRight: 16,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    settingDesc: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      lineHeight: 20,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.outline,
    },
    languageButtons: {
      maxWidth: 200,
    },
    timeButton: {
      borderColor: theme.colors.outline,
    },
    numberInput: {
      backgroundColor: theme.colors.surfaceVariant,
      height: 44,
      width: 120,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    },
    actionButton: {
      marginVertical: 8,
    },
    dangerButton: {
      backgroundColor: colors.error.main,
      borderRadius: 12,
      elevation: 4,
      borderWidth: 2,
      borderColor: colors.error.dark,
      ...Platform.select({
        ios: {
          shadowColor: colors.error.dark,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    dangerButtonContent: {
      height: 52,
      paddingHorizontal: 24,
    },
    dangerButtonLabel: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
      color: colors.error.contrastText,
      textTransform: 'uppercase',
    },
    aboutLabel: {
      fontSize: 16,
      color: theme.colors.onSurface,
    },
    aboutValue: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.onSurface,
    },
    aboutButton: {
      marginVertical: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    snackbar: {
      marginBottom: 16,
    },
    dropdownButton: {
      height: 40,
      minWidth: 120,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const loadedSettings = await storageService.getSettings();
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
      showSnackbar('settingsError');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: TranslationKey) => {
    setSnackbarMessage(i18nService.t(message));
    setSnackbarVisible(true);
  };

  const handleSettingChange = async (path: SettingPath, value: any) => {
    try {
      if (!settings) return;

      const updatedSettings = { ...settings };
      
      if (path.includes('.')) {
        const [section, key] = path.split('.') as [keyof AppSettings, string];
        if (section === 'notificationSettings' || section === 'workSettings') {
          (updatedSettings[section] as any)[key] = value;
        }
      } else {
        (updatedSettings as any)[path] = value;
      }

      setSettings(updatedSettings);
      await storageService.saveSettings(updatedSettings);

      if (path === 'theme') {
        themeService.setTheme(value as ThemeType);
      } else if (path === 'language') {
        await i18nService.setLanguage(value as Language);
        showSnackbar('settingsSaved');
        setTimeout(() => {
          router.replace('/settings');
        }, 1000);
        return;
      }

      showSnackbar('settingsSaved');
    } catch (error) {
      console.error('Ayar değiştirme hatası:', error);
      showSnackbar('settingsError');
    }
  };

  const handleTimeChange = (time: Date | undefined, mode: string) => {
    if (!time) return;

    const timeString = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    
    switch (mode) {
      case 'dailyReminder':
        handleSettingChange('notificationSettings.dailyReminderTime', timeString);
        break;
    }

    setShowTimePicker(false);
  };

  const handleClearData = async () => {
    try {
      await storageService.clearAllData();
      showSnackbar('clearSuccess');
      await loadSettings();
    } catch (error) {
      console.error('Veri temizleme hatası:', error);
      showSnackbar('clearError');
    }
  };

  const handleExportData = async () => {
    try {
      setIsLoading(true);
      
      // Storage kontrolü
      if (!storageService) {
        throw new Error('Storage service not initialized');
      }

      const data = await storageService.getAllData();
      
      // Veri kontrolü
      if (!data || Object.keys(data).length === 0) {
        showSnackbar('noDataToExport');
        return;
      }

      // Dosya sistemi kontrolü
      const fileName = `timetracker_export_${new Date().toISOString().split('T')[0]}.json`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      try {
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify(data, null, 2));
      } catch (fileError) {
        console.error('File write error:', fileError);
        showSnackbar('fileWriteError');
        return;
      }

      // Paylaşım kontrolü
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/json',
          dialogTitle: i18nService.t('exportDataTitle')
        });
        showSnackbar('exportSuccess');
      } else {
        showSnackbar('sharingNotAvailable');
      }
    } catch (error) {
      console.error('Export error:', error);
      showSnackbar('exportError');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderTimePicker = () => {
    if (!showTimePicker || !settings) return null;

    const currentTime = (() => {
      const [hours, minutes] = (() => {
        switch (selectedTimeKey) {
          case 'dailyReminder':
            return settings.notificationSettings.dailyReminderTime.split(':');
          default:
            return ['0', '0'];
        }
      })().map(Number);

      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      return date;
    })();

    return (
      <DateTimePicker
        value={currentTime}
        mode="time"
        is24Hour={true}
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(event, date) => handleTimeChange(date, selectedTimeKey)}
      />
    );
  };

  const renderSettingCard = (
    icon: string,
    title: string,
    subtitle: string,
    children: React.ReactNode,
    color: string,
    lightColor: string
  ) => (
    <Surface style={styles.card} elevation={2}>
      <View style={[styles.cardHeader, { backgroundColor: lightColor }]}>
        <View style={[styles.iconContainer, { backgroundColor: 'white' }]}>
          <IconButton 
            icon={icon}
            size={24}
            iconColor={color}
          />
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={[styles.cardTitle, { color }]}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </Surface>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Tema ve Görünüm */}
        {renderSettingCard(
          'palette-outline',
          i18nService.t('appearance'),
          i18nService.t('appearanceSubtitle'),
          <>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{i18nService.t('darkMode')}</Text>
                <Text style={styles.settingDesc}>{i18nService.t('darkModeDesc')}</Text>
              </View>
              <Switch
                value={settings.theme === 'dark'}
                onValueChange={(value) => handleSettingChange('theme', value ? 'dark' : 'light')}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{i18nService.t('language')}</Text>
                <Text style={styles.settingDesc}>{i18nService.t('languageDesc')}</Text>
              </View>
              <LanguageDropdown
                value={settings.language}
                onValueChange={(value) => handleSettingChange('language', value)}
              />
            </View>
          </>,
          colors.primary.main,
          colors.primary.light
        )}

        {/* Bildirimler */}
        {renderSettingCard(
          'bell-ring-outline',
          i18nService.t('notifications'),
          i18nService.t('notificationsSubtitle'),
          <>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{i18nService.t('notifications')}</Text>
                <Text style={styles.settingDesc}>{i18nService.t('notificationsDesc')}</Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={(value) => handleSettingChange('notifications', value)}
              />
            </View>

            {settings.notifications && (
              <>
                <View style={styles.divider} />
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>{i18nService.t('dailyReminder')}</Text>
                    <Text style={styles.settingDesc}>{i18nService.t('dailyReminderDesc')}</Text>
                  </View>
                  <Switch
                    value={settings.notificationSettings.dailyReminder}
                    onValueChange={(value) => handleSettingChange('notificationSettings.dailyReminder', value)}
                  />
                </View>

                {settings.notificationSettings.dailyReminder && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.settingItem}>
                      <Text style={styles.settingTitle}>{i18nService.t('reminderTime')}</Text>
                      <Button
                        mode="outlined"
                        onPress={() => {
                          setSelectedTimeKey('dailyReminder');
                          setShowTimePicker(true);
                        }}
                        icon="clock-outline"
                        style={styles.timeButton}
                      >
                        {settings.notificationSettings.dailyReminderTime}
                      </Button>
                    </View>
                  </>
                )}
              </>
            )}
          </>,
          colors.warning.main,
          colors.warning.light
        )}

        {/* Veri Yönetimi */}
        {renderSettingCard(
          'database-sync-outline',
          i18nService.t('dataManagement'),
          i18nService.t('dataManagementSubtitle'),
          <>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>{i18nService.t('autoSync')}</Text>
                <Text style={styles.settingDesc}>{i18nService.t('autoSyncDesc')}</Text>
              </View>
              <Switch
                value={settings.autoSync}
                onValueChange={(value) => handleSettingChange('autoSync', value)}
              />
            </View>

            <View style={styles.divider} />
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleExportData}
                icon="export"
                style={styles.actionButton}
              >
                {i18nService.t('exportData')}
              </Button>
            </View>
          </>,
          colors.info.main,
          colors.info.light
        )}

        {/* Tehlikeli Bölge */}
        {renderSettingCard(
          'alert-decagram',
          i18nService.t('dangerZone'),
          i18nService.t('dangerZoneSubtitle'),
          <>
            <Button
              mode="contained"
              onPress={handleClearData}
              icon="delete-forever"
              style={[styles.actionButton, styles.dangerButton]}
              buttonColor={colors.error.main}
              textColor={colors.error.contrastText}
              labelStyle={styles.dangerButtonLabel}
              contentStyle={styles.dangerButtonContent}
            >
              {i18nService.t('clearData')}
            </Button>
          </>,
          colors.error.dark,
          colors.error.light
        )}

        {/* Uygulama Hakkında */}
        {renderSettingCard(
          'information-variant',
          i18nService.t('about'),
          i18nService.t('aboutSubtitle'),
          <>
            <View style={styles.settingItem}>
              <Text style={styles.aboutLabel}>{i18nService.t('version')}</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <Button
              mode="text"
              onPress={() => router.push('/(modals)/privacy-policy')}
              icon="shield-account"
              style={styles.aboutButton}
            >
              {i18nService.t('privacyPolicy')}
            </Button>
            <View style={styles.divider} />
            <Button
              mode="text"
              onPress={() => router.push('/(modals)/user-guide')}
              icon="book-open-variant"
              style={styles.aboutButton}
            >
              {i18nService.t('userGuide')}
            </Button>
          </>,
          colors.neutral[700],
          colors.neutral[100]
        )}
      </View>

      {renderTimePicker()}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
} 