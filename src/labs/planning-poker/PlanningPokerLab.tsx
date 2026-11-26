import { useState } from 'react';
import { CheckCircle2, Eye, HelpCircle, RotateCcw, Users } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';

interface TeammateVote {
  name: string;
  role: string;
  round1: number | '?';
  round2: number;
  reason: string;
}

interface PokerRound {
  id: string;
  title: string;
  story: string;
  ac: string[];
  teammates: TeammateVote[];
  poQuestions: { text: string; isGood: boolean; answer: string }[];
  referencePoints: number;
  debrief: string;
}

const POKER_ROUNDS: PokerRound[] = [
  {
    id: 'pk-1',
    title: 'Vòng 1: Gửi SMS nhắc lịch trước 24 giờ',
    story:
      'Là bác Hòa (bệnh nhân cao tuổi), tôi muốn nhận SMS nhắc lịch trước 24 giờ để không quên ngày tái khám.',
    ac: [
      'Tự động gửi SMS trước đúng 24 giờ so với giờ khám.',
      'Nếu nhà mạng lỗi, thử gửi lại tối đa 2 lần cách nhau 15 phút và ghi log.',
    ],
    teammates: [
      {
        name: 'Anh Hùng',
        role: 'Senior Dev',
        round1: 8,
        round2: 5,
        reason: 'Cần cronjob + cơ chế retry + tích hợp SMS Brandname của nhà mạng, dễ dính lỗi timeout.',
      },
      {
        name: 'Bạn Tú',
        role: 'Junior Dev',
        round1: 2,
        round2: 5,
        reason: 'Em tưởng chỉ gọi 1 API gửi SMS là xong, chưa tính phần retry và lịch hẹn bị hủy giữa chừng.',
      },
      {
        name: 'Chị Mai',
        role: 'QA',
        round1: 5,
        round2: 5,
        reason: 'Cần test case múi giờ, hủy lịch trước 24h thì KHÔNG gửi SMS, và giả lập lỗi nhà mạng.',
      },
      {
        name: 'Bạn Vy',
        role: 'Designer',
        round1: 3,
        round2: 5,
        reason: 'Không có nhiều UI, chỉ cần thống nhất nội dung mẫu tin nhắn SMS ngắn gọn dễ đọc.',
      },
    ],
    poQuestions: [
      {
        text: 'Nếu bệnh nhân đã hủy lịch trước khi đến mốc 24h thì có hủy gửi SMS không?',
        isGood: true,
        answer: 'PO: Có! Hệ thống phải kiểm tra trạng thái lịch hẹn ngay trước khi gửi để tránh gửi nhầm.',
      },
      {
        text: 'Anh/chị thích dùng thư viện Node.js nào để gửi SMS?',
        isGood: false,
        answer: 'PO: Đó là quyết định kỹ thuật của team Dev, không phải câu hỏi nghiệp vụ cho PO.',
      },
    ],
    referencePoints: 5,
    debrief:
      'So với story tham chiếu "Đổi mật khẩu = 3 điểm", story này có thêm tác vụ nền (scheduler), tích hợp bên thứ 3 và cơ chế retry → 5 điểm là hợp lý.',
  },
  {
    id: 'pk-2',
    title: 'Vòng 2: Đồng bộ lịch bác sĩ 2 chiều với hệ thống HIS cũ',
    story:
      'Là bệnh nhân, tôi muốn thấy chính xác khung giờ bác sĩ còn trống theo thời gian thực từ hệ thống HIS bệnh viện.',
    ac: [
      'Khi bác sĩ khóa lịch trên HIS, app MediBook cập nhật trong vòng 1 phút.',
      'Khi bệnh nhân đặt trên app, lịch tự ghi ngược về HIS không bị trùng slot.',
    ],
    teammates: [
      {
        name: 'Anh Hùng',
        role: 'Senior Dev',
        round1: 13,
        round2: 13,
        reason: 'HIS cũ chưa có tài liệu API rõ ràng, đồng bộ 2 chiều rất dễ xung đột dữ liệu (race condition).',
      },
      {
        name: 'Bạn Tú',
        role: 'Junior Dev',
        round1: 5,
        round2: 13,
        reason: 'Em chưa từng tích hợp HIS nên không rõ độ khó.',
      },
      {
        name: 'Chị Mai',
        role: 'QA',
        round1: '?',
        round2: 13,
        reason: 'Chưa có môi trường staging HIS để kiểm thử, rủi ro cực cao.',
      },
      {
        name: 'Bạn Vy',
        role: 'Designer',
        round1: 8,
        round2: 8,
        reason: 'Cần thiết kế thêm trạng thái "đang đồng bộ" và xử lý khi HIS mất kết nối.',
      },
    ],
    poQuestions: [
      {
        text: 'Chúng ta có thể tách 1 Spike 2 ngày khảo sát API HIS trước, rồi chia thành đọc 1 chiều trước khi làm ghi 2 chiều không?',
        isGood: true,
        answer: 'PO: Rất hợp lý! Làm Spike và cắt lát 1 chiều trước sẽ giảm rủi ro rất nhiều.',
      },
      {
        text: 'Có thể tăng thêm 10 điểm để làm cho xong luôn không?',
        isGood: false,
        answer: 'PO: Tăng điểm không làm giảm rủi ro kỹ thuật — cần chia nhỏ hoặc làm Spike.',
      },
    ],
    referencePoints: 13,
    debrief:
      'Story 13 điểm + có thành viên giơ thẻ "?" là tín hiệu rõ ràng cần làm Spike điều tra và chia nhỏ trước khi đưa vào sprint.',
  },
];

