export type InvestLetter = 'I' | 'N' | 'V' | 'E' | 'S' | 'T';
export type FindingSeverity = 'fail' | 'warn';
export type LetterStatus = 'pass' | 'warn' | 'fail';

export interface StoryInput {
  title?: string;
  role: string;
  want: string;
  benefit: string;
  acceptanceCriteria: string[];
  estimate?: number | '?' | '';
  dependsOn?: string;
}

export interface CheckerFinding {
  ruleId: string;
  severity: FindingSeverity;
  letters: InvestLetter[];
  message: string;
  suggestion: string;
  lessonLink: string;
}

export interface InvestCheckResult {
  score: number;
  letters: Record<InvestLetter, LetterStatus>;
  findings: CheckerFinding[];
}

const GENERIC_ROLES = new Set([
  'người dùng',
  'nguoi dung',
  'user',
  'hệ thống',
  'he thong',
  'system',
  'khách',
  'khach',
  'khách hàng',
  'customer',
  'ai đó',
  'everyone',
  'anyone',
]);

const MAKER_ROLES = [
  'developer',
  'lập trình viên',
  'dev',
  'tester',
  'qa',
  'product owner',
  'scrum master',
  'ba',
  'business analyst',
  'backend',
  'frontend',
  'devops',
];

const TECH_SOLUTION_TERMS = [
  'database',
  'cơ sở dữ liệu',
  'bảng sql',
  'table ',
  'api',
  'endpoint',
  'nút ',
  'button',
  'dropdown',
  'popup',
  'modal',
  'sql',
  'react',
  'server',
  'redis',
  'kafka',
  'microservice',
  'checkbox',
  'radio button',
  'cột ',
];

const VAGUE_TERMS = [
  'nhanh',
  'dễ dàng',
  'thân thiện',
  'tốt hơn',
  'hiệu quả',
  'tối ưu',
  'linh hoạt',
  'v.v.',
  'vv',
  'etc',
  'đẹp',
  'hiện đại',
  'mượt mà',
  'fast',
  'easy',
  'user-friendly',
  'nice',
  'good',
  'better',
  'quickly',
  'seamless',
];

