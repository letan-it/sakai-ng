/**
 * Cấu hình môi trường development
 *
 * LƯU Ý BẢO MẬT:
 * - Sử dụng Google Client ID riêng cho development environment
 * - KHÔNG commit Client ID vào public repository
 * - Xem docs/GOOGLE_OAUTH_SETUP.md để biết thêm chi tiết
 */
export const environment = {
    production: false,
    // TODO: Thay thế bằng Client ID riêng cho development của bạn
    googleClientId: '491059873053-tmgn1brvnhn77h70fm4l4qa2t46m72f3.apps.googleusercontent.com'
};
