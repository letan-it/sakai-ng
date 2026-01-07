/**
 * Kết quả phát hiện email
 * Result of email detection
 */
export interface EmailDetectionResult {
    original: string;
    normalized: string;
}

/**
 * Phát hiện và chuẩn hóa địa chỉ email từ văn bản tự do
 * Detect and normalize email addresses from free text
 *
 * @param text - Văn bản đầu vào (CV, OCR text, user input)
 * @returns Mảng các email đã được phát hiện và chuẩn hóa
 *
 * @example
 * ```ts
 * const text = 'Liên hệ: john.doe@example.com hoặc jane@company.co.uk';
 * const emails = detectEmails(text);
 * // emails = [
 * //   { original: 'john.doe@example.com', normalized: 'john.doe@example.com' },
 * //   { original: 'jane@company.co.uk', normalized: 'jane@company.co.uk' }
 * // ]
 * ```
 */
export function detectEmails(text: string): EmailDetectionResult[] {
    if (!text || typeof text !== 'string') {
        return [];
    }

    // Regex để phát hiện email với các định dạng khác nhau
    // Email detection regex supporting various formats
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    const matches = text.match(emailRegex);

    if (!matches || matches.length === 0) {
        return [];
    }

    const results: EmailDetectionResult[] = [];
    const normalizedSet = new Set<string>();

    for (const match of matches) {
        const normalized = normalizeEmail(match);

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
 * Chuẩn hóa địa chỉ email (chuyển về chữ thường)
 * Normalize email address (convert to lowercase)
 *
 * @param email - Email gốc
 * @returns Email đã chuẩn hóa
 */
function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}
