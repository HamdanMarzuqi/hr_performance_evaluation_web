# Luminara Aesthetic Dental Clinic — HR Performance & KPI Appraisal Tool

Aplikasi web internal untuk HR **Luminara Aesthetic Dental Clinic** dalam menyusun evaluasi kinerja karyawan berbasis **Hybrid KPI (Target vs. Realisasi)** dan **Budaya Kerja 360° (Core Values Luminara)**, lengkap dengan fitur cetak **Laporan PDF siap pakai**.

## Fitur Utama
- **PIN Lock Screen:** Proteksi akses halaman HR (default PIN: `2025`, dapat diubah via environment variable `VITE_HR_PIN`).
- **Transparansi Bobot & Rumus:** Pengaturan rasio bobot KPI vs Budaya 360° serta alasan *Contribution Index*.
- **Pilar 1 — KPI-Based (Target vs. Realisasi):** Preset indikator per jabatan (*Perawat Gigi, Admin Klinik, Dokter Gigi*), kalkulasi otomatis `% Pencapaian` dan konversi skor skala `1–6`.
- **Pilar 2 — Budaya & 360°:** Input nilai kategori budaya, daftar penilai (*plus fitur Paste/Import CSV dari Excel atau Google Form*), deteksi otomatis kesenjangan antar penilai (*Gap Analysis*), dan feedback kualitatif.
- **Growth Plan 30–60–90 Hari & Rekomendasi Manajemen:** Penentuan otomatis kategori performa (*Extraordinary, High Performer, Solid Performer, Developing, Underperforming / PIP*).
- **Export / Import Backup JSON & Auto-Save Draft (`localStorage`)**.
- **Cetak / Save PDF A4 Presisi:** Format laporan profesional ber-branding Luminara Dental Clinic.

## Menjalankan Secara Lokal
```bash
npm install
npm run dev
```

## Deploy ke Vercel
1. Push folder ini ke GitHub/GitLab, atau jalankan `vercel` dari terminal.
2. Framework Preset: **Vite**.
3. *(Opsional)* Tambahkan Environment Variable di dashboard Vercel:
   - `VITE_HR_PIN` = `PIN_RAHASIA_HR_ANDA`
