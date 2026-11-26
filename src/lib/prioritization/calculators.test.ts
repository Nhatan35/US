import { describe, expect, it } from 'vitest';
import { calcRice, calcWsjf, simulateRelease, type PrioritizableStory } from './calculators';
import { forecastVelocity } from './velocity';

describe('Prioritization & Velocity engines', () => {
  it('computes RICE and WSJF accurately', () => {
    expect(calcRice({ reach: 5000, impact: 2, confidence: 80, effort: 4 })).toBe(2000);
    expect(calcWsjf({ businessValue: 8, timeCriticality: 6, riskReduction: 4, jobSize: 3 })).toBe(6);
  });

  it('detects compliance gaps, broken dependencies, and over-capacity in release simulation', () => {
    const stories: PrioritizableStory[] = [
      {
        id: 's1',
        title: 'Đồng ý xử lý dữ liệu (Nghị định 13)',
        points: 5,
        reach: 5000,
        impact: 1,
        confidence: 100,
        effort: 1,
        businessValue: 5,
        timeCriticality: 10,
        riskReduction: 10,
        jobSize: 2,
        simSatisfaction: 5,
        simRevenue: 0,
        simRiskMitigation: 25,
        isComplianceRequired: true,
      },
      {
        id: 's2',
        title: 'Đặt lịch trực tuyến',
        points: 8,
        reach: 4000,
        impact: 3,
        confidence: 80,
        effort: 3,
        businessValue: 10,
        timeCriticality: 8,
        riskReduction: 4,
        jobSize: 5,
        simSatisfaction: 25,
        simRevenue: 20,
        simRiskMitigation: 5,
      },
      {
        id: 's3',
        title: 'Nhắc lịch SMS',
        points: 5,
        reach: 4000,
        impact: 2,
        confidence: 90,
        effort: 2,
        businessValue: 8,
        timeCriticality: 6,
        riskReduction: 5,
        jobSize: 3,
        simSatisfaction: 15,
        simRevenue: 10,
        simRiskMitigation: 5,
        dependsOnId: 's2',
      },
    ];

    // Pick only s3 → misses compliance (s1) and breaks dependency (s2)
    const bad = simulateRelease(stories, ['s3'], { s3: 'must' }, 15);
    expect(bad.compliancePassed).toBe(false);
    expect(bad.brokenDependencies).toHaveLength(1);

    // Pick all → 18 > 15 overCapacity
    const over = simulateRelease(stories, ['s1', 's2', 's3'], { s1: 'must', s2: 'must', s3: 'must' }, 15);
    expect(over.overCapacity).toBe(true);
  });

  it('forecasts optimistic, average, and pessimistic sprint ranges', () => {
    const f = forecastVelocity([26, 30, 34], 120, 0, 1);
    expect(f.avgVelocity).toBe(30);
    expect(f.sprintsOptimistic).toBe(4); // ceil(120/34)
    expect(f.sprintsAverage).toBe(4); // ceil(120/30)
    expect(f.sprintsPessimistic).toBe(5); // ceil(120/26)
  });
});
