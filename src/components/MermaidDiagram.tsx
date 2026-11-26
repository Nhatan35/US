import { useEffect, useId, useState } from 'react';
import mermaid from 'mermaid';
import { useProgressStore } from '@/lib/store/progressStore';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, '');
  const theme = useProgressStore((s) => s.theme);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'neutral',
      securityLevel: 'strict',
      fontFamily: 'Be Vietnam Pro, system-ui, sans-serif',
    });

    mermaid
      .render(`mmd-${id}-${theme}`, chart.trim())
      .then(({ svg: rendered }) => {
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Không thể hiển thị sơ đồ.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, id, theme]);

  if (error) {
    return (
      <pre style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>
        {chart}
      </pre>
    );
  }

  return (
    <div
      className="card"
      style={{
        padding: '16px',
        margin: '16px 0',
        overflowX: 'auto',
        display: 'flex',
        justifyContent: 'center',
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
