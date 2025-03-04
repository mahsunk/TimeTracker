# Knowledge Base

## Hatalar ve Çözümleri

### İkon Hataları

#### Invalid Icon Name Error
Hata: "X is not a valid icon name for family material-community"

Çözüm:
1. Material Community ikonlarının doğru adlarını kullan
2. İkon adlarını kontrol et: https://pictogrammers.com/library/mdi/
3. Yaygın yanlış kullanımlar ve doğruları:
   - ❌ calendar-all -> ✅ calendar-month-outline
   - ❌ calendar-check -> ✅ calendar-check-outline
   - ❌ folder-check -> ✅ folder-check-outline

Örnek kullanım:
```tsx
<IconButton 
  icon="calendar-month-outline"  // Doğru ikon adı
  size={20}
  iconColor="#2196F3"
/>
```

### Çeviri Hataları

#### Missing Translation Error
Hata: Eksik çeviri hatası (örn: "missing en.date" veya "missing en.sortBy")

Çözüm: 
1. İlgili çeviri dosyasını kontrol et (`app/i18n/en.ts` veya `app/i18n/tr.ts`)
2. Eksik çevirileri ekle
3. Çevirileri kategorilere ayır (Main texts, Filter texts, Statistics texts, vb.)
4. Her iki dil için de aynı çeviri anahtarlarının olduğundan emin ol
5. Çeviri anahtarlarının kullanıldığı yerlerde doğru şekilde referans edildiğinden emin ol

Örnek çeviri yapısı:
```typescript
export default {
  // Ana metinler / Main texts
  appName: 'Time Tracker',
  
  // Sıralama metinleri / Sorting texts
  sortBy: 'Sort By',
  date: 'Date',
  duration: 'Duration',
  project: 'Project',
  // ...
};
```

## Modal Açılmama Sorunu

Çözüm: 
1. React Native Paper'da iç içe Modal ve Portal kullanımı sorunlara neden olabilir. Modal bileşenlerini tek bir seviyede tutun.
2. Ana layout dosyasında (`_layout.tsx`) tek bir PaperProvider kullanın.
3. Modal görünürlüğünü ayrı bir state ile kontrol edin (`visible` state'i).
4. Modal içeriği olan bileşenlerde (örn: TimerMode, ManualMode) Portal ve Modal kullanmayın, sadece içerik bileşenlerini döndürün.
5. Ana sayfada tek bir Portal ve Modal kullanın.

Örnek implementasyon:
```tsx
// _layout.tsx
<PaperProvider theme={theme}>
  <Slot />
</PaperProvider>

// index.tsx
const [visible, setVisible] = useState(false);
const [mode, setMode] = useState(null);

<Portal>
  <Modal visible={visible} onDismiss={handleClose}>
    {mode === 'timer' && <TimerMode />}
    {mode === 'manual' && <ManualMode />}
  </Modal>
</Portal>

// TimerMode.tsx veya ManualMode.tsx
return (
  <View>
    {/* Modal içeriği */}
  </View>
);
```

Ana sayfada tek bir Portal ve Modal kullanımı yeterlidir. 

## Yönlendirme Hataları

### Modal Yönlendirme Sorunu
Hata: Modal sayfalarına yönlendirme çalışmıyor

Çözüm:
1. Expo Router kullanarak modal yapısını oluştur
2. `(modals)` klasörü içinde modal sayfalarını tanımla
3. Modal sayfaları için `_layout.tsx` dosyası oluştur
4. Router ile yönlendirme yap

Örnek Yapı:
```
app/
  ├── (modals)/
  │   ├── _layout.tsx
  │   ├── timer.tsx
  │   └── manual.tsx
  └── (tabs)/
      └── index.tsx
```

Örnek Kullanım:
```tsx
// Yönlendirme
import { router } from 'expo-router';
onPress={() => router.push('/(modals)/timer')}

// Modal Layout
import { Stack } from 'expo-router';
export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        animation: 'slide_from_bottom',
      }}
    />
  );
}

// Modal Sayfası
import { router } from 'expo-router';
export default function TimerModal() {
  return (
    <View style={styles.container}>
      <TimerMode onClose={() => router.back()} />
    </View>
  );
}
```

### Tarih Hataları

#### Invalid time value Error
Hata: "RangeError: Invalid time value"

Çözüm:
1. Tarih değerlerini her zaman ISO string formatında sakla
2. Tarih dönüşümlerinde try-catch kullan
3. Geçersiz tarih kontrolü yap (isNaN)
4. Hata durumunda uygun bir varsayılan değer göster

Örnek kullanım:
```typescript
const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return 'Geçersiz Tarih';
    }
    return format(date, 'dd.MM.yyyy');
  } catch (error) {
    return 'Geçersiz Tarih';
  }
};
```

## Type '{ title: string; subtitle: string; style: { fontSize: number; }; }' is not assignable to type 'IntrinsicAttributes & { title: string; subtitle?: string | undefined; }'.

Çözüm: Header bileşenine style prop'u eklenemez, bu nedenle style prop'u kaldırıldı. 

## Proje Özeti

### Ana Bileşenler

1. **Ana Sayfa (Home)**: Kullanıcıya günlük, haftalık ve ortalama çalışma sürelerini gösterir. Ayrıca, çalışma saati eklemek için bir modal içerir.
   - **İstatistikler**: Bugün, bu hafta ve son 7 günün ortalaması gibi istatistikleri hesaplar.
   - **Hoşgeldin Kartı**: Kullanıcıya selam verir ve tarih bilgisini gösterir.

2. **Ayarlar Sayfası (Settings)**: Kullanıcı ayarlarını yönetir.
   - **Dil Seçimi**: Kullanıcıların uygulamanın dilini değiştirmesine olanak tanır.
   - **Bildirim Ayarları**: Kullanıcıların bildirimleri açıp kapatmasına olanak tanır.
   - **Veri Yönetimi**: Kullanıcıların verilerini dışa aktarmasına ve temizlemesine olanak tanır.

3. **Raporlar Sayfası (Reports)**: Kullanıcıların zaman girişlerini görüntülemesine ve filtrelemesine olanak tanır.
   - **Filtreleme**: Kullanıcılar zaman girişlerini haftalık, aylık veya özel tarihlere göre filtreleyebilir.
   - **İstatistikler**: Toplam süre ve giriş sayısını gösterir.

### Genel Bilgiler
- **Tema**: Uygulama, kullanıcı arayüzü için özelleştirilebilir bir tema kullanır.
- **Veri Yönetimi**: Uygulama, zaman girişlerini saklamak için bir depolama servisi kullanır.
- **Yerelleştirme**: Uygulama, çoklu dil desteği sunar ve kullanıcıların tercihine göre dil değiştirilebilir. 