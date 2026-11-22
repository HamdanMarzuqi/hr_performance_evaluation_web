import { Target, Plus, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { KPI_PRESETS_BY_ROLE } from '../data/presets';
import { calculateKpiRow } from '../utils/calculations';

export default function FormKPI({ data, onChange }) {
  const { kpiItems } = data;
  const totalWeight = kpiItems.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);

  const updateItem = (index, field, value) => {
    const updated = kpiItems.map((item, idx) =>
      idx === index ? { ...item, [field]: value } : item
    );
    onChange({ ...data, kpiItems: updated });
  };

  const addItem = () => {
    const newItem = {
      id: `kpi-${Date.now()}`,
      name: 'Indikator KPI Baru',
      description: 'Deskripsi target kerja terukur',
      weight: 10,
      unit: '%',
      direction: 'higher',
      target: 100,
      actual: 100,
    };
    onChange({ ...data, kpiItems: [...kpiItems, newItem] });
  };

  const removeItem = (index) => {
    onChange({
      ...data,
      kpiItems: kpiItems.filter((_, idx) => idx !== index),
    });
  };

  const applyPreset = (roleKey) => {
    const preset = KPI_PRESETS_BY_ROLE[roleKey];
    if (!preset) return;
    if (
      kpiItems.length > 0 &&
      !window.confirm(
        `Terapkan preset KPI "${roleKey}"? Daftar indikator KPI saat ini akan diganti.`
      )
    ) {
      return;
    }
    const defaultRoles = ['', ...Object.keys(KPI_PRESETS_BY_ROLE), 'Perawat Gigi — Leader Tim'];
    const shouldUpdateRole = defaultRoles.includes(data.profile?.role || '');
    onChange({
      ...data,
      profile: shouldUpdateRole ? { ...data.profile, role: roleKey } : data.profile,
      kpiItems: preset.map((p) => ({ ...p })),
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Pilar 1: Evaluasi KPI-Based (Target vs. Realisasi)
              </h2>
              <p className="text-[11px] text-slate-500">
                Mengukur ketercapaian indikator kerja yang disepakati di awal periode.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Preset Jabatan:</span>
            {Object.keys(KPI_PRESETS_BY_ROLE).map((roleKey) => (
              <button
                key={roleKey}
                type="button"
                onClick={() => applyPreset(roleKey)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 border border-slate-200 transition cursor-pointer"
              >
                {roleKey}
              </button>
            ))}
          </div>
        </div>

        {/* Status Total Bobot */}
        <div
          className={`mb-4 p-3 rounded-xl flex items-center justify-between text-xs font-medium border ${totalWeight === 100
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
        >
          <div className="flex items-center gap-2">
            {totalWeight === 100 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
            <span>
              Total Bobot KPI Saat Ini: <strong>{totalWeight}%</strong>{' '}
              {totalWeight !== 100 && '(Disarankan tepat 100% agar proporsional)'}
            </span>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F2942] hover:bg-[#1B365D] text-white text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah KPI
          </button>
        </div>

        {/* Daftar KPI */}
        <div className="space-y-3">
          {kpiItems.map((item, idx) => {
            const calc = calculateKpiRow(item);
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Nama Indikator KPI #{idx + 1}
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(idx, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Keterangan / Standar Pengukuran
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(idx, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    title="Hapus KPI"
                    aria-label={`Hapus KPI ${item.name}`}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 items-end">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Bobot (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.weight}
                      onChange={(e) =>
                        updateItem(
                          idx,
                          'weight',
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      onBlur={() => {
                        if (item.weight === '' || Number.isNaN(Number(item.weight))) {
                          updateItem(idx, 'weight', 0);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Satuan
                    </label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                      placeholder="%"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Arah Target
                    </label>
                    <select
                      value={item.direction}
                      onChange={(e) => updateItem(idx, 'direction', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      <option value="higher">↑ Lebih Tinggi Lebih Baik</option>
                      <option value="lower">↓ Lebih Rendah Lebih Baik</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Target Awal
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={item.target}
                      onChange={(e) =>
                        updateItem(
                          idx,
                          'target',
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      onBlur={() => {
                        if (item.target === '' || Number.isNaN(Number(item.target))) {
                          updateItem(idx, 'target', 0);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Realisasi
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={item.actual}
                      onChange={(e) =>
                        updateItem(
                          idx,
                          'actual',
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      onBlur={() => {
                        if (item.actual === '' || Number.isNaN(Number(item.actual))) {
                          updateItem(idx, 'actual', 0);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-teal-500 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 px-3 py-1.5 text-right">
                    <div className="text-[10px] text-slate-500">
                      Capaian: <strong>{calc.achievementPct}%</strong>
                    </div>
                    <div className="text-sm font-bold text-[#0F2942]">
                      Skor {calc.score.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
