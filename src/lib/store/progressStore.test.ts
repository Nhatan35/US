import { beforeEach, describe, expect, it } from 'vitest';
import { getLevelForXp, useProgressStore } from './progressStore';

describe('progressStore', () => {
  beforeEach(() => {
    useProgressStore.getState().resetProgress();
  });

  it('awards XP once per completed lesson and updates streak', () => {
    const store = useProgressStore.getState();
    store.markLessonDone('m1-1');
    store.markLessonDone('m1-1'); // duplicate should not add XP again

    const next = useProgressStore.getState();
    expect(next.lessonsDone).toEqual(['m1-1']);
    expect(next.xp).toBe(10);
    expect(next.streak).toBe(1);
  });

  it('records best quiz score, XP, skills, and badges', () => {
    useProgressStore.getState().recordQuizResult('quiz-m1', 100, 30, { writing: 9 });
    const afterFirst = useProgressStore.getState();
    expect(afterFirst.quizScores['quiz-m1']).toBe(100);
    expect(afterFirst.xp).toBe(30);
    expect(afterFirst.skills.writing).toBe(24);
    expect(afterFirst.badges).toContain('perfect-quiz');

    // Lower retry score should not overwrite best score
    useProgressStore.getState().recordQuizResult('quiz-m1', 60, 30, {});
    expect(useProgressStore.getState().quizScores['quiz-m1']).toBe(100);
  });

  it('exports and imports JSON snapshots safely', () => {
    useProgressStore.getState().markLessonDone('m1-1');
    useProgressStore.getState().saveLessonNote('m1-1', 'Ghi chú 3C');
    const backup = useProgressStore.getState().exportSnapshot();

    useProgressStore.getState().resetProgress();
    expect(useProgressStore.getState().lessonsDone).toEqual([]);

    const ok = useProgressStore.getState().importSnapshot(backup);
    expect(ok).toEqual({ ok: true });
    expect(useProgressStore.getState().lessonsDone).toEqual(['m1-1']);
    expect(useProgressStore.getState().lessonNotes['m1-1']).toBe('Ghi chú 3C');

    const bad = useProgressStore.getState().importSnapshot('{"invalid":true}');
    expect(bad.ok).toBe(false);
  });

  it('maps XP to expected levels', () => {
    expect(getLevelForXp(0).name).toBe('Story Novice');
    expect(getLevelForXp(200).name).toBe('Story Writer');
    expect(getLevelForXp(1700).name).toBe('Story Artisan');
  });
});
