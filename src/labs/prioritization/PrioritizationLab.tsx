import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Play, ShieldAlert, TrendingUp } from 'lucide-react';
import {
  calcRice,
  calcWsjf,
  simulateRelease,
  type MoscowCategory,
  type PrioritizableStory,
  type SimulationReport,
} from '@/lib/prioritization/calculators';
import { useProgressStore } from '@/lib/store/progressStore';

const CAPACITY = 36;

const MEDIBOOK_STORIES: PrioritizableStory[] = [
  {
    id: 'mb-1',
    title: 'Tìm & lọc bác sĩ theo chuyên khoa, chi nhánh',
    points: 5,
    reach: 5000,
    impact: 2,
    confidence: 100,
    effort: 2,
    businessValue: 8,
    timeCriticality: 8,
    riskReduction: 4,
    jobSize: 3,
    simSatisfaction: 20,
    simRevenue: 15,
    simRiskMitigation: 5,
  },
  {
    id: 'mb-2',
    title: 'Đặt lịch khám theo khung giờ trống',
    points: 8,
    reach: 5000,
    impact: 3,
    confidence: 90,
    effort: 3,
    businessValue: 10,
    timeCriticality: 9,
    riskReduction: 5,
    jobSize: 5,
    simSatisfaction: 25,
    simRevenue: 25,
    simRiskMitigation: 5,
    dependsOnId: 'mb-1',
  },
  {
    id: 'mb-3',
    title: 'Đồng ý xử lý dữ liệu cá nhân (Nghị định 13)',
    points: 3,
    reach: 5000,
    impact: 1,
    confidence: 100,
    effort: 1,
    businessValue: 4,
    timeCriticality: 10,
    riskReduction: 10,
    jobSize: 2,
    simSatisfaction: 5,
    simRevenue: 0,
    simRiskMitigation: 25,
    isComplianceRequired: true,
  },
  {
    id: 'mb-4',
    title: 'Gửi SMS nhắc lịch tự động trước 24 giờ',
    points: 5,
    reach: 4500,
    impact: 2,
    confidence: 90,
    effort: 2,
    businessValue: 8,
    timeCriticality: 7,
    riskReduction: 6,
    jobSize: 3,
    simSatisfaction: 18,
    simRevenue: 18,
    simRiskMitigation: 10,
    dependsOnId: 'mb-2',
  },
  {
    id: 'mb-5',
    title: 'Check-in nhanh bằng mã QR tại quầy lễ tân',
    points: 5,
    reach: 4000,
    impact: 2,
    confidence: 80,
    effort: 2,
    businessValue: 7,
    timeCriticality: 6,
    riskReduction: 5,
    jobSize: 3,
    simSatisfaction: 18,
    simRevenue: 10,
    simRiskMitigation: 8,
    dependsOnId: 'mb-2',
  },
  {
    id: 'mb-6',
    title: 'Đặt lịch hộ cho người thân lớn tuổi',
    points: 5,
    reach: 2000,
    impact: 2,
    confidence: 80,
    effort: 2,
    businessValue: 7,
    timeCriticality: 5,
    riskReduction: 4,
    jobSize: 3,
    simSatisfaction: 15,
    simRevenue: 12,
    simRiskMitigation: 4,
    dependsOnId: 'mb-2',
  },
  {
    id: 'mb-7',
    title: 'Thanh toán trực tuyến qua ví MoMo / VNPay',
    points: 8,
    reach: 3000,
    impact: 2,
    confidence: 70,
    effort: 4,
    businessValue: 8,
    timeCriticality: 5,
    riskReduction: 3,
    jobSize: 5,
    simSatisfaction: 12,
    simRevenue: 18,
    simRiskMitigation: 3,
    dependsOnId: 'mb-2',
  },
  {
    id: 'mb-8',
    title: 'Mini-game tích điểm đổi voucher cà phê',
    points: 8,
    reach: 1500,
    impact: 0.5,
    confidence: 50,
    effort: 4,
    businessValue: 3,
    timeCriticality: 2,
    riskReduction: 1,
    jobSize: 5,
    simSatisfaction: 4,
    simRevenue: 3,
    simRiskMitigation: 0,
  },
  {
    id: 'mb-9',
    title: 'Báo cáo tỉ lệ no-show cho ban giám đốc',
    points: 5,
    reach: 300,
    impact: 1,
    confidence: 80,
    effort: 2,
    businessValue: 6,
    timeCriticality: 4,
    riskReduction: 6,
    jobSize: 3,
    simSatisfaction: 5,
    simRevenue: 8,
    simRiskMitigation: 10,
  },
];

