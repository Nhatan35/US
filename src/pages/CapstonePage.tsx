import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  Layers,
  Mail,
  Printer,
} from 'lucide-react';
import { checkUserStory } from '@/lib/checker/investChecker';
import { useProgressStore } from '@/lib/store/progressStore';

const CAPSTONE_STEPS = [
  { step: 1, module: 'M1', title: 'Đọc brief & phân loại nhu cầu thô vs ràng buộc', labTo: '/modules/m1' },
  { step: 2, module: 'M2', title: 'Xây 3 Persona & User Journey Map', labTo: '/labs/persona' },
  { step: 3, module: 'M3', title: 'Viết Story + AC (INVEST ≥ 80) & Gherkin', labTo: '/labs/story-writer' },
  { step: 4, module: 'M4', title: 'Ưu tiên hóa (MoSCoW/RICE) & Ước lượng', labTo: '/labs/prioritization' },
  { step: 5, module: 'M5', title: 'Luyện đàm phán Stakeholder (5 Whys)', labTo: '/roleplay' },
  { step: 6, module: 'M6', title: 'Refinement, săn Anti-pattern & chốt DoR/DoD', labTo: '/labs/antipattern' },
  { step: 7, module: 'M7', title: 'Xây Story Map 3 Release & dự báo Velocity', labTo: '/labs/story-map' },
  { step: 8, module: 'M9', title: 'Xuất Portfolio MediBook hoàn chỉnh', labTo: '/modules/m9' },
];

const SURPRISE_EVENTS = [
  {
    id: 'ev-1',
    title: 'Email bất ngờ #1 — Từ Anh Khoa (Trưởng IT)',
    body: '"Hệ thống HIS cũ của bệnh viện chỉ mở API ĐỌC lịch bác sĩ, chưa cho phép GHI ngược tự động trong 3 tháng tới. Em xem điều chỉnh luồng đặt lịch MVP thế nào nhé!"',
  },
  {
    id: 'ev-2',
    title: 'Email bất ngờ #2 — Từ Luật sư tư vấn tuân thủ',
    body: '"Theo Nghị định 13/2023/NĐ-CP, ứng dụng bắt buộc phải có màn hình ghi nhận sự đồng ý xử lý dữ liệu sức khỏe cá nhân trước khi bệnh nhân đặt lịch lần đầu."',
  },
  {
    id: 'ev-3',
    title: 'Email bất ngờ #3 — Từ Scrum Master',
    body: '"Một lập trình viên Backend phải nghỉ phép 2 tuần trong Sprint 4 (năng lực giảm ~25%). Em cập nhật dự báo và đề xuất cắt bớt phạm vi nào khỏi MVP?"',
  },
];

