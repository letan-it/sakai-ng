import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

interface TranslationItem {
    key: string;
    vi: string;
    en: string;
}

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private translate = inject(TranslateService);
    private readonly DYNAMIC_TRANSLATIONS_KEY = 'dynamic_translations';

    constructor() {
        // Khởi tạo ngôn ngữ mặc định
        const savedLang = localStorage.getItem('lang') || 'vi';
        this.translate.addLangs(['en', 'vi']);
        this.translate.setDefaultLang('vi');
        
        // Load translations from localStorage if available
        this.loadStoredTranslations();
        
        this.translate.use(savedLang);

        // Fetch new translations from "API"
        this.fetchTranslations().subscribe();
    }

    /**
     * Giả lập gọi API lấy dữ liệu ngôn ngữ
     */
    private fetchTranslations() {
        const mockData: TranslationItem[] = [
            { key: 'COMMON.SAVE', vi: 'Lưu', en: 'Save' },
            { key: 'COMMON.CANCEL', vi: 'Hủy', en: 'Cancel' },
            { key: 'LOGIN.REMEMBER_ME', vi: 'Ghi nhớ tôi', en: '' }, // Test fallback
            { key: 'TOPBAR.SEARCH_PLACEHOLDER', vi: 'Tìm kiếm...', en: 'Search...' },
            { key: 'LOGIN.SUBTITLE', vi: 'Chào mừng bạn đến với ứng dụng của chúng tôi', en: 'Welcome to our application' },
            { key: 'LOGIN.WELCOME', vi: 'Chào mừng', en: 'Welcome' },
            { key: 'LOGIN.SUBTITLE', vi: 'Đăng nhập vào tài khoản để tiếp tục', en: 'Login to your account to continue' },
            { key: 'LOGIN.EMAIL', vi: 'Địa chỉ Email', en: 'Email Address' },
            { key: 'LOGIN.PASSWORD', vi: 'Mật khẩu', en: 'Password' },
            { key: 'LOGIN.REMEMBER_ME', vi: 'Ghi nhớ tôi', en: 'Remember me' },
            { key: 'LOGIN.FORGOT_PASSWORD', vi: 'Quên mật khẩu?', en: 'Forgot Password?' },
            { key: 'LOGIN.SIGN_IN', vi: 'ĐĂNG NHẬP', en: 'SIGN IN' },
            { key: 'LOGIN.OR', vi: 'HOẶC', en: 'OR' },
            { key: 'LOGIN.SIGN_IN_GOOGLE', vi: 'Đăng nhập với Google', en: 'Sign in with Google' },
            { key: 'LOGIN.NO_ACCOUNT', vi: 'Bạn chưa có tài khoản?', en: 'Don\'t have an account?' },
            { key: 'LOGIN.SIGN_UP_NOW', vi: 'Đăng ký ngay', en: 'Sign Up Now' },
            { key: 'TOPBAR.CALENDAR', vi: 'Lịch', en: 'Calendar' },
            { key: 'TOPBAR.MESSAGES', vi: 'Tin nhắn', en: 'Messages' },
            { key: 'TOPBAR.PROFILE', vi: 'Hồ sơ', en: 'Profile' },
            { key: 'TOPBAR.LOGOUT', vi: 'Đăng xuất', en: 'Logout' },
            { key: 'TOPBAR.USER_ID', vi: 'ID người dùng', en: 'User ID' },
            { key: 'COMMON.SEARCH', vi: 'Tìm kiếm...', en: 'Search...' },
            { key: 'COMMON.NOTIFICATION', vi: 'Thông báo', en: 'Notification' }

        ];

        // Giả lập độ trễ mạng
        return of(mockData).pipe(
            delay(1000),
            tap((data) => this.processTranslations(data))
        );
    }

    /**
     * Xử lý dữ liệu từ API và lưu trữ
     */
    private processTranslations(data: TranslationItem[]) {
        const viTranslations: any = {};
        const enTranslations: any = {};

        data.forEach(item => {
            viTranslations[item.key] = item.vi;
            // Logic: Nếu en không có hoặc null hoặc '' thì lấy vi
            enTranslations[item.key] = (item.en && item.en.trim() !== '') ? item.en : item.vi;
        });

        // Áp dụng vào TranslateService
        this.translate.setTranslation('vi', viTranslations, true);
        this.translate.setTranslation('en', enTranslations, true);

        // Lưu vào localStorage
        localStorage.setItem(this.DYNAMIC_TRANSLATIONS_KEY, JSON.stringify({ vi: viTranslations, en: enTranslations }));
        console.log('[LanguageService] Đã cập nhật dynamic translations từ API');
    }

    /**
     * Tải dữ liệu đã lưu từ localStorage
     */
    private loadStoredTranslations() {
        const stored = localStorage.getItem(this.DYNAMIC_TRANSLATIONS_KEY);
        if (stored) {
            try {
                const { vi, en } = JSON.parse(stored);
                this.translate.setTranslation('vi', vi, true);
                this.translate.setTranslation('en', en, true);
                console.log('[LanguageService] Đã nạp dynamic translations từ localStorage');
            } catch (e) {
                console.error('[LanguageService] Lỗi khi nạp stored translations:', e);
            }
        }
    }

    /**
     * Thay đổi ngôn ngữ
     * @param lang 'en' | 'vi'
     */
    changeLanguage(lang: string) {
        this.translate.use(lang);
        localStorage.setItem('lang', lang);
    }

    /**
     * Lấy ngôn ngữ hiện tại
     */
    getCurrentLanguage(): string {
        return this.translate.currentLang || 'vi';
    }
}
