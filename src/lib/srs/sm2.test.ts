import { describe, expect, it } from 'vitest';
import { isCardDue, reviewCardSm2 } from './sm2';

describe('SM-2 spaced repetition engine', () => {
  it('schedules intervals progressively for good/easy and resets on again', () => {
    const first = reviewCardSm2(undefined, 'good', '2026-11-26');
    expect(first.interval).toBe(1);
    expect(first.due).toBe('2026-11-27');

    const second = reviewCardSm2(first, 'good', '2026-11-27');
    expect(second.interval).toBe(6);
    expect(second.due).toBe('2026-12-03');

    const lapsed = reviewCardSm2(second, 'again', '2026-12-03');
    expect(lapsed.repetitions).toBe(0);
    expect(lapsed.interval).toBe(1);
    expect(lapsed.ease).toBeLessThan(second.ease);
  });

  it('marks unseen or past-due cards as due today', () => {
    expect(isCardDue(undefined, '2026-11-26')).toBe(true);
    expect(
      isCardDue({ ease: 2.5, interval: 1, repetitions: 1, due: '2026-11-25' }, '2026-11-26'),
    ).toBe(true);
    expect(
      isCardDue({ ease: 2.5, interval: 6, repetitions: 2, due: '2026-12-01' }, '2026-11-26'),
    ).toBe(false);
  });
});
