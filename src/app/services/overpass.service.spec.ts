import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { OverpassService, GeoJSONFeatureCollection } from './overpass.service';

describe('OverpassService', () => {
    let service: OverpassService;
    let httpMock: HttpTestingController;

    const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [OverpassService, provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(OverpassService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('executeQuery', () => {
        it('nên gọi Overpass API với URL-encoded query parameters', () => {
            const testQuery = '[out:json][timeout:25]; node(1); out;';
            const mockResponse = {
                version: 0.6,
                generator: 'Overpass API',
                osm3s: {
                    timestamp_osm_base: '2024-01-01T00:00:00Z',
                    copyright: 'OpenStreetMap contributors'
                },
                elements: []
            };

            service.executeQuery(testQuery).subscribe();

            const encodedQuery = encodeURIComponent(testQuery);
            const expectedUrl = `${OVERPASS_API_URL}?data=${encodedQuery}`;

            const req = httpMock.expectOne(expectedUrl);

            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('nên chuyển đổi response thành GeoJSON', (done) => {
            const testQuery = '[out:json]; way(1); out;';
            const mockResponse = {
                version: 0.6,
                generator: 'Overpass API',
                osm3s: {
                    timestamp_osm_base: '2024-01-01T00:00:00Z',
                    copyright: 'OpenStreetMap contributors'
                },
                elements: [
                    {
                        type: 'node',
                        id: 1,
                        lat: 11.9404,
                        lon: 108.4583
                    },
                    {
                        type: 'way',
                        id: 2,
                        nodes: [1],
                        tags: { name: 'Test Way' },
                        geometry: [
                            { lat: 11.9404, lon: 108.4583 },
                            { lat: 11.9504, lon: 108.4683 }
                        ]
                    }
                ]
            };

            service.executeQuery(testQuery).subscribe((result) => {
                expect(result.type).toBe('FeatureCollection');
                expect(result.features).toBeDefined();
                expect(Array.isArray(result.features)).toBe(true);
                done();
            });

            const req = httpMock.expectOne((request) => request.url.startsWith(OVERPASS_API_URL));

            req.flush(mockResponse);
        });

        it('nên xử lý lỗi từ API', (done) => {
            const testQuery = '[out:json]; invalid query;';

            service.executeQuery(testQuery).subscribe({
                next: () => fail('Test không nên thành công khi API trả về lỗi'),
                error: (error) => {
                    expect(error).toBeDefined();
                    expect(error.message).toContain('Không thể lấy dữ liệu từ Overpass API');
                    done();
                }
            });

            const req = httpMock.expectOne((request) => request.url.startsWith(OVERPASS_API_URL));

            req.error(new ProgressEvent('error'));
        });

        it('nên validate response từ API', (done) => {
            const testQuery = '[out:json]; node(1); out;';
            const invalidResponse = {
                // Thiếu trường elements
                version: 0.6
            };

            service.executeQuery(testQuery).subscribe({
                next: () => fail('Test không nên thành công khi response không hợp lệ (thiếu elements)'),
                error: (error) => {
                    expect(error).toBeDefined();
                    expect(error.message).toContain('Không thể lấy dữ liệu từ Overpass API');
                    done();
                }
            });

            const req = httpMock.expectOne((request) => request.url.startsWith(OVERPASS_API_URL));

            req.flush(invalidResponse);
        });
    });

    describe('getLamDongBoundaries', () => {
        it('nên truy vấn ranh giới Lâm Đồng', () => {
            const mockResponse = {
                version: 0.6,
                generator: 'Overpass API',
                osm3s: {
                    timestamp_osm_base: '2024-01-01T00:00:00Z',
                    copyright: 'OpenStreetMap contributors'
                },
                elements: []
            };

            service.getLamDongBoundaries().subscribe();

            const req = httpMock.expectOne((request) => {
                const decodedUrl = decodeURIComponent(request.url);

                return decodedUrl.includes('Lâm Đồng') && decodedUrl.includes('admin_level');
            });

            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });
    });

    describe('getAdministrativeBoundaries', () => {
        it('nên tạo truy vấn với tên khu vực và cấp hành chính', () => {
            const mockResponse = {
                version: 0.6,
                generator: 'Overpass API',
                osm3s: {
                    timestamp_osm_base: '2024-01-01T00:00:00Z',
                    copyright: 'OpenStreetMap contributors'
                },
                elements: []
            };

            service.getAdministrativeBoundaries('Hà Nội', '4').subscribe();

            const req = httpMock.expectOne((request) => {
                const decodedUrl = decodeURIComponent(request.url);

                return decodedUrl.includes('Hà Nội') && decodedUrl.includes('"admin_level"="4"');
            });

            expect(req.request.method).toBe('GET');
            req.flush(mockResponse);
        });

        it('nên sanitize input để tránh injection attacks', () => {
            const mockResponse = {
                version: 0.6,
                generator: 'Overpass API',
                osm3s: {
                    timestamp_osm_base: '2024-01-01T00:00:00Z',
                    copyright: 'OpenStreetMap contributors'
                },
                elements: []
            };

            // Thử inject với ký tự đặc biệt
            service.getAdministrativeBoundaries('Test"];malicious[', '4').subscribe();

            const req = httpMock.expectOne((request) => request.url.startsWith(OVERPASS_API_URL));

            expect(req.request.method).toBe('GET');

            // Kiểm tra rằng area name đã được sanitize (chỉ còn "Testmalicious")
            const decodedUrl = decodeURIComponent(req.request.url);

            // Nên chứa phần đã được sanitize (Testmalicious)
            expect(decodedUrl).toContain('Testmalicious');
            // Không nên chứa chuỗi nguy hiểm trong area name
            expect(decodedUrl).not.toContain('"];malicious');
            expect(decodedUrl).not.toContain('malicious[');
            req.flush(mockResponse);
        });
    });

    describe('Conversion to GeoJSON', () => {
        it('nên chuyển đổi way với geometry thành GeoJSON feature', (done) => {
            const testQuery = '[out:json]; way(1); out geom;';
            const mockResponse = {
                version: 0.6,
                generator: 'Overpass API',
                osm3s: {
                    timestamp_osm_base: '2024-01-01T00:00:00Z',
                    copyright: 'OpenStreetMap contributors'
                },
                elements: [
                    {
                        type: 'way',
                        id: 123,
                        tags: { name: 'Test Way', admin_level: '6' },
                        geometry: [
                            { lat: 11.9404, lon: 108.4583 },
                            { lat: 11.9504, lon: 108.4683 },
                            { lat: 11.9604, lon: 108.4783 }
                        ]
                    }
                ]
            };

            service.executeQuery(testQuery).subscribe((result: GeoJSONFeatureCollection) => {
                expect(result.features.length).toBe(1);

                const feature = result.features[0];

                expect(feature.type).toBe('Feature');
                expect(feature.geometry.type).toBe('LineString');
                expect(feature.properties['name']).toBe('Test Way');
                expect(feature.properties['admin_level']).toBe('6');
                done();
            });

            const req = httpMock.expectOne((request) => request.url.startsWith(OVERPASS_API_URL));

            req.flush(mockResponse);
        });

        it('nên nhận dạng polygon khi first point === last point', (done) => {
            const testQuery = '[out:json]; way(1); out geom;';
            const mockResponse = {
                version: 0.6,
                generator: 'Overpass API',
                osm3s: {
                    timestamp_osm_base: '2024-01-01T00:00:00Z',
                    copyright: 'OpenStreetMap contributors'
                },
                elements: [
                    {
                        type: 'way',
                        id: 123,
                        tags: { name: 'Test Polygon' },
                        geometry: [
                            { lat: 11.9404, lon: 108.4583 },
                            { lat: 11.9504, lon: 108.4683 },
                            { lat: 11.9604, lon: 108.4783 },
                            { lat: 11.9404, lon: 108.4583 } // Same as first point
                        ]
                    }
                ]
            };

            service.executeQuery(testQuery).subscribe((result: GeoJSONFeatureCollection) => {
                expect(result.features.length).toBe(1);

                const feature = result.features[0];

                expect(feature.geometry.type).toBe('Polygon');
                done();
            });

            const req = httpMock.expectOne((request) => request.url.startsWith(OVERPASS_API_URL));

            req.flush(mockResponse);
        });
    });
});
