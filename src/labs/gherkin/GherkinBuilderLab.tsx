import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Download, FileCode2, ListChecks, XCircle } from 'lucide-react';
import { validateGherkin } from '@/lib/gherkin/validator';
import { useProgressStore } from '@/lib/store/progressStore';

const COVERAGE_ITEMS = [
  { id: 'happy', label: 'Happy path', hint: 'Trường hợp thành công điển hình?' },
  { id: 'invalid', label: 'Dữ liệu không hợp lệ', hint: 'Nhập sai, thiếu, sai định dạng?' },
  { id: 'boundary', label: 'Giá trị biên', hint: 'Tối thiểu/tối đa, đúng ngưỡng?' },
  { id: 'auth', label: 'Quyền truy cập', hint: 'Người chưa đăng nhập / không đủ quyền?' },
  { id: 'empty', label: 'Trạng thái rỗng', hint: 'Chưa có dữ liệu nào?' },
  { id: 'external', label: 'Lỗi hệ thống/bên ngoài', hint: 'Mất mạng, cổng thanh toán timeout?' },
  { id: 'concurrency', label: 'Thao tác đồng thời', hint: 'Hai người cùng đặt 1 khung giờ?' },
];

const SAMPLE_GHERKIN = `Feature: Đặt lịch khám bác sĩ Nhi buổi tối

  Background:
    Given bệnh nhân "Chị Lan" đã đăng nhập ứng dụng MediBook

  Scenario: Đặt lịch thành công khi còn khung giờ trống
    Given bác sĩ Minh chuyên khoa Nhi còn khung giờ 18:00 ngày 28/11
    When bệnh nhân chọn khung giờ 18:00 và xác nhận đặt lịch
    Then lịch hẹn được tạo với trạng thái "Đã xác nhận"
    And hệ thống gửi SMS xác nhận trong vòng 60 giây

  Scenario: Khung giờ vừa bị người khác đặt trước
    Given khung giờ 18:00 vừa được bệnh nhân khác đặt thành công
    When bệnh nhân xác nhận đặt khung giờ 18:00
    Then hệ thống thông báo "Khung giờ đã hết"
    And hệ thống gợi ý 3 khung giờ gần nhất còn trống

  Scenario Outline: Kiểm tra quy tắc hủy lịch hẹn
    Given bệnh nhân có lịch hẹn còn <so_gio> giờ nữa sẽ khám
    When bệnh nhân yêu cầu hủy lịch
    Then hệ thống trả về kết quả "<ket_qua>"

    Examples:
      | so_gio | ket_qua                |
      | 5      | Hủy miễn phí           |
      | 1      | Không thể hủy tự động  |
`;

