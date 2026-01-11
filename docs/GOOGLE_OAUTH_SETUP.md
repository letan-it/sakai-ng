# Hướng dẫn cấu hình Google OAuth cho Sakai-NG

## Tổng quan

Ứng dụng này sử dụng Google OAuth 2.0 để cho phép người dùng đăng nhập bằng tài khoản Google của họ. Tài liệu này mô tả cách cấu hình Google OAuth để chức năng đăng nhập hoạt động chính xác.

## Yêu cầu

- Tài khoản Google Cloud Platform (GCP)
- Quyền truy cập để tạo và quản lý OAuth 2.0 Client IDs

## Các bước cấu hình

### 1. Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo một project mới hoặc chọn project hiện có
3. Enable **Google+ API** cho project của bạn

### 2. Cấu hình OAuth Consent Screen

1. Trong Google Cloud Console, đi tới **APIs & Services** > **OAuth consent screen**
2. Chọn **External** (hoặc **Internal** nếu bạn đang sử dụng Google Workspace)
3. Điền thông tin ứng dụng:
   - **App name**: AI Agents - Lê Tấn (hoặc tên khác)
   - **User support email**: Email của bạn
   - **Developer contact information**: Email của bạn
4. Thêm các scopes cần thiết:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
5. Lưu và tiếp tục

### 3. Tạo OAuth 2.0 Client ID

1. Đi tới **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Chọn **Application type**: **Web application**
4. Điền thông tin:
   - **Name**: Sakai-NG OAuth Client (hoặc tên khác)
   
5. **Authorized JavaScript origins** (quan trọng!):
   - Development: `http://localhost:4200`
   - Production: `https://your-domain.com`
   - Nếu deploy trên Vercel: `https://your-app.vercel.app`
   
6. **Authorized redirect URIs**:
   - Development: `http://localhost:4200`
   - Production: `https://your-domain.com`
   - Nếu deploy trên Vercel: `https://your-app.vercel.app`

7. Click **Create**
8. Lưu lại **Client ID** được tạo ra

### 4. Cập nhật Client ID trong ứng dụng

Có 2 cách để cấu hình Client ID:

#### Cách 1: Sử dụng Environment Variables (Khuyến nghị)

1. Mở file `src/environments/environment.ts` (cho development):
```typescript
export const environment = {
    production: false,
    googleClientId: 'YOUR-CLIENT-ID-HERE.apps.googleusercontent.com'
};
```

2. Mở file `src/environments/environment.prod.ts` (cho production):
```typescript
export const environment = {
    production: true,
    googleClientId: 'YOUR-PRODUCTION-CLIENT-ID-HERE.apps.googleusercontent.com'
};
```

#### Cách 2: Sử dụng Environment Variables của Hosting Platform

Nếu bạn deploy trên Vercel, Netlify, hoặc platform khác:

1. Thêm environment variable `GOOGLE_CLIENT_ID` trong platform settings
2. Cập nhật `environment.prod.ts` để sử dụng:
```typescript
export const environment = {
    production: true,
    googleClientId: process.env['GOOGLE_CLIENT_ID'] || 'fallback-client-id'
};
```

### 5. Testing

#### Development Environment

```bash
npm start
# Hoặc
ng serve
```

Truy cập `http://localhost:4200/auth/login` và test chức năng Google login.

#### Production Build

```bash
npm run build
```

Verify build thành công và không có errors liên quan đến environment configuration.

## Troubleshooting

### Lỗi: "Invalid Client ID"

**Nguyên nhân**: Client ID không chính xác hoặc chưa được cấu hình.

**Giải pháp**:
- Kiểm tra lại Client ID trong `environment.ts`
- Đảm bảo không có khoảng trắng thừa
- Xác nhận Client ID có đuôi `.apps.googleusercontent.com`

### Lỗi: "Redirect URI mismatch"

**Nguyên nhân**: URL hiện tại không nằm trong danh sách Authorized JavaScript origins.

**Giải pháp**:
1. Vào Google Cloud Console > Credentials
2. Chỉnh sửa OAuth 2.0 Client
3. Thêm URL hiện tại vào **Authorized JavaScript origins**
4. Đợi vài phút để thay đổi có hiệu lực

### Lỗi: "Google Identity Services không load được"

**Nguyên nhân**: 
- Kết nối internet bị chặn
- Content Security Policy quá strict
- Ad blocker/Privacy extensions đang chặn

**Giải pháp**:
- Kiểm tra console logs trong browser DevTools
- Tắt ad blocker/privacy extensions
- Kiểm tra CSP headers trong `index.html`
- Verify script tag: `<script src="https://accounts.google.com/gsi/client" async defer></script>`

### Button "Login with Google" không phản hồi

**Nguyên nhân**: Google API chưa load xong khi user click.

**Giải pháp**: 
- Ứng dụng đã implement retry logic tự động
- Nếu vẫn không hoạt động, reload trang và thử lại
- Kiểm tra console logs để xem thông báo lỗi cụ thể

## Best Practices

### Bảo mật

1. **Không commit Client ID vào source control nếu là private project**
   - Sử dụng environment variables
   - Thêm `environment*.ts` vào `.gitignore` nếu cần

2. **Giới hạn Authorized JavaScript origins**
   - Chỉ thêm domains thực sự cần thiết
   - Xóa các test domains khi không dùng nữa

3. **Rotate Client ID định kỳ**
   - Tạo Client ID mới mỗi 6-12 tháng
   - Cập nhật ứng dụng trước khi disable Client ID cũ

### Performance

1. **Preconnect to Google domains**
   - Đã được cấu hình trong `index.html`:
   ```html
   <link rel="preconnect" href="https://accounts.google.com" />
   ```

2. **Async loading của Google script**
   - Script được load với `async defer` attributes
   - Component có retry logic để đợi script load xong

### User Experience

1. **Loading states**
   - Button hiển thị "Đang kết nối..." khi đang xử lý
   - Toast notifications cho user feedback

2. **Error handling**
   - Tất cả lỗi đều hiển thị thông báo thân thiện cho user
   - Console logs chi tiết để debug

## Support

Nếu gặp vấn đề, kiểm tra:

1. Browser console logs
2. Network tab trong DevTools
3. Google Cloud Console > Logs
4. [Google Identity Services documentation](https://developers.google.com/identity/gsi/web)

## Changelog

### Version 1.0 (2026-01-11)
- Initial implementation với environment configuration
- Error handling và retry logic
- Loading states cho better UX
- Content Security Policy configuration
- Comprehensive logging
