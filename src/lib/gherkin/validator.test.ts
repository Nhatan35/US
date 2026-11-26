import { describe, expect, it } from 'vitest';
import { validateGherkin } from './validator';

describe('Gherkin validator', () => {
  it('validates a proper Feature with Scenario and Scenario Outline', () => {
    const source = `
Feature: Đặt lịch khám
  Scenario: Đặt thành công
    Given bác sĩ còn slot 18:00
    When bệnh nhân xác nhận đặt slot 18:00
    Then lịch hẹn chuyển sang trạng thái Đã xác nhận

  Scenario Outline: Kiểm tra hủy lịch
    Given lịch hẹn còn <gio> giờ
    When bệnh nhân yêu cầu hủy
    Then kết quả là "<kq>"

    Examples:
      | gio | kq |
      | 5   | OK |
`;
    const res = validateGherkin(source);
    expect(res.valid).toBe(true);
    expect(res.scenarioCount).toBe(2);
    expect(res.issues).toHaveLength(0);
  });

  it('flags missing When/Then, wrong Given order, missing Examples, and UI details in Then', () => {
    const bad = `
Feature: Lỗi
  Scenario: Thiếu bước và mô tả UI
    When bệnh nhân bấm xác nhận
    Given điều kiện viết sai thứ tự
    Then nhấn nút màu đỏ hiện popup

  Scenario Outline: Thiếu Examples
    Given nhập <sdt>
    When gửi form
    Then báo lỗi
`;
    const res = validateGherkin(bad);
    expect(res.valid).toBe(false);
    expect(res.issues.some((i) => i.message.includes('Given'))).toBe(true);
    expect(res.issues.some((i) => i.message.includes('UI'))).toBe(true);
    expect(res.issues.some((i) => i.message.includes('Examples'))).toBe(true);
  });
});
