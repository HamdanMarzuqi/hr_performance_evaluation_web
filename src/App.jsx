import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Printer,
  FileSpreadsheet,
  UserCheck,
  Target,
  HeartHandshake,
  TrendingUp,
  Eye,
  Download,
  Upload,
  RotateCcw,
  Lock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import PinLock from './components/PinLock';
import FormProfile from './components/FormProfile';
import FormKPI from './components/FormKPI';
import FormCulture360 from './components/FormCulture360';
import FormGrowthAndDecision from './components/FormGrowthAndDecision';
import ReportPreview from './components/ReportPreview';
import { SAMPLE_MERISTIYANTI, EMPTY_EVALUATION } from './data/presets';
import { computeEvaluationMetrics, normalizeEvaluationData } from './utils/calculations';

const STORAGE_KEY = 'luminara_hr_appraisal_draft_v1';

const TABS = [
  { id: 'profile', label: '1. Profil & Bobot', icon: UserCheck },
  { id: 'kpi', label: '2. KPI (Target vs Realisasi)', icon: Target },
  { id: 'culture', label: '3. Budaya & 360°', icon: HeartHandshake },
  { id: 'growth', label: '4. Growth Plan & Keputusan', icon: TrendingUp },
  { id: 'preview', label: '5. Preview & Cetak PDF', icon: Eye },
];

