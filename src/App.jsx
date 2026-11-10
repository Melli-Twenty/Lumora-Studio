import {
  Camera,
  Gift,
  Heart,
  Instagram,
  MessageCircle,
  PackageCheck,
  PenTool,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import OrderForm from "./components/OrderForm";
import { STORE, formatRupiah, PRICE_MATRIX } from "./data/products";

const steps = [
  {
    icon: PenTool,
    title: "Pilih & Custom",
    desc: "Tentukan produk, ukuran, warna LED, dan teks. Harga muncul otomatis.",
  },
  {
    icon: MessageCircle,
    title: "Kirim via WhatsApp",
    desc: "Rincian pesanan terkirim rapi ke admin. Kirim foto/logo referensi di chat.",
  },
  {
    icon: Camera,
    title: "Preview Desain",
    desc: "Kami kirim mockup desain. Revisi hingga Anda benar-benar puas.",
  },
  {
    icon: PackageCheck,
    title: "Produksi & Kirim",
    desc: "Setelah DP, produk digrafir, dikemas aman (bubble wrap + kardus tebal), lalu dikirim.",
  },
];

const highlights = [
  { icon: Heart, title: "Penuh Makna", desc: "Bukan sekadar lampu, tapi kenangan yang menyala setiap malam." },
  { icon: Sparkles, title: "Grafir Presisi", desc: "Detail tajam, glow merata di seluruh tepi akrilik." },
  { icon: ShieldCheck, title: "Revisi Desain", desc: "Lihat preview sebelum produksi, tidak ada kejutan." },
  { icon: Gift, title: "Siap Jadi Kado", desc: "Kemasan rapi dan aman, tinggal diberikan." },
];

export default function App() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />

        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <span className="text-lg font-extrabold tracking-tight">
            Lumora <span className="text-amber-400">Studio</span>
          </span>
          <a
            href={`https://instagram.com/${STORE.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-slate-700 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-300"
          >
            <Instagram className="h-4 w-4" />
            @{STORE.instagram}
          </a>
        </nav>

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-14">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/30">
            <Sparkles className="h-3.5 w-3.5" />
            Akrilik LED Custom · Dibuat khusus untuk Anda
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Kado yang <span className="text-amber-400">menyala</span>, dan
            kenangan yang tak pernah padam.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
            Lampu tidur grafir foto & nama, plakat wisuda, hingga signboard LED
            untuk usaha Anda. Pilih variasi, lihat harga langsung, lalu pesan
            lewat WhatsApp dalam hitungan menit.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#pesan"
              className="rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-slate-900 shadow-glow transition hover:bg-amber-300"
            >
              Mulai Custom Sekarang
            </a>
            <span className="text-sm text-slate-400">
              Lampu tidur mulai{" "}
              <strong className="text-white">
                {formatRupiah(PRICE_MATRIX.product.lampu.A6)}
              </strong>
            </span>
          </div>
        </div>
      </header>

      {/* KEUNGGULAN */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CARA PESAN */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Cara Pesan, Mudah Banget
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-amber-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Langkah {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM PEMESANAN */}
      <main id="pesan" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-14 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Rancang Akrilik LED Anda
          </h2>
          <p className="mt-2 text-slate-600">
            Pilih variasi di bawah. Ringkasan harga diperbarui otomatis, lalu
            kirim ke admin lewat WhatsApp.
          </p>
        </div>
        <OrderForm />
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-8 text-center text-sm text-slate-400">
        <p>
          © {new Date().getFullYear()} {STORE.name} · Akrilik LED Custom
        </p>
        <p className="mt-1">
          Ada pertanyaan? Chat langsung di{" "}
          <a
            href={`https://wa.me/${STORE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-amber-400 hover:underline"
          >
            WhatsApp
          </a>
        </p>
      </footer>
    </div>
  );
}
