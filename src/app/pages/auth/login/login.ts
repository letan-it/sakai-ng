import { Component, OnInit, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { TranslateModule } from '@ngx-translate/core';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';

// Định nghĩa interface cho Google Identity Services
declare const google: any;

interface GoogleUserProfile {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    token: string;
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, TranslateModule],
    templateUrl: './login.html',
    styleUrls: ['./login.scss']
})
export class Login implements OnInit, AfterViewInit {
    email: string = '';

    password: string = '';

    checked: boolean = false;

    googleButtonRendered: boolean = false;

    private router = inject(Router);

    private platformId = inject(PLATFORM_ID);

    private readonly GOOGLE_CLIENT_ID = '478210539-cfbfeaorngqplsad1agd078rs5e8nudr.apps.googleusercontent.com';

    private initAttempts = 0;

    private readonly MAX_INIT_ATTEMPTS = 10;

    ngOnInit() {
        // Chỉ khởi tạo Google Sign-In khi chạy trong browser
        if (isPlatformBrowser(this.platformId)) {
            console.log('[Google SSO] Bắt đầu khởi tạo Google Sign-In...');
            this.loadGoogleScript();
        }
    }

    ngAfterViewInit() {
        // Đảm bảo DOM đã sẵn sàng trước khi render button
        if (isPlatformBrowser(this.platformId)) {
            console.log('[Google SSO] AfterViewInit - DOM đã sẵn sàng');
            setTimeout(() => {
                this.initGoogleSignIn();
            }, 100);
        }
    }

    /**
     * Kiểm tra và load Google Identity Services script
     */
    private loadGoogleScript(): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('[Google SSO] Kiểm tra Google Identity Services script...');

            // Kiểm tra xem script đã được load chưa
            if (typeof google !== 'undefined' && google.accounts) {
                console.log('[Google SSO] Script đã được load sẵn');
                resolve();

                return;
            }

            // Tìm script tag hiện có
            const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');

