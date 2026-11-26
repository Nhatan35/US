import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { GLOSSARY, MODULES } from '@/content';

export function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY.filter((item) => {
      if (moduleFilter !== 'all' && item.moduleId !== moduleFilter) return false;
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.vi.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q)
      );
    });
  }, [query, moduleFilter]);

  return (
    <div className="stack-lg">
      <div className="stack-sm">
        <h1 style={{ fontSize: '1.5rem' }}>Từ điển thuật ngữ Việt – Anh</h1>
        <p className="secondary">
          Tra cứu nhanh các thuật ngữ User Story và Agile quan trọng xuyên suốt cuốn sách.
        </p>
      </div>

      <div className="card row" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div
          className="row"
          style={{
            flex: 1,
            minWidth: 220,
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-strong)',
            background: 'var(--bg)',
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm thuật ngữ (ví dụ: INVEST, 3C, Gherkin, Epic...)"
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              width: '100%',
              fontSize: '0.9rem',
            }}
          />
        </div>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          style={{
            padding: '9px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-strong)',
            background: 'var(--surface)',
            fontSize: '0.88rem',
          }}
        >
          <option value="all">Tất cả Module</option>
          {MODULES.filter((m) => m.chapter).map((m) => (
            <option key={m.id} value={m.id}>
              {m.code} · {m.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid-2">
        {filtered.map((item) => (
          <div key={item.term} className="card stack-sm">
            <div className="row-between">
              <strong style={{ fontSize: '1rem', color: 'var(--primary)' }}>
                {item.term}
              </strong>
              <span className="badge badge-muted">{item.moduleId.toUpperCase()}</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.vi}</div>
            <p className="secondary" style={{ fontSize: '0.88rem' }}>
              {item.definition}
            </p>
            <div
              style={{
                marginTop: 4,
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-muted)',
                fontSize: '0.82rem',
              }}
            >
              <strong>Ví dụ: </strong>
              {item.example}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card muted" style={{ textAlign: 'center', padding: 32 }}>
          Không tìm thấy thuật ngữ phù hợp với "{query}".
        </div>
      )}
    </div>
  );
}
