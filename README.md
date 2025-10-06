# eMILKOI

> eMILKOI adalah aplikasi web modern yang dibangun menggunakan teknologi terdepan untuk memberikan pengalaman pengguna yang lebih optimal.

> [!NOTE]
> Aplikasi ini belum sepenuhnya aman dan bekerja sebagaimana mestinya, maka dari itu saai ini kami tidak menyarankan untuk melakukan deployment untuk production.

[🇺🇸 English Version](./README.en.md)

## Daftar Isi

- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## Persyaratan

- [Node.js](https://nodejs.org) v22+ atau lebih tinggi.

## Instalasi

1. **Clone repository:**
```bash
git clone https://github.com/GTPSHAX/eMILKOI.git
cd eMILKOI
```

2. **Install dependencies:**
```bash
npm install
```

3. **Jalankan development server:**
```bash
npm run dev
```

4. **Buka browser:**
Kunjungi [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## Penggunaan

### Development Commands

```bash
# Jalankan development server dengan Turbopack
npm run dev

# Build untuk production
npm run build

# Jalankan production server
npm run start

# Lint kode
npm run lint

# Auto-fix lint issues
npm run lint:fix
```

### Project Structure

```
src/
├── app/                 # App Router directory
│   ├── globals.css     # Global styles dengan Tailwind
│   ├── layout.tsx      # Root layout dengan font loading
│   ├── page.tsx        # Homepage component
│   └── favicon.ico     # App icon
├── lib/                # Utility functions
│   └── utils.ts        # Helper utilities
public/                 # Static assets
components.json         # shadcn/ui configuration
```

## Kontribusi

Kami sangat menghargai segala kontribusi dari kamu, jika kamu tertarik untuk berkontribusi, silahkan:

1. Fork repository ini
2. Buat branch untuk fitur/perbaikan Anda
3. Commit perubahan dengan pesan yang jelas
4. Push ke branch Anda (Sebelum melakukan push pastikan sudah menjalankan `npm run lint` atau `npm run lint:fix`)
5. Buat Pull Request

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
