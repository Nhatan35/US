export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface CardSchedule {
  ease: number;
  interval: number; // days
  repetitions: number;
  due: string; // YYYY-MM-DD
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function reviewCardSm2(
  prev: CardSchedule | undefined,
  rating: ReviewRating,
  todayIso: string,
): CardSchedule {
  const ease = prev?.ease ?? 2.5;
  const interval = prev?.interval ?? 0;
  const reps = prev?.repetitions ?? 0;

  if (rating === 'again') {
    return {
      ease: Math.max(1.3, Number((ease - 0.2).toFixed(2))),
      interval: 1,
      repetitions: 0,
      due: addDays(todayIso, 1),
    };
  }

  let nextEase = ease;
  let nextInterval: number;
  const nextReps = reps + 1;

  if (rating === 'hard') {
    nextEase = Math.max(1.3, Number((ease - 0.15).toFixed(2)));
    nextInterval = reps === 0 ? 1 : Math.max(2, Math.round(interval * 1.2));
  } else if (rating === 'good') {
    nextInterval = reps === 0 ? 1 : reps === 1 ? 6 : Math.round(interval * ease);
  } else {
    // easy
    nextEase = Number((ease + 0.15).toFixed(2));
    nextInterval = reps === 0 ? 4 : Math.round(interval * ease * 1.3);
  }

  return {
    ease: nextEase,
    interval: nextInterval,
    repetitions: nextReps,
    due: addDays(todayIso, nextInterval),
  };
}

export function isCardDue(schedule: CardSchedule | undefined, todayIso: string): boolean {
  if (!schedule) return true;
  return schedule.due <= todayIso;
}