export function CapstonePage() {
  const personas = useProgressStore((s) => s.personas);
  const stories = useProgressStore((s) => s.capstoneStories);
  const saveLessonNote = useProgressStore((s) => s.saveLessonNote);
  const lessonNotes = useProgressStore((s) => s.lessonNotes);

  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2]);
  const [eventNotes, setEventNotes] = useState<Record<string, string>>({
    'ev-1': lessonNotes['cap-ev-1'] ?? '',
    'ev-2': lessonNotes['cap-ev-2'] ?? '',
    'ev-3': lessonNotes['cap-ev-3'] ?? '',
  });

  const avgStoryScore =
    stories.length === 0
      ? 0
      : Math.round(
          stories.reduce(
            (sum, st) =>
              sum +
              checkUserStory({
                role: st.role,
                want: st.want,
                benefit: st.benefit,
                acceptanceCriteria: st.acceptanceCriteria,
                estimate: st.estimate,
              }).score,
            0,
          ) / stories.length,
        );

  const toggleStep = (step: number) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev.filter((x) => x !== step) : [...prev, step],
    );
  };

  const exportPortfolio = () => {
    const md = [
      '# Portfolio Sản phẩm: MediBook — Hệ thống Đặt lịch Khám bệnh',
      `*Ngày xuất: ${new Date().toISOString().slice(0, 10)}*`,
      '',
      '## 1. Tóm tắt bài toán & Mục tiêu kinh doanh',
      '- **Khách hàng:** Chuỗi phòng khám đa khoa An Khang (6 cơ sở TP.HCM & Hà Nội).',
      '- **Mục tiêu 6 tháng:** Giảm 50% thời gian chờ (từ 90 phút), giảm no-show từ 18% xuống < 8%, giảm 40% cuộc gọi tổng đài.',
      '- **Ràng buộc:** Tuân thủ Nghị định 13/2023/NĐ-CP, tích hợp HIS cũ, hỗ trợ người cao tuổi.',
      '',
      `## 2. User Personas (${personas.length})`,
      ...personas.flatMap((p) => [
        `### ${p.name} — ${p.roleTitle} (${p.ageGroup}, Tech: ${p.techLevel})`,
        p.quote ? `> "${p.quote}"` : '',
        `- **Mục tiêu:** ${p.goals.join('; ')}`,
        `- **Nỗi đau:** ${p.painPoints.join('; ')}`,
        '',
      ]),
      `## 3. Product Backlog (${stories.length} User Story · Điểm INVEST trung bình: ${avgStoryScore}/100)`,
      ...(stories.length === 0
        ? ['*(Chưa có story nào — hãy tạo story trong Story Writer và bấm Lưu vào Backlog)*']
        : stories.flatMap((st, idx) => [
            `### ${idx + 1}. ${st.title} (${st.estimate ?? '?'} pt · ${st.status})`,
            `Là **${st.role}**, tôi muốn **${st.want}** để **${st.benefit}**.`,
            '**Acceptance Criteria:**',
            ...st.acceptanceCriteria.map((ac) => `- ${ac}`),
            '',
          ])),
      '## 4. Phương án xử lý 3 sự kiện thay đổi thực tế',
      ...SURPRISE_EVENTS.flatMap((ev) => [
        `### ${ev.title}`,
        eventNotes[ev.id] || '*(Chưa ghi phương án xử lý)*',
        '',
      ]),
    ].join('\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-medibook-user-stories.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="stack-lg">
      <div className="card stack-md" style={{ borderTop: '4px solid var(--primary)' }}>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div className="stack-sm">
            <span className="badge badge-primary" style={{ alignSelf: 'flex-start' }}>
              <Layers size={13} /> Dự án xuyên suốt (Capstone Project)
            </span>
            <h1 style={{ fontSize: '1.5rem' }}>MediBook — Chuỗi phòng khám An Khang</h1>
            <p className="secondary" style={{ fontSize: '0.92rem' }}>
              Áp dụng toàn bộ kỹ năng từ M1 đến M9 để xây dựng một Product Backlog hoàn chỉnh và xuất thành Portfolio dùng cho công việc hoặc phỏng vấn.
            </p>
          </div>
          <div className="row">
            <button type="button" className="btn btn-primary btn-sm" onClick={exportPortfolio}>
              <Download size={14} /> Xuất Portfolio (.md)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => window.print()}
            >
              <Printer size={14} /> In / Lưu PDF
            </button>
          </div>
        </div>

        {/* Live metrics synced with labs */}
        <div className="grid-3">
          <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-muted)' }}>
            <div className="muted" style={{ fontSize: '0.78rem' }}>Personas đã tạo</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{personas.length}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-muted)' }}>
            <div className="muted" style={{ fontSize: '0.78rem' }}>Stories trong Backlog</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{stories.length}</div>
          </div>
          <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-muted)' }}>
            <div className="muted" style={{ fontSize: '0.78rem' }}>Điểm INVEST trung bình</div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '1.2rem',
                color: avgStoryScore >= 80 ? 'var(--success)' : 'var(--primary)',
              }}
            >
              {stories.length > 0 ? `${avgStoryScore}/100` : 'Chưa có'}
            </div>
          </div>
        </div>
      </div>

      {/* 8 Steps Roadmap */}
      <div className="card stack-md">
        <div className="row-between">
          <h2 style={{ fontSize: '1.1rem' }}>Lộ trình 8 bước xây dựng MediBook</h2>
          <span className="badge badge-primary">
            {completedSteps.length}/{CAPSTONE_STEPS.length} bước
          </span>
        </div>
        <div className="stack-sm">
          {CAPSTONE_STEPS.map((item) => {
            const done = completedSteps.includes(item.step);
            return (
              <div
                key={item.step}
                className="row-between"
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: done ? 'var(--success-soft)' : 'transparent',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <label className="row" style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleStep(item.step)}
                    style={{ accentColor: 'var(--success)' }}
                  />
                  <span className="badge badge-muted">Bước {item.step} · {item.module}</span>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.title}</span>
                </label>
                <Link to={item.labTo} className="btn btn-ghost btn-sm">
                  Mở công cụ <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Surprise Events */}
      <div className="card stack-md">
        <div className="row">
          <AlertTriangle size={18} color="var(--warning)" />
          <h2 style={{ fontSize: '1.1rem' }}>3 Sự kiện bất ngờ giữa dự án (Thử thách thực chiến)</h2>
        </div>
        <p className="secondary" style={{ fontSize: '0.88rem' }}>
          Ghi lại cách bạn điều chỉnh Story, ưu tiên và kế hoạch Release trước 3 email thay đổi đột xuất sau (sẽ được tự động đưa vào Portfolio khi xuất):
        </p>

        <div className="stack-md">
          {SURPRISE_EVENTS.map((ev) => (
            <div
              key={ev.id}
              style={{
                padding: 14,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--warning-border)',
                background: 'var(--warning-soft)',
              }}
              className="stack-sm"
            >
              <div className="row">
                <Mail size={15} color="var(--warning)" />
                <strong style={{ fontSize: '0.92rem' }}>{ev.title}</strong>
              </div>
              <p style={{ fontSize: '0.88rem' }}>{ev.body}</p>
              <textarea
                rows={2}
                value={eventNotes[ev.id] ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setEventNotes((prev) => ({ ...prev, [ev.id]: val }));
                  saveLessonNote(`cap-${ev.id}`, val);
                }}
                placeholder="Phương án xử lý của bạn (tách story, thêm Spike, đổi ưu tiên, giao tiếp stakeholder)..."
                style={{
                  width: '100%',
                  padding: 9,
                  borderRadius: 6,
                  border: '1px solid var(--border-strong)',
                  background: 'var(--surface)',
                  fontSize: '0.86rem',
                }}
              />
            </div>
          ))}
        </div>

        <div className="row" style={{ fontSize: '0.85rem', color: 'var(--success)' }}>
          <CheckCircle2 size={16} />
          <span>Mọi thay đổi được lưu tự động và gộp vào tệp Portfolio khi bạn bấm Xuất Portfolio.</span>
        </div>
      </div>
    </div>
  );
}