const ERROR_AC_TERMS = [
  'không',
  'lỗi',
  'sai',
  'hết',
  'thất bại',
  'quá',
  'vượt',
  'trùng',
  'rỗng',
  'thiếu',
  'từ chối',
  'invalid',
  'fail',
  'error',
  'empty',
  'denied',
  'timeout',
  'expired',
  'not ',
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const w of setA) {
    if (setB.has(w)) intersection += 1;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function checkUserStory(input: StoryInput): InvestCheckResult {
  const findings: CheckerFinding[] = [];
  const role = input.role.trim();
  const want = input.want.trim();
  const benefit = input.benefit.trim();
  const acList = input.acceptanceCriteria.map((s) => s.trim()).filter(Boolean);

  const roleLower = role.toLowerCase();
  const wantLower = want.toLowerCase();
  const benefitLower = benefit.toLowerCase();

  // R01: Đủ 3 phần Ai - Gì - Để làm gì
  if (!role || !want) {
    findings.push({
      ruleId: 'R01',
      severity: 'fail',
      letters: ['V', 'T'],
      message: 'Thiếu phần "Là một..." (vai trò) hoặc "Tôi muốn..." (nhu cầu).',
      suggestion: 'Điền đầy đủ 3 phần: Ai cần, họ muốn làm gì và để đạt giá trị gì.',
      lessonLink: '/modules/m3/lessons/m3-1',
    });
  }

  // R02: Vai trò cụ thể
  if (role && GENERIC_ROLES.has(roleLower)) {
    findings.push({
      ruleId: 'R02',
      severity: 'warn',
      letters: ['V'],
      message: `Vai trò "${role}" quá chung chung.`,
      suggestion: 'Chỉ rõ persona cụ thể (ví dụ: "phụ huynh đặt khám cho con", "kế toán trưởng").',
      lessonLink: '/modules/m2/lessons/m2-1',
    });
  }

  // R03: Vai trò không phải người làm sản phẩm
  if (role && MAKER_ROLES.some((m) => roleLower === m || roleLower.includes(m))) {
    findings.push({
      ruleId: 'R03',
      severity: 'warn',
      letters: ['V'],
      message: `Vai trò "${role}" là thành viên đội phát triển — dấu hiệu của task kỹ thuật đội lốt story.`,
      suggestion: 'Viết lại từ góc nhìn người hưởng lợi cuối cùng, hoặc tách thành Technical Task/Enabler.',
      lessonLink: '/modules/m1/lessons/m1-3',
    });
  }

  // R04: Có giá trị thật ở phần "Để"
  if (!benefit) {
    findings.push({
      ruleId: 'R04',
      severity: 'fail',
      letters: ['V'],
      message: 'Thiếu phần "Để..." (giá trị/lợi ích mang lại).',
      suggestion: 'Trả lời câu hỏi: người dùng đạt được kết quả kinh doanh hoặc tiết kiệm được gì?',
      lessonLink: '/modules/m3/lessons/m3-1',
    });
  } else if (want && jaccardSimilarity(want, benefit) > 0.7) {
    findings.push({
      ruleId: 'R04',
      severity: 'fail',
      letters: ['V'],
      message: 'Phần "Để..." đang lặp lại ý của phần "Tôi muốn..." mà không nêu giá trị thật.',
      suggestion: 'Đào sâu bằng "5 Whys": họ làm hành động đó để giải quyết nỗi đau nào?',
      lessonLink: '/modules/m3/lessons/m3-2',
    });
  }

  // R05: Không nêu giải pháp kỹ thuật/UI
  const foundTech = TECH_SOLUTION_TERMS.filter(
    (term) => wantLower.includes(term) || benefitLower.includes(term),
  );
  if (foundTech.length > 0) {
    findings.push({
      ruleId: 'R05',
      severity: 'warn',
      letters: ['N'],
      message: `Phát hiện từ ngữ áp đặt giải pháp kỹ thuật/UI: "${foundTech.slice(0, 3).join(', ')}".`,
      suggestion: 'Mô tả nhu cầu và kết quả thay vì chỉ định nút bấm, API hay bảng dữ liệu để giữ tính Negotiable.',
      lessonLink: '/modules/m3/lessons/m3-2',
    });
  }

  // R06: Một mục tiêu duy nhất
  const compoundMatch = wantLower.match(
    /(?:^|\s)(và|and|hoặc|or|đồng thời|cũng như)(?=\s|$|[.,;])/,
  );
  if (compoundMatch) {
    findings.push({
      ruleId: 'R06',
      severity: 'warn',
      letters: ['S', 'I'],
      message: `Phần "Tôi muốn" chứa từ nối ("${compoundMatch[1]}") — có thể đang gộp nhiều story làm một.`,
      suggestion: 'Kiểm tra xem có thể tách thành 2 story độc lập theo lát cắt dọc hay không.',
      lessonLink: '/modules/m3/lessons/m3-6',
    });
  }

  // R07: Độ dài hợp lý
  const wantWordCount = tokenize(want).length;
  if (wantWordCount > 25) {
    findings.push({
      ruleId: 'R07',
      severity: 'warn',
      letters: ['S'],
      message: `Phần "Tôi muốn" hơi dài (${wantWordCount} từ, nên ≤ 25 từ).`,
      suggestion: 'Rút gọn câu chuyện cốt lõi trên Card; chuyển các chi tiết quy tắc xuống Acceptance Criteria.',
      lessonLink: '/modules/m3/lessons/m3-1',
    });
  }

  // R08: Không từ mơ hồ trong story
  const foundVagueStory = VAGUE_TERMS.filter(
    (term) => wantLower.includes(term) || benefitLower.includes(term),
  );
  if (foundVagueStory.length > 0) {
    findings.push({
      ruleId: 'R08',
      severity: 'warn',
      letters: ['T', 'E'],
      message: `Phát hiện từ ngữ mơ hồ, khó kiểm chứng: "${foundVagueStory.slice(0, 3).join(', ')}".`,
      suggestion: 'Thay bằng tiêu chí định lượng cụ thể (ví dụ: "< 2 giây", "trong vòng 3 bước").',
      lessonLink: '/modules/m3/lessons/m3-3',
    });
  }

  // R09: Có ít nhất 2 AC
  if (acList.length < 2) {
    findings.push({
      ruleId: 'R09',
      severity: 'fail',
      letters: ['T'],
      message: `Cần ít nhất 2 Acceptance Criteria (hiện có ${acList.length}).`,
      suggestion: 'Bổ sung điều kiện thành công (happy path) và ít nhất 1 trường hợp lỗi/biên.',
      lessonLink: '/modules/m3/lessons/m3-3',
    });
  }

  // R10: AC có trường hợp lỗi
  if (acList.length >= 2) {
    const hasErrorCase = acList.some((ac) => {
      const lower = ac.toLowerCase();
      return ERROR_AC_TERMS.some((term) => lower.includes(term));
    });
    if (!hasErrorCase) {
      findings.push({
        ruleId: 'R10',
        severity: 'warn',
        letters: ['T'],
        message: 'Acceptance Criteria chưa thấy trường hợp lỗi hoặc ngoại lệ (unhappy path).',
        suggestion: 'Hỏi thêm: "Nếu dữ liệu sai, hết slot, hoặc mất quyền thì hệ thống phản hồi ra sao?"',
        lessonLink: '/modules/m3/lessons/m3-3',
      });
    }
  }

  // R11: AC đo được (không từ mơ hồ)
  const vagueInAc = acList.flatMap((ac) => {
    const lower = ac.toLowerCase();
    return VAGUE_TERMS.filter((term) => lower.includes(term));
  });
  if (vagueInAc.length > 0) {
    findings.push({
      ruleId: 'R11',
      severity: 'warn',
      letters: ['T'],
      message: `AC chứa từ mơ hồ ("${Array.from(new Set(vagueInAc)).slice(0, 3).join(', ')}") nên khó kiểm thử.`,
      suggestion: 'Chuyển thành con số hoặc hành vi quan sát được rõ ràng.',
      lessonLink: '/modules/m3/lessons/m3-3',
    });
  }

  // R12: Kích thước / ước lượng
  if (input.estimate === '?') {
    findings.push({
      ruleId: 'R12',
      severity: 'warn',
      letters: ['E'],
      message: 'Ước lượng đang là "?" — story chưa đủ rõ để ước lượng (Estimable).',
      suggestion: 'Trao đổi thêm với team hoặc tạo một Spike ngắn để điều tra kỹ thuật.',
      lessonLink: '/modules/m3/lessons/m3-2',
    });
  } else if (typeof input.estimate === 'number' && input.estimate >= 13) {
    findings.push({
      ruleId: 'R12',
      severity: 'warn',
      letters: ['S'],
      message: `Ước lượng ${input.estimate} điểm là quá lớn cho 1 sprint (nên ≤ 8 điểm).`,
      suggestion: 'Dùng Story Splitting Trainer (SPIDR) để chia nhỏ thành các lát cắt dọc.',
      lessonLink: '/modules/m3/lessons/m3-6',
    });
  }

  // R13: Độc lập
  if (input.dependsOn && input.dependsOn.trim().length > 0) {
    findings.push({
      ruleId: 'R13',
      severity: 'warn',
      letters: ['I'],
      message: 'Story đang có phụ thuộc vào mục khác.',
      suggestion: 'Cân nhắc gộp nhẹ, đổi thứ tự hoặc dùng mock/stub để giảm phụ thuộc chéo.',
      lessonLink: '/modules/m3/lessons/m3-2',
    });
  }

  // R14: Từ góc nhìn người dùng
  if (
    wantLower.startsWith('hệ thống sẽ') ||
    wantLower.startsWith('hệ thống phải') ||
    wantLower.startsWith('system shall') ||
    wantLower.startsWith('the system')
  ) {
    findings.push({
      ruleId: 'R14',
      severity: 'warn',
      letters: ['V', 'N'],
      message: 'Phần "Tôi muốn" đang viết theo góc nhìn hệ thống ("Hệ thống phải/sẽ...").',
      suggestion: 'Đổi chủ ngữ sang hành động mà người dùng muốn thực hiện.',
      lessonLink: '/modules/m1/lessons/m1-1',
    });
  }

  const letters: Record<InvestLetter, LetterStatus> = {
    I: 'pass',
    N: 'pass',
    V: 'pass',
    E: 'pass',
    S: 'pass',
    T: 'pass',
  };

  let failCount = 0;
  let warnCount = 0;
  for (const f of findings) {
    if (f.severity === 'fail') failCount += 1;
    else warnCount += 1;
    for (const l of f.letters) {
      if (f.severity === 'fail') letters[l] = 'fail';
      else if (letters[l] !== 'fail') letters[l] = 'warn';
    }
  }

  const score = Math.max(0, 100 - failCount * 20 - warnCount * 7);
  return { score, letters, findings };
}
