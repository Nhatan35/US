import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { forecastVelocity } from '@/lib/prioritization/velocity';

export function VelocityForecasterLab() {
  const [historyText, setHistoryText] = useState('26, 31, 28, 33, 30, 29');
  const [remainingPoints, setRemainingPoints] = useState(140);
  const [extraScope, setExtraScope] = useState(0);
  const [capacityPct, setCapacityPct] = useState(100);

  const history = useMemo(
    () =>
      historyText
        .split(/[,\s]+/)
        .map((n) => Number(n.trim()))
        .filter((n) => Number.isFinite(n) && n > 0),
    [historyText],
  );

  const forecast = useMemo(
    () => forecastVelocity(history, remainingPoints, extraScope, capacityPct / 100),
    [history, remainingPoints, extraScope, capacityPct],
  );

  return (
    <div className="stack-lg">
      <div className="stack-sm">
        <h1 style={{ fontSize: '1.45rem' }}>Velocity Forecaster & Kịch bản "Nếu..."</h1>
        <p className="secondary" style={{ fontSize: '0.9rem' }}>
          Dự báo thời điểm hoàn thành release dưới dạng <strong>khoảng (range)</strong> thay vì hứa 1 ngày cứng duy nhất. Thử kéo thanh trượt thêm phạm vi hoặc giảm nhân sự để xem tác động.
        </p>
      </div>

      <div className="grid-2">
        <div className="card stack-md">
          <h2 style={{ fontSize: '1.05rem' }}>Thông số đầu vào</h2>
          <div className="stack-sm">
            <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>
              Lịch sử Velocity các sprint gần nhất (cách nhau bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={historyText}
              onChange={(e) => setHistoryText(e.target.value)}
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg)',
              }}
            />
          </div>

          <div className="stack-sm">
            <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>
              Backlog còn lại: <strong>{remainingPoints} điểm</strong>
            </label>
            <input
              type="range"
              min={40}
              max={260}
              step={10}
              value={remainingPoints}
              onChange={(e) => setRemainingPoints(Number(e.target.value))}
            />
          </div>

          <div className="stack-sm">
            <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>
              Kịch bản "Nếu..." — Thêm phạm vi phát sinh: <strong>+{extraScope} điểm</strong>
            </label>
            <input
              type="range"
              min={0}
              max={80}
              step={5}
              value={extraScope}
              onChange={(e) => setExtraScope(Number(e.target.value))}
            />
          </div>

          <div className="stack-sm">
            <label style={{ fontSize: '0.84rem', fontWeight: 600 }}>
              Năng lực team (ví dụ nghỉ lễ / thiếu 1 dev): <strong>{capacityPct}%</strong>
            </label>
            <input
              type="range"
              min={50}
              max={120}
              step={5}
              value={capacityPct}
              onChange={(e) => setCapacityPct(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="card stack-md">
          <h2 style={{ fontSize: '1.05rem' }}>Kết quả dự báo (dạng khoảng)</h2>
          <div className="grid-3" style={{ gap: 10 }}>
            <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-muted)' }}>
              <div className="muted" style={{ fontSize: '0.76rem' }}>Velocity TB</div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{forecast.avgVelocity}</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-muted)' }}>
              <div className="muted" style={{ fontSize: '0.76rem' }}>Tổng phạm vi</div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                {remainingPoints + extraScope} pt
              </div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: 'var(--primary-soft)' }}>
              <div className="muted" style={{ fontSize: '0.76rem' }}>Khoảng dự báo</div>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>
                {forecast.sprintsOptimistic}–{forecast.sprintsPessimistic} sprint
              </div>
            </div>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-muted)',
              fontSize: '0.88rem',
            }}
          >
            <strong>Câu trả lời mẫu có dữ liệu cho Ban giám đốc:</strong>
            <p className="secondary" style={{ marginTop: 4 }}>
              "Dựa trên tốc độ {history.length} sprint gần nhất ({forecast.minVelocity}–
              {forecast.maxVelocity} điểm/sprint), với tổng phạm vi {remainingPoints + extraScope}{' '}
              điểm, team dự kiến hoàn thành trong khoảng{' '}
              <strong>
                {forecast.sprintsOptimistic} đến {forecast.sprintsPessimistic} sprint
              </strong>{' '}
              (trung bình {forecast.sprintsAverage} sprint). Nếu cần chốt sớm hơn, chúng ta nên cắt
              nhóm Could/Should khỏi bản phát hành đầu tiên."
            </p>
          </div>
        </div>
      </div>

      {/* Burnup Chart */}
      <div className="card stack-sm">
        <h2 style={{ fontSize: '1.05rem' }}>Biểu đồ Burnup dự báo 3 kịch bản</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast.series}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="sprint" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="scope"
                name="Tổng phạm vi"
                stroke="#ef4444"
                strokeDasharray="6 4"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="optimistic"
                name="Lạc quan (Max)"
                stroke="#16a34a"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="average"
                name="Trung bình"
                stroke="#4f46e5"
                strokeWidth={2.5}
              />
              <Line
                type="monotone"
                dataKey="pessimistic"
                name="Bi quan (Min)"
                stroke="#f59e0b"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