const DECK: (number | '?')[] = [1, 2, 3, 5, 8, 13, 21, '?'];

export function PlanningPokerLab() {
  const recordExerciseResult = useProgressStore((s) => s.recordExerciseResult);
  const [roundIdx, setRoundIdx] = useState(0);
  const [step, setStep] = useState<'vote1' | 'discuss' | 'vote2' | 'done'>('vote1');
  const [myVote1, setMyVote1] = useState<number | '?' | null>(null);
  const [myVote2, setMyVote2] = useState<number | '?' | null>(null);
  const [askedIdx, setAskedIdx] = useState<number | null>(null);

  const round = POKER_ROUNDS[roundIdx];

  const resetRound = (nextIdx: number) => {
    setRoundIdx(nextIdx);
    setStep('vote1');
    setMyVote1(null);
    setMyVote2(null);
    setAskedIdx(null);
  };

  const handleFinishVote2 = (card: number | '?') => {
    setMyVote2(card);
    setStep('done');
    const closeEnough =
      typeof card === 'number' && Math.abs(card - round.referencePoints) <= 3;
    recordExerciseResult(`poker-${round.id}`, closeEnough ? 100 : 80, 20, {
      estimating: 5,
    });
  };

  return (
    <div className="stack-lg">
      <div className="row-between" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="stack-sm">
          <h1 style={{ fontSize: '1.45rem' }}>Planning Poker cùng 4 đồng đội ảo</h1>
          <p className="secondary" style={{ fontSize: '0.9rem' }}>
            Story tham chiếu chuẩn của team: <strong>"Đổi mật khẩu tài khoản = 3 điểm"</strong>. Hãy ước lượng, lắng nghe lý lẽ khác biệt và bỏ phiếu lại.
          </p>
        </div>

        <div className="row">
          {POKER_ROUNDS.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className={`btn btn-sm ${i === roundIdx ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => resetRound(i)}
            >
              Vòng {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Story Card */}
      <div className="card stack-sm" style={{ borderLeft: '4px solid var(--primary)' }}>
        <h2 style={{ fontSize: '1.1rem' }}>{round.title}</h2>
        <p style={{ fontWeight: 500 }}>{round.story}</p>
        <ul style={{ margin: '4px 0 0 18px', padding: 0, fontSize: '0.86rem' }} className="secondary">
          {round.ac.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>

      {/* Step 1: First vote */}
      {step === 'vote1' && (
        <div className="card stack-md">
          <h3 style={{ fontSize: '1rem' }}>Bước 1: Chọn thẻ ước lượng ban đầu của bạn</h3>
          <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
            {DECK.map((card) => (
              <button
                key={String(card)}
                type="button"
                className={`btn ${myVote1 === card ? 'btn-primary' : 'btn-secondary'}`}
                style={{ minWidth: 56, height: 68, fontSize: '1.1rem' }}
                onClick={() => setMyVote1(card)}
              >
                {card}
              </button>
            ))}
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={myVote1 === null}
              onClick={() => setStep('discuss')}
            >
              <Eye size={16} /> Lật bài đồng thời
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Discussion & PO question */}
      {(step === 'discuss' || step === 'vote2' || step === 'done') && (
        <div className="card stack-md">
          <div className="row">
            <Users size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem' }}>
              Kết quả lật bài vòng 1 (Bạn chọn: {myVote1})
            </h3>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            {round.teammates.map((tm) => (
              <div
                key={tm.name}
                style={{
                  padding: 12,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                }}
                className="stack-sm"
              >
                <div className="row-between">
                  <strong>
                    {tm.name} <span className="muted">({tm.role})</span>
                  </strong>
                  <span className="badge badge-primary" style={{ fontSize: '0.9rem' }}>
                    {tm.round1} pt
                  </span>
                </div>
                <p className="secondary" style={{ fontSize: '0.84rem' }}>
                  "{tm.reason}"
                </p>
              </div>
            ))}
          </div>

          <div className="stack-sm" style={{ paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <div className="row">
              <HelpCircle size={16} color="var(--primary)" />
              <strong style={{ fontSize: '0.92rem' }}>
                Chọn 1 câu hỏi làm rõ để hỏi Product Owner trước khi bỏ phiếu lại:
              </strong>
            </div>
            {round.poQuestions.map((q, idx) => (
              <button
                key={q.text}
                type="button"
                className={`quiz-option ${
                  askedIdx === idx ? (q.isGood ? 'correct' : 'wrong') : ''
                }`}
                onClick={() => setAskedIdx(idx)}
              >
                <span>{q.text}</span>
              </button>
            ))}
            {askedIdx !== null && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--surface-muted)',
                  fontSize: '0.86rem',
                }}
              >
                {round.poQuestions[askedIdx].answer}
              </div>
            )}
          </div>

          {step === 'discuss' && (
            <div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setStep('vote2')}
              >
                Sang vòng bỏ phiếu lại (đồng thuận)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Re-vote */}
      {step === 'vote2' && (
        <div className="card stack-md">
          <h3 style={{ fontSize: '1rem' }}>
            Bước 3: Sau khi nghe team & PO, bạn chọn lại thẻ nào?
          </h3>
          <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
            {DECK.map((card) => (
              <button
                key={String(card)}
                type="button"
                className="btn btn-secondary"
                style={{ minWidth: 56, height: 68, fontSize: '1.1rem' }}
                onClick={() => handleFinishVote2(card)}
              >
                {card}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Debrief */}
      {step === 'done' && (
        <div
          className="card stack-md"
          style={{ background: 'var(--success-soft)', borderColor: 'var(--success-border)' }}
        >
          <div className="row">
            <CheckCircle2 size={22} color="var(--success)" />
            <h3 style={{ fontSize: '1.08rem' }}>
              Ước lượng tham khảo: {round.referencePoints} điểm (Bạn chọn vòng 2: {myVote2})
            </h3>
          </div>
          <p className="secondary" style={{ fontSize: '0.9rem' }}>
            {round.debrief}
          </p>
          <div className="row">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => resetRound(roundIdx)}
            >
              <RotateCcw size={14} /> Chơi lại vòng này
            </button>
            {roundIdx < POKER_ROUNDS.length - 1 && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => resetRound(roundIdx + 1)}
              >
                Sang Vòng {roundIdx + 2}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
