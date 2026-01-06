/**
 * Kết quả phát hiện số điện thoại
 * Result of phone number detection
 */
export interface PhoneDetectionResult {
    original: string;
    normalized: string;
}

/**
 * Phát hiện và chuẩn hóa số điện thoại di động Việt Nam từ văn bản tự do
 * Detect and normalize Vietnamese mobile phone numbers from free text
 *
 * @param text - Văn bản đầu vào (CV, OCR text, user input)
 * @returns Mảng các số điện thoại đã được phát hiện và chuẩn hóa
 *
 * @example
 * ```ts
 * const text = 'Liên hệ: 0386677607 hoặc +84 886 232 456';
 * const phones = detectVietnamesePhones(text);
 * // phones = [
 * //   { original: '0386677607', normalized: '0386677607' },
 * //   { original: '+84 886 232 456', normalized: '0886232456' }
 * // ]
 * ```
 */
export function detectVietnamesePhones(text: string): PhoneDetectionResult[] {
    if (!text || typeof text !== 'string') {
        return [];
    }

    // Regex để phát hiện số điện thoại Việt Nam với các định dạng khác nhau
    // Vietnamese phone number detection regex supporting multiple formats
    //
    // Hỗ trợ các tiền tố hợp lệ:
    // - 03x (các số từ 0-9)
    // - 05x (chỉ 5, 6, 8, 9)
    // - 07x (chỉ 0, 6, 7, 8, 9)
    // - 08x (các số từ 1-9)
    // - 09x (các số từ 0-9)
    //
    // Hỗ trợ mã quốc gia:
    // - 0xxxxxxxxx
    // - 84xxxxxxxxx
    // - +84xxxxxxxxx
    //
    // Hỗ trợ các ký tự phân cách: khoảng trắng, dấu gạch ngang (-), dấu chấm (.)
    const phoneRegex = /(?:\+?84|0)[\s.-]*(?:3[0-9]|5[5689]|7[06789]|8[1-9]|9[0-9])(?:[\s.-]*\d){7}\b/g;

    const matches = text.match(phoneRegex);

    if (!matches || matches.length === 0) {
        return [];
    }

    const results: PhoneDetectionResult[] = [];
    const normalizedSet = new Set<string>();

    for (const match of matches) {
        const normalized = normalizePhoneNumber(match);

        // Kiểm tra số điện thoại có đúng 10 chữ số sau khi loại bỏ ký tự phân cách
        // Verify the phone number has exactly 10 digits after removing separators
        if (normalized && !normalizedSet.has(normalized)) {
            normalizedSet.add(normalized);
            results.push({
                original: match,
                normalized: normalized
            });
        }
    }

    return results;
}

/**
 * Chuẩn hóa số điện thoại về định dạng 0xxxxxxxxx
 * Normalize phone number to 0xxxxxxxxx format
 *
 * @param phone - Số điện thoại gốc
 * @returns Số điện thoại đã chuẩn hóa hoặc null nếu không hợp lệ
 */
function normalizePhoneNumber(phone: string): string | null {
    // Loại bỏ tất cả ký tự phân cách (khoảng trắng, dấu gạch ngang, dấu chấm)
    // Remove all separators (spaces, dashes, dots)
    let cleaned = phone.replace(/[\s.-]/g, '');

    // Xử lý mã quốc gia
    // Handle country code
    if (cleaned.startsWith('+84')) {
        cleaned = '0' + cleaned.substring(3);
    } else if (cleaned.startsWith('84')) {
        cleaned = '0' + cleaned.substring(2);
    }

    // Kiểm tra độ dài phải là 10 chữ số
    // Verify length must be exactly 10 digits
    if (cleaned.length !== 10) {
        return null;
    }

    // Kiểm tra số điện thoại bắt đầu bằng 0 và tiền tố hợp lệ
    // Verify phone starts with 0 and has valid prefix
    if (!cleaned.startsWith('0')) {
        return null;
    }

    // Kiểm tra tiền tố hợp lệ (03x, 05x (5689), 07x (06-9), 08x (1-9), 09x)
    // Verify valid prefixes
    const prefix = cleaned.substring(0, 3);
    const thirdDigit = cleaned.charAt(2);

    if (prefix.startsWith('03')) {
        // 03x - tất cả các số từ 0-9 đều hợp lệ
        return cleaned;
    } else if (prefix.startsWith('05')) {
        // 05x - chỉ 5, 6, 8, 9
        if ('5689'.includes(thirdDigit)) {
            return cleaned;
        }
    } else if (prefix.startsWith('07')) {
        // 07x - chỉ 0, 6, 7, 8, 9
        if ('06789'.includes(thirdDigit)) {
            return cleaned;
        }
    } else if (prefix.startsWith('08')) {
        // 08x - các số từ 1-9
        if (thirdDigit >= '1' && thirdDigit <= '9') {
            return cleaned;
        }
    } else if (prefix.startsWith('09')) {
        // 09x - tất cả các số từ 0-9 đều hợp lệ
        return cleaned;
    }

    return null;
}
