import { useMemo, useState } from "react";
import {
  Award,
  Check,
  CreditCard,
  Lightbulb,
  Link2,
  MapPin,
  MessageCircle,
  Minus,
  Palette,
  PenLine,
  Phone,
  Plus,
  Ruler,
  Sparkles,
  Store,
  Upload,
  User,
} from "lucide-react";
import {
  BASE_TYPES,
  DESIGN_FEE,
  DESIGN_FILE_TIPS,
  DESIGN_OPTIONS,
  DESIGN_REVISIONS,
  DP_PERCENT,
  ENGRAVE_TYPES,
  PAYMENT_METHODS,
  PRICE_MATRIX,
  PRODUCT_TYPES,
  SIZES,
  STORE,
  calculatePrice,
  formatRupiah,
} from "../data/products";

const PRODUCT_ICONS = {
  lampu: Lightbulb,
  plakat: Award,
  signboard: Store,
};

const initialForm = {
  nama: "",
  whatsapp: "",
  alamat: "",
  product: "lampu",
  size: "A5",
  base: "warm",
  engrave: "teks",
  qty: 1,
  teks: "",
  catatan: "",
  designBy: "self",
  designLink: "",
  payment: "bca",
};

const normalizePhone = (value) => {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "62" + digits.slice(1);
  else if (digits.startsWith("8")) digits = "62" + digits;
  return digits;
};

