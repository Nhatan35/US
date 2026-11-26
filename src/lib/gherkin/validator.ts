export interface GherkinIssue {
  line: number;
  severity: 'error' | 'warn';
  message: string;
}

export interface GherkinValidationResult {
  valid: boolean;
  scenarioCount: number;
  issues: GherkinIssue[];
}

const UI_DETAIL_WORDS = ['click', 'nhấn nút', 'bấm nút', 'màu ', 'pixel', 'dropdown', 'checkbox'];

export function validateGherkin(source: string): GherkinValidationResult {
  const lines = source.split(/\r?\n/);
  const issues: GherkinIssue[] = [];

  let hasFeature = false;
  let scenarioCount = 0;
  let inScenario = false;
  let isOutline = false;
  let scenarioLine = 0;
  let seenWhen = 0;
  let seenThen = 0;
  let lastPrimary: 'given' | 'when' | 'then' | null = null;
  let outlinePlaceholders = new Set<string>();
  let hasExamples = false;
  let inExamples = false;
  let exampleHeaders: string[] = [];

  const finalizeScenario = () => {
    if (!inScenario) return;
    if (seenWhen === 0) {
      issues.push({
        line: scenarioLine,
        severity: 'error',
        message: 'Scenario thiếu bước "When" (hành động kích hoạt).',
      });
    }
    if (seenWhen > 1) {
      issues.push({
        line: scenarioLine,
        severity: 'warn',
        message: 'Scenario có nhiều hơn 1 bước "When" — nên tách thành 2 Scenario riêng.',
      });
    }
    if (seenThen === 0) {
      issues.push({
        line: scenarioLine,
        severity: 'error',
        message: 'Scenario thiếu bước "Then" (kết quả kỳ vọng kiểm thử được).',
      });
    }
    if (isOutline) {
      if (!hasExamples) {
        issues.push({
          line: scenarioLine,
          severity: 'error',
          message: 'Scenario Outline bắt buộc phải có bảng "Examples:".',
        });
      } else {
        for (const ph of outlinePlaceholders) {
          if (!exampleHeaders.includes(ph)) {
            issues.push({
              line: scenarioLine,
              severity: 'error',
              message: `Biến <${ph}> không khớp với tên cột nào trong bảng Examples.`,
            });
          }
        }
      }
    }
  };

  lines.forEach((rawLine, idx) => {
    const lineNum = idx + 1;
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    if (/^Feature:/i.test(trimmed)) {
      hasFeature = true;
      return;
    }

    if (/^Background:/i.test(trimmed)) {
      finalizeScenario();
      inScenario = false;
      inExamples = false;
      return;
    }

    if (/^Scenario Outline:/i.test(trimmed) || /^Scenario:/i.test(trimmed)) {
      finalizeScenario();
      scenarioCount += 1;
      inScenario = true;
      isOutline = /^Scenario Outline:/i.test(trimmed);
      scenarioLine = lineNum;
      seenWhen = 0;
      seenThen = 0;
      lastPrimary = null;
      outlinePlaceholders = new Set<string>();
      hasExamples = false;
      inExamples = false;
      exampleHeaders = [];
      return;
    }

    if (/^Examples:/i.test(trimmed)) {
      if (!isOutline) {
        issues.push({
          line: lineNum,
          severity: 'error',
          message: '"Examples:" chỉ dùng cùng "Scenario Outline:".',
        });
      }
      hasExamples = true;
      inExamples = true;
      return;
    }

    if (inExamples && trimmed.startsWith('|')) {
      const cols = trimmed
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean);
      if (exampleHeaders.length === 0) {
        exampleHeaders = cols;
      }
      return;
    }

    const stepMatch = /^(Given|When|Then|And|But)\s+(.+)$/i.exec(trimmed);
    if (stepMatch) {
      const kw = stepMatch[1].toLowerCase();
      const body = stepMatch[2];

      if (isOutline) {
        for (const m of body.matchAll(/<([^>]+)>/g)) {
          outlinePlaceholders.add(m[1].trim());
        }
      }

      if (kw === 'given') {
        if (lastPrimary === 'when' || lastPrimary === 'then') {
          issues.push({
            line: lineNum,
            severity: 'error',
            message: 'Bước "Given" phải đứng trước "When" và "Then".',
          });
        }
        lastPrimary = 'given';
      } else if (kw === 'when') {
        if (lastPrimary === 'then') {
          issues.push({
            line: lineNum,
            severity: 'warn',
            message: 'Bước "When" xuất hiện sau "Then" — cân nhắc tách thành Scenario mới.',
          });
        }
        seenWhen += 1;
        lastPrimary = 'when';
      } else if (kw === 'then') {
        seenThen += 1;
        lastPrimary = 'then';
        const lowerBody = body.toLowerCase();
        const foundUi = UI_DETAIL_WORDS.find((w) => lowerBody.includes(w));
        if (foundUi) {
          issues.push({
            line: lineNum,
            severity: 'warn',
            message: `Bước "Then" mô tả chi tiết UI ("${foundUi.trim()}") — nên tập trung vào kết quả nghiệp vụ.`,
          });
        }
      }
      return;
    }

    if (inScenario) {
      issues.push({
        line: lineNum,
        severity: 'warn',
        message: 'Dòng không bắt đầu bằng từ khóa Gherkin chuẩn (Given/When/Then/And/But).',
      });
    }
  });

  finalizeScenario();

  if (!hasFeature) {
    issues.unshift({
      line: 1,
      severity: 'warn',
      message: 'Nên có dòng "Feature: <Tên tính năng>" ở đầu tệp.',
    });
  }

  if (scenarioCount === 0) {
    issues.push({
      line: 1,
      severity: 'error',
      message: 'Chưa có Scenario nào. Thêm ít nhất 1 "Scenario:" để kiểm thử.',
    });
  }

  return {
    valid: issues.every((i) => i.severity !== 'error'),
    scenarioCount,
    issues,
  };
}
