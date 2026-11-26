export interface Flashcard {
  id: string;
  moduleId: string;
  category: 'Khái niệm' | 'Bắt lỗi' | 'Framework' | 'So sánh';
  front: string;
  back: string;
}

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    moduleId: 'm1',
    category: 'Khái niệm',
    front: '3 chữ "C" trong mô hình 3C của Ron Jeffries là gì?',
    back: 'Card (thẻ ghi ngắn) – Conversation (trao đổi làm rõ) – Confirmation (tiêu chí xác nhận / AC). Trong đó Conversation quan trọng nhất.',
  },
  {
    id: 'fc-2',
    moduleId: 'm1',
    category: 'So sánh',
    front: 'Khác biệt cốt lõi giữa User Story và Technical Task là gì?',
    back: 'User Story mang lại giá trị trực tiếp cho người dùng cuối; Technical Task (tạo bảng DB, cấu hình cache) là đầu việc kỹ thuật con để thực hiện Story.',
  },
  {
    id: 'fc-3',
    moduleId: 'm2',
    category: 'Khái niệm',
    front: 'Negative Persona dùng để làm gì?',
    back: 'Xác định nhóm đối tượng sản phẩm CHỦ ĐỘNG không phục vụ, giúp bảo vệ phạm vi và dễ dàng nói "không" với tính năng lạc hướng.',
  },
  {
    id: 'fc-4',
    moduleId: 'm2',
    category: 'Khái niệm',
    front: 'Cấu trúc chuẩn của một Job Story (JTBD) là gì?',
    back: 'Khi [tình huống cụ thể], tôi muốn [động cơ/hành động], để [kết quả mong muốn].',
  },
  {
    id: 'fc-5',
    moduleId: 'm3',
    category: 'Khái niệm',
    front: '6 chữ cái INVEST viết tắt của những tiêu chí nào?',
    back: 'Independent (Độc lập) · Negotiable (Thương lượng được) · Valuable (Có giá trị) · Estimable (Ước lượng được) · Small (Nhỏ gọn) · Testable (Kiểm thử được).',
  },
  {
    id: 'fc-6',
    moduleId: 'm3',
    category: 'Bắt lỗi',
    front: 'Story: "Là người dùng, tôi muốn bấm nút màu xanh gọi API /export thật nhanh." Vi phạm những tiêu chí INVEST nào?',
    back: 'Vi phạm Valuable (vai trò chung chung, thiếu "Để..."), Negotiable (áp đặt nút màu xanh/API) và Testable ("thật nhanh" mơ hồ).',
  },
  {
    id: 'fc-7',
    moduleId: 'm3',
    category: 'So sánh',
    front: 'Phân biệt nhanh DoR, AC và DoD?',
    back: 'DoR: điều kiện chung trước khi vào Sprint. AC: điều kiện nghiệm thu riêng từng Story. DoD: tiêu chuẩn chất lượng chung trước khi kéo sang Done.',
  },
  {
    id: 'fc-8',
    moduleId: 'm3',
    category: 'Framework',
    front: '5 chữ cái SPIDR trong kỹ thuật chia nhỏ User Story là gì?',
    back: 'Spike (điều tra rủi ro) · Paths (nhánh luồng) · Interfaces (giao diện/kênh) · Data (tập dữ liệu) · Rules (quy tắc nghiệp vụ).',
  },
  {
    id: 'fc-9',
    moduleId: 'm3',
    category: 'Khái niệm',
    front: 'Tại sao phải chia Story theo Lát cắt dọc (Vertical Slice) thay vì cắt ngang (UI/API/DB)?',
    back: 'Mỗi lát cắt dọc đi xuyên qua đủ các tầng nên tự thân mang giá trị, demo được và lấy phản hồi sớm từ người dùng.',
  },
  {
    id: 'fc-10',
    moduleId: 'm4',
    category: 'Framework',
    front: 'Quy tắc vàng cho nhóm "Must have" trong MoSCoW là gì?',
    back: 'Must have nên chiếm ≤ 60% năng lực (capacity) để còn vùng đệm khi phát sinh rủi ro hoặc thay đổi.',
  },
  {
    id: 'fc-11',
    moduleId: 'm4',
    category: 'Framework',
    front: 'Công thức tính RICE và WSJF khác nhau thế nào?',
    back: 'RICE = (Reach × Impact × Confidence) / Effort (mạnh cho sản phẩm tiêu dùng). WSJF = (Value + Time Criticality + Risk Reduction) / Job Size (mạnh khi có hạn pháp lý/rủi ro).',
  },
  {
    id: 'fc-12',
    moduleId: 'm4',
    category: 'Khái niệm',
    front: 'Story Point đo lường 3 yếu tố nào?',
    back: 'Khối lượng công việc (Volume) + Độ phức tạp (Complexity) + Mức độ rủi ro / không chắc chắn (Uncertainty). KHÔNG phải quy đổi cứng sang số giờ.',
  },
  {
    id: 'fc-13',
    moduleId: 'm5',
    category: 'Framework',
    front: 'Công thức 3 bước nói "chưa phải lúc" với Stakeholder mà vẫn giữ niềm tin?',
    back: '1. Thừa nhận mục tiêu · 2. Đưa dữ liệu năng lực/capacity · 3. Đề xuất 2 phương án Trade-off (Phạm vi vs Thời gian) để họ cùng quyết định.',
  },
  {
    id: 'fc-14',
    moduleId: 'm5',
    category: 'Bắt lỗi',
    front: 'Khi Stakeholder nói "Thêm nút xuất Excel", phản ứng sai và phản ứng đúng là gì?',
    back: 'Sai: ghi ngay story nút xuất Excel. Đúng: dùng 5 Whys hỏi mục đích sử dụng dữ liệu để tìm nhu cầu gốc (có thể tự động hóa báo cáo).',
  },
  {
    id: 'fc-15',
    moduleId: 'm6',
    category: 'Khái niệm',
    front: '4 đặc tính DEEP của một Product Backlog khỏe mạnh là gì?',
    back: 'Detailed appropriately (chi tiết ở đỉnh, thô ở đáy) · Estimated · Emergent (tiến hóa liên tục) · Prioritized.',
  },
  {
    id: 'fc-16',
    moduleId: 'm6',
    category: 'Khái niệm',
    front: 'Buổi Three Amigos gồm 3 vai trò nào và giải quyết vấn đề gì?',
    back: 'Business (PO/BA) + Dev + QA cùng soi story trước sprint để làm rõ AC, phát hiện trường hợp biên và chặn hiểu nhầm từ sớm.',
  },
  {
    id: 'fc-17',
    moduleId: 'm6',
    category: 'Bắt lỗi',
    front: 'Anti-pattern "Gold-plating" trong phát triển sản phẩm là gì?',
    back: 'Tự ý thêm tính năng hoặc hiệu ứng phức tạp ngoài yêu cầu mà người dùng không cần, gây lãng phí công sức và trễ tiến độ.',
  },
  {
    id: 'fc-18',
    moduleId: 'm7',
    category: 'Khái niệm',
    front: 'Walking Skeleton trên User Story Map là gì?',
    back: 'Lát cắt MVP tối giản nhất nhưng có ít nhất 1 story ở mọi cột Backbone để người dùng đi trọn hành trình từ đầu đến cuối.',
  },
  {
    id: 'fc-19',
    moduleId: 'm7',
    category: 'So sánh',
    front: 'Phân biệt Output và Outcome khi lập kế hoạch Release?',
    back: 'Output là số lượng tính năng/story làm ra; Outcome là sự thay đổi tích cực đo được ở người dùng hoặc kinh doanh (ví dụ: giảm no-show từ 18% xuống < 8%).',
  },
  {
    id: 'fc-20',
    moduleId: 'm7',
    category: 'Khái niệm',
    front: 'Ai là Persona hợp lệ khi viết User Story cho sản phẩm Open API?',
    back: 'Lập trình viên của đối tác tích hợp (Partner Developer) — người trực tiếp gọi API, đọc mã lỗi và tài liệu.',
  },
];
