import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { GoogleUserProfile } from '../../models/google-user-profile.model';
import { environment } from '../../../environments/environment';

// Định nghĩa interface cho Google Identity Services
declare const google: any;

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ToastModule, DialogModule, AppFloatingConfigurator],
    providers: [MessageService],
    template: `
        <p-toast />
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-8 w-16 shrink-0 mx-auto">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M17.1637 19.2467C17.1566 19.4033 17.1529 19.561 17.1529 19.7194C17.1529 25.3503 21.7203 29.915 27.3546 29.915C32.9887 29.915 37.5561 25.3503 37.5561 19.7194C37.5561 19.5572 37.5524 19.3959 37.5449 19.2355C38.5617 19.0801 39.5759 18.9013 40.5867 18.6994L40.6926 18.6782C40.7191 19.0218 40.7326 19.369 40.7326 19.7194C40.7326 27.1036 34.743 33.0896 27.3546 33.0896C19.966 33.0896 13.9765 27.1036 13.9765 19.7194C13.9765 19.374 13.9896 19.0316 14.0154 18.6927L14.0486 18.6994C15.0837 18.9062 16.1223 19.0886 17.1637 19.2467ZM33.3284 11.4538C31.6493 10.2396 29.5855 9.52381 27.3546 9.52381C25.1195 9.52381 23.0524 10.2421 21.3717 11.4603C20.0078 11.3232 18.6475 11.1387 17.2933 10.907C19.7453 8.11308 23.3438 6.34921 27.3546 6.34921C31.36 6.34921 34.9543 8.10844 37.4061 10.896C36.0521 11.1292 34.692 11.3152 33.3284 11.4538ZM43.826 18.0518C43.881 18.6003 43.9091 19.1566 43.9091 19.7194C43.9091 28.8568 36.4973 36.2642 27.3546 36.2642C18.2117 36.2642 10.8 28.8568 10.8 19.7194C10.8 19.1615 10.8276 18.61 10.8816 18.0663L7.75383 17.4411C7.66775 18.1886 7.62354 18.9488 7.62354 19.7194C7.62354 30.6102 16.4574 39.4388 27.3546 39.4388C38.2517 39.4388 47.0855 30.6102 47.0855 19.7194C47.0855 18.9439 47.0407 18.1789 46.9536 17.4267L43.826 18.0518ZM44.2613 9.54743L40.9084 10.2176C37.9134 5.95821 32.9593 3.1746 27.3546 3.1746C21.7442 3.1746 16.7856 5.96385 13.7915 10.2305L10.4399 9.56057C13.892 3.83178 20.1756 0 27.3546 0C34.5281 0 40.8075 3.82591 44.2613 9.54743Z"
                                    fill="var(--primary-color)"
                                />
                                <mask id="mask0_1413_1551" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="8" width="54" height="11">
                                    <path d="M27 18.3652C10.5114 19.1944 0 8.88892 0 8.88892C0 8.88892 16.5176 14.5866 27 14.5866C37.4824 14.5866 54 8.88892 54 8.88892C54 8.88892 43.4886 17.5361 27 18.3652Z" fill="var(--primary-color)" />
                                </mask>
                                <g mask="url(#mask0_1413_1551)">
                                    <path
                                        d="M-4.673e-05 8.88887L3.73084 -1.91434L-8.00806 17.0473L-4.673e-05 8.88887ZM27 18.3652L26.4253 6.95109L27 18.3652ZM54 8.88887L61.2673 17.7127L50.2691 -1.91434L54 8.88887ZM-4.673e-05 8.88887C-8.00806 17.0473 -8.00469 17.0505 -8.00132 17.0538C-8.00018 17.055 -7.99675 17.0583 -7.9944 17.0607C-7.98963 17.0653 -7.98474 17.0701 -7.97966 17.075C-7.96949 17.0849 -7.95863 17.0955 -7.94707 17.1066C-7.92401 17.129 -7.89809 17.1539 -7.86944 17.1812C-7.8122 17.236 -7.74377 17.3005 -7.66436 17.3743C-7.50567 17.5218 -7.30269 17.7063 -7.05645 17.9221C-6.56467 18.3532 -5.89662 18.9125 -5.06089 19.5534C-3.39603 20.83 -1.02575 22.4605 1.98012 24.0457C7.97874 27.2091 16.7723 30.3226 27.5746 29.7793L26.4253 6.95109C20.7391 7.23699 16.0326 5.61231 12.6534 3.83024C10.9703 2.94267 9.68222 2.04866 8.86091 1.41888C8.45356 1.10653 8.17155 0.867278 8.0241 0.738027C7.95072 0.673671 7.91178 0.637576 7.90841 0.634492C7.90682 0.63298 7.91419 0.639805 7.93071 0.65557C7.93897 0.663455 7.94952 0.673589 7.96235 0.686039C7.96883 0.692262 7.97582 0.699075 7.98338 0.706471C7.98719 0.710167 7.99113 0.714014 7.99526 0.718014C7.99729 0.720008 8.00047 0.723119 8.00148 0.724116C8.00466 0.727265 8.00796 0.730446 -4.673e-05 8.88887ZM27.5746 29.7793C37.6904 29.2706 45.9416 26.3684 51.6602 23.6054C54.5296 22.2191 56.8064 20.8465 58.4186 19.7784C59.2265 19.2431 59.873 18.7805 60.3494 18.4257C60.5878 18.2482 60.7841 18.0971 60.9374 17.977C61.014 17.9169 61.0799 17.8645 61.1349 17.8203C61.1624 17.7981 61.1872 17.7781 61.2093 17.7602C61.2203 17.7512 61.2307 17.7427 61.2403 17.7348C61.2452 17.7308 61.2499 17.727 61.2544 17.7233C61.2566 17.7215 61.2598 17.7188 61.261 17.7179C61.2642 17.7153 61.2673 17.7127 54 8.88887C46.7326 0.0650536 46.7357 0.0625219 46.7387 0.0600241C46.7397 0.0592345 46.7427 0.0567658 46.7446 0.0551857C46.7485 0.0520238 46.7521 0.0489887 46.7557 0.0460799C46.7628 0.0402623 46.7694 0.0349487 46.7753 0.0301318C46.7871 0.0204986 46.7966 0.0128495 46.8037 0.00712562C46.818 -0.00431848 46.8228 -0.00808311 46.8184 -0.00463784C46.8096 0.00228345 46.764 0.0378652 46.6828 0.0983779C46.5199 0.219675 46.2165 0.439161 45.7812 0.727519C44.9072 1.30663 43.5257 2.14765 41.7061 3.02677C38.0469 4.79468 32.7981 6.63058 26.4253 6.95109L27.5746 29.7793ZM54 8.88887C50.2691 -1.91433 50.27 -1.91467 50.271 -1.91498C50.2712 -1.91506 50.272 -1.91535 50.2724 -1.9155C50.2733 -1.91581 50.274 -1.91602 50.2743 -1.91616C50.2752 -1.91643 50.275 -1.91636 50.2738 -1.91595C50.2714 -1.91515 50.2652 -1.91302 50.2552 -1.9096C50.2351 -1.90276 50.1999 -1.89078 50.1503 -1.874C50.0509 -1.84043 49.8938 -1.78773 49.6844 -1.71863C49.2652 -1.58031 48.6387 -1.377 47.8481 -1.13035C46.2609 -0.635237 44.0427 0.0249875 41.5325 0.6823C36.215 2.07471 30.6736 3.15796 27 3.15796V26.0151C33.8087 26.0151 41.7672 24.2495 47.3292 22.7931C50.2586 22.026 52.825 21.2618 54.6625 20.6886C55.5842 20.4011 56.33 20.1593 56.8551 19.986C57.1178 19.8993 57.3258 19.8296 57.4735 19.7797C57.5474 19.7548 57.6062 19.7348 57.6493 19.72C57.6709 19.7127 57.6885 19.7066 57.7021 19.7019C57.7089 19.6996 57.7147 19.6976 57.7195 19.696C57.7219 19.6952 57.7241 19.6944 57.726 19.6938C57.7269 19.6934 57.7281 19.693 57.7286 19.6929C57.7298 19.6924 57.7309 19.692 54 8.88887ZM27 3.15796C23.3263 3.15796 17.7849 2.07471 12.4674 0.6823C9.95717 0.0249875 7.73904 -0.635237 6.15184 -1.13035C5.36118 -1.377 4.73467 -1.58031 4.3155 -1.71863C4.10609 -1.78773 3.94899 -1.84043 3.84961 -1.874C3.79994 -1.89078 3.76474 -1.90276 3.74471 -1.9096C3.73469 -1.91302 3.72848 -1.91515 3.72613 -1.91595C3.72496 -1.91636 3.72476 -1.91643 3.72554 -1.91616C3.72593 -1.91602 3.72657 -1.91581 3.72745 -1.9155C3.72789 -1.91535 3.72874 -1.91506 3.72896 -1.91498C3.72987 -1.91467 3.73084 -1.91433 -4.673e-05 8.88887C-3.73093 19.692 -3.72983 19.6924 -3.72868 19.6929C-3.72821 19.693 -3.72698 19.6934 -3.72603 19.6938C-3.72415 19.6944 -3.72201 19.6952 -3.71961 19.696C-3.71482 19.6976 -3.70901 19.6996 -3.7022 19.7019C-3.68858 19.7066 -3.67095 19.7127 -3.6494 19.72C-3.60629 19.7348 -3.54745 19.7548 -3.47359 19.7797C-3.32589 19.8296 -3.11788 19.8993 -2.85516 19.986C-2.33008 20.1593 -1.58425 20.4011 -0.662589 20.6886C1.17485 21.2618 3.74125 22.026 6.67073 22.7931C12.2327 24.2495 20.1913 26.0151 27 26.0151V3.15796Z"
                                        fill="var(--primary-color)"
                                    />
                                </g>
                            </svg>
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to PrimeLand!</div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Email address" class="w-full md:w-120 mb-8" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Remember me</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                            </div>
                            <p-button label="Sign In" styleClass="w-full" routerLink="/"></p-button>

                            <div class="flex items-center my-6">
                                <div class="flex-1 border-t border-surface-200 dark:border-surface-700"></div>
                                <span class="px-4 text-muted-color font-medium">OR</span>
                                <div class="flex-1 border-t border-surface-200 dark:border-surface-700"></div>
                            </div>

                            <button
                                type="button"
                                (click)="handleGoogleSignIn()"
                                class="w-full flex items-center justify-center gap-3 px-6 py-3 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4" />
                                    <path
                                        d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span class="text-surface-900 dark:text-surface-0 font-medium">Login with Google</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Welcome Modal -->
        <p-dialog 
            [(visible)]="showWelcomeModal" 
            [modal]="true" 
            [closable]="false"
            [draggable]="false"
            maskStyleClass="backdrop-blur-sm"
            styleClass="!border-0"
        >
            <ng-template pTemplate="header">
                <div class="flex items-center gap-3">
                    <i class="pi pi-sparkles text-primary text-2xl"></i>
                    <span class="text-2xl font-bold">Chào mừng {{ welcomeUserName }} đến với Website Demo</span>
                </div>
            </ng-template>
            
            <div class="flex flex-col items-center gap-6 py-4">
                @if (welcomeUserAvatar) {
                    <img 
                        [src]="welcomeUserAvatar" 
                        alt="Avatar" 
                        class="w-24 h-24 rounded-full border-4 border-primary shadow-xl animate-scalein"
                    />
                }
                
                <div class="text-center max-w-md">
                    <p class="text-lg text-surface-700 dark:text-surface-300 mb-4">
                        Đây là giao diện demo do Agent AI LQT tạo ra.
                    </p>
                    
                    <p class="text-lg text-surface-700 dark:text-surface-300">
                        Sản phẩm do AI Agents của LQT tạo ra, chỉ dùng để demo giao diện chức năng
                    </p>
                </div>
            </div>
            
            <ng-template pTemplate="footer">
                <p-button 
                    label="Bắt đầu" 
                    icon="pi pi-arrow-right" 
                    iconPos="right"
                    severity="primary"
                    size="large"
                    (onClick)="closeWelcomeModal()"
                    [fluid]="true"
                />
            </ng-template>
        </p-dialog>
    `
})
export class Login implements OnInit {
    email: string = '';

