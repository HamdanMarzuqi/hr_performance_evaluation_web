/**
 * Perhitungan Transparan Evaluasi Kinerja (KPI-Based + Budaya 360°)
 * Skala Penilaian Standar: 1.00 - 6.00
 */

/**
 * Menghitung persentase pencapaian KPI dan konversinya ke skala 1.0 - 6.0.
 * - direction === 'higher': Semakin tinggi semakin baik (misal % kepatuhan SOP)
 * - direction === 'lower': Semakin rendah semakin baik (misal jumlah keterlambatan, waktu persiapan)
 */
export function calculateKpiRow(item) {
  const target = Number(item.target) || 0;
  const actual = Number(item.actual) || 0;
  const weight = Math.max(0, Number(item.weight) || 0);

  let achievementPct = 0;

  if (item.direction === 'lower') {
    if (actual <= 0 && target <= 0) {
      achievementPct = 100;
    } else if (actual <= 0) {
      achievementPct = 120;
    } else if (target <= 0) {
      // Target 0 pelanggaran/keterlambatan, namun ada realisasi > 0
      achievementPct = Math.max(0, 100 - actual * 15);
    } else {
      achievementPct = (target / actual) * 100;
    }
  } else {
    if (target <= 0) {
      achievementPct = actual > 0 ? 100 : 0;
    } else {
      achievementPct = (actual / target) * 100;
    }
  }

  // Batasi visualisasi achievement di rentang wajar (0% - 150%)
  const clampedPct = Math.max(0, Math.min(150, achievementPct));

  // Konversi transparan % Pencapaian ke Skala 1 - 6:
  // >= 115% -> 6.00 | 100% -> 5.00 | 85% -> 4.00 | 70% -> 3.00 | 55% -> 2.00 | <= 40% -> 1.00
  let score = 1 + ((clampedPct - 40) / 75) * 5;
  score = Math.max(1, Math.min(6, score));

  let status = 'Perlu Perbaikan';
  let statusColor = 'rose';
  if (clampedPct >= 105) {
    status = 'Melampaui Target';
    statusColor = 'emerald';
  } else if (clampedPct >= 95) {
    status = 'Tercapai';
    statusColor = 'teal';
  } else if (clampedPct >= 80) {
    status = 'Mendekati Target';
    statusColor = 'amber';
  }

  return {
    achievementPct: Number(clampedPct.toFixed(1)),
    score: Number(score.toFixed(2)),
    weightedScore: Number(((score * weight) / 100).toFixed(4)),
    status,
    statusColor,
  };
}

/**
 * Menentukan kategori performa & rekomendasi tindak lanjut sesuai standar HR.
 */
export function getPerformanceCategory(finalScore) {
  if (finalScore >= 5.5) {
    return {
      label: 'Extraordinary',
      badgeBg: 'bg-emerald-700',
      textColor: 'text-emerald-700',
      actionType: 'Recognition & Fast-Track Promotion',
      summary: 'Kinerja jauh melampaui ekspektasi di seluruh dimensi KPI dan budaya.',
    };
  }
  if (finalScore >= 5.3) {
    return {
      label: 'High Performer',
      badgeBg: 'bg-amber-600',
      textColor: 'text-amber-700',
      actionType: 'Recognition, Growth Plan & Promosi Level',
      summary: 'Kinerja sangat baik; fokus pada penguatan kepemimpinan dan konsistensi detail.',
    };
  }
  if (finalScore >= 4.2) {
    return {
      label: 'Solid Performer',
      badgeBg: 'bg-teal-700',
      textColor: 'text-teal-700',
      actionType: 'Coaching & Competency Training',
      summary: 'Memenuhi ekspektasi klinik dengan beberapa area pengembangan terarah.',
    };
  }
  if (finalScore >= 3.2) {
    return {
      label: 'Developing / Need Coaching',
      badgeBg: 'bg-orange-600',
      textColor: 'text-orange-700',
      actionType: 'Intensive Coaching & Training',
      summary: 'Terdapat kesenjangan signifikan antara target dan realisasi kinerja.',
    };
  }
  return {
    label: 'Underperforming',
    badgeBg: 'bg-rose-700',
    textColor: 'text-rose-700',
    actionType: 'Performance Improvement Plan (PIP)',
    summary: 'Memerlukan program perbaikan terstruktur (PIP) dan evaluasi ketat 30-60 hari.',
  };
}

/**
 * Menghitung keseluruhan metrik laporan evaluasi secara real-time.
 */
