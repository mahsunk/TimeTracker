import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { CustomTheme } from '../services/theme';
import { useRouter } from 'expo-router';
import i18nService from '../services/i18nService';

export default function UserGuideModal() {
  const theme = useTheme() as CustomTheme;
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="close"
          size={24}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>{i18nService.t('userGuide')}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.section}>
          1. Zaman Takibi
        </Text>
        <Text style={styles.paragraph}>
          • Timer Modu: Çalışmaya başladığınızda zamanlayıcıyı başlatın.{'\n'}
          • Manuel Mod: Geçmiş çalışma sürelerinizi manuel olarak girin.{'\n'}
          • Notlar: Her çalışma kaydına not ekleyebilirsiniz.
        </Text>
        
        <Text style={styles.section}>
          2. Raporlar
        </Text>
        <Text style={styles.paragraph}>
          • Günlük, haftalık ve aylık raporları görüntüleyin.{'\n'}
          • Özel tarih aralığı seçerek detaylı rapor alın.{'\n'}
          • Çalışma sürelerinizi analiz edin.
        </Text>
        
        <Text style={styles.section}>
          3. Ayarlar
        </Text>
        <Text style={styles.paragraph}>
          • Bildirim tercihlerinizi yönetin.{'\n'}
          • Uygulama dilini değiştirin.{'\n'}
          • Verilerinizi yedekleyin ve geri yükleyin.
        </Text>

        <Text style={styles.section}>
          4. Bildirimler
        </Text>
        <Text style={styles.paragraph}>
          • Günlük hatırlatıcıları ayarlayın.{'\n'}
          • Çalışma süresi limitlerini belirleyin.{'\n'}
          • Mola hatırlatmalarını özelleştirin.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#1E293B',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#475569',
  },
}); 