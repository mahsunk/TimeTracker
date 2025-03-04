import { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { themeService, ThemeType, lightTheme, darkTheme } from './services/theme';
import i18nService from './services/i18nService';
import { useColorScheme } from 'react-native';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // i18n servisinin başlatılmasını bekle
        await i18nService.waitForInit();
        
        // Tema ayarlarını yükle
        const savedTheme = await themeService.initialize();
        const initialTheme = savedTheme || systemColorScheme || 'light';
        setTheme(initialTheme);
        themeService.setTheme(initialTheme);
      } catch (error) {
        console.error('Error initializing app:', error);
        const defaultTheme = systemColorScheme || 'light';
        setTheme(defaultTheme);
        themeService.setTheme(defaultTheme);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    // Global tema değişikliği dinleyicisi
    global.onThemeChange = (newTheme: ThemeType) => {
      setTheme(newTheme);
    };

    return () => {
      global.onThemeChange = undefined;
    };
  }, [systemColorScheme]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={currentTheme}>
      <Slot />
    </PaperProvider>
  );
} 