export function computeEvaluationMetrics(data) {
  // 1. Skor KPI
  const kpiRows = (data.kpiItems || []).map((item) => ({
    ...item,
    ...calculateKpiRow(item),
  }));

  const totalKpiWeight = kpiRows.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);
  const rawKpiScore = kpiRows.reduce((sum, r) => sum + r.weightedScore, 0);
  const kpiScore =
    totalKpiWeight > 0 ? Number(((rawKpiScore / totalKpiWeight) * 100).toFixed(2)) : 0;

  // 2. Skor Budaya & 360°
  const cultureCategories = data.cultureCategories || [];
  const cultureScore =
    cultureCategories.length > 0
      ? Number(
          (
            cultureCategories.reduce((sum, c) => sum + (Number(c.score) || 0), 0) /
            cultureCategories.length
          ).toFixed(2)
        )
      : 0;

  // 3. Skor Gabungan Berdasarkan Bobot Pilar (KPI % + 360 %)
  const kpiWeightPct = Number(data.weights?.kpiWeight ?? 60);
  const cultureWeightPct = Number(data.weights?.cultureWeight ?? 40);
  const totalPillarWeight = kpiWeightPct + cultureWeightPct || 100;

  const blendedScore = Number(
    (
      (kpiScore * kpiWeightPct + cultureScore * cultureWeightPct) /
      totalPillarWeight
    ).toFixed(2)
  );

  // 4. Final Score dengan Contribution Index
  const rawContribution = data.profile?.contributionIndex;
  const contributionIndex =
    rawContribution === '' ||
    rawContribution === null ||
    rawContribution === undefined ||
    Number.isNaN(Number(rawContribution))
      ? 1.0
      : Number(rawContribution);
  const finalScore = Number((blendedScore * contributionIndex).toFixed(2));

  // 5. Analisis Penilai 360° (Deteksi Kesenjangan / Gap)
  const raters = data.raters || [];
  const sortedRaters = [...raters].sort((a, b) => Number(b.score) - Number(a.score));
  const highestRater = sortedRaters[0] || null;
  const lowestRater = sortedRaters[sortedRaters.length - 1] || null;
  const raterSpread =
    highestRater && lowestRater
      ? Number((Number(highestRater.score) - Number(lowestRater.score)).toFixed(2))
      : 0;
  const hasSignificantGap = raterSpread >= 1.5;

  const avgRaterScore =
    raters.length > 0
      ? Number(
          (raters.reduce((s, r) => s + (Number(r.score) || 0), 0) / raters.length).toFixed(2)
        )
      : 0;

  // 6. Aspek Tertinggi & Terendah (Tanpa duplikasi/overlap ketika jumlah aspek < 12)
  const aspects = data.aspects || [];
  const sortedAspects = [...aspects].sort((a, b) => Number(b.score) - Number(a.score));
  const splitIndex = Math.min(6, Math.ceil(sortedAspects.length / 2));
  const topAspects = sortedAspects.slice(0, splitIndex);
  const bottomAspects = sortedAspects.slice(splitIndex).reverse().slice(0, 6);

  const avgAspectScore =
    aspects.length > 0
      ? Number(
          (aspects.reduce((s, a) => s + (Number(a.score) || 0), 0) / aspects.length).toFixed(2)
        )
      : 0;

  const category = getPerformanceCategory(finalScore);

  return {
    kpiRows,
    totalKpiWeight,
    kpiScore,
    cultureScore,
    kpiWeightPct,
    cultureWeightPct,
    blendedScore,
    contributionIndex,
    finalScore,
    category,
    sortedRaters,
    highestRater,
    lowestRater,
    raterSpread,
    hasSignificantGap,
    avgRaterScore,
    avgAspectScore,
    topAspects,
    bottomAspects,
  };
}

/**
 * Menjamin struktur data evaluasi selalu lengkap (safe fallback merge)
 * saat dimuat dari localStorage atau import file JSON.
 */
export function normalizeEvaluationData(raw, fallback) {
  if (!raw || typeof raw !== 'object') return fallback;
  return {
    ...fallback,
    ...raw,
    profile: {
      ...fallback.profile,
      ...(raw.profile && typeof raw.profile === 'object' ? raw.profile : {}),
    },
    weights: {
      ...fallback.weights,
      ...(raw.weights && typeof raw.weights === 'object' ? raw.weights : {}),
    },
    kpiItems: Array.isArray(raw.kpiItems) ? raw.kpiItems : fallback.kpiItems,
    cultureCategories: Array.isArray(raw.cultureCategories)
      ? raw.cultureCategories
      : fallback.cultureCategories,
    raters: Array.isArray(raw.raters) ? raw.raters : fallback.raters,
    aspects: Array.isArray(raw.aspects) ? raw.aspects : fallback.aspects,
    qualitativeFeedback: Array.isArray(raw.qualitativeFeedback)
      ? raw.qualitativeFeedback
      : fallback.qualitativeFeedback,
    gapAnalysisNote:
      typeof raw.gapAnalysisNote === 'string' ? raw.gapAnalysisNote : fallback.gapAnalysisNote,
    growthPlan: Array.isArray(raw.growthPlan) ? raw.growthPlan : fallback.growthPlan,
    decision: {
      ...fallback.decision,
      ...(raw.decision && typeof raw.decision === 'object' ? raw.decision : {}),
      followUpItems: Array.isArray(raw.decision?.followUpItems)
        ? raw.decision.followUpItems
        : fallback.decision.followUpItems,
    },
  };
}
