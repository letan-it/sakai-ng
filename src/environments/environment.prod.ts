/**
 * Cấu hình môi trường production
 * 
 * LƯU Ý BẢO MẬT:
 * - Sử dụng Google Client ID KHÁC với development environment
 * - Cân nhắc sử dụng environment variables thay vì hardcode
 * - Xem docs/GOOGLE_OAUTH_SETUP.md để biết thêm chi tiết
 */
export const environment = {
    production: true,
    // TODO: Thay thế bằng Client ID riêng cho production của bạn
    // Khuyến nghị: Sử dụng environment variables từ hosting platform
    googleClientId: '478210539-cfbfeaorngqplsad1agd078rs5e8nudr.apps.googleusercontent.com'
};
