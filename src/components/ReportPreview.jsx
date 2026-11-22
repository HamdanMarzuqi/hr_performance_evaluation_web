import { LUMINARA_CLINIC } from '../data/presets';

function ScoreDots({ score, colorClass = 'bg-[#0F2942]' }) {
  const filled = Math.round(Number(score) || 0);
  return (
    <div className="inline-flex items-center gap-1" aria-label={`Skor ${score} dari 6`}>
      {[1, 2, 3, 4, 5, 6].map((idx) => (
        <span
          key={idx}
          className={`w-2.5 h-2.5 rounded-full inline-block ${
            idx <= filled ? colorClass : 'bg-slate-200 border border-slate-300'
          }`}
        />
      ))}
    </div>
  );
}

export default function ReportPreview({ data, metrics }) {
  const { profile, cultureCategories, qualitativeFeedback, gapAnalysisNote, growthPlan, decision } =
    data;

  const statusBadgeClass = (color) => {
    if (color === 'emerald') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (color === 'teal') return 'bg-teal-50 text-teal-800 border-teal-200';
    if (color === 'amber') return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-rose-50 text-rose-800 border-rose-200';
  };

  return (
    <div
      id="printable-report"
      className="print-only-container bg-white text-slate-800 max-w-[210mm] mx-auto shadow-lg border border-slate-200 rounded-xl p-8 md:p-10 space-y-6 text-[12px] leading-relaxed"
    >
      {/* Running Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#0F2942]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-teal-700">
            {LUMINARA_CLINIC.name}
          </p>
          <p className="text-[10px] text-slate-500">
            Laporan Evaluasi Kinerja KPI &amp; Budaya 360° • {profile.name || 'Karyawan'} • Periode{' '}
            {profile.period || '-'}
          </p>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Dokumen Rahasia — Internal Klinik
        </span>
      </div>

      {/* Executive Title */}
      <div className="avoid-break space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F2942] tracking-tight">
            LAPORAN EVALUASI KINERJA KPI &amp; 360°
          </h1>
          <p className="text-lg font-bold text-teal-700 mt-0.5">
            {profile.name || '(Nama Karyawan)'}
          </p>
          <p className="text-xs text-slate-600 font-medium">{profile.role}</p>
        </div>

        {/* Summary Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 print:grid-cols-5 gap-2.5">
          <div className="bg-[#0F2942] text-white p-3 rounded-lg">
            <div className="text-[10px] text-slate-300 font-medium">
              Skor KPI ({metrics.kpiWeightPct}%)
            </div>
            <div className="text-xl font-extrabold mt-0.5">{metrics.kpiScore.toFixed(2)}</div>
          </div>

          <div className="bg-[#1B4D6B] text-white p-3 rounded-lg">
            <div className="text-[10px] text-slate-200 font-medium">
              Budaya 360° ({metrics.cultureWeightPct}%)
            </div>
            <div className="text-xl font-extrabold mt-0.5">{metrics.cultureScore.toFixed(2)}</div>
          </div>

          <div className="bg-[#0D9488] text-white p-3 rounded-lg">
            <div className="text-[10px] text-teal-100 font-medium">Contribution Index</div>
            <div className="text-xl font-extrabold mt-0.5">
              {metrics.contributionIndex.toFixed(2)}×
            </div>
          </div>

          <div className="bg-emerald-700 text-white p-3 rounded-lg">
            <div className="text-[10px] text-emerald-100 font-medium">Final Score</div>
            <div className="text-xl font-extrabold mt-0.5">{metrics.finalScore.toFixed(2)}</div>
          </div>

          <div
            className={`${metrics.category.badgeBg} text-white p-3 rounded-lg col-span-2 sm:col-span-1 print:col-span-1`}
          >
            <div className="text-[10px] text-white/80 font-medium">Kategori</div>
            <div className="text-sm font-extrabold mt-0.5 leading-tight">
              {metrics.category.label}
            </div>
          </div>
        </div>

        {/* Formula Transparency Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-[11px] text-slate-700 flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong className="text-[#0F2942]">Transparansi Rumus:</strong>{' '}
            <code>
              (({metrics.kpiScore.toFixed(2)} × {metrics.kpiWeightPct}%) + (
              {metrics.cultureScore.toFixed(2)} × {metrics.cultureWeightPct}%)) ×{' '}
              {metrics.contributionIndex.toFixed(2)} = {metrics.finalScore.toFixed(2)}
            </code>
          </div>
          <div className="text-slate-500">
            Jumlah Penilai 360°: <strong>{data.raters.length} orang</strong> • Skala: <strong>1–6</strong>
          </div>
        </div>

        <div className="text-xs font-bold text-emerald-800">
          Rekomendasi Tindak Lanjut: {decision.recommendedLevel} ({metrics.category.actionType})
        </div>
      </div>

      {/* 1. Profil Individu */}
      <div className="avoid-break">
        <h2 className="text-sm font-bold text-[#0F2942] mb-2">1. Profil Individu</h2>
        <table className="w-full border-collapse border border-slate-300 text-xs">
          <tbody>
            {[
              ['Nama Karyawan', profile.name || '-'],
              ['Jabatan / Posisi', profile.role || '-'],
              ['Status Kepegawaian', profile.employmentStatus || '-'],
              ['Periode Evaluasi', profile.period || '-'],
              ['Atasan Penilai Utama', profile.supervisorName || '-'],
              ['Metode Penilaian', profile.method || '-'],
              [
                'Contribution Index',
                `${metrics.contributionIndex.toFixed(2)}× (${profile.contributionReason || '-'})`,
              ],
            ].map(([label, val], idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}>
                <td className="border border-slate-300 px-3 py-1.5 font-semibold text-[#0F2942] w-48">
                  {label}
                </td>
                <td className="border border-slate-300 px-3 py-1.5 text-slate-700">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. Pilar 1: Evaluasi KPI-Based (Target vs. Realisasi) */}
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <h2 className="text-sm font-bold text-[#0F2942]">
            2. Hasil Evaluasi KPI-Based (Target vs. Realisasi)
          </h2>
          <span className="text-[11px] font-semibold text-teal-700">
            Skor KPI Terbobot: {metrics.kpiScore.toFixed(2)} / 6.00 (Bobot {metrics.kpiWeightPct}%)
          </span>
        </div>

        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse border border-slate-300 text-[11px]">
            <thead>
              <tr className="bg-[#0F2942] text-white text-left">
                <th className="border border-slate-300 px-2.5 py-2">Indikator KPI</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-14">Bobot</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-20">Target</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-20">Realisasi</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-18">Capaian</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-14">Skor</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-28">Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.kpiRows.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="border border-slate-300 px-2.5 py-2">
                    <div className="font-semibold text-slate-900">{row.name}</div>
                    {row.description && (
                      <div className="text-[10px] text-slate-500 mt-0.5">{row.description}</div>
                    )}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center font-medium">
                    {row.weight}%
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center">
                    {row.target} {row.unit}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center font-bold text-[#0F2942]">
                    {row.actual} {row.unit}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center font-semibold">
                    {row.achievementPct}%
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center font-bold text-[#0F2942]">
                    {row.score.toFixed(2)}
                  </td>
                  <td className="border border-slate-300 px-2 py-2 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadgeClass(
                        row.statusColor
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Pilar 2: Budaya Kerja & 360° */}
      <div className="space-y-4">
        <div className="avoid-break">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-sm font-bold text-[#0F2942]">
              3. Evaluasi Budaya Kerja &amp; Kompetensi 360°
            </h2>
            <span className="text-[11px] font-semibold text-teal-700">
              Rata-rata Budaya 360°: {metrics.cultureScore.toFixed(2)} / 6.00 (Bobot{' '}
              {metrics.cultureWeightPct}%)
            </span>
          </div>

          <h3 className="text-xs font-bold text-teal-800 mb-1.5">3.1 Skor Per Kategori Budaya</h3>
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-[#1B4D6B] text-white text-left">
                <th className="border border-slate-300 px-3 py-1.5">Kategori Budaya &amp; Kinerja</th>
                <th className="border border-slate-300 px-3 py-1.5 w-36">Visualisasi Skor</th>
                <th className="border border-slate-300 px-3 py-1.5 w-24 text-center">Rata-rata</th>
              </tr>
            </thead>
            <tbody>
              {cultureCategories.map((c) => (
                <tr key={c.id}>
                  <td className="border border-slate-300 px-3 py-1.5 font-medium">{c.name}</td>
                  <td className="border border-slate-300 px-3 py-1.5">
                    <ScoreDots score={c.score} colorClass="bg-teal-600" />
                  </td>
                  <td className="border border-slate-300 px-3 py-1.5 text-center font-bold text-[#0F2942]">
                    {Number(c.score).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3.2 Skor Per Penilai */}
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
            <h3 className="text-xs font-bold text-teal-800">
              3.2 Rincian Skor Per Penilai ({data.raters.length} Penilai)
            </h3>
            <span className="text-[11px] font-semibold text-slate-600">
              Rata-rata Penilai:{' '}
              <strong className="text-[#0F2942]">{metrics.avgRaterScore.toFixed(2)}</strong> / 6.00
            </span>
          </div>
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-[#1B4D6B] text-white text-left">
                  <th className="border border-slate-300 px-3 py-1.5">Penilai</th>
                  <th className="border border-slate-300 px-3 py-1.5">Kelompok</th>
                  <th className="border border-slate-300 px-3 py-1.5 w-32">Visualisasi</th>
                  <th className="border border-slate-300 px-3 py-1.5 w-20 text-center">Skor</th>
                </tr>
              </thead>
              <tbody>
                {metrics.sortedRaters.map((r) => (
                  <tr key={r.id}>
                    <td className="border border-slate-300 px-3 py-1 font-medium">{r.name}</td>
                    <td className="border border-slate-300 px-3 py-1 text-slate-600">{r.group}</td>
                    <td className="border border-slate-300 px-3 py-1">
                      <ScoreDots score={r.score} colorClass="bg-[#0F2942]" />
                    </td>
                    <td className="border border-slate-300 px-3 py-1 text-center font-bold">
                      {Number(r.score).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3.3 Kekuatan & Prioritas Pengembangan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4 avoid-break">
          <div>
            <h3 className="text-xs font-bold text-emerald-800 mb-1.5">
              3.3 Aspek Tertinggi (Kekuatan Utama)
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-[11px]">
              <thead>
                <tr className="bg-emerald-800 text-white text-left">
                  <th className="border border-slate-300 px-2.5 py-1.5">Aspek</th>
                  <th className="border border-slate-300 px-2.5 py-1.5 w-16 text-center">Skor</th>
                </tr>
              </thead>
              <tbody>
                {metrics.topAspects.map((a) => (
                  <tr key={a.id}>
                    <td className="border border-slate-300 px-2.5 py-1">{a.name}</td>
                    <td className="border border-slate-300 px-2.5 py-1 text-center font-bold text-emerald-800">
                      {Number(a.score).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-xs font-bold text-rose-800 mb-1.5">
              3.4 Aspek Terendah (Prioritas Pengembangan)
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-[11px]">
              <thead>
                <tr className="bg-rose-800 text-white text-left">
                  <th className="border border-slate-300 px-2.5 py-1.5">Aspek</th>
                  <th className="border border-slate-300 px-2.5 py-1.5 w-16 text-center">Skor</th>
                </tr>
              </thead>
              <tbody>
                {metrics.bottomAspects.length > 0 ? (
                  metrics.bottomAspects.map((a) => (
                    <tr key={a.id}>
                      <td className="border border-slate-300 px-2.5 py-1">{a.name}</td>
                      <td className="border border-slate-300 px-2.5 py-1 text-center font-bold text-rose-800">
                        {Number(a.score).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="border border-slate-300 px-2.5 py-2 text-center text-slate-400 italic"
                    >
                      Tambahkan minimal 2 aspek untuk perbandingan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Analisis Feedback Kualitatif & Gap Analysis */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#0F2942]">
          4. Analisis Feedback Kualitatif &amp; Kesenjangan Penilai
        </h2>

        {metrics.hasSignificantGap && metrics.highestRater && metrics.lowestRater && (
          <div className="avoid-break p-3 rounded-lg bg-amber-50 border border-amber-300 text-[11px] text-amber-900">
            <strong>Deteksi Kesenjangan Otomatis:</strong> Terdapat selisih skor signifikan sebesar{' '}
            <strong>{metrics.raterSpread.toFixed(2)} poin</strong> antara penilai tertinggi (
            {metrics.highestRater.name}: {Number(metrics.highestRater.score).toFixed(2)}) dan
            terendah ({metrics.lowestRater.name}: {Number(metrics.lowestRater.score).toFixed(2)}).
            Disarankan klarifikasi manajemen dalam sesi 1-on-1.
          </div>
        )}

        {gapAnalysisNote && (
          <div className="avoid-break p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <strong className="text-[#0F2942]">Catatan Gap Analysis HR/Manajemen: </strong>
            {gapAnalysisNote}
          </div>
        )}

        <div className="space-y-2.5">
          {qualitativeFeedback.map((fb) => (
            <div
              key={fb.id}
              className="avoid-break p-3 rounded-lg border border-slate-200 bg-white space-y-1.5"
            >
              <div className="text-xs font-bold text-[#1B4D6B]">{fb.source}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="font-semibold text-rose-700">Perlu Dihilangkan: </span>
                  <span className="text-slate-700">{fb.toStop || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-emerald-700">Dilanjutkan: </span>
                  <span className="text-slate-700">{fb.toContinue || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold text-amber-700">Ditingkatkan: </span>
                  <span className="text-slate-700">{fb.toImprove || '-'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Growth Plan */}
      <div>
        <h2 className="text-sm font-bold text-[#0F2942] mb-2">
          5. Rencana Pengembangan &amp; Aksi (30–60–90 Hari) — {metrics.category.label}
        </h2>
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse border border-slate-300 text-[11px]">
            <thead>
              <tr className="bg-[#0F2942] text-white text-left">
                <th className="border border-slate-300 px-2 py-1.5 w-8 text-center">#</th>
                <th className="border border-slate-300 px-2.5 py-1.5 w-40">Area</th>
                <th className="border border-slate-300 px-2.5 py-1.5">Rencana Aksi</th>
                <th className="border border-slate-300 px-2 py-1.5 w-24 text-center">Target Waktu</th>
                <th className="border border-slate-300 px-2 py-1.5 w-24 text-center">PIC</th>
              </tr>
            </thead>
            <tbody>
              {growthPlan.map((gp, idx) => (
                <tr key={gp.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                  <td className="border border-slate-300 px-2 py-1.5 text-center font-bold">
                    {idx + 1}
                  </td>
                  <td className="border border-slate-300 px-2.5 py-1.5 font-semibold text-[#0F2942]">
                    {gp.area}
                  </td>
                  <td className="border border-slate-300 px-2.5 py-1.5">{gp.action}</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-center font-semibold text-emerald-800">
                    {gp.timeline}
                  </td>
                  <td className="border border-slate-300 px-2 py-1.5 text-center">{gp.pic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Rekomendasi Manajemen & Pengesahan */}
      <div className="avoid-break space-y-4">
        <h2 className="text-sm font-bold text-[#0F2942]">6. Rekomendasi Manajemen &amp; Pengesahan</h2>

        <table className="w-full border-collapse border border-slate-300 text-xs">
          <tbody>
            <tr className="bg-[#0F2942] text-white">
              <td className="border border-slate-300 px-3 py-1.5 font-bold w-48">Final Score</td>
              <td className="border border-slate-300 px-3 py-1.5 font-extrabold">
                {metrics.finalScore.toFixed(2)} ({metrics.category.label})
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 px-3 py-1.5 font-semibold">
                Jenis Tindak Lanjut
              </td>
              <td className="border border-slate-300 px-3 py-1.5 font-semibold text-teal-800">
                {metrics.category.actionType}
              </td>
            </tr>
            <tr className="bg-slate-50">
              <td className="border border-slate-300 px-3 py-1.5 font-semibold">
                Rekomendasi Level
              </td>
              <td className="border border-slate-300 px-3 py-1.5">{decision.recommendedLevel}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 px-3 py-1.5 font-semibold">
                Penyesuaian Gaji Pokok
              </td>
              <td className="border border-slate-300 px-3 py-1.5">{decision.baseSalaryNote}</td>
            </tr>
            <tr className="bg-slate-50">
              <td className="border border-slate-300 px-3 py-1.5 font-semibold">
                Range Tunjangan
              </td>
              <td className="border border-slate-300 px-3 py-1.5">{decision.allowanceRange}</td>
            </tr>
          </tbody>
        </table>

        {decision.followUpItems.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-[#1B4D6B] mb-1">Tindak Lanjut yang Disarankan</h3>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700">
              {decision.followUpItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </div>
        )}

        {decision.closingNote && (
          <div>
            <h3 className="text-xs font-bold text-[#1B4D6B] mb-1">Catatan Penutup</h3>
            <p className="text-xs text-slate-700">{decision.closingNote}</p>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-12 pt-6">
          <div>
            <p className="text-xs font-semibold text-slate-700">Disiapkan oleh:</p>
            <div className="h-16 border-b border-slate-400" />
            <p className="text-[11px] text-slate-600 mt-1">{decision.preparedBy}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700">Diketahui oleh:</p>
            <div className="h-16 border-b border-slate-400" />
            <p className="text-[11px] text-slate-600 mt-1">{decision.approvedBy}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
        <span>{LUMINARA_CLINIC.name} — {LUMINARA_CLINIC.address}</span>
        <span>Dokumen Rahasia HR Internal</span>
      </div>
    </div>
  );
}
