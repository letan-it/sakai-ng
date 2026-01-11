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
    googleClientId: '478210539-cfbfeaorngqplsad1agd078rs5e8nudr.apps.googleusercontent.com'
};