export function PrioritizationLab() {
  const recordExerciseResult = useProgressStore((s) => s.recordExerciseResult);
  const [framework, setFramework] = useState<'moscow' | 'rice' | 'wsjf'>('moscow');
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'mb-1',
    'mb-2',
    'mb-3',
    'mb-4',
    'mb-5',
    'mb-6',
  ]);
  const [moscow, setMoscow] = useState<Record<string, MoscowCategory>>({
    'mb-1': 'must',
    'mb-2': 'must',
    'mb-3': 'must',
    'mb-4': 'must',
    'mb-5': 'should',
    'mb-6': 'should',
    'mb-7': 'could',
    'mb-8': 'wont',
    'mb-9': 'could',
  });
  const [report, setReport] = useState<SimulationReport | null>(null);

  const usedPoints = useMemo(
    () =>
      MEDIBOOK_STORIES.filter((s) => selectedIds.includes(s.id)).reduce(
        (sum, s) => sum + s.points,
        0,
      ),
    [selectedIds],
  );

  const sortedStories = useMemo(() => {
    const copy = [...MEDIBOOK_STORIES];
    if (framework === 'rice') return copy.sort((a, b) => calcRice(b) - calcRice(a));
    if (framework === 'wsjf') return copy.sort((a, b) => calcWsjf(b) - calcWsjf(a));
    const order: Record<MoscowCategory, number> = { must: 0, should: 1, could: 2, wont: 3 };
    return copy.sort((a, b) => (order[moscow[a.id]] ?? 3) - (order[moscow[b.id]] ?? 3));
  }, [framework, moscow]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setReport(null);
  };

  const runSimulation = () => {
    const sim = simulateRelease(MEDIBOOK_STORIES, selectedIds, moscow, CAPACITY);
    setReport(sim);
    if (!sim.overCapacity && sim.compliancePassed && sim.brokenDependencies.length === 0) {
      recordExerciseResult('prioritization-lab', 100, 25, { prioritizing: 6 });
    }
  };

  return (
    <div className="stack-lg">
      <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="stack-sm">
          <h1 style={{ fontSize: '1.45rem' }}>Prioritization Simulator (MoSCoW · RICE · WSJF)</h1>
          <p className="secondary" style={{ fontSize: '0.9rem' }}>
            Chọn phạm vi Release 1 (MVP MediBook) trong giới hạn <strong>{CAPACITY} Story Point</strong>, so sánh thứ hạng giữa 3 framework và chạy mô phỏng hậu quả thực tế.
          </p>
        </div>

        <div className="row">
          {(['moscow', 'rice', 'wsjf'] as const).map((fw) => (
            <button
              key={fw}
              type="button"
              className={`btn btn-sm ${framework === fw ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFramework(fw)}
            >
              {fw.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Capacity bar */}
      <div className="card stack-sm">
        <div className="row-between">
          <strong>
            Năng lực Release 1: {usedPoints} / {CAPACITY} điểm
          </strong>
          <span
            className={`badge ${usedPoints > CAPACITY ? 'badge-danger' : 'badge-success'}`}
          >
            {usedPoints > CAPACITY
              ? `Vượt ${usedPoints - CAPACITY} điểm!`
              : `Còn dư ${CAPACITY - usedPoints} điểm`}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(100, Math.round((usedPoints / CAPACITY) * 100))}%`,
              background: usedPoints > CAPACITY ? 'var(--danger)' : 'var(--primary)',
            }}
          />
        </div>
      </div>

      {/* Story table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-strong)', textAlign: 'left' }}>
              <th style={{ padding: '8px 6px' }}>Chọn MVP</th>
              <th style={{ padding: '8px 6px' }}>User Story</th>
              <th style={{ padding: '8px 6px' }}>Điểm</th>
              {framework === 'moscow' && <th style={{ padding: '8px 6px' }}>MoSCoW</th>}
              {framework === 'rice' && (
                <>
                  <th style={{ padding: '8px 6px' }}>Reach</th>
                  <th style={{ padding: '8px 6px' }}>Impact</th>
                  <th style={{ padding: '8px 6px' }}>Conf.</th>
                  <th style={{ padding: '8px 6px' }}>Effort</th>
                  <th style={{ padding: '8px 6px' }}>Điểm RICE</th>
                </>
              )}
              {framework === 'wsjf' && (
                <>
                  <th style={{ padding: '8px 6px' }}>Value</th>
                  <th style={{ padding: '8px 6px' }}>Time</th>
                  <th style={{ padding: '8px 6px' }}>Risk</th>
                  <th style={{ padding: '8px 6px' }}>Size</th>
                  <th style={{ padding: '8px 6px' }}>Điểm WSJF</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedStories.map((s) => {
              const checked = selectedIds.includes(s.id);
              return (
                <tr
                  key={s.id}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: checked ? 'var(--primary-soft)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '9px 6px' }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSelect(s.id)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                  </td>
                  <td style={{ padding: '9px 6px', fontWeight: 500 }}>
                    {s.title}
                    {s.isComplianceRequired && (
                      <span className="badge badge-warning" style={{ marginLeft: 6 }}>
                        Pháp lý
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '9px 6px' }}>
                    <span className="badge badge-muted">{s.points} pt</span>
                  </td>
                  {framework === 'moscow' && (
                    <td style={{ padding: '9px 6px' }}>
                      <select
                        value={moscow[s.id]}
                        onChange={(e) =>
                          setMoscow((prev) => ({
                            ...prev,
                            [s.id]: e.target.value as MoscowCategory,
                          }))
                        }
                        style={{
                          padding: '5px 8px',
                          borderRadius: 6,
                          border: '1px solid var(--border-strong)',
                          background: 'var(--surface)',
                        }}
                      >
                        <option value="must">Must have</option>
                        <option value="should">Should have</option>
                        <option value="could">Could have</option>
                        <option value="wont">Won't have</option>
                      </select>
                    </td>
                  )}
                  {framework === 'rice' && (
                    <>
                      <td style={{ padding: '9px 6px' }}>{s.reach}</td>
                      <td style={{ padding: '9px 6px' }}>{s.impact}</td>
                      <td style={{ padding: '9px 6px' }}>{s.confidence}%</td>
                      <td style={{ padding: '9px 6px' }}>{s.effort}w</td>
                      <td style={{ padding: '9px 6px', fontWeight: 700, color: 'var(--primary)' }}>
                        {calcRice(s)}
                      </td>
                    </>
                  )}
                  {framework === 'wsjf' && (
                    <>
                      <td style={{ padding: '9px 6px' }}>{s.businessValue}</td>
                      <td style={{ padding: '9px 6px' }}>{s.timeCriticality}</td>
                      <td style={{ padding: '9px 6px' }}>{s.riskReduction}</td>
                      <td style={{ padding: '9px 6px' }}>{s.jobSize}</td>
                      <td style={{ padding: '9px 6px', fontWeight: 700, color: 'var(--primary)' }}>
                        {calcWsjf(s)}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div>
        <button type="button" className="btn btn-primary" onClick={runSimulation}>
          <Play size={16} /> Chạy mô phỏng hậu quả Release 1
        </button>
      </div>

      {/* Simulation Report */}
      {report && (
        <div
          className="card stack-md"
          style={{
            borderColor:
              !report.overCapacity &&
              report.compliancePassed &&
              report.brokenDependencies.length === 0
                ? 'var(--success-border)'
                : 'var(--danger-border)',
          }}
        >
          <div className="row">
            {!report.overCapacity &&
            report.compliancePassed &&
            report.brokenDependencies.length === 0 ? (
              <CheckCircle2 size={22} color="var(--success)" />
            ) : (
              <ShieldAlert size={22} color="var(--danger)" />
            )}
            <h2 style={{ fontSize: '1.1rem' }}>Kết quả mô phỏng Release 1</h2>
          </div>

          <p style={{ fontWeight: 600 }}>{report.verdict}</p>

          <div className="grid-3">
            <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-muted)' }}>
              <div className="muted" style={{ fontSize: '0.78rem' }}>
                <TrendingUp size={13} /> Hài lòng người dùng
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>
                {report.satisfactionScore}%
              </div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-muted)' }}>
              <div className="muted" style={{ fontSize: '0.78rem' }}>Tác động doanh thu</div>
              <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--success)' }}>
                {report.revenueScore}%
              </div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-muted)' }}>
              <div className="muted" style={{ fontSize: '0.78rem' }}>An toàn rủi ro & pháp lý</div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: report.compliancePassed ? 'var(--success)' : 'var(--danger)',
                }}
              >
                {report.compliancePassed ? `${report.riskScore}%` : 'VI PHẠM'}
              </div>
            </div>
          </div>

          {report.brokenDependencies.length > 0 && (
            <div className="row" style={{ color: 'var(--warning)', fontSize: '0.88rem' }}>
              <AlertTriangle size={16} />
              <span>Phụ thuộc bị gãy: {report.brokenDependencies.join('; ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
