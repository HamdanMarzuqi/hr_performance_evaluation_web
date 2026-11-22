import { useState } from 'react';
import {
  Users,
  HeartHandshake,
  MessageSquare,
  Plus,
  Trash2,
  Upload,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { LUMINARA_CLINIC } from '../data/presets';

export default function FormCulture360({ data, metrics, onChange }) {
  const { cultureCategories, raters, aspects, qualitativeFeedback, gapAnalysisNote } = data;
  const [csvText, setCsvText] = useState('');
  const [csvError, setCsvError] = useState('');
  const [showCsvModal, setShowCsvModal] = useState(false);

  const updateArrayItem = (key, idx, field, val) => {
    const next = data[key].map((item, i) => (i === idx ? { ...item, [field]: val } : item));
    onChange({ ...data, [key]: next });
  };

  const clampScoreOnBlur = (key, idx, currentVal) => {
    const num = Number(currentVal);
    if (currentVal === '' || Number.isNaN(num)) {
      updateArrayItem(key, idx, 'score', 5.0);
    } else {
      updateArrayItem(key, idx, 'score', Number(Math.max(1, Math.min(6, num)).toFixed(2)));
    }
  };

  const addCultureCategory = () => {
    onChange({
      ...data,
      cultureCategories: [
        ...cultureCategories,
        { id: `c-${Date.now()}`, name: 'Dimensi Budaya Baru', score: 5.0 },
      ],
    });
  };

  const removeCultureCategory = (idx) => {
    onChange({
      ...data,
      cultureCategories: cultureCategories.filter((_, i) => i !== idx),
    });
  };

  const syncCategoriesFromRaters = () => {
    if (!metrics?.avgRaterScore) return;
    onChange({
      ...data,
      cultureCategories: cultureCategories.map((c) => ({
        ...c,
        score: metrics.avgRaterScore,
      })),
    });
  };

  const addRater = () => {
    onChange({
      ...data,
      raters: [
        ...raters,
        { id: `r-${Date.now()}`, name: 'Penilai Baru', group: 'Rekan', score: 5.0 },
      ],
    });
  };

  const removeRater = (idx) => {
    onChange({ ...data, raters: raters.filter((_, i) => i !== idx) });
  };

  const addAspect = () => {
    onChange({
      ...data,
      aspects: [...aspects, { id: `a-${Date.now()}`, name: 'Aspek Budaya Baru', score: 5.0 }],
    });
  };

  const removeAspect = (idx) => {
    onChange({ ...data, aspects: aspects.filter((_, i) => i !== idx) });
  };

  const addFeedbackSource = () => {
    onChange({
      ...data,
      qualitativeFeedback: [
        ...qualitativeFeedback,
        {
          id: `qf-${Date.now()}`,
          source: 'Sumber Penilai Baru',
          toStop: '',
          toContinue: '',
          toImprove: '',
        },
      ],
    });
  };

  const removeFeedbackSource = (idx) => {
    onChange({
      ...data,
      qualitativeFeedback: qualitativeFeedback.filter((_, i) => i !== idx),
    });
  };

  const handleImportCsv = () => {
    const lines = csvText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    const parsed = [];
    lines.forEach((line, idx) => {
      let parts;
      if (line.includes('\t')) {
        parts = line.split('\t').map((p) => p.trim());
      } else if (line.includes(';')) {
        parts = line.split(';').map((p) => p.trim());
      } else {
        parts = line.split(',').map((p) => p.trim());
        // Dukung desimal koma jika dipisahkan koma (misal: "Dokter 1, Dokter, 5,85")
        if (
          parts.length >= 3 &&
          /^[1-6]$/.test(parts[parts.length - 2]) &&
          /^\d{1,2}$/.test(parts[parts.length - 1])
        ) {
          const dec = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
          parts = [...parts.slice(0, -2), dec];
        }
      }

      if (parts.length >= 2) {
        const rawScore = parts[parts.length - 1].replace(',', '.');
        const score = parseFloat(rawScore);
        if (!Number.isNaN(score) && parts[0]) {
          parsed.push({
            id: `r-csv-${Date.now()}-${idx}`,
            name: parts[0],
            group: parts.length >= 3 && parts[1] ? parts[1] : 'Penilai',
            score: Number(Math.max(1, Math.min(6, score)).toFixed(2)),
          });
        }
      }
    });

    if (parsed.length > 0) {
      onChange({ ...data, raters: parsed });
      setCsvText('');
      setCsvError('');
      setShowCsvModal(false);
    } else {
      setCsvError(
        'Data tidak terbaca. Pastikan tiap baris memiliki format: Nama Penilai, Kelompok, Skor (contoh: Dokter 1, Dokter, 5.85 atau copy-paste langsung dari Excel).'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Kategori Budaya Luminara */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-teal-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Pilar 2: Kategori Budaya &amp; Kompetensi 360° (Skala 1–6)
              </h2>
              <p className="text-[11px] text-slate-500">
                Selaras dengan 7 Core Values Luminara: {LUMINARA_CLINIC.coreValues.join(' • ')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {raters.length > 0 && metrics?.avgRaterScore > 0 && (
              <button
                type="button"
                onClick={syncCategoriesFromRaters}
                title="Samakan skor kategori budaya dengan rata-rata skor penilai 360°"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Samakan dgn Rata-rata Penilai ({metrics.avgRaterScore.toFixed(2)})
              </button>
            )}
            <button
              type="button"
              onClick={addCultureCategory}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F2942] hover:bg-[#1B365D] text-white text-xs font-semibold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Kategori
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cultureCategories.map((cat, idx) => (
            <div
              key={cat.id}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200"
            >
              <input
                type="text"
                value={cat.name}
                onChange={(e) => updateArrayItem('cultureCategories', idx, 'name', e.target.value)}
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <input
                type="number"
                step="0.01"
                min="1"
                max="6"
                value={cat.score}
                onChange={(e) =>
                  updateArrayItem(
                    'cultureCategories',
                    idx,
                    'score',
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                onBlur={() => clampScoreOnBlur('cultureCategories', idx, cat.score)}
                className="w-20 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-sm font-bold text-center text-[#0F2942] focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              {cultureCategories.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCultureCategory(idx)}
                  title="Hapus Kategori Budaya"
                  aria-label={`Hapus kategori ${cat.name}`}
                  className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Daftar Penilai 360 + Import CSV */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <Users className="w-4 h-4 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Skor Per Penilai 360° ({raters.length} Penilai)
            </h2>
            {metrics && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
                Rata-rata Penilai:{' '}
                <strong className="text-[#0F2942]">{metrics.avgRaterScore.toFixed(2)}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowCsvModal(!showCsvModal);
                setCsvError('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Import CSV / Paste Excel
            </button>
            <button
              type="button"
              onClick={addRater}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F2942] hover:bg-[#1B365D] text-white text-xs font-semibold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Penilai
            </button>
          </div>
        </div>

        {showCsvModal && (
          <div className="mb-4 p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2">
            <p className="text-xs font-semibold text-teal-900">
              Paste data dari Excel / Google Form (Format:{' '}
              <code>Nama Penilai, Kelompok, Skor</code> per baris — mendukung koma &amp; titik
              desimal):
            </p>
            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                setCsvError('');
              }}
              placeholder={`Dokter 1, Dokter, 5.85\nPerawat 1, Perawat, 4.97\nAtasan, Atasan, 4.67`}
              className="w-full p-2.5 rounded-lg border border-teal-300 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            {csvError && <p className="text-xs font-medium text-rose-600">{csvError}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCsvModal(false);
                  setCsvError('');
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleImportCsv}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white cursor-pointer"
              >
                Terapkan Data Penilai
              </button>
            </div>
          </div>
        )}

        {metrics?.hasSignificantGap && metrics.highestRater && metrics.lowestRater && (
          <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>
                Terdeteksi Kesenjangan Penilai ({metrics.raterSpread.toFixed(2)} poin):
              </strong>{' '}
              Skor tertinggi dari <strong>{metrics.highestRater.name}</strong> (
              {Number(metrics.highestRater.score).toFixed(2)}) dan terendah dari{' '}
              <strong>{metrics.lowestRater.name}</strong> (
              {Number(metrics.lowestRater.score).toFixed(2)}). Pastikan mengisi catatan{' '}
              <em>Gap Analysis</em> di bawah.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {raters.map((r, idx) => (
            <div
              key={r.id}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
            >
              <input
                type="text"
                value={r.name}
                onChange={(e) => updateArrayItem('raters', idx, 'name', e.target.value)}
                placeholder="Penilai"
                className="flex-1 min-w-0 px-2 py-1 rounded-lg bg-white border border-slate-300 text-xs font-medium"
              />
              <input
                type="text"
                value={r.group}
                onChange={(e) => updateArrayItem('raters', idx, 'group', e.target.value)}
                placeholder="Grup"
                className="w-24 px-2 py-1 rounded-lg bg-white border border-slate-300 text-xs text-slate-600"
              />
              <input
                type="number"
                step="0.01"
                min="1"
                max="6"
                value={r.score}
                onChange={(e) =>
                  updateArrayItem(
                    'raters',
                    idx,
                    'score',
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                onBlur={() => clampScoreOnBlur('raters', idx, r.score)}
                className="w-16 px-2 py-1 rounded-lg bg-white border border-slate-300 text-xs font-bold text-center"
              />
              <button
                type="button"
                onClick={() => removeRater(idx)}
                title="Hapus Penilai"
                aria-label={`Hapus penilai ${r.name}`}
                className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Aspek Perilaku (Otomatis diranking untuk Kekuatan & Prioritas) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Skor Per Aspek Perilaku &amp; Pelayanan ({aspects.length} Aspek)
            </h2>
            <p className="text-[11px] text-slate-500">
              Sistem otomatis membagi aspek tertinggi (Kekuatan Utama) &amp; terendah (Prioritas
              Pengembangan) tanpa duplikasi.
            </p>
          </div>
          <button
            type="button"
            onClick={addAspect}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F2942] hover:bg-[#1B365D] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Aspek
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {aspects.map((asp, idx) => (
            <div
              key={asp.id}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200"
            >
              <input
                type="text"
                value={asp.name}
                onChange={(e) => updateArrayItem('aspects', idx, 'name', e.target.value)}
                className="flex-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs font-medium"
              />
              <input
                type="number"
                step="0.01"
                min="1"
                max="6"
                value={asp.score}
                onChange={(e) =>
                  updateArrayItem(
                    'aspects',
                    idx,
                    'score',
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                onBlur={() => clampScoreOnBlur('aspects', idx, asp.score)}
                className="w-16 px-2 py-1 rounded-lg bg-white border border-slate-300 text-xs font-bold text-center"
              />
              <button
                type="button"
                onClick={() => removeAspect(idx)}
                title="Hapus Aspek"
                aria-label={`Hapus aspek ${asp.name}`}
                className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Kualitatif & Analisis Gap */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Analisis Feedback Kualitatif &amp; Kesenjangan Penilai
            </h2>
          </div>
          <button
            type="button"
            onClick={addFeedbackSource}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F2942] hover:bg-[#1B365D] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Sumber Feedback
          </button>
        </div>

        <div className="space-y-3">
          {qualitativeFeedback.map((fb, idx) => (
            <div key={fb.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={fb.source}
                  onChange={(e) =>
                    updateArrayItem('qualitativeFeedback', idx, 'source', e.target.value)
                  }
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-[#0F2942]"
                />
                <button
                  type="button"
                  onClick={() => removeFeedbackSource(idx)}
                  title="Hapus Sumber Feedback"
                  aria-label={`Hapus sumber feedback ${fb.source}`}
                  className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-semibold text-rose-700 uppercase mb-1">
                    Perlu Dihilangkan
                  </label>
                  <textarea
                    rows={2}
                    value={fb.toStop}
                    onChange={(e) =>
                      updateArrayItem('qualitativeFeedback', idx, 'toStop', e.target.value)
                    }
                    className="w-full p-2 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-emerald-700 uppercase mb-1">
                    Hal Bagus Dilanjutkan
                  </label>
                  <textarea
                    rows={2}
                    value={fb.toContinue}
                    onChange={(e) =>
                      updateArrayItem('qualitativeFeedback', idx, 'toContinue', e.target.value)
                    }
                    className="w-full p-2 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-amber-700 uppercase mb-1">
                    Perlu Ditingkatkan
                  </label>
                  <textarea
                    rows={2}
                    value={fb.toImprove}
                    onChange={(e) =>
                      updateArrayItem('qualitativeFeedback', idx, 'toImprove', e.target.value)
                    }
                    className="w-full p-2 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Catatan Analisis Kesenjangan Antar Penilai (Gap Analysis)
          </label>
          <textarea
            rows={3}
            value={gapAnalysisNote}
            onChange={(e) => onChange({ ...data, gapAnalysisNote: e.target.value })}
            placeholder="Jelaskan jika ada selisih mencolok antar penilai (misal per shift atau insiden tertentu)..."
            className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>
    </div>
  );
}