    password: string = '';

    checked: boolean = false;

    showWelcomeModal: boolean = false;

    welcomeUserName: string = '';

    welcomeUserAvatar: string = '';

    private router = inject(Router);

    private platformId = inject(PLATFORM_ID);

    private messageService = inject(MessageService);

    private readonly GOOGLE_CLIENT_ID = environment.googleClientId;

    private readonly MAX_INIT_RETRIES = 10;

    private readonly MODAL_CLOSE_DELAY = 100; // Delay trước khi navigate (ms)

    private initRetryCount = 0;

    private isGoogleApiLoaded = false;

    ngOnInit() {
        // Chỉ khởi tạo Google Sign-In khi chạy trong browser
        if (isPlatformBrowser(this.platformId)) {
            this.initGoogleSignIn();
        }
    }

    /**
     * Khởi tạo Google OAuth client
     */
    initGoogleSignIn() {
        if (typeof google !== 'undefined' && google.accounts) {
            try {
                google.accounts.id.initialize({
                    client_id: this.GOOGLE_CLIENT_ID,
                    callback: this.handleGoogleCallback.bind(this),
                    auto_select: false,
                    cancel_on_tap_outside: true
                });
                this.isGoogleApiLoaded = true;
                this.initRetryCount = 0;
                console.log('Google Identity Services đã được khởi tạo thành công');
            } catch (error) {
                console.error('Lỗi khi khởi tạo Google Identity Services:', error);
                this.showErrorMessage('Không thể khởi tạo Google Sign-In. Vui lòng thử lại sau.');
            }
        } else if (this.initRetryCount < this.MAX_INIT_RETRIES) {
            // Nếu script chưa load, thử lại sau 500ms (tối đa 10 lần)
            this.initRetryCount++;
            console.log(`Đang chờ Google Identity Services load... (lần thử ${this.initRetryCount}/${this.MAX_INIT_RETRIES})`);
            setTimeout(() => this.initGoogleSignIn(), 500);
        } else {
            // Đã thử quá số lần cho phép
            const errorMsg = `Không thể load Google Identity Services sau ${this.MAX_INIT_RETRIES} lần thử`;
            console.error(errorMsg);
            this.showErrorMessage('Không thể kết nối với Google. Vui lòng kiểm tra kết nối internet và thử lại.');
        }
    }

