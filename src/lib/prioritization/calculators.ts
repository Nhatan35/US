export type MoscowCategory = 'must' | 'should' | 'could' | 'wont';

export interface PrioritizableStory {
  id: string;
  title: string;
  points: number;
  // RICE inputs
  reach: number; // users/month
  impact: number; // 0.25 | 0.5 | 1 | 2 | 3
  confidence: number; // 50 | 80 | 100 (%)
  effort: number; // person-weeks
  // WSJF inputs (1-10)
  businessValue: number;
  timeCriticality: number;
  riskReduction: number;
  jobSize: number;
  // Hidden simulation attributes
  simSatisfaction: number; // 0-25
  simRevenue: number; // 0-25
  simRiskMitigation: number; // 0-25
  isComplianceRequired?: boolean;
  dependsOnId?: string;
}

export function calcRice(s: Pick<PrioritizableStory, 'reach' | 'impact' | 'confidence' | 'effort'>): number {
  if (s.effort <= 0) return 0;
  return Math.round((s.reach * s.impact * (s.confidence / 100)) / s.effort);
}

export function calcWsjf(
  s: Pick<PrioritizableStory, 'businessValue' | 'timeCriticality' | 'riskReduction' | 'jobSize'>,
): number {
  if (s.jobSize <= 0) return 0;
  return Number(((s.businessValue + s.timeCriticality + s.riskReduction) / s.jobSize).toFixed(2));
}

export interface SimulationReport {
  usedPoints: number;
  capacity: number;
  overCapacity: boolean;
  mustPercent: number;
  satisfactionScore: number; // 0-100
  revenueScore: number; // 0-100
  riskScore: number; // 0-100 (higher = safer)
  compliancePassed: boolean;
  missingComplianceTitles: string[];
  brokenDependencies: string[];
  verdict: string;
}

export function simulateRelease(
  allStories: PrioritizableStory[],
  selectedIds: string[],
  moscowMap: Record<string, MoscowCategory>,
  capacity: number,
): SimulationReport {
  const selectedSet = new Set(selectedIds);
  const selected = allStories.filter((s) => selectedSet.has(s.id));

  const usedPoints = selected.reduce((sum, s) => sum + s.points, 0);
  const mustPoints = allStories
    .filter((s) => moscowMap[s.id] === 'must')
    .reduce((sum, s) => sum + s.points, 0);
  const mustPercent = capacity > 0 ? Math.round((mustPoints / capacity) * 100) : 0;

  const maxSat = allStories.reduce((sum, s) => sum + s.simSatisfaction, 0) || 1;
  const maxRev = allStories.reduce((sum, s) => sum + s.simRevenue, 0) || 1;
  const maxRisk = allStories.reduce((sum, s) => sum + s.simRiskMitigation, 0) || 1;

  const satisfactionScore = Math.round(
    (selected.reduce((sum, s) => sum + s.simSatisfaction, 0) / maxSat) * 100,
  );
  const revenueScore = Math.round(
    (selected.reduce((sum, s) => sum + s.simRevenue, 0) / maxRev) * 100,
  );
  const riskScore = Math.round(
    (selected.reduce((sum, s) => sum + s.simRiskMitigation, 0) / maxRisk) * 100,
  );

  const missingComplianceTitles = allStories
    .filter((s) => s.isComplianceRequired && !selectedSet.has(s.id))
    .map((s) => s.title);

  const brokenDependencies: string[] = [];
  for (const s of selected) {
    if (s.dependsOnId && !selectedSet.has(s.dependsOnId)) {
      const dep = allStories.find((x) => x.id === s.dependsOnId);
      brokenDependencies.push(`"${s.title}" cần "${dep?.title ?? s.dependsOnId}"`);
    }
  }

  const overCapacity = usedPoints > capacity;
  const compliancePassed = missingComplianceTitles.length === 0;

  let verdict = 'Phạm vi release cân bằng tốt giữa giá trị người dùng, rủi ro và năng lực team!';
  if (overCapacity) {
    verdict = `Vượt quá capacity (${usedPoints}/${capacity} điểm) — nguy cơ trễ deadline và giảm chất lượng rất cao.`;
  } else if (!compliancePassed) {
    verdict = `Thiếu yêu cầu pháp lý bắt buộc (${missingComplianceTitles.join(', ')}) — ban giám đốc/pháp chế sẽ chặn phát hành.`;
  } else if (brokenDependencies.length > 0) {
    verdict = `Phát hiện phụ thuộc bị gãy (${brokenDependencies[0]}) — cần bổ sung story nền tảng vào release.`;
  } else if (mustPercent > 65) {
    verdict = `Nhóm Must chiếm ${mustPercent}% capacity (khuyến nghị ≤ 60%) — ít vùng đệm nếu phát sinh rủi ro.`;
  }

  return {
    usedPoints,
    capacity,
    overCapacity,
    mustPercent,
    satisfactionScore,
    revenueScore,
    riskScore,
    compliancePassed,
    missingComplianceTitles,
    brokenDependencies,
    verdict,
  };
}
