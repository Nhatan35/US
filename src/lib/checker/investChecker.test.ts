import { describe, expect, it } from 'vitest';
import { checkUserStory } from './investChecker';

describe('INVEST Checker (14 rules)', () => {
  it('awards 100/100 for a well-crafted Vietnamese user story', () => {
    const res = checkUserStory({
      role: 'phụ huynh có con nhỏ',
      want: 'lọc bác sĩ chuyên khoa Nhi còn lịch trống sau 18:00',
      benefit: 'đưa con đi khám mà không phải xin nghỉ làm',
      acceptanceCriteria: [
        'Kết quả chỉ hiển thị bác sĩ chuyên khoa Nhi có ít nhất 1 slot từ 18:00 trở đi.',
        'Nếu không còn khung giờ trống tối nay, hệ thống báo hết lịch và gợi ý 3 khung giờ ngày mai.',
      ],
      estimate: 5,
    });

    expect(res.score).toBe(100);
    expect(res.findings).toHaveLength(0);
    expect(res.letters).toEqual({
      I: 'pass',
      N: 'pass',
      V: 'pass',
      E: 'pass',
      S: 'pass',
      T: 'pass',
    });
  });

  it('catches generic role, tech solution, compound goal, vague words, missing AC, huge estimate, and dependency', () => {
    const res = checkUserStory({
      role: 'người dùng',
      want: 'bấm button gọi API /search và xuất báo cáo nhanh và đẹp',
      benefit: 'xuất báo cáo nhanh',
      acceptanceCriteria: [],
      estimate: 21,
      dependsOn: 'API cổng thanh toán',
    });

    const ids = res.findings.map((f) => f.ruleId);
    expect(ids).toContain('R02');
    expect(ids).toContain('R05');
    expect(ids).toContain('R06');
    expect(ids).toContain('R08');
    expect(ids).toContain('R09');
    expect(ids).toContain('R12');
    expect(ids).toContain('R13');
    expect(res.score).toBeLessThan(60);
    expect(res.letters.T).toBe('fail');
    expect(res.letters.S).toBe('warn');
    expect(res.letters.I).toBe('warn');
  });

  it('catches maker role (R03), system perspective (R14), and unknown estimate "?" (R12)', () => {
    const res = checkUserStory({
      role: 'Developer',
      want: 'hệ thống phải lưu log',
      benefit: 'theo dõi lỗi',
      acceptanceCriteria: ['Ghi log vào file', 'Ghi log khi lỗi xảy ra'],
      estimate: '?',
    });

    const ids = res.findings.map((f) => f.ruleId);
    expect(ids).toContain('R03');
    expect(ids).toContain('R14');
    expect(ids).toContain('R12');
    expect(res.letters.E).toBe('warn');
  });
});
