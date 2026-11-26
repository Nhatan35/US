export type CommDimension = 'question' | 'listen' | 'value' | 'negotiate' | 'relation';

export const COMM_LABELS: Record<CommDimension, string> = {
  question: 'Đặt câu hỏi',
  listen: 'Lắng nghe',
  value: 'Tập trung giá trị',
  negotiate: 'Đàm phán',
  relation: 'Giữ quan hệ',
};

export interface RolePlayChoice {
  text: string;
  next: string;
  quality: 'good' | 'ok' | 'bad';
  effects: Partial<Record<CommDimension, number>>;
  trustDelta: number;
  feedback: string;
}

export interface RolePlayNode {
  id: string;
  speaker: string;
  speakerRole: string;
  text: string;
  choices?: RolePlayChoice[];
  ending?: {
    grade: 'good' | 'neutral' | 'bad';
    summary: string;
    takeawayPhrases: string[];
    resultingStory?: string;
  };
}

export interface RolePlayScenario {
  id: string;
  code: string;
  moduleId: string;
  title: string;
  character: string;
  goal: string;
  startNode: string;
  nodes: Record<string, RolePlayNode>;
}

export const ROLEPLAY_SCENARIOS: RolePlayScenario[] = [
  {
    id: 'rp2',
    code: 'RP2',
    moduleId: 'm5',
    title: '"Em thêm cho anh nút xuất Excel gấp nhé!"',
    character: 'Anh Tuấn — Trưởng phòng Kinh doanh',
    goal: 'Dùng kỹ thuật 5 Whys để tách nhu cầu gốc khỏi giải pháp "nút xuất Excel" mà vẫn giữ quan hệ tốt.',
    startNode: 'n1',
    nodes: {
      n1: {
        id: 'n1',
        speaker: 'Anh Tuấn',
        speakerRole: 'Trưởng phòng Kinh doanh',
        text: 'Chào em, em thêm giúp anh một nút "Xuất Excel" ở trang danh sách đơn hàng nhé. Tuần này anh cần gấp lắm!',
        choices: [
          {
            text: 'Dạ vâng, em tạo ngay ticket "Thêm nút xuất Excel" cho dev làm luôn ạ.',
            next: 'n_bad_yes',
            quality: 'bad',
            effects: { question: -2, value: -2, relation: 1 },
            trustDelta: 5,
            feedback: 'Nhận ngay giải pháp mà không hỏi lý do khiến team dễ xây tính năng không giải quyết triệt để nỗi đau thật.',
          },
          {
            text: 'Dạ em ghi nhận ạ! Để em hiểu đúng nhu cầu, anh định dùng file Excel đó để làm việc gì ạ?',
            next: 'n2',
            quality: 'good',
            effects: { question: 3, listen: 2, relation: 2 },
            trustDelta: 10,
            feedback: 'Rất tốt! Bạn vừa ghi nhận tích cực vừa mở câu hỏi "Why" đầu tiên nhẹ nhàng.',
          },
          {
            text: 'Sprint này kín lịch rồi anh ơi, không thêm được đâu ạ.',
            next: 'n_cold_no',
            quality: 'bad',
            effects: { listen: -2, relation: -3, negotiate: -1 },
            trustDelta: -20,
            feedback: 'Từ chối thẳng khi chưa lắng nghe nhu cầu làm stakeholder cảm thấy không được tôn trọng.',
          },
        ],
      },
      n_bad_yes: {
        id: 'n_bad_yes',
        speaker: 'Anh Tuấn',
        speakerRole: 'Trưởng phòng Kinh doanh',
        text: 'Tuyệt vời, cảm ơn em! (2 tuần sau: Dev làm xong nút xuất 50 cột thô, anh Tuấn vẫn phải lọc tay 2 tiếng mỗi tuần rồi phàn nàn app dùng chán quá.)',
        ending: {
          grade: 'bad',
          summary: 'Bạn làm đúng lời yêu cầu nhưng không giải quyết được vấn đề gốc của anh Tuấn.',
          takeawayPhrases: [
            '"Để em hiểu đúng và làm giải pháp tiện nhất cho anh, anh định dùng dữ liệu đó để làm việc gì ạ?"',
          ],
        },
      },
      n_cold_no: {
        id: 'n_cold_no',
        speaker: 'Anh Tuấn',
        speakerRole: 'Trưởng phòng Kinh doanh',
        text: 'Sao lúc nào bên IT cũng kêu kín lịch thế? Anh cần gửi báo cáo cho sếp lớn thứ Hai này đấy!',
        choices: [
          {
            text: 'Em xin lỗi vì nói hơi vội. Anh chia sẻ thêm về báo cáo thứ Hai đó được không, biết đâu mình có cách xử lý nhanh hơn ạ?',
            next: 'n2',
            quality: 'ok',
            effects: { listen: 2, relation: 2, question: 2 },
            trustDelta: 10,
            feedback: 'Kịp thời hạ nhiệt và quay lại lắng nghe nhu cầu thật.',
          },
          {
            text: 'Quy trình Scrum không cho phép chen ngang sprint anh thông cảm.',
            next: 'n_end_conflict',
            quality: 'bad',
            effects: { relation: -3, negotiate: -2 },
            trustDelta: -25,
            feedback: 'Lấy quy trình ra làm khiên chắn thay vì cùng giải quyết bài toán kinh doanh.',
          },
        ],
      },
      n_end_conflict: {
        id: 'n_end_conflict',
        speaker: 'Anh Tuấn',
        speakerRole: 'Trưởng phòng Kinh doanh',
        text: 'Được rồi, để anh báo thẳng lên Giám đốc vậy.',
        ending: {
          grade: 'bad',
          summary: 'Cuộc trao đổi rơi vào đối đầu và bị leo thang lên cấp trên.',
          takeawayPhrases: [
            '"Em hiểu báo cáo thứ Hai rất quan trọng. Cho em hỏi 2 phút về số liệu anh cần để xem mình có cách nào gỡ nhanh không nhé?"',
          ],
        },
      },
      n2: {
        id: 'n2',
        speaker: 'Anh Tuấn',
        speakerRole: 'Trưởng phòng Kinh doanh',
        text: 'À, mỗi sáng thứ Hai anh phải tổng hợp doanh số tuần theo từng nhân viên kinh doanh để gửi cho Ban giám đốc. Hiện tại anh phải ngồi cộng tay từng đơn hàng mất gần 2 tiếng, lại hay sai công thức.',
        choices: [
          {
            text: 'Vậy em làm nút xuất Excel có sẵn cột tên nhân viên và tổng tiền nhé?',
            next: 'n_neutral',
            quality: 'ok',
            effects: { listen: 1, value: 1 },
            trustDelta: 5,
            feedback: 'Khá hơn ban đầu vì đã rõ cột cần xuất, nhưng vẫn dừng ở giải pháp thủ công tải file.',
          },
          {
            text: 'Nếu hệ thống tự tổng hợp bảng doanh số theo nhân viên và gửi email tóm tắt cho anh + Ban giám đốc mỗi 8h sáng thứ Hai, anh có còn cần tải Excel thủ công nữa không ạ?',
            next: 'n3',
            quality: 'good',
            effects: { value: 3, question: 2, listen: 2, negotiate: 2 },
            trustDelta: 20,
            feedback: 'Xuất sắc! Bạn chuyển từ "tính năng xuất file" sang giải pháp loại bỏ hoàn toàn 2 tiếng làm tay.',
          },
        ],
      },
      n_neutral: {
        id: 'n_neutral',
        speaker: 'Anh Tuấn',
        speakerRole: 'Trưởng phòng Kinh doanh',
        text: 'Ừ có sẵn 2 cột đó thì cũng đỡ hơn được nửa tiếng. Em xếp vào sprint tới giúp anh nhé.',
        ending: {
          grade: 'neutral',
          summary: 'Giải quyết được một phần nỗi đau nhưng bỏ lỡ cơ hội tự động hóa hoàn toàn quy trình báo cáo tuần.',
          takeawayPhrases: [
            '"Nếu hệ thống tự tổng hợp sẵn bảng doanh số mỗi sáng thứ Hai thì có giúp anh tiết kiệm trọn 2 tiếng không ạ?"',
          ],
          resultingStory:
            'Là trưởng phòng kinh doanh, tôi muốn xuất bảng doanh số tuần gồm tên nhân viên và tổng tiền để giảm thời gian tổng hợp thủ công.',
        },
      },
      n3: {
        id: 'n3',
        speaker: 'Anh Tuấn',
        speakerRole: 'Trưởng phòng Kinh doanh',
        text: 'Ồ, nếu tự gửi báo cáo tóm tắt mỗi sáng thứ Hai thì quá tuyệt vời! Anh không cần phải ngồi tải Excel rồi lọc tay nữa. Bao giờ thì làm được em?',
        choices: [
          {
            text: 'Sprint này team đang chốt mục tiêu đặt lịch, nên em đề xuất chia 2 bước: tuần này em hỗ trợ chạy query gửi số liệu tạm, và đưa story "Báo cáo doanh số tuần tự động" lên đầu Sprint sau nhé anh?',
            next: 'n_good_end',
            quality: 'good',
            effects: { negotiate: 3, relation: 2, value: 2 },
            trustDelta: 15,
            feedback: 'Tuyệt vời! Vừa bảo vệ được Sprint đang chạy, vừa có giải pháp tình thế cho thứ Hai này, vừa chốt được story giá trị cao cho Sprint sau.',
          },
        ],
      },
      n_good_end: {
        id: 'n_good_end',
        speaker: 'Anh Tuấn',
        speakerRole: 'Trưởng phòng Kinh doanh',
        text: 'Hợp lý quá! Cảm ơn em đã hỏi kỹ chứ không làm vội cái nút Excel kia. Anh hoàn toàn đồng ý kế hoạch này.',
        ending: {
          grade: 'good',
          summary: 'Kết thúc xuất sắc! Bạn đã đào đúng nhu cầu gốc bằng 5 Whys, bảo vệ sprint hiện tại và tăng mạnh sự tin tưởng của stakeholder.',
          takeawayPhrases: [
            '"Anh định dùng file Excel đó để ra quyết định hay làm công việc gì ạ?"',
            '"Nếu hệ thống tự động hóa bước đó thì anh có còn cần thao tác thủ công không?"',
            '"Tuần này em hỗ trợ phương án tạm, và ưu tiên đưa story hoàn chỉnh lên đầu Sprint sau anh nhé."',
          ],
          resultingStory:
            'Là trưởng phòng kinh doanh, tôi muốn nhận báo cáo tổng hợp doanh số tuần theo từng nhân viên qua email vào 8h sáng thứ Hai để gửi Ban giám đốc mà không tốn 2 giờ cộng tay.',
        },
      },
    },
  },
  {
    id: 'rp4',
    code: 'RP4',
    moduleId: 'm6',
    title: 'Senior Dev phản đối Story quá lớn ngay trong Refinement',
    character: 'Anh Hùng — Senior Developer',
    goal: 'Lắng nghe phản hồi kỹ thuật, không phòng thủ và cùng team chia nhỏ story theo lát cắt dọc.',
    startNode: 'r1',
    nodes: {
      r1: {
        id: 'r1',
        speaker: 'Anh Hùng',
        speakerRole: 'Senior Developer',
        text: 'Story "Thanh toán đa phương thức + áp mã giảm giá + xuất hóa đơn VAT" này ôm đồm quá! Ít nhất 21 điểm, sao mà làm xong trong 1 sprint 2 tuần được?',
        choices: [
          {
            text: 'Khách hàng yêu cầu gói này phải xong hết trong sprint sau, anh cố gắng ước lượng 8 điểm giúp em đi.',
            next: 'r_bad',
            quality: 'bad',
            effects: { listen: -3, negotiate: -2, relation: -3 },
            trustDelta: -25,
            feedback: 'Ép dev hạ điểm ước lượng không làm giảm công việc thật — chỉ dẫn đến carry-over và code kém chất lượng.',
          },
          {
            text: 'Cảm ơn anh Hùng chỉ ra sớm! Đúng là story này đang ôm 3 việc lớn. Mình cùng tách theo SPIDR nhé: nếu Sprint tới chỉ làm thanh toán thẻ nội địa trước, bỏ mã giảm giá và VAT sang story riêng thì khoảng mấy điểm ạ?',
            next: 'r2',
            quality: 'good',
            effects: { listen: 3, value: 2, negotiate: 3, relation: 2 },
            trustDelta: 20,
            feedback: 'Rất chuyên nghiệp! Tiếp nhận phản hồi tích cực và chủ động đề xuất lát cắt dọc ngay trong buổi Refinement.',
          },
        ],
      },
      r_bad: {
        id: 'r_bad',
        speaker: 'Anh Hùng',
        speakerRole: 'Senior Developer',
        text: 'Nếu ép 8 điểm thì team chỉ làm được một nửa rồi lại kéo sang sprint sau thôi. Em tự chịu trách nhiệm với khách hàng nhé.',
        ending: {
          grade: 'bad',
          summary: 'Ép ước lượng phá vỡ niềm tin giữa PO/BA và team kỹ thuật.',
          takeawayPhrases: [
            '"Cảm ơn anh cảnh báo sớm, vậy mình cùng chia nhỏ thành các lát cắt dọc để vừa 1 sprint nhé."',
          ],
        },
      },
      r2: {
        id: 'r2',
        speaker: 'Anh Hùng',
        speakerRole: 'Senior Developer',
        text: 'Nếu tách riêng "Thanh toán thẻ nội địa" thì khoảng 5 điểm thôi, rất rõ ràng và test kỹ được trong 1 sprint. Phần mã giảm giá khoảng 3 điểm, hóa đơn VAT cần thêm 1 ngày Spike xem API hóa đơn điện tử.',
        choices: [
          {
            text: 'Quá rõ ràng! Em sẽ tách thành 3 story + 1 Spike 1 ngày cho API hóa đơn điện tử, rồi mình chốt AC cùng QA luôn nhé.',
            next: 'r_good',
            quality: 'good',
            effects: { listen: 2, value: 2, negotiate: 2, relation: 2 },
            trustDelta: 15,
            feedback: 'Chốt gọn gàng, đưa thêm QA vào làm rõ AC — đúng tinh thần Three Amigos.',
          },
        ],
      },
      r_good: {
        id: 'r_good',
        speaker: 'Anh Hùng',
        speakerRole: 'Senior Developer',
        text: 'Ok em, làm vậy sprint sau vừa chắc ăn giao được tính năng thanh toán thật vừa không bị rủi ro API hóa đơn!',
        ending: {
          grade: 'good',
          summary: 'Buổi Refinement thành công mỹ mãn: 1 Epic 21 điểm đã trở thành 3 lát cắt dọc rõ ràng + 1 Spike giảm rủi ro.',
          takeawayPhrases: [
            '"Cảm ơn anh chỉ ra sớm — mình cùng tách lát cắt dọc nào nhỏ nhất mà vẫn demo được cho khách nhé."',
          ],
        },
      },
    },
  },
];
