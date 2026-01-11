import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Authentication Guard để bảo vệ các routes
 * Kiểm tra xem user đã đăng nhập hay chưa bằng cách kiểm tra localStorage
 */
export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    // Kiểm tra authentication status và user profile từ localStorage
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userProfileStr = localStorage.getItem('googleUserProfile');

    // Kiểm tra cả hai điều kiện để đảm bảo user đã đăng nhập
    if (isAuthenticated && userProfileStr) {
        try {
            // Parse user profile để verify nó không bị corrupt
            const userProfile = JSON.parse(userProfileStr);

            // Kiểm tra các trường bắt buộc
            if (userProfile && userProfile.token && userProfile.id) {
                // TODO: Trong production nên verify token expiry ở đây
                // Ví dụ: const tokenExpiry = parseJwt(userProfile.token).exp;
                // if (tokenExpiry && Date.now() >= tokenExpiry * 1000) {
                //     // Token đã hết hạn
                //     clearAuthentication();
                //     router.navigate(['/auth/login']);
                //     return false;
                // }

                return true;
            }
        } catch (error) {
            // Nếu có lỗi khi parse JSON, xóa dữ liệu corrupt
            console.error('Lỗi khi parse user profile:', error);
            clearAuthentication();
        }
    }

    // Lưu URL hiện tại để có thể redirect sau khi login
    localStorage.setItem('redirectUrl', state.url);

    // Redirect về login page
    router.navigate(['/auth/login']);

    return false;
};

/**
 * Helper function để xóa authentication data
 * TODO: Trong tương lai nên tạo shared authentication service
 * để tránh code duplication với handleLogout() trong app.topbar.ts
 */
function clearAuthentication() {
    localStorage.removeItem('googleUserProfile');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authMethod');
}