function Field({ label, icon: Icon, error, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
        {Icon && <Icon className="h-4 w-4 text-amber-500" />}
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

function OptionCard({ active, onClick, title, subtitle, extra, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative w-full rounded-xl border-2 p-3.5 text-left transition-all ${
        active
          ? "border-amber-500 bg-amber-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-amber-300"
      }`}
    >
      {active && (
        <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white">
          <Check className="h-3 w-3" />
        </span>
      )}
      <div className="flex items-start gap-3">
        {Icon && (
          <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              active ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div className="pr-5">
          <p className="text-sm font-bold text-slate-800">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          {extra && <p className="mt-1 text-xs font-semibold text-amber-600">{extra}</p>}
        </div>
      </div>
    </button>
  );
}

function SectionTitle({ number, title }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
        {number}
      </span>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
    </div>
  );
}

function Row({ label, value, strong = false }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className={`text-right ${strong ? "font-bold text-white" : "text-slate-100"}`}>
        {value}
      </span>
    </div>
  );
}

export default function OrderForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleInput = (e) => setField(e.target.name, e.target.value);

  // Pilihan "siapa yang mendesain" hanya muncul untuk Line Art & Logo/Ilustrasi.
  // Untuk Teks Only, layout teks diatur tim tanpa biaya desain.
  const needsDesignChoice = form.engrave !== "teks";
  const designBy = needsDesignChoice ? form.designBy : "studio";
  const studioBrief = needsDesignChoice && designBy === "studio";

  const price = useMemo(
    () =>
      calculatePrice({
        product: form.product,
        size: form.size,
        base: form.base,
        engrave: form.engrave,
        qty: form.qty,
        designBy,
      }),
    [form.product, form.size, form.base, form.engrave, form.qty, designBy]
  );

  const selectedProduct = PRODUCT_TYPES.find((p) => p.id === form.product);
  const selectedSize = SIZES.find((s) => s.id === form.size);
  const selectedBase = BASE_TYPES.find((b) => b.id === form.base);
  const selectedEngrave = ENGRAVE_TYPES.find((g) => g.id === form.engrave);
  const selectedPayment = PAYMENT_METHODS.find((p) => p.id === form.payment);

  const designLabel = !needsDesignChoice
    ? `Layout teks oleh tim ${STORE.name}`
    : designBy === "self"
    ? "Desain dikirim sendiri oleh pemesan"
    : `Dibuatkan tim ${STORE.name} (jasa desain)`;

  const designSummary = !needsDesignChoice
    ? "Layout oleh tim"
    : designBy === "self"
    ? "Dikirim sendiri"
    : "Dibuatkan tim";

  const validate = () => {
    const next = {};
    if (form.nama.trim().length < 3) next.nama = "Nama minimal 3 karakter.";
    const phone = normalizePhone(form.whatsapp);
    if (!/^62\d{9,13}$/.test(phone)) {
      next.whatsapp = "Nomor WhatsApp tidak valid. Contoh: 081234567890";
    }
    if (form.alamat.trim().length < 10) {
      next.alamat = "Mohon isi alamat lengkap (jalan, kecamatan, kota, kode pos).";
    }
    if (form.engrave === "teks" && form.teks.trim().length < 1) {
      next.teks = "Isi teks yang ingin digrafir.";
    }
    if (studioBrief && form.catatan.trim().length < 10) {
      next.catatan = "Ceritakan brief desain Anda (minimal 10 karakter) agar tim kami bisa mulai.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildMessage = () => {
    const phone = normalizePhone(form.whatsapp);
    const lines = [
      `*PESANAN BARU - ${STORE.name}*`,
      "━━━━━━━━━━━━━━━━━━",
      "",
      "*DATA PEMESAN*",
      `Nama      : ${form.nama.trim()}`,
      `WhatsApp  : ${phone}`,
      `Alamat    : ${form.alamat.trim()}`,
      "",
      "*DETAIL PESANAN*",
      `Produk    : ${selectedProduct.name}`,
      `Ukuran    : ${selectedSize.label} (${selectedSize.dimension})`,
      `Dudukan   : ${selectedBase.name} - ${selectedBase.description}`,
      `Grafir    : ${selectedEngrave.name}`,
      `Jumlah    : ${form.qty} pcs`,
      "",
      "*DESAIN / TEKS CUSTOM*",
      `Sumber Desain : ${designLabel}`,
      ...(needsDesignChoice && designBy === "self"
        ? [`Link Desain   : ${form.designLink.trim() || "Dikirim lewat chat"}`]
        : []),
      `Teks          : ${form.teks.trim() || "-"}`,
      `${studioBrief ? "Brief Desain  " : "Catatan       "}: ${form.catatan.trim() || "-"}`,
      "",
      "*RINCIAN HARGA*",
      `Harga produk   : ${formatRupiah(price.productPrice)}`,
      `Dudukan        : ${price.basePrice > 0 ? "+" + formatRupiah(price.basePrice) : "Termasuk"}`,
      `Grafir         : ${price.engravePrice > 0 ? "+" + formatRupiah(price.engravePrice) : "Termasuk"}`,
      `Harga satuan   : ${formatRupiah(price.unit)}`,
      `Subtotal (${form.qty} pcs) : ${formatRupiah(price.subtotal)}`,
      ...(needsDesignChoice
        ? [
            `Jasa desain (sekali bayar) : ${
              designBy === "studio"
                ? price.designFee > 0
                  ? "+" + formatRupiah(price.designFee)
                  : "Gratis"
                : "Tidak ada"
            }`,
          ]
        : []),
      `*TOTAL : ${formatRupiah(price.total)}*`,
      `DP ${DP_PERCENT}%          : ${formatRupiah(price.dp)}`,
      "(Belum termasuk ongkos kirim)",
      "",
      `*Metode Pembayaran:* ${selectedPayment.name}`,
      "",
      needsDesignChoice && designBy === "self"
        ? "File desain akan saya kirim lewat chat ini (atau lewat link di atas). Mohon konfirmasi ketersediaan & estimasi pengerjaannya ya. Terima kasih! 🙏"
        : "Foto / logo / referensi akan saya kirim setelah chat ini. Mohon konfirmasi ketersediaan & estimasi pengerjaannya ya. Terima kasih! 🙏",
    ];
    return lines.join("\n");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setTimeout(() => {
        const firstError = document.querySelector("[data-error='true']");
        firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
      return;
    }
    const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const inputClass = (hasError) =>
    `w-full rounded-xl border-2 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 ${
      hasError ? "border-red-400" : "border-slate-200"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start"
    >
      {/* ================= KOLOM KIRI: FORM ================= */}
      <div className="space-y-6">
        {/* 1. Produk */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <SectionTitle number="1" title="Pilih Tipe Produk" />
          <div className="grid gap-3 sm:grid-cols-3">
            {PRODUCT_TYPES.map((p) => (
              <OptionCard
                key={p.id}
                icon={PRODUCT_ICONS[p.id]}
                active={form.product === p.id}
                onClick={() => setField("product", p.id)}
                title={p.name}
                subtitle={p.tagline}
                extra={`Mulai ${formatRupiah(PRICE_MATRIX.product[p.id].A6)}`}
              />
            ))}
          </div>
        </section>

        {/* 2. Ukuran */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <SectionTitle number="2" title="Pilih Ukuran" />
          <div className="grid gap-3 sm:grid-cols-3">
            {SIZES.map((s) => (
              <OptionCard
                key={s.id}
                icon={Ruler}
                active={form.size === s.id}
                onClick={() => setField("size", s.id)}
                title={`${s.label} · ${s.dimension}`}
                subtitle={s.note}
                extra={formatRupiah(PRICE_MATRIX.product[form.product][s.id])}
              />
            ))}
          </div>
        </section>

        {/* 3. Base LED */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <SectionTitle number="3" title="Pilih Dudukan & Warna LED" />
          <div className="grid gap-3 sm:grid-cols-2">
            {BASE_TYPES.map((b) => {
              const add = PRICE_MATRIX.base[b.id][form.size];
              return (
                <OptionCard
                  key={b.id}
                  icon={Lightbulb}
                  active={form.base === b.id}
                  onClick={() => setField("base", b.id)}
                  title={b.name}
                  subtitle={b.description}
                  extra={add > 0 ? `+${formatRupiah(add)}` : "Sudah termasuk"}
                />
              );
            })}
          </div>
        </section>

        {/* 4. Grafir */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <SectionTitle number="4" title="Pilih Jenis Grafir" />
          <div className="grid gap-3 sm:grid-cols-3">
            {ENGRAVE_TYPES.map((g) => {
              const add = PRICE_MATRIX.engrave[g.id][form.size];
              return (
                <OptionCard
                  key={g.id}
                  icon={PenLine}
                  active={form.engrave === g.id}
                  onClick={() => setField("engrave", g.id)}
                  title={g.name}
                  subtitle={g.description}
                  extra={add > 0 ? `+${formatRupiah(add)}` : "Sudah termasuk"}
                />
              );
            })}
          </div>

          {needsDesignChoice && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Siapa yang menyiapkan desain grafir?
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {DESIGN_OPTIONS.map((d) => {
                  const fee = DESIGN_FEE[form.engrave] ?? 0;
                  const extra =
                    d.id === "studio"
                      ? fee > 0
                        ? `+${formatRupiah(fee)} (sekali bayar, tidak dikali jumlah)`
                        : "Gratis"
                      : "Tanpa biaya desain";
                  return (
                    <OptionCard
                      key={d.id}
                      icon={d.id === "self" ? Upload : Palette}
                      active={form.designBy === d.id}
                      onClick={() => setField("designBy", d.id)}
                      title={d.name}
                      subtitle={d.description}
                      extra={extra}
                    />
                  );
                })}
              </div>
              <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                {designBy === "self"
                  ? "File akan dicek tim sebelum produksi. Jika kurang jelas atau resolusinya rendah, kami hubungi Anda lewat WhatsApp."
                  : `Tim kami membuat desain dari brief dan referensi Anda, lalu mengirim preview untuk disetujui sebelum produksi. Termasuk revisi ${DESIGN_REVISIONS}x.`}
              </p>
            </div>
          )}

          <div className="mt-5 space-y-4">
            <div data-error={errors.teks ? "true" : "false"}>
              <Field
                label={
                  form.engrave === "teks"
                    ? "Teks yang Ingin Digrafir"
                    : "Teks Tambahan (opsional)"
                }
                icon={PenLine}
                error={errors.teks}
                hint="Contoh: Rina & Dimas · 14 Februari 2024 · Selamat Wisuda, Aldi!"
              >
                <input
                  type="text"
                  name="teks"
                  value={form.teks}
                  onChange={handleInput}
                  placeholder="Tulis teks custom Anda"
                  className={inputClass(errors.teks)}
                />
              </Field>
            </div>

            {needsDesignChoice && designBy === "self" && (
              <Field label="Link File Desain (opsional)" icon={Link2} hint={DESIGN_FILE_TIPS}>
                <input
                  type="url"
                  name="designLink"
                  value={form.designLink}
                  onChange={handleInput}
                  placeholder="https://drive.google.com/..."
                  className={inputClass(false)}
                />
              </Field>
            )}

            <div data-error={errors.catatan ? "true" : "false"}>
              <Field
                label={studioBrief ? "Brief Desain" : "Catatan Desain (opsional)"}
                icon={Sparkles}
                error={errors.catatan}
                hint={
                  studioBrief
                    ? "Ceritakan konsep, gaya, warna, dan elemen yang diinginkan. Foto/logo referensi dikirim lewat WhatsApp setelah pesanan terkirim."
                    : form.engrave === "teks"
                    ? "Boleh sebutkan gaya huruf yang diinginkan (elegan, tulisan tangan, tegas)."
                    : "Catatan tambahan, misalnya posisi desain atau ukuran grafir yang diinginkan."
                }
              >
                <textarea
                  name="catatan"
                  value={form.catatan}
                  onChange={handleInput}
                  rows={3}
                  placeholder={
                    studioBrief
                      ? "Contoh: Logo cafe dengan ilustrasi cangkir kopi, gaya minimalis, teks 'Kopi Senja' di bawahnya."
                      : "Contoh: Foto berdua saat di pantai, teks di bawah foto, gaya huruf script."
                  }
                  className={inputClass(errors.catatan)}
                />
              </Field>
            </div>
          </div>
        </section>

        {/* 5. Data pemesan */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <SectionTitle number="5" title="Data Pemesan & Pengiriman" />
          <div className="space-y-4">
            <div data-error={errors.nama ? "true" : "false"}>
              <Field label="Nama Pemesan" icon={User} error={errors.nama}>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleInput}
                  placeholder="Nama lengkap"
                  autoComplete="name"
                  className={inputClass(errors.nama)}
                />
              </Field>
            </div>

            <div data-error={errors.whatsapp ? "true" : "false"}>
              <Field label="Nomor WhatsApp" icon={Phone} error={errors.whatsapp}>
                <input
                  type="tel"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleInput}
                  placeholder="081234567890"
                  autoComplete="tel"
                  inputMode="tel"
                  className={inputClass(errors.whatsapp)}
                />
              </Field>
            </div>

            <div data-error={errors.alamat ? "true" : "false"}>
              <Field label="Alamat Pengiriman" icon={MapPin} error={errors.alamat}>
                <textarea
                  name="alamat"
                  value={form.alamat}
                  onChange={handleInput}
                  rows={3}
                  placeholder="Nama jalan, nomor rumah, kelurahan, kecamatan, kota, provinsi, kode pos"
                  autoComplete="street-address"
                  className={inputClass(errors.alamat)}
                />
              </Field>
            </div>

            <Field label="Jumlah Pesanan">
              <div className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setField("qty", Math.max(1, form.qty - 1))}
                  className="px-3.5 py-2.5 text-slate-600 hover:text-amber-600"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold">{form.qty}</span>
                <button
                  type="button"
                  onClick={() => setField("qty", Math.min(20, form.qty + 1))}
                  className="px-3.5 py-2.5 text-slate-600 hover:text-amber-600"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </Field>

            <Field label="Metode Pembayaran" icon={CreditCard}>
              <div className="grid gap-2 sm:grid-cols-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setField("payment", m.id)}
                    aria-pressed={form.payment === m.id}
                    className={`rounded-xl border-2 px-3.5 py-2.5 text-left text-sm font-medium transition ${
                      form.payment === m.id
                        ? "border-amber-500 bg-amber-50 text-amber-800"
                        : "border-slate-200 bg-white text-slate-700 hover:border-amber-300"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </section>
      </div>

      {/* ================= KOLOM KANAN: PREVIEW HARGA ================= */}
      <aside className="lg:sticky lg:top-6">
        <div className="overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl ring-1 ring-slate-800">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 px-5 py-4 text-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wider">Ringkasan Pesanan</p>
            <p className="mt-1 text-lg font-extrabold leading-tight">{selectedProduct.name}</p>
          </div>

          <div className="space-y-3 px-5 py-5 text-sm">
            <Row label="Ukuran" value={`${selectedSize.label} (${selectedSize.dimension})`} />
            <Row label="Dudukan" value={selectedBase.name} />
            <Row label="Grafir" value={selectedEngrave.name} />
            <Row label="Desain" value={designSummary} />
            <Row label="Jumlah" value={`${form.qty} pcs`} />

            <div className="my-3 border-t border-dashed border-slate-700" />

            <Row label="Harga produk" value={formatRupiah(price.productPrice)} />
            <Row
              label="Dudukan"
              value={price.basePrice > 0 ? `+${formatRupiah(price.basePrice)}` : "Termasuk"}
            />
            <Row
              label="Grafir"
              value={price.engravePrice > 0 ? `+${formatRupiah(price.engravePrice)}` : "Termasuk"}
            />
            <Row label="Harga satuan" value={formatRupiah(price.unit)} strong />
            {form.qty > 1 && (
              <Row label={`Subtotal (${form.qty} pcs)`} value={formatRupiah(price.subtotal)} />
            )}
            {needsDesignChoice && (
              <Row
                label="Jasa desain (sekali bayar)"
                value={
                  designBy === "studio"
                    ? price.designFee > 0
                      ? `+${formatRupiah(price.designFee)}`
                      : "Gratis"
                    : "Tidak ada"
                }
              />
            )}

            <div className="my-3 border-t border-dashed border-slate-700" />

            <div className="flex items-end justify-between">
              <span className="text-slate-300">Total</span>
              <span className="text-2xl font-extrabold text-amber-400">
                {formatRupiah(price.total)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2 text-xs">
              <span className="text-slate-300">DP {DP_PERCENT}% untuk mulai produksi</span>
              <span className="font-bold text-white">{formatRupiah(price.dp)}</span>
            </div>
            <p className="text-xs text-slate-400">
              *Belum termasuk ongkir. Harga final dikonfirmasi admin setelah desain disetujui.
            </p>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              <MessageCircle className="h-5 w-5" />
              Pesan via WhatsApp
            </button>
          </div>
        </div>
      </aside>
    </form>
  );
}