export default function App() {
  const [unlocked, setUnlocked] = useState(() => {
    return sessionStorage.getItem('luminara_hr_unlocked') === 'true';
  });

  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return normalizeEvaluationData(JSON.parse(saved), EMPTY_EVALUATION);
      }
    } catch {
      // ignore storage errors
    }
    return SAMPLE_MERISTIYANTI;
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [saveState, setSaveState] = useState('saved');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setSaveState('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSaveState('saved');
      } catch {
        setSaveState('error');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);

  const metrics = useMemo(() => computeEvaluationMetrics(data), [data]);

  if (!unlocked) {
    return <PinLock onUnlock={() => setUnlocked(true)} />;
  }

  const currentTabIndex = TABS.findIndex((t) => t.id === activeTab);
  const prevTab = currentTabIndex > 0 ? TABS[currentTabIndex - 1] : null;
  const nextTab = currentTabIndex < TABS.length - 1 ? TABS[currentTabIndex + 1] : null;

  const goToTab = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadSample = () => {
    if (
      window.confirm(
        'Muat data Contoh Lengkap (Meristiyanti)? Perubahan pada form saat ini akan diganti.'
      )
    ) {
      setData(SAMPLE_MERISTIYANTI);
    }
  };

  const handleResetEmpty = () => {
    if (
      window.confirm(
        'Mulai Evaluasi Karyawan Baru? Pastikan Anda sudah menyimpan Backup atau PDF evaluasi sebelumnya.'
      )
    ) {
      setData(EMPTY_EVALUATION);
      setActiveTab('profile');
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleExportJson = () => {
    const fileName = `Evaluasi_HR_${(data.profile.name || 'Karyawan')
      .replace(/\s+/g, '_')}_${data.profile.period || '2025'}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (parsed && typeof parsed === 'object' && (parsed.profile || parsed.kpiItems)) {
          setData(normalizeEvaluationData(parsed, EMPTY_EVALUATION));
        } else {
          alert('Struktur file JSON tidak dikenali sebagai data evaluasi HR Luminara.');
        }
      } catch {
        alert('Format file JSON tidak valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLock = () => {
    sessionStorage.removeItem('luminara_hr_unlocked');
    setUnlocked(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-14">
      {/* Top Navbar (Hidden when printing) */}
      <header className="no-print sticky top-0 z-30 bg-[#0F2942] text-white shadow-md border-b border-slate-700/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center font-extrabold text-sm shadow">
              L
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">
                Luminara Dental Clinic — HR Appraisal Tool
              </h1>
              <p className="text-[11px] text-slate-300">
                Hybrid Evaluation: KPI-Based (Target vs. Realisasi) &amp; 360° Core Values
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition cursor-pointer"
              title="Muat Contoh Lengkap (Meristiyanti)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Contoh Lengkap
            </button>

            <button
              type="button"
              onClick={handleResetEmpty}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition cursor-pointer"
              title="Mulai Evaluasi Karyawan Baru"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Evaluasi Baru
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition cursor-pointer"
              title="Simpan Backup Data JSON"
            >
              <Download className="w-3.5 h-3.5" />
              Backup
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium transition cursor-pointer"
              title="Muat Backup Data JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              Muat File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />

            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Save PDF
            </button>

            <button
              type="button"
              onClick={handleLock}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/80 text-white transition cursor-pointer"
              title="Kunci Halaman HR"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Live Score Summary Strip (Hidden when printing) */}
      <div className="no-print bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <FileSpreadsheet className="w-4 h-4 text-teal-700" />
            <span className="text-slate-500">Karyawan Aktif:</span>
            <strong className="text-slate-900">{data.profile.name || '(Belum diisi)'}</strong>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">{data.profile.role}</span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
              <Check className="w-3 h-3" />
              {saveState === 'saving' ? 'Menyimpan...' : 'Tersimpan otomatis'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
              KPI ({metrics.kpiWeightPct}%):{' '}
              <strong className="text-[#0F2942]">{metrics.kpiScore.toFixed(2)}</strong>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
              360° ({metrics.cultureWeightPct}%):{' '}
              <strong className="text-teal-800">{metrics.cultureScore.toFixed(2)}</strong>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
              Index: <strong>{metrics.contributionIndex.toFixed(2)}×</strong>
            </div>
            <div className="px-3 py-1 rounded-lg bg-[#0F2942] text-white font-bold">
              Final Score: {metrics.finalScore.toFixed(2)}
            </div>
            <div className={`px-3 py-1 rounded-lg text-white font-bold ${metrics.category.badgeBg}`}>
              {metrics.category.label}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto gap-1 pt-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'border-teal-600 text-teal-800 bg-teal-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-6 print:p-0 print:max-w-none">
        {activeTab === 'profile' && (
          <div className="no-print">
            <FormProfile data={data} onChange={setData} />
          </div>
        )}

        {activeTab === 'kpi' && (
          <div className="no-print">
            <FormKPI data={data} onChange={setData} />
          </div>
        )}

        {activeTab === 'culture' && (
          <div className="no-print">
            <FormCulture360 data={data} metrics={metrics} onChange={setData} />
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="no-print">
            <FormGrowthAndDecision data={data} metrics={metrics} onChange={setData} />
          </div>
        )}

        {activeTab === 'preview' ? (
          <div>
            <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 text-xs text-teal-900">
              <span>
                <strong>Mode Pratinjau Cetak A4:</strong> Pastikan di dialog Print browser memilih{' '}
                <em>Save as PDF</em>, ukuran <strong>A4</strong>, dan centang{' '}
                <strong>Background graphics</strong> agar warna kartu ikut tercetak.
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F2942] hover:bg-[#1B365D] text-white font-bold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
            <ReportPreview data={data} metrics={metrics} />
          </div>
        ) : (
          /* Tetap dirender khusus saat @media print agar tombol Cetak / Ctrl+P berfungsi langsung dari tab mana saja */
          <div className="hidden print:block">
            <ReportPreview data={data} metrics={metrics} />
          </div>
        )}

        {/* Step Navigation Footer (Hidden when printing) */}
        <div className="no-print mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {prevTab ? (
            <button
              type="button"
              onClick={() => goToTab(prevTab.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya: {prevTab.label}
            </button>
          ) : (
            <div />
          )}

          {nextTab ? (
            <button
              type="button"
              onClick={() => goToTab(nextTab.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2942] hover:bg-[#1B365D] text-white text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              Selanjutnya: {nextTab.label}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak / Save PDF Sekarang
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
