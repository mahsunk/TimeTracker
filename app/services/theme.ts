import { MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';
import { storageService } from '@/services/storage';

const fontConfig = {
  fontFamily: 'System',
};

export type ThemeType = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  primaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  surface: string;
  surfaceVariant: string;
  background: string;
  error: string;
  onPrimary: string;
  onPrimaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
  onSurface: string;
  onSurfaceVariant: string;
  onBackground: string;
  onError: string;
  outline: string;
  shadow: string;
}

interface ExtendedColors {
  primary: {
    main: string;
    dark: string;
    light: string;
    default: string;
    contrastText: string;
  };
  secondary: {
    main: string;
    dark: string;
    light: string;
    default: string;
    contrastText: string;
  };
  warning: {
    main: string;
    dark: string;
    light: string;
    default: string;
    contrastText: string;
  };
  info: {
    main: string;
    dark: string;
    light: string;
    default: string;
    contrastText: string;
  };
  success: {
    main: string;
    dark: string;
    light: string;
    default: string;
    contrastText: string;
  };
  error: {
    main: string;
    dark: string;
    light: string;
    default: string;
    contrastText: string;
  };
  neutral: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  background: {
    card: string;
    main: string;
    input: string;
  };
}

const lightExtendedColors: ExtendedColors = {
  primary: {
    main: '#2563EB',
    dark: '#1E40AF',
    light: '#60A5FA',
    default: '#2563EB',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#4ADE80',
    dark: '#16A34A',
    light: '#86EFAC',
    default: '#4ADE80',
    contrastText: '#FFFFFF'
  },
  warning: {
    main: '#F59E0B',
    dark: '#B45309',
    light: '#FCD34D',
    default: '#F59E0B',
    contrastText: '#FFFFFF'
  },
  info: {
    main: '#0EA5E9',
    dark: '#0369A1',
    light: '#7DD3FC',
    default: '#0EA5E9',
    contrastText: '#FFFFFF'
  },
  success: {
    main: '#4ADE80',
    dark: '#16A34A',
    light: '#F0FDF4',
    default: '#4ADE80',
    contrastText: '#FFFFFF'
  },
  error: {
    main: '#E11D48',
    dark: '#BE123C',
    light: '#FEF2F2',
    default: '#E11D48',
    contrastText: '#FFFFFF'
  },
  neutral: {
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717'
  },
  background: {
    card: '#FFFFFF',
    main: '#FAFAFA',
    input: '#F9FAFB'
  }
};

const darkExtendedColors: ExtendedColors = {
  primary: {
    main: '#60A5FA',
    dark: '#1E40AF',
    light: '#93C5FD',
    default: '#60A5FA',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#4ADE80',
    dark: '#16A34A',
    light: '#86EFAC',
    default: '#4ADE80',
    contrastText: '#FFFFFF'
  },
  warning: {
    main: '#F59E0B',
    dark: '#B45309',
    light: '#FCD34D',
    default: '#F59E0B',
    contrastText: '#FFFFFF'
  },
  info: {
    main: '#0EA5E9',
    dark: '#0369A1',
    light: '#7DD3FC',
    default: '#0EA5E9',
    contrastText: '#FFFFFF'
  },
  success: {
    main: '#4ADE80',
    dark: '#16A34A',
    light: '#F0FDF4',
    default: '#4ADE80',
    contrastText: '#FFFFFF'
  },
  error: {
    main: '#FB7185',
    dark: '#BE123C',
    light: '#FEF2F2',
    default: '#FB7185',
    contrastText: '#FFFFFF'
  },
  neutral: {
    100: '#171717',
    200: '#262626',
    300: '#404040',
    400: '#525252',
    500: '#737373',
    600: '#A3A3A3',
    700: '#D4D4D4',
    800: '#E5E5E5',
    900: '#F5F5F5'
  },
  background: {
    card: '#27272A',
    main: '#18181B',
    input: '#3F3F46'
  }
};

const lightColors: ThemeColors = {
  primary: lightExtendedColors.primary.main,
  primaryContainer: lightExtendedColors.primary.light,
  secondary: lightExtendedColors.secondary.main,
  secondaryContainer: lightExtendedColors.secondary.light,
  surface: '#FFFFFF',
  surfaceVariant: '#F9FAFB',
  background: '#FAFAFA',
  error: '#E11D48',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#1E40AF',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#16A34A',
  onSurface: '#18181B',
  onSurfaceVariant: '#71717A',
  onBackground: '#27272A',
  onError: '#FFFFFF',
  outline: '#E4E4E7',
  shadow: '#18181B',
};

const darkColors: ThemeColors = {
  primary: darkExtendedColors.primary.main,
  primaryContainer: darkExtendedColors.primary.dark,
  secondary: darkExtendedColors.secondary.main,
  secondaryContainer: darkExtendedColors.secondary.dark,
  surface: '#27272A',
  surfaceVariant: '#3F3F46',
  background: '#18181B',
  error: '#FB7185',
  onPrimary: '#18181B',
  onPrimaryContainer: '#DBEAFE',
  onSecondary: '#18181B',
  onSecondaryContainer: '#DCFCE7',
  onSurface: '#FAFAFA',
  onSurfaceVariant: '#A1A1AA',
  onBackground: '#E4E4E7',
  onError: '#18181B',
  outline: '#52525B',
  shadow: '#000000',
};

export interface CustomTheme {
  colors: ThemeColors & {
    extended: ExtendedColors;
  };
  dark: boolean;
  mode?: 'adaptive' | 'exact';
  roundness: number;
  animation: {
    scale: number;
  };
  fonts: any;
}

export const lightTheme: CustomTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightColors,
    extended: lightExtendedColors,
  },
  dark: false,
  mode: 'exact',
  roundness: 4,
  animation: {
    scale: 1.0,
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const darkTheme: CustomTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors,
    extended: darkExtendedColors,
  },
  dark: true,
  mode: 'exact',
  roundness: 4,
  animation: {
    scale: 1.0,
  },
  fonts: configureFonts({ config: fontConfig }),
};

class ThemeService {
  private currentTheme: ThemeType = 'light';

  async initialize() {
    try {
      const settings = await storageService.getSettings();
      this.currentTheme = settings.theme;
      return this.currentTheme;
    } catch (error) {
      console.error('Tema yüklenirken hata:', error);
      return null;
    }
  }

  getTheme() {
    return this.currentTheme;
  }

  getThemeObject(theme: ThemeType = this.currentTheme): CustomTheme {
    this.currentTheme = theme;
    return theme === 'dark' ? darkTheme : lightTheme;
  }

  async setTheme(theme: ThemeType) {
    this.currentTheme = theme;
    try {
      const settings = await storageService.getSettings();
      settings.theme = theme;
      await storageService.saveSettings(settings);
      if (global.onThemeChange) {
        global.onThemeChange(theme);
      }
    } catch (error) {
      console.error('Tema kaydedilirken hata:', error);
      if (global.onThemeChange) {
        global.onThemeChange(theme);
      }
    }
  }

  isDark(theme: ThemeType = this.currentTheme): boolean {
    return theme === 'dark';
  }
}

export const themeService = new ThemeService();
export default themeService; 