export function GherkinBuilderLab() {
  const recordExerciseResult = useProgressStore((s) => s.recordExerciseResult);
  const [tab, setTab] = useState<'gherkin' | 'checklist'>('gherkin');
  const [source, setSource] = useState(SAMPLE_GHERKIN);
  const [checklistItems, setChecklistItems] = useState<string[]>([
    'Chỉ hiển thị các khung giờ cách thời điểm hiện tại ít nhất 2 giờ.',
    'Không cho phép 2 bệnh nhân đặt trùng cùng 1 bác sĩ và 1 khung giờ.',
    'Tin nhắn SMS xác nhận phải gửi trong vòng 60 giây sau khi đặt thành công.',
  ]);
  const [newRule, setNewRule] = useState('');
  const [coverage, setCoverage] = useState<Record<string, boolean>>({
    happy: true,
    concurrency: true,
    boundary: true,
  });

  const validation = useMemo(() => validateGherkin(source), [source]);

  const coveredCount = Object.values(coverage).filter(Boolean).length;

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    if (validation.valid && validation.scenarioCount >= 2) {
      recordExerciseResult('gherkin-lab', 100, 20, { ac: 5 });
    }
  };

  return (
    <div className="stack-lg">
      <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="stack-sm">
          <h1 style={{ fontSize: '1.45rem' }}>Acceptance Criteria & Gherkin Builder</h1>
          <p className="secondary" style={{ fontSize: '0.9rem' }}>
            Viết kịch bản Given/When/Then có kiểm tra cú pháp tự động, đối chiếu bảng phủ 7 loại kịch bản và xuất file <code>.feature</code>.
          </p>
        </div>

        <div className="row">
          <button
            type="button"
            className={`btn btn-sm ${tab === 'gherkin' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('gherkin')}
          >
            <FileCode2 size={14} /> Chế độ Gherkin (BDD)
          </button>
          <button
            type="button"
            className={`btn btn-sm ${tab === 'checklist' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab('checklist')}
          >
            <ListChecks size={14} /> Chế độ Checklist quy tắc
          </button>
        </div>
      </div>

      <div className="lesson-grid" style={{ gridTemplateColumns: 'minmax(0, 1.4fr) minmax(290px, 0.85fr)' }}>
        {/* Left: Editor */}
        {tab === 'gherkin' ? (
          <div className="card stack-md">
            <div className="row-between" style={{ flexWrap: 'wrap', gap: 8 }}>
              <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
                {['Scenario: ', 'Given ', 'When ', 'Then ', 'And ', 'Scenario Outline: '].map(
                  (kw) => (
                    <button
                      key={kw}
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSource((prev) => `${prev.trimEnd()}\n    ${kw}`)}
                    >
                      + {kw.trim()}
                    </button>
                  ),
                )}
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => downloadFile('user-story.feature', source)}
              >
                <Download size={14} /> Xuất .feature
              </button>
            </div>

            <textarea
              rows={20}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              spellCheck={false}
              style={{
                width: '100%',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                lineHeight: 1.65,
                padding: 14,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg)',
                resize: 'vertical',
              }}
            />

            {/* Validation results */}
            <div className="stack-sm">
              <div className="row-between">
                <strong style={{ fontSize: '0.9rem' }}>
                  Kiểm tra cú pháp ({validation.scenarioCount} Scenario)
                </strong>
                {validation.valid ? (
                  <span className="badge badge-success">
                    <CheckCircle2 size={14} /> Cú pháp hợp lệ
                  </span>
                ) : (
                  <span className="badge badge-danger">
                    <XCircle size={14} /> Có lỗi cú pháp
                  </span>
                )}
              </div>

              {validation.issues.length === 0 ? (
                <p className="muted" style={{ fontSize: '0.85rem' }}>
                  Không phát hiện lỗi cú pháp hay cảnh báo UI quá chi tiết.
                </p>
              ) : (
                validation.issues.map((iss, idx) => (
                  <div
                    key={idx}
                    className="row"
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background:
                        iss.severity === 'error'
                          ? 'var(--danger-soft)'
                          : 'var(--warning-soft)',
                      fontSize: '0.84rem',
                    }}
                  >
                    {iss.severity === 'error' ? (
                      <XCircle size={15} color="var(--danger)" />
                    ) : (
                      <AlertTriangle size={15} color="var(--warning)" />
                    )}
                    <span>
                      <strong>Dòng {iss.line}:</strong> {iss.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="card stack-md">
            <div className="row-between">
              <h2 style={{ fontSize: '1.05rem' }}>Danh sách quy tắc Acceptance Criteria</h2>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() =>
                  downloadFile(
                    'acceptance-criteria.md',
                    `# Acceptance Criteria\n\n${checklistItems.map((c) => `- [ ] ${c}`).join('\n')}\n`,
                  )
                }
              >
                <Download size={14} /> Xuất Markdown
              </button>
            </div>

            <div className="row">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Nhập một điều kiện kiểm thử được..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newRule.trim()) {
                    setChecklistItems((prev) => [...prev, newRule.trim()]);
                    setNewRule('');
                  }
                }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg)',
                }}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  if (!newRule.trim()) return;
                  setChecklistItems((prev) => [...prev, newRule.trim()]);
                  setNewRule('');
                }}
              >
                Thêm
              </button>
            </div>

            <div className="stack-sm">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="row-between"
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    fontSize: '0.9rem',
                  }}
                >
                  <span>
                    {idx + 1}. {item}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      setChecklistItems((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right: 7-point Scenario Coverage */}
        <aside className="card stack-md" style={{ position: 'sticky', top: 80 }}>
          <div className="row-between">
            <h2 style={{ fontSize: '1rem' }}>Bảng phủ kịch bản</h2>
            <span className="badge badge-primary">
              {coveredCount}/{COVERAGE_ITEMS.length}
            </span>
          </div>
          <p className="muted" style={{ fontSize: '0.82rem' }}>
            Tự rà soát và đánh dấu những loại kịch bản bạn đã viết đủ cho story:
          </p>
          <div className="stack-sm">
            {COVERAGE_ITEMS.map((item) => (
              <label
                key={item.id}
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: coverage[item.id] ? 'var(--success-soft)' : 'transparent',
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(coverage[item.id])}
                  onChange={(e) =>
                    setCoverage((prev) => ({ ...prev, [item.id]: e.target.checked }))
                  }
                  style={{ marginTop: 3, accentColor: 'var(--success)' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.86rem' }}>{item.label}</div>
                  <div className="muted" style={{ fontSize: '0.78rem' }}>{item.hint}</div>
                </div>
              </label>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
