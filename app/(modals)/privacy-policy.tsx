import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { CustomTheme } from '../services/theme';
import { useRouter } from 'expo-router';
import i18nService from '../services/i18nService';

export default function PrivacyPolicyModal() {
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
        <Text style={styles.headerTitle}>{i18nService.t('privacyPolicy')}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.section}>
          1. Veri Toplama ve Kullanım
        </Text>
        <Text style={styles.paragraph}>
          Bu uygulama, çalışma sürelerinizi takip etmek için gerekli olan minimum veriyi toplar. 
          Toplanan veriler yalnızca cihazınızda saklanır ve herhangi bir üçüncü tarafla paylaşılmaz.
        </Text>
        
        <Text style={styles.section}>
          2. Veri Güvenliği
        </Text>
        <Text style={styles.paragraph}>
          Verileriniz güvenli bir şekilde cihazınızda saklanır ve şifrelenir. 
          İnternet bağlantısı gerektiren hiçbir işlem yapılmaz.
        </Text>
        
        <Text style={styles.section}>
          3. Bildirimler
        </Text>
        <Text style={styles.paragraph}>
          Uygulama, yalnızca sizin izin verdiğiniz durumlarda bildirim gönderir. 
          Bu bildirimler tamamen yerel olup, uzaktan kontrol edilemez.
        </Text>

        <Text style={styles.section}>
          4. Veri Saklama
        </Text>
        <Text style={styles.paragraph}>
          Tüm verileriniz yerel olarak saklanır ve istediğiniz zaman silinebilir.
          Verileriniz hiçbir şekilde bulut sistemlerinde depolanmaz.
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