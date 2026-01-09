import { Injectable } from '@angular/core';

export interface DeviceInfo {
    isMobile: boolean;
    isAndroid: boolean;
    isIOS: boolean;
    isTablet: boolean;
    hasFacebookApp: boolean;
    userAgent: string;
}

@Injectable({
    providedIn: 'root'
})
export class MobileDetectionService {
    private readonly SCHEME_CHECK_TIMEOUT = 2000;
    private deviceInfo: DeviceInfo;

    constructor() {
        this.deviceInfo = this.detectDevice();
    }

    private detectDevice(): DeviceInfo {
        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
        const isAndroid = /Android/i.test(userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
        const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
        const isMobile = isAndroid || isIOS || /Mobile/i.test(userAgent);

        // Phát hiện ứng dụng Facebook (thông qua User Agent hoặc khả năng mở URL scheme)
        const hasFacebookApp = /FBAN|FBAV/i.test(userAgent);

        return {
            isMobile,
            isAndroid,
            isIOS,
            isTablet,
            hasFacebookApp,
            userAgent
        };
    }

    getDeviceInfo(): DeviceInfo {
        return { ...this.deviceInfo };
    }

    isMobileDevice(): boolean {
        return this.deviceInfo.isMobile;
    }

    isAndroidDevice(): boolean {
        return this.deviceInfo.isAndroid;
    }

    isIOSDevice(): boolean {
        return this.deviceInfo.isIOS;
    }

    isTabletDevice(): boolean {
        return this.deviceInfo.isTablet;
    }

    hasFacebookAppInstalled(): boolean {
        return this.deviceInfo.hasFacebookApp;
    }

    /**
     * Kiểm tra xem có thể mở URL scheme hay không
     * Hàm này sử dụng để detect ứng dụng Facebook trên thiết bị
     */
    canOpenUrlScheme(scheme: string): Promise<boolean> {
        return new Promise((resolve) => {
            if (typeof window === 'undefined') {
                resolve(false);

                return;
            }

            const timeout = setTimeout(() => {
                resolve(false);
            }, this.SCHEME_CHECK_TIMEOUT);

            const iframe = document.createElement('iframe');

            iframe.style.display = 'none';
            iframe.src = scheme;

            document.body.appendChild(iframe);

            setTimeout(() => {
                clearTimeout(timeout);

                if (iframe.parentNode) {
                    document.body.removeChild(iframe);
                }

                resolve(true);
            }, 1000);
        });
    }

    /**
     * Log thông tin thiết bị để debug
     */
    logDeviceInfo(): void {
        console.log('[Mobile Detection] Device Info:', {
            isMobile: this.deviceInfo.isMobile,
            isAndroid: this.deviceInfo.isAndroid,
            isIOS: this.deviceInfo.isIOS,
            isTablet: this.deviceInfo.isTablet,
            hasFacebookApp: this.deviceInfo.hasFacebookApp,
            userAgent: this.deviceInfo.userAgent
        });
    }
}
