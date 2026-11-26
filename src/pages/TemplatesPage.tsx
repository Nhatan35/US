import { useState } from 'react';
import { Check, Copy, Download, FileText } from 'lucide-react';
import { TEMPLATES } from '@/content/templates';

export function TemplatesPage() {
  const [filter, setFilter] = useState<'all' | 'Template' | 'Cheat sheet'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visible = TEMPLATES.filter((t) => filter === 'all' || t.category === filter);

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="stack-lg">
      <div className="row-between" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="stack-sm">
          <h1 style={{ fontSize: '1.5rem' }}>Templates & Cheat sheets thực chiến</h1>
          <p className="secondary" style={{ fontSize: '0.9rem' }}>
            Sao chép hoặc tải xuống định dạng Markdown để dùng ngay trên Notion, Confluence, Jira hoặc GitHub trong công việc hằng ngày.
          </p>
        </div>

        <div className="row">
          {(['all', 'Template', 'Cheat sheet'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="stack-md">
        {visible.map((item) => (
          <div key={item.id} className="card stack-md">
            <div className="row-between" style={{ flexWrap: 'wrap', gap: 10 }}>
              <div className="stack-sm" style={{ gap: 4 }}>
                <div className="row">
                  <span
                    className={`badge ${
                      item.category === 'Template' ? 'badge-primary' : 'badge-warning'
                    }`}
                  >
                    <FileText size={12} /> {item.category}
                  </span>
                  <span className="badge badge-muted">{item.module}</span>
                </div>
                <h2 style={{ fontSize: '1.1rem' }}>{item.title}</h2>
                <p className="secondary" style={{ fontSize: '0.86rem' }}>{item.summary}</p>
              </div>

              <div className="row">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleCopy(item.id, item.content)}
                >
                  {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                  {copiedId === item.id ? 'Đã sao chép' : 'Sao chép'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => handleDownload(item.filename, item.content)}
                >
                  <Download size={14} /> Tải .md
                </button>
              </div>
            </div>

            <pre
              style={{
                margin: 0,
                padding: 14,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                overflowX: 'auto',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                maxHeight: 240,
              }}
            >
              {item.content}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
