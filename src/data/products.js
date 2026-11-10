// ============================================================
// DATA PRODUK, PRICE MATRIX & KALKULASI HARGA
// Ganti nilai STORE dan harga sesuai kondisi usaha Anda.
// ============================================================

export const STORE = {
  name: "Lumora Studio",
  whatsapp: "6281234567890", // format internasional tanpa + atau spasi
  instagram: "lumor.astudioid",
};

export const SIZES = [
  { id: "A6", label: "A6", dimension: "10 x 15 cm", note: "Mungil, pas untuk nakas & meja kerja" },
  { id: "A5", label: "A5", dimension: "15 x 21 cm", note: "Paling favorit untuk kado" },
  { id: "A4", label: "A4", dimension: "21 x 30 cm", note: "Besar, detail grafir paling tajam" },
];

export const PRODUCT_TYPES = [
  {
    id: "lampu",
    name: "Lampu Tidur Akrilik",
    tagline: "Grafir foto/nama, cocok untuk ulang tahun & anniversary",
  },
  {
    id: "plakat",
    name: "Plakat Akrilik",
    tagline: "Wisuda, penghargaan, dan apresiasi tim",
  },
  {
    id: "signboard",
    name: "Signboard LED",
    tagline: "Papan nama usaha, cafe, dan dekorasi ruangan",
  },
];

export const BASE_TYPES = [
  {
    id: "warm",
    name: "Dudukan Kayu Standar",
    description: "Satu warna: Warm White / White",
  },
  {
    id: "rgb",
    name: "Dudukan Kayu RGB",
    description: "7 warna + remot / touch",
  },
];

export const ENGRAVE_TYPES = [
  {
    id: "teks",
    name: "Teks Only",
    description: "Nama, tanggal, atau kalimat spesial",
  },
  {
    id: "lineart",
    name: "Line Art Foto + Teks",
    description: "Foto diubah jadi sketsa garis + teks",
  },
  {
    id: "logo",
    name: "Full Custom Logo / Ilustrasi",
    description: "Logo brand atau ilustrasi khusus",
  },
];

export const PAYMENT_METHODS = [
  { id: "bca", name: "Transfer BCA" },
  { id: "mandiri", name: "Transfer Mandiri" },
  { id: "qris", name: "QRIS" },
  { id: "ewallet", name: "E-Wallet (DANA / OVO / GoPay)" },
  { id: "cod", name: "COD (khusus area tertentu)" },
];

// ------------------------------------------------------------
// PRICE MATRIX (dalam Rupiah)
// Harga satuan = harga produk[ukuran] + add-on base[ukuran] + add-on grafir[ukuran]
// ------------------------------------------------------------
export const PRICE_MATRIX = {
  product: {
    lampu: { A6: 85000, A5: 125000, A4: 185000 },
    plakat: { A6: 95000, A5: 140000, A4: 210000 },
    signboard: { A6: 150000, A5: 225000, A4: 350000 },
  },
  base: {
    warm: { A6: 0, A5: 0, A4: 0 },
    rgb: { A6: 35000, A5: 45000, A4: 60000 },
  },
  engrave: {
    teks: { A6: 0, A5: 0, A4: 0 },
    lineart: { A6: 25000, A5: 35000, A4: 50000 },
    logo: { A6: 45000, A5: 65000, A4: 90000 },
  },
};

// ------------------------------------------------------------
// OPSI DESAIN (muncul untuk grafir Line Art Foto & Full Custom Logo)
// - "self"   : pelanggan mengirim desain sendiri (tanpa biaya desain)
// - "studio" : tim Anda yang membuat desain (kena biaya jasa desain)
// ------------------------------------------------------------
export const DESIGN_OPTIONS = [
  {
    id: "self",
    name: "Saya Kirim Desain Sendiri",
    description: "File siap grafir dari Anda: logo, ilustrasi, atau line art",
  },
  {
    id: "studio",
    name: "Dibuatkan Tim Kami",
    description: "Tim kami yang mendesain dari foto, brief, dan referensi Anda",
  },
];

// Biaya jasa desain (Rupiah), dikenakan SEKALI per desain (tidak dikali jumlah pesanan).
// Teks Only tidak memunculkan pilihan ini, jadi nilainya 0.
export const DESIGN_FEE = {
  teks: 0,
  lineart: 30000,
  logo: 75000,
};

// Jumlah revisi gratis untuk desain buatan tim (tampil di teks form)
export const DESIGN_REVISIONS = 2;

// Panduan file untuk pelanggan yang mengirim desain sendiri
export const DESIGN_FILE_TIPS =
  "Format disarankan: AI, SVG, CDR, atau PDF (vektor). PNG/JPG boleh jika resolusi tinggi dan latar bersih. Bisa tempel link Google Drive/Dropbox, atau kirim file langsung lewat WhatsApp.";

export const DP_PERCENT = 50;

export const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export function calculatePrice({ product, size, base, engrave, qty, designBy = "self" }) {
  const productPrice = PRICE_MATRIX.product[product]?.[size] ?? 0;
  const basePrice = PRICE_MATRIX.base[base]?.[size] ?? 0;
  const engravePrice = PRICE_MATRIX.engrave[engrave]?.[size] ?? 0;

  // Harga per pcs
  const unit = productPrice + basePrice + engravePrice;
  const subtotal = unit * qty;

  // Jasa desain: hanya jika desain dibuatkan tim, dihitung sekali per pesanan
  const designFee = designBy === "studio" ? DESIGN_FEE[engrave] ?? 0 : 0;

  const total = subtotal + designFee;
  const dp = Math.round((total * DP_PERCENT) / 100);

  return { productPrice, basePrice, engravePrice, unit, subtotal, designFee, total, dp };
}
