import { TestBed } from '@angular/core/testing';
import { MobileDetectionService } from './mobile-detection.service';

describe('MobileDetectionService', () => {
    let service: MobileDetectionService;
    let originalNavigator: Navigator;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MobileDetectionService);
        originalNavigator = navigator;
    });

    afterEach(() => {
        // Khôi phục navigator gốc
        Object.defineProperty(window, 'navigator', {
            value: originalNavigator,
            configurable: true,
            writable: true
        });
    });

    describe('Phát hiện thiết bị Android / Android detection', () => {
        beforeEach(() => {
            Object.defineProperty(window, 'navigator', {
                value: {
                    userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
                },
                configurable: true,
                writable: true
            });
            service = new MobileDetectionService();
        });

        it('nên phát hiện thiết bị Android', () => {
            expect(service.isAndroidDevice()).toBe(true);
            expect(service.isMobileDevice()).toBe(true);
            expect(service.isIOSDevice()).toBe(false);
        });

        it('nên trả về thông tin thiết bị Android', () => {
            const info = service.getDeviceInfo();

            expect(info.isAndroid).toBe(true);
            expect(info.isMobile).toBe(true);
            expect(info.isIOS).toBe(false);
        });
    });

    describe('Phát hiện thiết bị iOS / iOS detection', () => {
        beforeEach(() => {
            Object.defineProperty(window, 'navigator', {
                value: {
                    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
                },
                configurable: true,
                writable: true
            });
            service = new MobileDetectionService();
        });

        it('nên phát hiện thiết bị iOS', () => {
            expect(service.isIOSDevice()).toBe(true);
            expect(service.isMobileDevice()).toBe(true);
            expect(service.isAndroidDevice()).toBe(false);
        });

        it('nên trả về thông tin thiết bị iOS', () => {
            const info = service.getDeviceInfo();

            expect(info.isIOS).toBe(true);
            expect(info.isMobile).toBe(true);
            expect(info.isAndroid).toBe(false);
        });
    });

    describe('Phát hiện iPad / iPad detection', () => {
        beforeEach(() => {
            Object.defineProperty(window, 'navigator', {
                value: {
                    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
                },
                configurable: true,
                writable: true
            });
            service = new MobileDetectionService();
        });

        it('nên phát hiện iPad là thiết bị iOS và tablet', () => {
            expect(service.isIOSDevice()).toBe(true);
            expect(service.isTabletDevice()).toBe(true);
            expect(service.isMobileDevice()).toBe(true);
        });
    });

    describe('Phát hiện tablet Android / Android tablet detection', () => {
        beforeEach(() => {
            Object.defineProperty(window, 'navigator', {
                value: {
                    userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-T865) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36'
                },
                configurable: true,
                writable: true
            });
            service = new MobileDetectionService();
        });

        it('nên phát hiện tablet Android', () => {
            expect(service.isAndroidDevice()).toBe(true);
            expect(service.isTabletDevice()).toBe(true);
            expect(service.isMobileDevice()).toBe(true);
        });
    });

    describe('Phát hiện desktop / Desktop detection', () => {
        beforeEach(() => {
            Object.defineProperty(window, 'navigator', {
                value: {
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                configurable: true,
                writable: true
            });
            service = new MobileDetectionService();
        });

        it('nên không phát hiện desktop là mobile', () => {
            expect(service.isMobileDevice()).toBe(false);
            expect(service.isAndroidDevice()).toBe(false);
            expect(service.isIOSDevice()).toBe(false);
            expect(service.isTabletDevice()).toBe(false);
        });
    });

    describe('Phát hiện ứng dụng Facebook / Facebook app detection', () => {
        beforeEach(() => {
            Object.defineProperty(window, 'navigator', {
                value: {
                    userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36 [FBAN/FB4A;FBAV/325.0.0.0;]'
                },
                configurable: true,
                writable: true
            });
            service = new MobileDetectionService();
        });

        it('nên phát hiện khi đang chạy trong ứng dụng Facebook', () => {
            expect(service.hasFacebookAppInstalled()).toBe(true);
        });
    });

    describe('Logging / Ghi log', () => {
        it('nên ghi log thông tin thiết bị mà không lỗi', () => {
            const consoleSpy = spyOn(console, 'log');

            service.logDeviceInfo();

            expect(consoleSpy).toHaveBeenCalled();
        });
    });

    describe('URL Scheme detection', () => {
        it('nên trả về Promise khi kiểm tra URL scheme', async () => {
            const result = await service.canOpenUrlScheme('fb://');

            expect(typeof result).toBe('boolean');
        });
    });
});
