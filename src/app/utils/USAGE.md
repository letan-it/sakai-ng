# Utils - Hướng dẫn sử dụng / Usage Guide

Thư mục này chứa các utility functions được sử dụng trong toàn bộ ứng dụng.

## Modules

### phone-detector.ts

Phát hiện và chuẩn hóa số điện thoại di động Việt Nam từ văn bản tự do.

**Sử dụng:**

```typescript
import { detectVietnamesePhones } from '@/utils';

const text = 'Liên hệ: 0386677607 hoặc +84 886 232 456';
const phones = detectVietnamesePhones(text);
```

Xem thêm chi tiết trong file `README.md`.

### email-detector.ts

Phát hiện và chuẩn hóa địa chỉ email từ văn bản tự do.

**Sử dụng:**

```typescript
import { detectEmails } from '@/utils';

const text = 'Liên hệ: john.doe@example.com';
const emails = detectEmails(text);
```

### cv-matcher.ts

So sánh CV với Job Description và tính toán độ phù hợp.

**Sử dụng:**

```typescript
import { compareCV } from '@/utils';

const cvText = 'I have experience with JavaScript, React, and Node.js';
const requiredSkills = 'JavaScript, TypeScript, React';
const result = compareCV(cvText, requiredSkills);
```

**Cấu hình từ đồng nghĩa:**

Từ điển đồng nghĩa hiện tại được hardcode trong file `cv-matcher.ts`. Để cập nhật:

1. Mở file `src/app/utils/cv-matcher.ts`
2. Tìm constant `SKILL_SYNONYMS`
3. Thêm hoặc chỉnh sửa các entry

**Lưu ý:** Trong tương lai, có thể chuyển từ điển này sang file cấu hình JSON để dễ dàng cập nhật mà không cần thay đổi code.

## Testing

```bash
npm test
```

- `phone-detector.spec.ts` - 36 test cases
- `email-detector.spec.ts` - 24 test cases  
- `cv-matcher.spec.ts` - 21 test cases
