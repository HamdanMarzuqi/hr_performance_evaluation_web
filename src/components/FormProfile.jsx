import { User, Sliders, Info } from 'lucide-react';

export default function FormProfile({ data, onChange }) {
  const { profile, weights } = data;

  const updateProfile = (field, value) => {
    onChange({
      ...data,
      profile: { ...profile, [field]: value },
    });
  };

  const updateKpiWeight = (val) => {
    const kpi = Math.max(0, Math.min(100, Number(val) || 0));
    onChange({
      ...data,
      weights: { kpiWeight: kpi, cultureWeight: 100 - kpi },
    });
  };

  return (
    <div className="space-y-6">
      {/* Profil Karyawan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <User className="w-4 h-4 text-teal-700" />
          <h2 className="text-sm font-bold text-slate-900">1. Profil Karyawan &amp; Periode</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profile-name" className="block text-xs font-semibold text-slate-600 mb-1">
              Nama Lengkap Karyawan
            </label>
            <input
              id="profile-name"
              type="text"
              value={profile.name}
              onChange={(e) => updateProfile('name', e.target.value)}
              placeholder="Contoh: Meristiyanti"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label htmlFor="profile-role" className="block text-xs font-semibold text-slate-600 mb-1">
              Jabatan / Posisi
            </label>
            <input
              id="profile-role"
              type="text"
              value={profile.role}
              onChange={(e) => updateProfile('role', e.target.value)}
              placeholder="Contoh: Perawat Gigi — Leader Tim"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label htmlFor="profile-status" className="block text-xs font-semibold text-slate-600 mb-1">
              Status Kepegawaian
            </label>
            <input
              id="profile-status"
              type="text"
              value={profile.employmentStatus}
              onChange={(e) => updateProfile('employmentStatus', e.target.value)}
              placeholder="Kontrak / Permanen"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label htmlFor="profile-period" className="block text-xs font-semibold text-slate-600 mb-1">
              Periode Evaluasi
            </label>
            <input
              id="profile-period"
              type="text"
              value={profile.period}
              onChange={(e) => updateProfile('period', e.target.value)}
              placeholder="Contoh: 2025 atau H1 2026"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label htmlFor="profile-supervisor" className="block text-xs font-semibold text-slate-600 mb-1">
              Atasan Penilai Utama
            </label>
            <input
              id="profile-supervisor"
              type="text"
              value={profile.supervisorName}
              onChange={(e) => updateProfile('supervisorName', e.target.value)}
              placeholder="Contoh: drg. Anne"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label htmlFor="profile-method" className="block text-xs font-semibold text-slate-600 mb-1">
              Metode Evaluasi
            </label>
            <input
              id="profile-method"
              type="text"
              value={profile.method}
              onChange={(e) => updateProfile('method', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>
      </div>

      {/* Konfigurasi Bobot & Contribution Index */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-teal-700" />
          <h2 className="text-sm font-bold text-slate-900">
            2. Transparansi Bobot Pilar &amp; Contribution Index
          </h2>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-[#0F2942]">
                Pilar 1: KPI Terukur (Target vs Realisasi): {weights.kpiWeight}%
              </span>
              <span className="text-teal-700">
                Pilar 2: Budaya &amp; 360° Feedback: {weights.cultureWeight}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.kpiWeight}
              onChange={(e) => updateKpiWeight(e.target.value)}
              className="w-full accent-[#0F2942] cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Rekomendasi HR standar: <strong>60% KPI Terukur</strong> +{' '}
              <strong>40% Budaya &amp; 360°</strong> (total otomatis 100%).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label htmlFor="profile-contribution-index" className="block text-xs font-semibold text-slate-600 mb-1">
                Contribution Index (Pengali)
              </label>
              <input
                id="profile-contribution-index"
                type="number"
                step="0.05"
                min="0.8"
                max="1.5"
                value={profile.contributionIndex}
                onChange={(e) =>
                  updateProfile(
                    'contributionIndex',
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                onBlur={() => {
                  const val = Number(profile.contributionIndex);
                  if (!val || Number.isNaN(val)) {
                    updateProfile('contributionIndex', 1.0);
                  } else {
                    updateProfile('contributionIndex', Math.max(0.5, Math.min(2.0, val)));
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="profile-contribution-reason" className="block text-xs font-semibold text-slate-600 mb-1">
                Alasan Penetapan Contribution Index (Transparansi)
              </label>
              <input
                id="profile-contribution-reason"
                type="text"
                value={profile.contributionReason}
                onChange={(e) => updateProfile('contributionReason', e.target.value)}
                placeholder="Misal: 1.0 untuk reguler, 1.1 untuk Leader Tim / peran strategis tambahan"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <Info className="w-4 h-4 text-[#0F2942] shrink-0 mt-0.5" />
            <p>
              <strong>Rumus Transparan:</strong> Final Score = ((Skor KPI × {weights.kpiWeight}%) +
              (Skor Budaya 360° × {weights.cultureWeight}%)) × {profile.contributionIndex}. Seluruh
              perhitungan tampil otomatis di laporan PDF.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
