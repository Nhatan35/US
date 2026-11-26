import { Link } from 'react-router-dom';
import { ArrowRight, Hammer } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  phase: string;
  description: string;
  highlights: string[];
}

export function ComingSoonPage({
  title,
  phase,
  description,
  highlights,
}: ComingSoonPageProps) {
  return (
    <div className="card stack-md" style={{ maxWidth: 720 }}>
      <div className="row">
        <span className="badge badge-primary">
          <Hammer size={13} /> Lộ trình {phase}
        </span>
      </div>
      <h1 style={{ fontSize: '1.45rem' }}>{title}</h1>
      <p className="secondary">{description}</p>
      <div className="stack-sm">
        <strong style={{ fontSize: '0.9rem' }}>Tính năng sẽ được xây dựng:</strong>
        <ul style={{ margin: '0 0 0 20px', padding: 0 }} className="secondary">
          {highlights.map((item) => (
            <li key={item} style={{ marginBottom: 4 }}>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Link to="/modules/m1" className="btn btn-primary btn-sm">
          Học Module 1 ngay <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
