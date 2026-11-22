import { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PinLock({ onUnlock }) {
  const customPin = import.meta.env.VITE_HR_PIN;
  const expectedPin = customPin || '2025';
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() === expectedPin) {
      sessionStorage.setItem('luminara_hr_unlocked', 'true');
      onUnlock();
    } else {
      setError('PIN tidak sesuai. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F2942] via-[#1B365D] to-[#0D5C63] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#0F2942] text-white flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Luminara HR Appraisal
            </h1>
            <p className="text-xs text-slate-500">
              Sistem Evaluasi Kinerja KPI &amp; 360° — Internal Klinik
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="hr-pin"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
            >
              Masukkan PIN Akses HR
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="hr-pin"
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="••••"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              />
            </div>
            {error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#0F2942] hover:bg-[#1B365D] text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            Buka Sistem Evaluasi
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {!customPin && (
          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            <p>
              PIN default demo:{' '}
              <code className="px-1.5 py-0.5 bg-slate-100 rounded font-semibold text-slate-700">
                2025
              </code>{' '}
              (otomatis disembunyikan jika Environment Variable{' '}
              <code className="px-1 bg-slate-100 rounded">VITE_HR_PIN</code> diatur di Vercel).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
