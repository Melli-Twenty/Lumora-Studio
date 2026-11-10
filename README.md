# Lumora Studio - Website Pemesanan Akrilik LED Custom

React (Vite) + Tailwind CSS + Lucide React. Form pemesanan dengan kalkulasi harga otomatis dan pengiriman rincian pesanan ke WhatsApp.

## Menjalankan

```bash
npm install
npm run dev
```

Buka alamat yang tampil di terminal (biasanya http://localhost:5173).

## Build untuk produksi

```bash
npm run build
```

Hasil build tersedia di folder `dist`.

## Deploy ke GitHub Pages

Workflow GitHub Actions akan membangun dan menerbitkan situs setiap kali ada push ke branch `main`.
Aktifkan **Settings > Pages > Build and deployment > Source > GitHub Actions** satu kali di repositori.
Alamat situs untuk repositori ini: https://melli-twenty.github.io/Lumora-Studio/

## Yang wajib diganti sebelum dipakai

Buka `src/data/products.js`, lalu ubah:

- `STORE.whatsapp`: nomor WhatsApp penjual (format 62xxxxxxxxxx, tanpa + dan spasi)
- `STORE.instagram`: username Instagram
- `STORE.name`: nama brand
- `PRICE_MATRIX`: semua harga adalah contoh
- `DESIGN_FEE`: biaya jasa desain jika desain dibuatkan tim (sekali bayar per pesanan)
- `DESIGN_REVISIONS`: jumlah revisi gratis yang ditampilkan di form
- `DP_PERCENT`: persentase DP
- `PAYMENT_METHODS`: sesuaikan dengan rekening/metode yang tersedia

## Struktur

```
src/
├─ main.jsx
├─ index.css
├─ App.jsx
├─ data/products.js         data produk, price matrix, fungsi kalkulasi
└─ components/OrderForm.jsx form, ringkasan harga, pesan WhatsApp
```

## Catatan

- Foto/logo referensi tidak diunggah lewat form. Pembeli mengirimkannya manual di chat WhatsApp setelah pesan terkirim.
- Ongkos kirim belum dihitung otomatis.
