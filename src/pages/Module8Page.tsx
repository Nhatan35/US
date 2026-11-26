import { useState } from 'react';
import { BookOpen, Download, Sparkles } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';

const PLAYBOOK_DEFAULTS = [
  'Luôn chỉ rõ Persona cụ thể thay vì viết "Là người dùng...".',
  'Mỗi User Story phải trả lời được "Để làm gì?" (Why) trước khi bàn giải pháp.',
  'Tổ chức buổi Three Amigos (PO/BA – Dev – QA) để chốt Acceptance Criteria có cả trường hợp lỗi.',
  'Chia nhỏ mọi story > 8 điểm theo lát cắt dọc SPIDR trước khi đưa vào Sprint Planning.',
  'Dự báo release theo khoảng (range) dựa trên Velocity thực tế, không hứa 1 ngày cứng.',
  'Vệ sinh backlog định kỳ: lưu trữ các item nằm im quá 6 tháng.',
];

export function Module8Page() {
  const saveLessonNote = useProgressStore((s) => s.saveLessonNote);
  const savedJournal = useProgressStore((s) => s.lessonNotes['m8-journal'] ?? '');
  const markLessonDone = useProgressStore((s) => s.markLessonDone);

  const [journal, setJournal] = useState(savedJournal);
  const [rules, setRules] = useState<string[]>(PLAYBOOK_DEFAULTS);
  const [newRule, setNewRule] = useState('');

  const exportPlaybook = () => {
    const md = [
      '# Playbook cá nhân: Viết & Quản lý User Story hiệu quả',
      '',
      '## Nguyên tắc hành động của tôi',
      ...rules.map((r, i) => `${i + 1}. ${r}`),
      '',
      '## Ghi chú suy ngẫm Chương 8 (Expert Interviews)',
      journal || '(Chưa có ghi chú)',
      '',
    ].join('\n');

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-user-story-playbook.md';
    a.click();
    URL.revokeObjectURL(url);
    markLessonDone('m8-playbook');
  };

  return (
    <div className="stack-lg">
      <div className="card stack-sm" style={{ borderTop: '4px solid #f97316' }}>
        <div className="row">
          <span className="badge badge-warning">
            <BookOpen size={13} /> M8 · Chương 8 — Expert Interviews
          </span>
        </div>
        <h1 style={{ fontSize: '1.5rem' }}>Góc nhìn chuyên gia & Playbook cá nhân</h1>
        <p className="secondary" style={{ fontSize: '0.92rem' }}>
          Vì nội dung phỏng vấn chuyên gia thuộc bản quyền sách gốc, hãy đọc trực tiếp Chương 8 trong cuốn <em>The Art of Crafting User Stories</em> và dùng không gian này để đúc kết thành <strong>Playbook thực chiến cá nhân</strong> của riêng bạn.
        </p>
      </div>

      <div className="grid-2">
        <div className="card stack-md">
          <h2 style={{ fontSize: '1.08rem' }}>Nhật ký suy ngẫm khi đọc Chương 8</h2>
          <p className="muted" style={{ fontSize: '0.84rem' }}>
            Gợi ý cấu trúc ghi chú: 3 ý tâm đắc nhất · 1 quan điểm bạn thấy khác với bối cảnh công ty mình · 1 thói quen sẽ áp dụng ngay tuần sau.
          </p>
          <textarea
            rows={10}
            value={journal}
            onChange={(e) => {
              setJournal(e.target.value);
              saveLessonNote('m8-journal', e.target.value);
            }}
            placeholder="Ghi lại bài học từ các chuyên gia trong Chương 8..."
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-strong)',
              background: 'var(--bg)',
              resize: 'vertical',
              fontSize: '0.9rem',
            }}
          />
        </div>

        <div className="card stack-md">
          <div className="row-between">
            <h2 style={{ fontSize: '1.08rem' }}>
              <Sparkles size={16} color="var(--primary)" style={{ marginRight: 6 }} />
              Playbook cá nhân của tôi
            </h2>
            <button type="button" className="btn btn-primary btn-sm" onClick={exportPlaybook}>
              <Download size={14} /> Xuất Playbook (.md)
            </button>
          </div>

          <div className="row">
            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Thêm 1 nguyên tắc thực hành của riêng bạn..."
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg)',
              }}
            />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (!newRule.trim()) return;
                setRules((prev) => [...prev, newRule.trim()]);
                setNewRule('');
              }}
            >
              Thêm
            </button>
          </div>

          <ol style={{ margin: '0 0 0 18px', padding: 0, fontSize: '0.88rem' }} className="secondary">
            {rules.map((r, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {r}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