            if (existingScript) {
                console.log('[Google SSO] Script tag đã tồn tại, chờ load...');
                // Script đã tồn tại, chờ nó load
                existingScript.addEventListener('load', () => {
                    console.log('[Google SSO] Script đã load thành công');
                    resolve();
                });
                existingScript.addEventListener('error', (error) => {
                    console.error('[Google SSO] Lỗi khi load script:', error);
                    reject(error);
                });
            } else {
                console.warn('[Google SSO] Script tag không tồn tại trong HTML, tạo mới...');
                // Tạo script tag mới nếu chưa có
                const script = document.createElement('script');

                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    console.log('[Google SSO] Script mới đã load thành công');
                    resolve();
                };
                script.onerror = (error) => {
                    console.error('[Google SSO] Lỗi khi load script mới:', error);
                    reject(error);
                };
                document.head.appendChild(script);
            }

            // Timeout sau 10 giây
            setTimeout(() => {
                if (typeof google === 'undefined' || !google.accounts) {
                    console.error('[Google SSO] Timeout: Script không load sau 10 giây');
                    reject(new Error('Google script load timeout'));
                }
            }, 10000);
        });
    }

    /**
     * Khởi tạo Google OAuth client
     */
    private initGoogleSignIn() {
        this.initAttempts++;
        console.log(`[Google SSO] Lần thử khởi tạo #${this.initAttempts}`);

        if (typeof google !== 'undefined' && google.accounts) {
            try {
                console.log('[Google SSO] Đang khởi tạo Google Identity Services...');
                google.accounts.id.initialize({
                    client_id: this.GOOGLE_CLIENT_ID,
                    callback: this.handleGoogleCallback.bind(this),
                    auto_select: false,
                    cancel_on_tap_outside: true,
                    ux_mode: 'popup' // Sử dụng popup mode thay vì redirect
                });
                console.log('[Google SSO] Khởi tạo thành công, đang render button...');
                this.renderGoogleButton();
            } catch (error) {
                console.error('[Google SSO] Lỗi khi khởi tạo:', error);
                this.handleError(error);
            }
        } else {
            // Nếu script chưa load, thử lại
            if (this.initAttempts < this.MAX_INIT_ATTEMPTS) {
                console.log('[Google SSO] Script chưa sẵn sàng, thử lại sau 500ms...');
                setTimeout(() => this.initGoogleSignIn(), 500);
            } else {
                console.error('[Google SSO] Đã vượt quá số lần thử tối đa');
                alert('Không thể tải Google Sign-In. Vui lòng tải lại trang.');
            }
        }
    }

    /**
     * Render Google Sign-In button chính thức
     */
    private renderGoogleButton() {
        const buttonDiv = document.getElementById('googleSignInDiv');

        if (!buttonDiv) {
            console.error('[Google SSO] Không tìm thấy container #googleSignInDiv');

            return;
        }

        if (typeof google === 'undefined' || !google.accounts) {
            console.error('[Google SSO] Google accounts object không tồn tại');

            return;
        }

        try {
            console.log('[Google SSO] Đang render button chính thức của Google...');
            google.accounts.id.renderButton(buttonDiv, {
                theme: 'outline',
                size: 'large',
                width: buttonDiv.offsetWidth || 400,
                text: 'signin_with',
                shape: 'rectangular',
                logo_alignment: 'left'
            });
            this.googleButtonRendered = true;
            console.log('[Google SSO] Button đã được render thành công');
        } catch (error) {
            console.error('[Google SSO] Lỗi khi render button:', error);
            console.log('[Google SSO] Sẽ sử dụng custom button làm fallback');
            this.googleButtonRendered = false;
        }
    }

    /**
     * Xử lý khi user click custom button "Login with Google"
     */
    handleGoogleSignIn() {
        console.log('[Google SSO] User click vào custom Google button');

        if (typeof google !== 'undefined' && google.accounts) {
            try {
                console.log('[Google SSO] Đang hiển thị Google One Tap...');
                // Sử dụng prompt với callback để xử lý các trường hợp không hiển thị
                google.accounts.id.prompt((notification: any) => {
                    if (notification.isNotDisplayed()) {
                        console.warn('[Google SSO] One Tap không được hiển thị:', notification.getNotDisplayedReason());
                        console.log('[Google SSO] Lý do:', notification.getNotDisplayedReason());

                        // Thử render button nếu chưa có
                        if (!this.googleButtonRendered) {
                            console.log('[Google SSO] Thử render button chính thức...');
                            this.renderGoogleButton();
                        }

                        // Hiển thị thông báo cho user
                        alert('Popup Google Sign-In có thể bị chặn bởi browser. Vui lòng:\n1. Cho phép popup từ trang này\n2. Hoặc sử dụng button Google chính thức ở trên\n3. Hoặc thử lại');
                    } else if (notification.isSkippedMoment()) {
                        console.log('[Google SSO] User đã skip One Tap moment');
                    } else {
                        console.log('[Google SSO] One Tap hiển thị thành công');
                    }
                });
            } catch (error) {
                console.error('[Google SSO] Lỗi khi gọi prompt():', error);
                this.handleError(error);
            }
        } else {
            console.error('[Google SSO] Google Identity Services chưa được load');
            alert('Google Sign-In chưa sẵn sàng. Vui lòng tải lại trang hoặc thử lại sau.');
        }
    }

    /**
     * Xử lý response từ Google sau khi đăng nhập thành công
     */
    handleGoogleCallback(response: any) {
        try {
            if (response.credential) {
                // Decode JWT token để lấy thông tin user
                const payload = this.parseJwt(response.credential);

                const userProfile: GoogleUserProfile = {
                    id: payload.sub,
                    name: payload.name,
                    email: payload.email,
                    imageUrl: payload.picture,
                    token: response.credential
                };

                // Lưu profile vào localStorage
                this.saveUserProfile(userProfile);

                // Điều hướng về trang chính
                this.router.navigate(['/']);
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    /**
     * Parse JWT token để lấy payload
     */
    private parseJwt(token: string): any {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            return JSON.parse(jsonPayload);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    /**
     * Lưu user profile vào localStorage
     */
    private saveUserProfile(profile: GoogleUserProfile) {
        try {
            localStorage.setItem('googleUserProfile', JSON.stringify(profile));
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('authMethod', 'google');
        } catch (error) {
            console.error('Lỗi khi lưu profile vào localStorage:', error);
            throw error;
        }
    }

    /**
     * Xử lý các lỗi
     */
    private handleError(error: any) {
        console.error('Lỗi đăng nhập Google:', error);

        let errorMessage = 'Đã xảy ra lỗi khi đăng nhập với Google';

        if (error.message === 'Invalid token') {
            errorMessage = 'Token không hợp lệ. Vui lòng thử lại.';
        } else if (error.type === 'popup_closed') {
            errorMessage = 'Cửa sổ đăng nhập đã bị đóng. Vui lòng thử lại.';
        } else if (error.type === 'access_denied') {
            errorMessage = 'Bạn đã từ chối cấp quyền. Vui lòng thử lại và cho phép truy cập.';
        }

        // Hiển thị thông báo lỗi cho user
        alert(errorMessage);
    }
}
