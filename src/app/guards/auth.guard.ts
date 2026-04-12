import { CanActivateFn } from '@angular/router';

/**
 * Authentication Guard - đã tắt xác thực, cho phép truy cập trực tiếp
 */
export const authGuard: CanActivateFn = () => {
    return true;
};
