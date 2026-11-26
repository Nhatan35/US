import { useRef, useState } from 'react';
import { Download, RefreshCw, ShieldAlert, Upload } from 'lucide-react';
import { ROLE_LABELS, type UserRole } from '@/types/course';
import { SkillRadarChart } from '@/components/SkillRadarChart';
import { getLevelForXp, useProgressStore } from '@/lib/store/progressStore';

export function ProfilePage() {
  const role = useProgressStore((s) => s.role);
  const setRole = useProgressStore((s) => s.setRole);
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const lessonsDone = useProgressStore((s) => s.lessonsDone);
  const quizScores = useProgressStore((s) => s.quizScores);
  const skills = useProgressStore((s) => s.skills);
  const badges = useProgressStore((s) => s.badges);
  const exportSnapshot = useProgressStore((s) => s.exportSnapshot);
  const importSnapshot = useProgressStore((s) => s.importSnapshot);
  const resetProgress = useProgressStore((s) => s.resetProgress);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null,
  );
  const [confirmReset, setConfirmReset] = useState(false);

  const level = getLevelForXp(xp);

  const handleExport = () => {
    const json = exportSnapshot();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-story-craft-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg({ type: 'ok', text: 'Đã tải xuống tệp sao lưu JSON thành công.' });
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const res = importSnapshot(text);
    if (res.ok) {
      setStatusMsg({ type: 'ok', text: 'Đã khôi phục tiến độ từ tệp sao lưu!' });
    } else {
      setStatusMsg({ type: 'err', text: res.error });
    }
    e.target.value = '';
  };

  return (
    <div className="stack-lg">
      <div className="stack-sm">
        <h1 style={{ fontSize: '1.5rem' }}>Hồ sơ học tập & Sao lưu dữ liệu</h1>
        <p className="secondary">
          Toàn bộ tiến độ được lưu cục bộ trên trình duyệt của bạn. Bạn có thể xuất tệp JSON để sao lưu hoặc chuyển sang máy khác.
        </p>
      </div>

      <div className="grid-2">
        <div className="card stack-md">
          <h2 style={{ fontSize: '1.1rem' }}>Thông tin cá nhân</h2>

          <div className="stack-sm">
            <label htmlFor="role-select" style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Vai trò của bạn
            </label>
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-strong)',
                background: 'var(--surface)',
              }}
            >
              {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-muted)' }}>
              <div className="muted" style={{ fontSize: '0.78rem' }}>Cấp độ</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{level.name}</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-muted)' }}>
              <div className="muted" style={{ fontSize: '0.78rem' }}>Tổng XP / Chuỗi</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                {xp} XP · {streak} ngày
              </div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-muted)' }}>
              <div className="muted" style={{ fontSize: '0.78rem' }}>Bài đã xong</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{lessonsDone.length}</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: 'var(--surface-muted)' }}>
              <div className="muted" style={{ fontSize: '0.78rem' }}>Quiz đã làm</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                {Object.keys(quizScores).length}
              </div>
            </div>
          </div>

          {badges.length > 0 && (
            <div className="stack-sm">
              <strong style={{ fontSize: '0.88rem' }}>Huy hiệu đã đạt</strong>
              <div className="row" style={{ flexWrap: 'wrap' }}>
                {badges.map((b) => (
                  <span key={b} className="badge badge-success">
                    🏅 {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card stack-sm">
          <h2 style={{ fontSize: '1.1rem' }}>Radar 8 kỹ năng</h2>
          <SkillRadarChart skills={skills} height={270} />
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="card stack-md">
        <h2 style={{ fontSize: '1.1rem' }}>Sao lưu & Khôi phục (JSON)</h2>
        <p className="secondary" style={{ fontSize: '0.9rem' }}>
          Lưu ý: Khi nhập tệp sao lưu, dữ liệu tiến độ hiện tại trên trình duyệt sẽ bị ghi đè.
        </p>

        <div className="row" style={{ flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleExport}>
            <Download size={15} /> Xuất tệp sao lưu (.json)
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={15} /> Nhập tệp sao lưu (.json)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            style={{ display: 'none' }}
          />
        </div>

        {statusMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background:
                statusMsg.type === 'ok' ? 'var(--success-soft)' : 'var(--danger-soft)',
              color: statusMsg.type === 'ok' ? 'var(--success)' : 'var(--danger)',
              fontSize: '0.88rem',
              fontWeight: 500,
            }}
          >
            {statusMsg.text}
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="card stack-sm" style={{ borderColor: 'var(--danger-border)' }}>
        <div className="row">
          <ShieldAlert size={18} color="var(--danger)" />
          <h2 style={{ fontSize: '1rem', color: 'var(--danger)' }}>Đặt lại toàn bộ tiến độ</h2>
        </div>
        <p className="secondary" style={{ fontSize: '0.86rem' }}>
          Xóa toàn bộ XP, bài đã học, ghi chú và điểm quiz về trạng thái ban đầu.
        </p>
        {!confirmReset ? (
          <div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setConfirmReset(true)}
            >
              <RefreshCw size={14} /> Đặt lại tiến độ
            </button>
          </div>
        ) : (
          <div className="row">
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
                setStatusMsg({ type: 'ok', text: 'Đã đặt lại toàn bộ tiến độ.' });
              }}
            >
              Xác nhận xóa hết
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setConfirmReset(false)}
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
