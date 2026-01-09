import { Injectable } from '@angular/core';
import { JobWithDetails } from '@/models/rms.models';
import { getJobShareUrl } from '@/utils/share-url';
import { MobileDetectionService, DeviceInfo } from './mobile-detection.service';

export interface ShareResult {
    success: boolean;
    method: 'native_app' | 'web_fallback' | 'failed';
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class SocialShareService {
    private readonly FACEBOOK_APP_TIMEOUT = 2500;
    private readonly LOG_PREFIX = '[Social Share]';

    constructor(private mobileDetection: MobileDetectionService) {}

    async shareOnFacebook(job: JobWithDetails): Promise<ShareResult> {
        const url = getJobShareUrl(job.id);
        const quote = this.createShareText(job);

        this.logInfo('Bắt đầu chia sẻ lên Facebook', { jobId: job.id, url });

        const deviceInfo = this.mobileDetection.getDeviceInfo();

        this.logInfo('Thông tin thiết bị', deviceInfo);

        // Kiểm tra nếu đang ở trong ứng dụng Facebook
        if (deviceInfo.hasFacebookApp) {
            this.logWarning('Đang chạy trong ứng dụng Facebook - sử dụng web fallback');

            return this.openWebFallback(url, quote);
        }

        // Thử mở ứng dụng Facebook native trên mobile
        if (deviceInfo.isMobile) {
            this.logInfo('Thiết bị mobile được phát hiện - thử mở ứng dụng Facebook native');

            const nativeResult = await this.tryOpenNativeFacebookApp(url, quote, deviceInfo);

            if (nativeResult.success) {
                return nativeResult;
            }

            this.logWarning('Không thể mở ứng dụng Facebook native - chuyển sang web fallback');
        }

        // Fallback cho desktop hoặc khi không mở được native app
        return this.openWebFallback(url, quote);
    }

    private async tryOpenNativeFacebookApp(url: string, quote: string, deviceInfo: DeviceInfo): Promise<ShareResult> {
        try {
            if (deviceInfo.isAndroid) {
                return await this.openAndroidFacebookApp(url, quote);
            }

            if (deviceInfo.isIOS) {
                return await this.openIOSFacebookApp(url, quote);
            }

            this.logWarning('Hệ điều hành mobile không được hỗ trợ');

            return { success: false, method: 'failed', message: 'Unsupported mobile OS' };
        } catch (error) {
            this.logError('Lỗi khi mở ứng dụng Facebook native', error);

            return { success: false, method: 'failed', message: 'Native app open failed' };
        }
    }

    private async openAndroidFacebookApp(url: string, quote: string): Promise<ShareResult> {
        this.logInfo('Thử mở ứng dụng Facebook trên Android');

        const fbWebUrl = this.buildFacebookShareUrl(url, quote);

        // Android Intent URL cho Facebook
        const intentUrl = `intent://share/#Intent;scheme=https;package=com.facebook.katana;S.browser_fallback_url=${encodeURIComponent(fbWebUrl)};end`;

        // Deep link cho Facebook app
        const fbScheme = `fb://facewebmodal/f?href=${encodeURIComponent(fbWebUrl)}`;

        try {
            // Thử deep link trước
            const opened = await this.tryOpenUrl(fbScheme, this.FACEBOOK_APP_TIMEOUT);

            if (opened) {
                this.logInfo('Mở thành công ứng dụng Facebook qua deep link');

                return { success: true, method: 'native_app', message: 'Opened via Facebook deep link' };
            }

            // Nếu deep link thất bại, thử Intent
            this.logInfo('Deep link thất bại - thử Android Intent');
            const intentOpened = await this.tryOpenUrl(intentUrl, this.FACEBOOK_APP_TIMEOUT);

            if (intentOpened) {
                this.logInfo('Mở thành công ứng dụng Facebook qua Intent');

                return { success: true, method: 'native_app', message: 'Opened via Android Intent' };
            }

            this.logWarning('Không thể mở ứng dụng Facebook trên Android');

            return { success: false, method: 'failed', message: 'Failed to open Facebook app on Android' };
        } catch (error) {
            this.logError('Lỗi khi mở Facebook trên Android', error);

            return { success: false, method: 'failed', message: 'Android open error' };
        }
    }

    private async openIOSFacebookApp(url: string, quote: string): Promise<ShareResult> {
        this.logInfo('Thử mở ứng dụng Facebook trên iOS');

        // iOS URL scheme cho Facebook
        const fbScheme = `fb://share?link=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`;

        try {
            const opened = await this.tryOpenUrl(fbScheme, this.FACEBOOK_APP_TIMEOUT);

            if (opened) {
                this.logInfo('Mở thành công ứng dụng Facebook trên iOS');

                return { success: true, method: 'native_app', message: 'Opened via iOS URL scheme' };
            }

            this.logWarning('Không thể mở ứng dụng Facebook trên iOS - sử dụng fallback');

            return { success: false, method: 'failed', message: 'Failed to open Facebook app on iOS' };
        } catch (error) {
            this.logError('Lỗi khi mở Facebook trên iOS', error);

            return { success: false, method: 'failed', message: 'iOS open error' };
        }
    }

    private buildFacebookShareUrl(url: string, quote: string): string {
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`;
    }

    private async tryOpenUrl(targetUrl: string, timeout: number): Promise<boolean> {
        return new Promise((resolve) => {
            if (typeof window === 'undefined') {
                resolve(false);

                return;
            }

            let hasBlurred = false;
            const startTime = Date.now();

            const blurHandler = () => {
                hasBlurred = true;
                this.logInfo('Window blur detected - app likely opened');
            };

            window.addEventListener('blur', blurHandler);

            // Thử mở URL bằng iframe thay vì window.location.href để tránh reload
            const iframe = document.createElement('iframe');

            iframe.style.display = 'none';
            iframe.src = targetUrl;

            try {
                document.body.appendChild(iframe);
            } catch (e) {
                this.logWarning('Không thể thêm iframe', e);
                window.removeEventListener('blur', blurHandler);
                resolve(false);

                return;
            }

            const cleanup = () => {
                window.removeEventListener('blur', blurHandler);

                try {
                    if (iframe.parentNode) {
                        document.body.removeChild(iframe);
                    }
                } catch (e) {
                    // Ignore cleanup errors
                }
            };

            // Đợi và kiểm tra xem app có mở không
            const checkTimer = setTimeout(() => {
                cleanup();

                const elapsed = Date.now() - startTime;

                // Nếu window bị blur hoặc mất nhiều thời gian => app đã mở
                if (hasBlurred || elapsed > timeout + 500) {
                    this.logInfo('App có vẻ đã mở', { hasBlurred, elapsed });
                    resolve(true);
                } else {
                    this.logInfo('App không mở được', { hasBlurred, elapsed });
                    resolve(false);
                }
            }, timeout);

            // Cleanup sau timeout
            setTimeout(() => {
                clearTimeout(checkTimer);
                cleanup();
            }, timeout + 1000);
        });
    }

    private openWebFallback(url: string, quote: string): ShareResult {
        this.logInfo('Sử dụng web fallback để chia sẻ');

        const facebookUrl = this.buildFacebookShareUrl(url, quote);

        const popup = window.open(facebookUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');

        if (popup) {
            this.logInfo('Mở thành công cửa sổ chia sẻ Facebook');

            return { success: true, method: 'web_fallback', message: 'Opened Facebook share dialog in browser' };
        } else {
            this.logError('Không thể mở cửa sổ chia sẻ - popup bị chặn');

            return { success: false, method: 'failed', message: 'Popup blocked' };
        }
    }

    private createShareText(job: JobWithDetails): string {
        const salary = `${(job.salary_min / 1000000).toFixed(0)} - ${(job.salary_max / 1000000).toFixed(0)} triệu VND`;
        const experience = `${job.experience_min} - ${job.experience_max} năm kinh nghiệm`;

        const skillsList =
            job.skills && job.skills.length > 0
                ? job.skills
                      .slice(0, 5)
                      .map((s) => s.name)
                      .join(', ')
                : 'Nhiều kỹ năng đa dạng';

        const companyInfo = job.customer ? `${job.customer.name} - ${job.customer.industry}` : 'Công ty hàng đầu';

        return `🚀 TUYỂN DỤNG: ${job.title}

📍 Địa điểm: ${job.location}
💰 Mức lương: ${salary}
💼 Kinh nghiệm: ${experience}

✨ Kỹ năng yêu cầu: ${skillsList}

🏢 ${companyInfo}

Tuyển dụng nhân tài - Xây dựng tương lai

#TuyenDung #JobOpportunity #Career`;
    }

    private logInfo(message: string, data?: any): void {
        if (data) {
            console.log(`${this.LOG_PREFIX} ${message}`, data);
        } else {
            console.log(`${this.LOG_PREFIX} ${message}`);
        }
    }

    private logWarning(message: string, data?: any): void {
        if (data) {
            console.warn(`${this.LOG_PREFIX} ${message}`, data);
        } else {
            console.warn(`${this.LOG_PREFIX} ${message}`);
        }
    }

    private logError(message: string, error?: any): void {
        if (error) {
            console.error(`${this.LOG_PREFIX} ${message}`, error);
        } else {
            console.error(`${this.LOG_PREFIX} ${message}`);
        }
    }
}
