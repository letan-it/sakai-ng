import { detectEmails } from './email-detector';

describe('detectEmails', () => {
    describe('Định dạng cơ bản / Basic formats', () => {
        it('nên phát hiện email cơ bản', () => {
            const text = 'Liên hệ: john.doe@example.com';
            const result = detectEmails(text);

            expect(result.length).toBe(1);
            expect(result[0].original).toBe('john.doe@example.com');
            expect(result[0].normalized).toBe('john.doe@example.com');
        });

        it('nên phát hiện email với subdomain', () => {
            const text = 'Email: user@mail.company.com';
            const result = detectEmails(text);

            expect(result.length).toBe(1);
            expect(result[0].normalized).toBe('user@mail.company.com');
        });

        it('nên phát hiện email với TLD dài', () => {
            const text = 'Contact: info@example.co.uk';
            const result = detectEmails(text);

            expect(result.length).toBe(1);
            expect(result[0].normalized).toBe('info@example.co.uk');
        });

        it('nên phát hiện email với số và ký tự đặc biệt', () => {
            const text = 'Email: user_123+test@example.com';
            const result = detectEmails(text);

            expect(result.length).toBe(1);
            expect(result[0].normalized).toBe('user_123+test@example.com');
        });
    });

    describe('Nhiều email / Multiple emails', () => {
        it('nên phát hiện nhiều email trong cùng văn bản', () => {
            const text = 'Liên hệ: john@example.com hoặc jane@company.com';
            const result = detectEmails(text);

            expect(result.length).toBe(2);
            expect(result[0].normalized).toBe('john@example.com');
            expect(result[1].normalized).toBe('jane@company.com');
        });

        it('nên phát hiện email trong văn bản phức tạp', () => {
            const text = `
                Thông tin liên hệ:
                Email 1: admin@example.com
                Email 2: support@company.co.uk
                Email 3: sales@business.org
            `;
            const result = detectEmails(text);

            expect(result.length).toBe(3);
            expect(result[0].normalized).toBe('admin@example.com');
            expect(result[1].normalized).toBe('support@company.co.uk');
            expect(result[2].normalized).toBe('sales@business.org');
        });
    });

    describe('Loại bỏ trùng lặp / Deduplication', () => {
        it('nên loại bỏ email trùng lặp', () => {
            const text = 'Email: john@example.com, hoặc gọi john@example.com';
            const result = detectEmails(text);

            expect(result.length).toBe(1);
            expect(result[0].normalized).toBe('john@example.com');
        });

        it('nên loại bỏ email trùng lặp với viết hoa khác nhau', () => {
            const text = 'Email: John@Example.COM hoặc john@example.com';
            const result = detectEmails(text);

            expect(result.length).toBe(1);
            expect(result[0].normalized).toBe('john@example.com');
        });
    });

    describe('Xử lý edge cases / Edge cases', () => {
        it('nên trả về mảng rỗng với văn bản rỗng', () => {
            const result = detectEmails('');

            expect(result).toEqual([]);
        });

        it('nên trả về mảng rỗng với giá trị null', () => {
            const result = detectEmails(null as any);

            expect(result).toEqual([]);
        });

        it('nên trả về mảng rỗng với giá trị undefined', () => {
            const result = detectEmails(undefined as any);

            expect(result).toEqual([]);
        });

        it('nên trả về mảng rỗng với văn bản không chứa email', () => {
            const text = 'Đây là văn bản không có email nào cả.';
            const result = detectEmails(text);

            expect(result).toEqual([]);
        });

        it('nên bỏ qua email không hợp lệ (thiếu @)', () => {
            const text = 'Email: userexample.com';
            const result = detectEmails(text);

            expect(result.length).toBe(0);
        });

        it('nên bỏ qua email không hợp lệ (thiếu domain)', () => {
            const text = 'Email: user@';
            const result = detectEmails(text);

            expect(result.length).toBe(0);
        });

        it('nên bỏ qua email không hợp lệ (thiếu TLD)', () => {
            const text = 'Email: user@example';
            const result = detectEmails(text);

            expect(result.length).toBe(0);
        });
    });

    describe('Kịch bản thực tế / Real-world scenarios', () => {
        it('nên phát hiện email trong CV text', () => {
            const cvText = `
                THÔNG TIN CÁ NHÂN
                Họ và tên: Nguyễn Văn A
                Email: nguyenvana@example.com
                Điện thoại: 0386677607
                
                KINH NGHIỆM LÀM VIỆC
                - Công ty ABC (2020-2023)
                  Email liên hệ: hr@abc-company.com
            `;
            const result = detectEmails(cvText);

            expect(result.length).toBe(2);
            expect(result[0].normalized).toBe('nguyenvana@example.com');
            expect(result[1].normalized).toBe('hr@abc-company.com');
        });

        it('nên phát hiện email trong OCR text với nhiễu', () => {
            const ocrText = 'Contact me at john.doe@example.com or call +84 123 456 789';
            const result = detectEmails(ocrText);

            expect(result.length).toBe(1);
            expect(result[0].normalized).toBe('john.doe@example.com');
        });
    });

    describe('Chuẩn hóa / Normalization', () => {
        it('nên chuẩn hóa email về chữ thường', () => {
            const text = 'Email: John.Doe@EXAMPLE.COM';
            const result = detectEmails(text);

            expect(result.length).toBe(1);
            expect(result[0].normalized).toBe('john.doe@example.com');
        });

        it('nên loại bỏ khoảng trắng thừa', () => {
            const text = 'Email:  john@example.com  ';
            const result = detectEmails(text);

            expect(result.length).toBe(1);
            expect(result[0].normalized).toBe('john@example.com');
        });
    });
});
