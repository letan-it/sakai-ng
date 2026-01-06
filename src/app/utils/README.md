# Vietnamese Phone Number Detector

Hàm tiện ích để phát hiện và chuẩn hóa số điện thoại di động Việt Nam từ văn bản tự do.

## Cài đặt / Installation

```typescript
import { detectVietnamesePhones } from '@/utils/phone-detector';
```

## Sử dụng / Usage

### Ví dụ cơ bản / Basic Example

```typescript
const text = 'Liên hệ: 0386677607 hoặc +84 886 232 456';
const phones = detectVietnamesePhones(text);

console.log(phones);
// Output:
// [
//   { original: '0386677607', normalized: '0386677607' },
//   { original: '+84 886 232 456', normalized: '0886232456' }
// ]
```

### Xử lý CV text / Processing CV Text

```typescript
const cvText = `
    THÔNG TIN CÁ NHÂN
    Họ và tên: Nguyễn Văn A
    Điện thoại: 0386677607
    Email: nguyenvana@example.com
    
    KINH NGHIỆM LÀM VIỆC
    - Công ty ABC (2020-2023)
      Liên hệ: +84 886 232 456
`;

const phones = detectVietnamesePhones(cvText);

console.log(phones);
// Output:
// [
//   { original: '0386677607', normalized: '0386677607' },
//   { original: '+84 886 232 456', normalized: '0886232456' }
// ]
```

### Xử lý OCR text / Processing OCR Text

```typescript
const ocrText = 'Liên hệ: 0386.677.607 hoặc gọi 84-886-232-456 để được tư vấn.';
const phones = detectVietnamesePhones(ocrText);

console.log(phones);
// Output:
// [
//   { original: '0386.677.607', normalized: '0386677607' },
//   { original: '84-886-232-456', normalized: '0886232456' }
// ]
```

### Loại bỏ trùng lặp / Duplicate Removal

```typescript
const text = 'SĐT: 0386677607 hoặc +84386677607 hoặc 84 386 677 607';
const phones = detectVietnamesePhones(text);

console.log(phones);
// Output:
// [
//   { original: '0386677607', normalized: '0386677607' }
// ]
// Chỉ trả về 1 số vì các số điện thoại đều giống nhau sau khi chuẩn hóa
```

## Định dạng được hỗ trợ / Supported Formats

Hàm hỗ trợ các định dạng sau:

- `0xxxxxxxxx` - Định dạng Việt Nam chuẩn
- `84xxxxxxxxx` - Mã quốc gia không có dấu +
- `+84xxxxxxxxx` - Mã quốc gia có dấu +

Với các ký tự phân cách:
- Khoảng trắng: `038 667 7607`
- Dấu gạch ngang: `038-667-7607`
- Dấu chấm: `038.667.7607`
- Hỗn hợp: `0386 - 677 607`

## Tiền tố hợp lệ / Valid Prefixes

- `03x` - Tất cả các số từ 0-9 (030-039)
- `05x` - Chỉ 5, 6, 8, 9 (055, 056, 058, 059)
- `07x` - Chỉ 0, 6, 7, 8, 9 (070, 076, 077, 078, 079)
- `08x` - Chỉ 1-9 (081-089)
- `09x` - Tất cả các số từ 0-9 (090-099)

## API

### `detectVietnamesePhones(text: string): PhoneDetectionResult[]`

**Parameters:**
- `text: string` - Văn bản đầu vào cần phát hiện số điện thoại

**Returns:**
- `PhoneDetectionResult[]` - Mảng các kết quả phát hiện

**PhoneDetectionResult:**
```typescript
interface PhoneDetectionResult {
    original: string;    // Số điện thoại gốc từ văn bản
    normalized: string;  // Số điện thoại đã chuẩn hóa về định dạng 0xxxxxxxxx
}
```

## Kiểm tra / Testing

```bash
npm test
```

## Lưu ý / Notes

- Hàm tự động loại bỏ các số điện thoại trùng lặp
- Số điện thoại được chuẩn hóa về định dạng `0xxxxxxxxx` (10 chữ số)
- Chỉ phát hiện số điện thoại di động Việt Nam (không hỗ trợ số cố định)
- Hàm không cần thư viện bên ngoài, chỉ sử dụng JavaScript/TypeScript thuần
