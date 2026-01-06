import { detectVietnamesePhones, PhoneDetectionResult } from './phone-detector';

describe('detectVietnamesePhones', () => {
    describe('Định dạng cơ bản / Basic formats', () => {
        it('nên phát hiện số điện thoại 10 chữ số bắt đầu bằng 0', () => {
            const text = 'Liên hệ: 0386677607';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(1);
            expect(result[0].original).toBe('0386677607');
            expect(result[0].normalized).toBe('0386677607');
        });

        it('nên phát hiện số điện thoại với mã quốc gia +84', () => {
            const text = 'Số điện thoại: +84386677607';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(1);
            expect(result[0].original).toBe('+84386677607');
            expect(result[0].normalized).toBe('0386677607');
        });

        it('nên phát hiện số điện thoại với mã quốc gia 84', () => {
            const text = 'Gọi ngay: 84386677607';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(1);
            expect(result[0].original).toBe('84386677607');
            expect(result[0].normalized).toBe('0386677607');
        });
    });

    describe('Định dạng với ký tự phân cách / Formats with separators', () => {
        it('nên phát hiện số điện thoại với khoảng trắng', () => {
            const text = 'Liên hệ: 038 667 7607';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(1);
            expect(result[0].original).toBe('038 667 7607');
            expect(result[0].normalized).toBe('0386677607');
        });

        it('nên phát hiện số điện thoại với dấu gạch ngang', () => {
            const text = 'Hotline: 0886-232-456';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(1);
            expect(result[0].normalized).toBe('0886232456');
        });

        it('nên phát hiện số điện thoại với dấu chấm', () => {
            const text = 'SĐT: 038.6677.607';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(1);
            expect(result[0].normalized).toBe('0386677607');
        });

        it('nên phát hiện số điện thoại với ký tự phân cách hỗn hợp', () => {
            const text = 'Gọi: 0386 - 677 607';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(1);
            expect(result[0].original).toBe('0386 - 677 607');
            expect(result[0].normalized).toBe('0386677607');
        });

        it('nên phát hiện số điện thoại +84 với khoảng trắng', () => {
            const text = 'Hotline: +84 386 677 607';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(1);
            expect(result[0].original).toBe('+84 386 677 607');
            expect(result[0].normalized).toBe('0386677607');
        });

        it('nên phát hiện số điện thoại 84 với dấu gạch ngang', () => {
            const text = 'Tel: 84-386-677-607';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(1);
            expect(result[0].original).toBe('84-386-677-607');
            expect(result[0].normalized).toBe('0386677607');
        });
    });

    describe('Tiền tố hợp lệ / Valid prefixes', () => {
        it('nên chấp nhận tiền tố 03x (tất cả chữ số)', () => {
            const prefixes = ['030', '031', '032', '033', '034', '035', '036', '037', '038', '039'];

            prefixes.forEach((prefix) => {
                const text = `SĐT: ${prefix}1234567`;
                const result = detectVietnamesePhones(text);

                expect(result.length).toBe(1);
                expect(result[0].normalized).toBe(`${prefix}1234567`);
            });
        });

        it('nên chấp nhận tiền tố 05x (chỉ 5, 6, 8, 9)', () => {
            const validPrefixes = ['055', '056', '058', '059'];

            validPrefixes.forEach((prefix) => {
                const text = `SĐT: ${prefix}1234567`;
                const result = detectVietnamesePhones(text);

                expect(result.length).toBe(1);
                expect(result[0].normalized).toBe(`${prefix}1234567`);
            });
        });

        it('nên từ chối tiền tố 05x không hợp lệ', () => {
            const invalidPrefixes = ['050', '051', '052', '053', '054', '057'];

            invalidPrefixes.forEach((prefix) => {
                const text = `SĐT: ${prefix}1234567`;
                const result = detectVietnamesePhones(text);

                expect(result.length).toBe(0);
            });
        });

        it('nên chấp nhận tiền tố 07x (chỉ 0, 6, 7, 8, 9)', () => {
            const validPrefixes = ['070', '076', '077', '078', '079'];

            validPrefixes.forEach((prefix) => {
                const text = `SĐT: ${prefix}1234567`;
                const result = detectVietnamesePhones(text);

                expect(result.length).toBe(1);
                expect(result[0].normalized).toBe(`${prefix}1234567`);
            });
        });

        it('nên từ chối tiền tố 07x không hợp lệ', () => {
            const invalidPrefixes = ['071', '072', '073', '074', '075'];

            invalidPrefixes.forEach((prefix) => {
                const text = `SĐT: ${prefix}1234567`;
                const result = detectVietnamesePhones(text);

                expect(result.length).toBe(0);
            });
        });

        it('nên chấp nhận tiền tố 08x (chỉ 1-9, không có 0)', () => {
            const validPrefixes = ['081', '082', '083', '084', '085', '086', '087', '088', '089'];

            validPrefixes.forEach((prefix) => {
                const text = `SĐT: ${prefix}1234567`;
                const result = detectVietnamesePhones(text);

                expect(result.length).toBe(1);
                expect(result[0].normalized).toBe(`${prefix}1234567`);
            });
        });

        it('nên từ chối tiền tố 080', () => {
            const text = 'SĐT: 0801234567';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(0);
        });

        it('nên chấp nhận tiền tố 09x (tất cả chữ số)', () => {
            const prefixes = ['090', '091', '092', '093', '094', '095', '096', '097', '098', '099'];

            prefixes.forEach((prefix) => {
                const text = `SĐT: ${prefix}1234567`;
                const result = detectVietnamesePhones(text);

                expect(result.length).toBe(1);
                expect(result[0].normalized).toBe(`${prefix}1234567`);
            });
        });
    });

    describe('Nhiều số điện thoại / Multiple phone numbers', () => {
        it('nên phát hiện nhiều số điện thoại trong cùng văn bản', () => {
            const text = 'Liên hệ: 0386677607 hoặc 0886232456';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(2);
            expect(result[0].normalized).toBe('0386677607');
            expect(result[1].normalized).toBe('0886232456');
        });

        it('nên phát hiện số điện thoại với nhiều định dạng khác nhau', () => {
            const text = 'SĐT 1: 0386677607, SĐT 2: +84 886 232 456, SĐT 3: 84-956-123-789';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(3);
            expect(result[0].normalized).toBe('0386677607');
            expect(result[1].normalized).toBe('0886232456');
            expect(result[2].normalized).toBe('0956123789');
        });
    });

    describe('Loại bỏ trùng lặp / Deduplication', () => {
        it('nên loại bỏ số điện thoại trùng lặp', () => {
            const text = 'Liên hệ: 0386677607, hoặc gọi 0386677607';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(1);
            expect(result[0].normalized).toBe('0386677607');
        });

        it('nên loại bỏ số điện thoại trùng lặp với định dạng khác nhau', () => {
            const text = 'SĐT: 0386677607 hoặc +84386677607 hoặc 84 386 677 607';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(1);
            expect(result[0].normalized).toBe('0386677607');
        });
    });

    describe('Xử lý edge cases / Edge cases', () => {
        it('nên trả về mảng rỗng với văn bản rỗng', () => {
            const result = detectVietnamesePhones('');

            expect(result).toEqual([]);
        });

        it('nên trả về mảng rỗng với giá trị null', () => {
            const result = detectVietnamesePhones(null as any);

            expect(result).toEqual([]);
        });

        it('nên trả về mảng rỗng với giá trị undefined', () => {
            const result = detectVietnamesePhones(undefined as any);

            expect(result).toEqual([]);
        });

        it('nên trả về mảng rỗng với văn bản không chứa số điện thoại', () => {
            const text = 'Đây là văn bản không có số điện thoại nào cả.';
            const result = detectVietnamesePhones(text);

            expect(result).toEqual([]);
        });

        it('nên bỏ qua số điện thoại không đủ 10 chữ số', () => {
            const text = 'SĐT: 038667760';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(0);
        });

        it('nên bỏ qua số điện thoại quá 10 chữ số', () => {
            const text = 'SĐT: 03866776077';
            const result = detectVietnamesePhones(text);

            expect(result.length).toBe(0);
        });
    });

    describe('Các định dạng trong yêu cầu / Required formats', () => {
        const testCases: Array<{ input: string; expected: string }> = [
            { input: '0386677607', expected: '0386677607' },
            { input: '+84386677607', expected: '0386677607' },
            { input: '84386677607', expected: '0386677607' },
            { input: '0886-232-456', expected: '0886232456' },
            { input: '038 667 7607', expected: '0386677607' },
            { input: '038.6677.607', expected: '0386677607' },
            { input: '0386 - 677 607', expected: '0386677607' },
            { input: '+84 386 677 607', expected: '0386677607' },
            { input: '84-386-677-607', expected: '0386677607' }
        ];

        testCases.forEach(({ input, expected }) => {
            it(`nên phát hiện và chuẩn hóa: ${input} -> ${expected}`, () => {
                const result = detectVietnamesePhones(`Text: ${input}`);

                expect(result.length).toBe(1);
                expect(result[0].normalized).toBe(expected);
            });
        });
    });

    describe('Kịch bản thực tế / Real-world scenarios', () => {
        it('nên phát hiện số điện thoại trong CV text', () => {
            const cvText = `
                THÔNG TIN CÁ NHÂN
                Họ và tên: Nguyễn Văn A
                Điện thoại: 0386677607
                Email: nguyenvana@example.com
                
                KINH NGHIỆM LÀM VIỆC
                - Công ty ABC (2020-2023)
                  Liên hệ: +84 886 232 456
            `;
            const result = detectVietnamesePhones(cvText);

            expect(result.length).toBe(2);
            expect(result[0].normalized).toBe('0386677607');
            expect(result[1].normalized).toBe('0886232456');
        });

        it('nên phát hiện số điện thoại trong OCR text với nhiễu', () => {
            const ocrText = 'Liên hệ: 0386.677.607 hoặc gọi 84-886-232-456 để được tư vấn.';
            const result = detectVietnamesePhones(ocrText);

            expect(result.length).toBe(2);
            expect(result[0].normalized).toBe('0386677607');
            expect(result[1].normalized).toBe('0886232456');
        });
    });
});
