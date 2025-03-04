import { Tabs, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import { IconButton, Text, Surface, useTheme } from 'react-native-paper';
import i18nService from '../services/i18nService';

const colors = {
  primary: {
    light: '#EFF6FF',
    main: '#2563EB',
    dark: '#2563EB',
    default: '#2563EB',
    contrastText: '#FFFFFF'
  },
  neutral: {
    100: '#F3F4F6',
    500: '#71717A',
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
  },
  background: {
    card: '#FFFFFF',
    input: '#F9FAFB'
  },
  error: {
    light: '#FEE2E2',
    main: '#DC2626',
    dark: '#991B1B',
    default: '#DC2626',
    contrastText: '#FFFFFF'
  },
  warning: {
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#B45309',
    default: '#F59E0B',
    contrastText: '#FFFFFF'
  },
  info: {
    light: '#E0F2FE',
    main: '#0EA5E9',
    dark: '#0369A1',
    default: '#0EA5E9',
    contrastText: '#FFFFFF'
  },
  success: {
    light: '#DCFCE7',
    main: '#22C55E',
    dark: '#15803D',
    default: '#22C55E',
    contrastText: '#FFFFFF'
  }
};

export default function TabLayout() {
  const router = useRouter();
  const theme = useTheme();

  const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <Surface style={styles.headerCard} elevation={2}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </Surface>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: styles.headerStyle,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18nService.t('home'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="reports"
        options={{
          title: i18nService.t('reports'),
          header: () => <Header title={i18nService.t('reports')} subtitle={i18nService.t('workReports')} />,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-box" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: i18nService.t('settings'),
          header: () => <Header title={i18nService.t('settings')} subtitle={i18nService.t('settingsSubtitle')} />,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 36 : 12,
    paddingBottom: 12,
  },
  headerContent: {
    gap: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  headerStyle: {
    height: 0,
  },
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 0,
    height: 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
}); 