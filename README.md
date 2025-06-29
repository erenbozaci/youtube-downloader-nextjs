# YouTube Ses İndirici

YouTube videolarından ses indirmeye olanak sağlayan, Next.js ile geliştirilmiş modern bir web uygulaması.

## Özellikler

- 🎵 YouTube videolarından ses indirme
- 🖼️ Video küçük resimleri ve bilgilerini görüntüleme
- 📱 Karanlık mod desteği ile duyarlı, modern arayüz
- ⚡ Hızlı indirme işlemi
- 🎨 Güzel gradyan tasarım

## Teknoloji Yığını

- **Next.js 15** - App Router ile React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Stil
- **@distube/ytdl-core** - YouTube video indirme
- **Fluent-FFmpeg** - Ses işleme

## Başlarken

### Önkoşullar

- Node.js 18+ 
- npm veya yarn

### Kurulum

1. Depoyu klonlayın:
```bash
git clone <repo-url>
cd ytdownloader
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu çalıştırın:
```bash
npm run dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Kullanım

1. Giriş alanına bir YouTube URL'si girin
2. Video detaylarını almak için "Video Bilgilerini Al" butonuna tıklayın
3. Video bilgilerini ve küçük resmini inceleyin
4. Ses dosyasını indirmek için "Ses İndir" butonuna tıklayın

## API Uç Noktaları

- `POST /api/info` - Video bilgilerini al
- `POST /api/download` - Ses akışını indir

## Notlar

- İndirilen dosyalar WebM ses formatındadır
- Lütfen telif hakkı yasalarına saygı gösterin ve yalnızca kullanım izniniz olan içerikleri indirin
- YouTube sistemlerini sıklıkla güncellediği için işlevsellik zaman zaman güncellenmeye ihtiyaç duyabilir

## Lisans

Bu proje eğitim amaçlıdır. Lütfen YouTube'un Hizmet Şartlarına ve geçerli telif hakkı yasalarına saygı gösterin.
