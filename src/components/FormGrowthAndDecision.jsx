import { TrendingUp, Award, Plus, Trash2 } from 'lucide-react';

export default function FormGrowthAndDecision({ data, metrics, onChange }) {
  const { growthPlan, decision } = data;

  const updateGrowth = (idx, field, val) => {
    const next = growthPlan.map((g, i) => (i === idx ? { ...g, [field]: val } : g));
    onChange({ ...data, growthPlan: next });
  };

  const addGrowth = () => {
    onChange({
      ...data,
      growthPlan: [
        ...growthPlan,
        { id: `gp-${Date.now()}`, area: '', action: '', timeline: '30 hari', pic: 'Atasan / HR' },
      ],
    });
  };

  const removeGrowth = (idx) => {
    onChange({ ...data, growthPlan: growthPlan.filter((_, i) => i !== idx) });
  };

  const updateDecision = (field, val) => {
    onChange({ ...data, decision: { ...decision, [field]: val } });
  };

  const updateFollowUp = (idx, val) => {
    const next = decision.followUpItems.map((item, i) => (i === idx ? val : item));
    updateDecision('followUpItems', next);
  };

  const addFollowUp = () => {
    updateDecision('followUpItems', [...decision.followUpItems, '']);
  };

  const removeFollowUp = (idx) => {
    updateDecision(
      'followUpItems',
      decision.followUpItems.filter((_, i) => i !== idx)
    );
  };

  return (
    <div className="space-y-6">
      {/* Growth Plan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Rencana Pengembangan / Aksi Perbaikan (30–60–90 Hari)
              </h2>
              <p className="text-[11px] text-slate-500">
                Rekomendasi sistem saat ini: <strong>{metrics.category.actionType}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={addGrowth}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F2942] hover:bg-[#1B365D] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Rencana Aksi
          </button>
        </div>

        <div className="space-y-3">
          {growthPlan.map((gp, idx) => (
            <div
              key={gp.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-start"
            >
              <div className="md:col-span-3">
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  Area Fokus
                </label>
                <input
                  type="text"
                  value={gp.area}
                  onChange={(e) => updateGrowth(idx, 'area', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold"
                />
              </div>
              <div className="md:col-span-5">
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  Rencana Aksi Konkret
                </label>
                <textarea
                  rows={2}
                  value={gp.action}
                  onChange={(e) => updateGrowth(idx, 'action', e.target.value)}
                  className="w-full p-2 rounded-lg bg-white border border-slate-300 text-xs"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                  Target Waktu
                </label>
                <input
                  type="text"
                  value={gp.timeline}
                  onChange={(e) => updateGrowth(idx, 'timeline', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium"
                />
              </div>
              <div className="md:col-span-2 flex items-end gap-1.5">
                <div className="flex-1">
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                    PIC
                  </label>
                  <input
                    type="text"
                    value={gp.pic}
                    onChange={(e) => updateGrowth(idx, 'pic', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeGrowth(idx)}
                  title="Hapus Rencana Aksi"
                  aria-label={`Hapus rencana aksi ${gp.area || idx + 1}`}
                  className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keputusan Level, Kompensasi & Tanda Tangan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Award className="w-4 h-4 text-teal-700" />
          <h2 className="text-sm font-bold text-slate-900">
            Rekomendasi Manajemen, Kompensasi &amp; Pengesahan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Rekomendasi Level / Status
            </label>
            <input
              type="text"
              value={decision.recommendedLevel}
              onChange={(e) => updateDecision('recommendedLevel', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Penyesuaian Gaji Pokok
            </label>
            <input
              type="text"
              value={decision.baseSalaryNote}
              onChange={(e) => updateDecision('baseSalaryNote', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Range Tunjangan
            </label>
            <input
              type="text"
              value={decision.allowanceRange}
              onChange={(e) => updateDecision('allowanceRange', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Daftar Tindak Lanjut Manajemen (Recognition / Coaching / Training / PIP)
            </label>
            <button
              type="button"
              onClick={addFollowUp}
              className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
            >
              + Tambah Poin
            </button>
          </div>
          <div className="space-y-2">
            {decision.followUpItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateFollowUp(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeFollowUp(idx)}
                  title="Hapus Poin Tindak Lanjut"
                  aria-label={`Hapus poin tindak lanjut ${idx + 1}`}
                  className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Catatan Penutup HR / Pimpinan
          </label>
          <textarea
            rows={3}
            value={decision.closingNote}
            onChange={(e) => updateDecision('closingNote', e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Disiapkan Oleh (Nama / Jabatan)
            </label>
            <input
              type="text"
              value={decision.preparedBy}
              onChange={(e) => updateDecision('preparedBy', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Diketahui / Disetujui Oleh
            </label>
            <input
              type="text"
              value={decision.approvedBy}
              onChange={(e) => updateDecision('approvedBy', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
