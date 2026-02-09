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
    googleClientId: '491059873053-tmgn1brvnhn77h70fm4l4qa2t46m72f3.apps.googleusercontent.com'
};