    /**
     * Xử lý khi user click "Login with Google"
     */
    handleGoogleSignIn() {
        if (typeof google !== 'undefined' && google.accounts && this.isGoogleApiLoaded) {
            try {
                google.accounts.id.prompt();
            } catch (error) {
                console.error('Lỗi khi hiển thị Google Sign-In prompt:', error);
                this.showErrorMessage('Không thể mở cửa sổ đăng nhập Google. Vui lòng thử lại.');
            }
        } else if (!this.isGoogleApiLoaded) {
            // Google API chưa sẵn sàng, thông báo cho user và thử init lại
            console.warn('Google API chưa sẵn sàng, đang thử khởi tạo lại...');
            this.showInfoMessage('Đang kết nối với Google, vui lòng đợi...');
            this.initRetryCount = 0;
            this.initGoogleSignIn();
            
            // Thử lại sau 1 giây
            setTimeout(() => {
                if (this.isGoogleApiLoaded) {
                    this.handleGoogleSignIn();
                }
            }, 1000);
        } else {
            this.showErrorMessage('Dịch vụ Google Sign-In chưa sẵn sàng. Vui lòng thử lại sau.');
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

                // Hiển thị welcome modal trước khi navigate
                this.welcomeUserName = userProfile.name;
                this.welcomeUserAvatar = userProfile.imageUrl;
                this.showWelcomeModal = true;

                console.log('Đăng nhập Google thành công:', userProfile.email);
            } else {
                throw new Error('Không nhận được credential từ Google');
            }
        } catch (error) {
            console.error('Lỗi trong quá trình xử lý Google callback:', error);
            this.handleError(error);
        }
    }

    /**
     * Đóng welcome modal và chuyển đến trang chính
     */
    closeWelcomeModal() {
        this.showWelcomeModal = false;

        // Sử dụng setTimeout để đảm bảo modal đã đóng hoàn toàn trước khi navigate
        setTimeout(() => {
            // Kiểm tra xem có URL được lưu để redirect không
            const redirectUrl = localStorage.getItem('redirectUrl');

            if (redirectUrl) {
                localStorage.removeItem('redirectUrl');
                this.router.navigateByUrl(redirectUrl);
            } else {
                this.router.navigate(['/']);
            }
        }, this.MODAL_CLOSE_DELAY);
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
     * NOTE: Trong production nên cân nhắc:
     * - Sử dụng sessionStorage thay vì localStorage để tăng bảo mật
     * - Hoặc lưu token vào httpOnly cookie thông qua backend
     * - Mã hóa dữ liệu nhạy cảm trước khi lưu
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

        this.showErrorMessage(errorMessage);
    }

    /**
     * Hiển thị thông báo lỗi cho user
     */
    private showErrorMessage(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Lỗi đăng nhập',
            detail: message,
            life: 5000
        });
    }

    /**
     * Hiển thị thông báo thông tin cho user
     */
    private showInfoMessage(message: string) {
        this.messageService.add({
            severity: 'info',
            summary: 'Thông tin',
            detail: message,
            life: 3000
        });
    }
}
