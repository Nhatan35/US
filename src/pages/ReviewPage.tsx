import { useMemo, useState } from 'react';
import { CheckCircle2, Eye, RotateCcw } from 'lucide-react';
import { FLASHCARDS } from '@/content/flashcards';
import { isCardDue, type ReviewRating } from '@/lib/srs/sm2';
import { useProgressStore } from '@/lib/store/progressStore';

export function ReviewPage() {
  const schedules = useProgressStore((s) => s.flashcards);
  const reviewFlashcard = useProgressStore((s) => s.reviewFlashcard);

  const [showAll, setShowAll] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);

  const today = new Date().toISOString().slice(0, 10);

  const dueCards = useMemo(
    () => FLASHCARDS.filter((c) => isCardDue(schedules[c.id], today)),
    [schedules, today],
  );

  const deck = showAll ? FLASHCARDS : dueCards;
  const current = deck[index % Math.max(1, deck.length)];

  const handleRate = (rating: ReviewRating) => {
    if (!current) return;
    reviewFlashcard(current.id, rating);
    setFlipped(false);
    if (showAll) {
      setIndex((i) => (i + 1) % deck.length);
    } else {
      setIndex(0);
    }
  };

  return (
    <div className="stack-lg">
      <div className="row-between" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="stack-sm">
          <h1 style={{ fontSize: '1.5rem' }}>Ôn tập Flashcard (Lặp lại ngắt quãng SM-2)</h1>
          <p className="secondary" style={{ fontSize: '0.9rem' }}>
            Đọc câu hỏi, tự trả lời trong đầu, lật thẻ và đánh giá mức độ nhớ để hệ thống tự lên lịch ôn tập tối ưu (+2 XP mỗi thẻ).
          </p>
        </div>

        <div className="row">
          <span className="badge badge-primary">
            Đến hạn hôm nay: {dueCards.length}/{FLASHCARDS.length} thẻ
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setShowAll((v) => !v);
              setIndex(0);
              setFlipped(false);
            }}
          >
            <RotateCcw size={14} /> {showAll ? 'Chỉ xem thẻ đến hạn' : 'Ôn toàn bộ 20 thẻ'}
          </button>
        </div>
      </div>

      {!current ? (
        <div
          className="card stack-md"
          style={{
            textAlign: 'center',
            padding: 40,
            background: 'var(--success-soft)',
            borderColor: 'var(--success-border)',
          }}
        >
          <CheckCircle2 size={42} color="var(--success)" style={{ margin: '0 auto' }} />
          <h2>Xuất sắc! Bạn đã ôn hết tất cả thẻ đến hạn hôm nay</h2>
          <p className="secondary">
            Quay lại vào ngày mai để tiếp tục giữ chuỗi ngày học, hoặc bấm nút bên dưới để ôn tự do toàn bộ bộ thẻ.
          </p>
          <div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowAll(true)}
            >
              Ôn tự do toàn bộ 20 thẻ
            </button>
          </div>
        </div>
      ) : (
        <div className="card stack-lg" style={{ maxWidth: 740, margin: '0 auto', width: '100%' }}>
          <div className="row-between">
            <span className="badge badge-primary">
              {current.moduleId.toUpperCase()} · {current.category}
            </span>
            <span className="muted" style={{ fontSize: '0.82rem' }}>
              Còn lại: {deck.length} thẻ
            </span>
          </div>

          <div
            style={{
              minHeight: 150,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '20px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-muted)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '1.12rem', fontWeight: 600 }}>{current.front}</p>
          </div>

          {!flipped ? (
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setFlipped(true)}
              >
                <Eye size={16} /> Lật xem đáp án
              </button>
            </div>
          ) : (
            <div className="stack-md">
              <div
                style={{
                  padding: 18,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-soft)',
                  border: '1px solid var(--primary-border)',
                  fontSize: '0.96rem',
                }}
              >
                <strong>Đáp án:</strong>
                <p style={{ marginTop: 6 }}>{current.back}</p>
              </div>

              <div className="stack-sm">
                <span className="muted" style={{ fontSize: '0.82rem', textAlign: 'center' }}>
                  Bạn nhớ thẻ này ở mức nào?
                </span>
                <div className="grid-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ borderColor: 'var(--danger-border)', color: 'var(--danger)' }}
                    onClick={() => handleRate('again')}
                  >
                    Lại (1 ngày)
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ borderColor: 'var(--warning-border)', color: 'var(--warning)' }}
                    onClick={() => handleRate('hard')}
                  >
                    Khó
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleRate('good')}
                  >
                    Được
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ borderColor: 'var(--success-border)', color: 'var(--success)' }}
                    onClick={() => handleRate('easy')}
                  >
                    Dễ (4+ ngày)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
