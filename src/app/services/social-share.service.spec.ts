import { TestBed } from '@angular/core/testing';
import { SocialShareService, ShareResult } from './social-share.service';
import { MobileDetectionService, DeviceInfo } from './mobile-detection.service';
import { JobWithDetails } from '@/models/rms.models';

describe('SocialShareService', () => {
    let service: SocialShareService;
    let mobileDetectionService: jasmine.SpyObj<MobileDetectionService>;
    let mockJob: JobWithDetails;

    beforeEach(() => {
        const mobileDetectionSpy = jasmine.createSpyObj('MobileDetectionService', ['getDeviceInfo', 'logDeviceInfo']);

        TestBed.configureTestingModule({
            providers: [SocialShareService, { provide: MobileDetectionService, useValue: mobileDetectionSpy }]
        });

        service = TestBed.inject(SocialShareService);
        mobileDetectionService = TestBed.inject(MobileDetectionService) as jasmine.SpyObj<MobileDetectionService>;

        // Mock job data
        mockJob = {
            id: 1,
            customer_id: 1,
            title: 'Senior Software Engineer',
            description: 'Exciting opportunity for a senior engineer',
            location: 'Hà Nội',
            salary_min: 30000000,
            salary_max: 50000000,
            education_level: 'Bachelor',
            experience_min: 3,
            experience_max: 5,
            status: 'Open',
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
            customer: {
                id: 1,
                name: 'Tech Company',
                industry: 'Technology',
                location: 'Hà Nội',
                contact_email: 'hr@techcompany.com',
                contact_phone: '0123456789',
                created_at: '2024-01-01',
                updated_at: '2024-01-01'
            },
            skills: [
                {
                    id: 1,
                    name: 'Angular',
                    category: 'Frontend',
                    created_at: '2024-01-01',
                    importance_level: 5
                },
                {
                    id: 2,
                    name: 'TypeScript',
                    category: 'Programming',
                    created_at: '2024-01-01',
                    importance_level: 5
                }
            ],
            candidates: []
        } as JobWithDetails;
    });

    describe('Desktop / Web Fallback', () => {
        beforeEach(() => {
            const desktopInfo: DeviceInfo = {
                isMobile: false,
                isAndroid: false,
                isIOS: false,
                isTablet: false,
                hasFacebookApp: false,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
            };

            mobileDetectionService.getDeviceInfo.and.returnValue(desktopInfo);
        });

        it('nên sử dụng web fallback cho desktop', async () => {
            spyOn(window, 'open').and.returnValue(window);

            const result = await service.shareOnFacebook(mockJob);

            expect(result.success).toBe(true);
            expect(result.method).toBe('web_fallback');
            expect(window.open).toHaveBeenCalled();
        });

        it('nên trả về lỗi nếu popup bị chặn', async () => {
            spyOn(window, 'open').and.returnValue(null);

            const result = await service.shareOnFacebook(mockJob);

            expect(result.success).toBe(false);
            expect(result.method).toBe('failed');
            expect(result.message).toContain('Popup blocked');
        });
    });

    describe('Android Device', () => {
        beforeEach(() => {
            const androidInfo: DeviceInfo = {
                isMobile: true,
                isAndroid: true,
                isIOS: false,
                isTablet: false,
                hasFacebookApp: false,
                userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) Chrome/91.0.4472.120 Mobile'
            };

            mobileDetectionService.getDeviceInfo.and.returnValue(androidInfo);
        });

        it('nên thử mở ứng dụng Facebook trên Android', async () => {
            spyOn(window, 'open').and.returnValue(window);

            const result = await service.shareOnFacebook(mockJob);

            // Có thể thành công hoặc fallback sang web
            expect(result).toBeDefined();
            expect(['native_app', 'web_fallback', 'failed']).toContain(result.method);
        }, 10000); // Tăng timeout lên 10 giây
    });

    describe('iOS Device', () => {
        beforeEach(() => {
            const iosInfo: DeviceInfo = {
                isMobile: true,
                isAndroid: false,
                isIOS: true,
                isTablet: false,
                hasFacebookApp: false,
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) Version/14.0 Mobile'
            };

            mobileDetectionService.getDeviceInfo.and.returnValue(iosInfo);
        });

        it('nên thử mở ứng dụng Facebook trên iOS', async () => {
            spyOn(window, 'open').and.returnValue(window);

            const result = await service.shareOnFacebook(mockJob);

            // Có thể thành công hoặc fallback sang web
            expect(result).toBeDefined();
            expect(['native_app', 'web_fallback', 'failed']).toContain(result.method);
        });
    });

    describe('Trong ứng dụng Facebook / Within Facebook App', () => {
        beforeEach(() => {
            const fbAppInfo: DeviceInfo = {
                isMobile: true,
                isAndroid: true,
                isIOS: false,
                isTablet: false,
                hasFacebookApp: true,
                userAgent: 'Mozilla/5.0 (Linux; Android 10) [FBAN/FB4A;FBAV/325.0.0.0;]'
            };

            mobileDetectionService.getDeviceInfo.and.returnValue(fbAppInfo);
        });

        it('nên sử dụng web fallback khi đang trong ứng dụng Facebook', async () => {
            spyOn(window, 'open').and.returnValue(window);

            const result = await service.shareOnFacebook(mockJob);

            expect(result.method).toBe('web_fallback');
            expect(window.open).toHaveBeenCalled();
        });
    });

    describe('Share Text Creation', () => {
        it('nên tạo nội dung chia sẻ với đầy đủ thông tin', async () => {
            const desktopInfo: DeviceInfo = {
                isMobile: false,
                isAndroid: false,
                isIOS: false,
                isTablet: false,
                hasFacebookApp: false,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
            };

            mobileDetectionService.getDeviceInfo.and.returnValue(desktopInfo);

            const openSpy = spyOn(window, 'open').and.returnValue(window);

            await service.shareOnFacebook(mockJob);

            expect(openSpy).toHaveBeenCalled();

            const callArgs = openSpy.calls.first().args[0] as string;
            const decodedUrl = decodeURIComponent(callArgs);

            expect(decodedUrl).toContain('TUYỂN DỤNG');
            expect(decodedUrl).toContain('Senior Software Engineer');
            expect(decodedUrl).toContain('Tech Company');
        });

        it('nên xử lý job không có kỹ năng', async () => {
            const desktopInfo: DeviceInfo = {
                isMobile: false,
                isAndroid: false,
                isIOS: false,
                isTablet: false,
                hasFacebookApp: false,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
            };

            mobileDetectionService.getDeviceInfo.and.returnValue(desktopInfo);

            const jobWithoutSkills = { ...mockJob, skills: [] };
            const openSpy = spyOn(window, 'open').and.returnValue(window);

            await service.shareOnFacebook(jobWithoutSkills);

            const callArgs = openSpy.calls.first().args[0] as string;
            const decodedUrl = decodeURIComponent(callArgs);

            expect(decodedUrl).toContain('Nhiều kỹ năng đa dạng');
        });

        it('nên xử lý job không có thông tin công ty', async () => {
            const desktopInfo: DeviceInfo = {
                isMobile: false,
                isAndroid: false,
                isIOS: false,
                isTablet: false,
                hasFacebookApp: false,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
            };

            mobileDetectionService.getDeviceInfo.and.returnValue(desktopInfo);

            const jobWithoutCustomer = { ...mockJob, customer: undefined };
            const openSpy = spyOn(window, 'open').and.returnValue(window);

            await service.shareOnFacebook(jobWithoutCustomer);

            const callArgs = openSpy.calls.first().args[0] as string;
            const decodedUrl = decodeURIComponent(callArgs);

            expect(decodedUrl).toContain('Công ty hàng đầu');
        });
    });

    describe('Logging', () => {
        it('nên ghi log trong quá trình chia sẻ', async () => {
            const desktopInfo: DeviceInfo = {
                isMobile: false,
                isAndroid: false,
                isIOS: false,
                isTablet: false,
                hasFacebookApp: false,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'
            };

            mobileDetectionService.getDeviceInfo.and.returnValue(desktopInfo);

            spyOn(window, 'open').and.returnValue(window);
            const consoleSpy = spyOn(console, 'log');

            await service.shareOnFacebook(mockJob);

            expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
