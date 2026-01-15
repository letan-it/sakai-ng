import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

/**
 * Interface cho dữ liệu GeoJSON Feature
 */
export interface GeoJSONFeature {
    type: 'Feature';
    geometry: {
        type: string;
        coordinates: number[][] | number[][][] | number[][][][];
    };
    properties: {
        [key: string]: any;
    };
}

/**
 * Interface cho GeoJSON FeatureCollection
 */
export interface GeoJSONFeatureCollection {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}

/**
 * Interface cho Overpass Element
 */
interface OverpassElement {
    type: string;
    id: number;
    lat?: number;
    lon?: number;
    tags?: { [key: string]: any };
    nodes?: number[];
    members?: Array<{
        type: string;
        ref: number;
        role: string;
    }>;
    geometry?: Array<{
        lat: number;
        lon: number;
    }>;
}

/**
 * Interface cho Overpass Response
 */
interface OverpassResponse {
    version: number;
    generator: string;
    osm3s: {
        timestamp_osm_base: string;
        copyright: string;
    };
    elements: OverpassElement[];
}

/**
 * Service để tương tác với Overpass Turbo API
 */
@Injectable({
    providedIn: 'root'
})
export class OverpassService {
    private readonly OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
    private http = inject(HttpClient);

    /**
     * Thực hiện truy vấn Overpass
     * @param query Chuỗi truy vấn Overpass QL
     * @returns Observable của GeoJSON FeatureCollection
     *
     * Note: Sử dụng GET request với URL-encoded parameters.
     * URL có giới hạn độ dài (thường ~2048 chars trên browser).
     * Các query trong app này thường ngắn, nhưng nếu cần query dài hơn
     * có thể cần fallback về POST method.
     */
    executeQuery(query: string): Observable<GeoJSONFeatureCollection> {
        // Sử dụng URL-encoded query parameters thay vì FormData
        const encodedQuery = encodeURIComponent(query);
        const url = `${this.OVERPASS_API_URL}?data=${encodedQuery}`;

        return this.http.get<OverpassResponse>(url).pipe(
            map((response) => {
                // Validate API response
                if (!this.isValidOverpassResponse(response)) {
                    throw new Error('Phản hồi từ Overpass API không hợp lệ');
                }

                return this.convertToGeoJSON(response);
            }),
            catchError((error) => {
                console.error('Lỗi khi gọi Overpass API:', error);

                return throwError(() => new Error('Không thể lấy dữ liệu từ Overpass API'));
            })
        );
    }

    /**
     * Truy vấn ranh giới hành chính của Lâm Đồng
     * @returns Observable của GeoJSON FeatureCollection
     */
    getLamDongBoundaries(): Observable<GeoJSONFeatureCollection> {
        const query = `
            [out:json][timeout:25];
            area["name"~"Lâm Đồng"]["admin_level"="4"]->.lamdong;
            (
                relation(area.lamdong)["admin_level"="6"]["boundary"="administrative"];
            );
            out body;
            >;
            out skel qt;
        `;

        return this.executeQuery(query);
    }

    /**
     * Chuyển đổi Overpass response sang GeoJSON
     * @param response Overpass API response
     * @returns GeoJSON FeatureCollection
     */
    private convertToGeoJSON(response: OverpassResponse): GeoJSONFeatureCollection {
        const features: GeoJSONFeature[] = [];
        const nodeMap = new Map<number, { lat: number; lon: number }>();

        // Lưu trữ tất cả các node để sử dụng sau
        response.elements.forEach((element) => {
            if (element.type === 'node' && element.lat !== undefined && element.lon !== undefined) {
                nodeMap.set(element.id, { lat: element.lat, lon: element.lon });
            }
        });

        // Xử lý các relation và way
        response.elements.forEach((element) => {
            if (element.type === 'relation' || element.type === 'way') {
                const feature = this.elementToFeature(element, nodeMap);

                if (feature) {
                    features.push(feature);
                }
            }
        });

        return {
            type: 'FeatureCollection',
            features
        };
    }

    /**
     * Chuyển đổi Overpass element sang GeoJSON Feature
     * @param element Overpass element
     * @param nodeMap Map của nodes với lat/lon
     * @returns GeoJSON Feature hoặc null
     */
    private elementToFeature(element: OverpassElement, nodeMap: Map<number, { lat: number; lon: number }>): GeoJSONFeature | null {
        // Nếu có geometry từ Overpass
        if (element.geometry && element.geometry.length > 0) {
            const coordinates = element.geometry.map((point) => [point.lon, point.lat]);

            // Kiểm tra xem có phải là polygon không (first point === last point)
            const isPolygon = coordinates.length > 3 && coordinates[0][0] === coordinates[coordinates.length - 1][0] && coordinates[0][1] === coordinates[coordinates.length - 1][1];

            return {
                type: 'Feature',
                geometry: {
                    type: isPolygon ? 'Polygon' : 'LineString',
                    coordinates: isPolygon ? [coordinates] : coordinates
                },
                properties: {
                    id: element.id,
                    type: element.type,
                    ...element.tags
                }
            };
        }

        // Nếu là way với nodes
        if (element.type === 'way' && element.nodes) {
            const coordinates = element.nodes
                .map((nodeId) => {
                    const node = nodeMap.get(nodeId);

                    return node ? [node.lon, node.lat] : null;
                })
                .filter((coord): coord is [number, number] => coord !== null);

            if (coordinates.length > 0) {
                const isPolygon = coordinates.length > 3 && coordinates[0][0] === coordinates[coordinates.length - 1][0] && coordinates[0][1] === coordinates[coordinates.length - 1][1];

                return {
                    type: 'Feature',
                    geometry: {
                        type: isPolygon ? 'Polygon' : 'LineString',
                        coordinates: isPolygon ? [coordinates] : coordinates
                    },
                    properties: {
                        id: element.id,
                        type: element.type,
                        ...element.tags
                    }
                };
            }
        }

        return null;
    }

    /**
     * Tạo truy vấn tùy chỉnh cho ranh giới hành chính
     * @param areaName Tên khu vực
     * @param adminLevel Cấp hành chính
     * @returns Observable của GeoJSON FeatureCollection
     */
    getAdministrativeBoundaries(areaName: string, adminLevel: string): Observable<GeoJSONFeatureCollection> {
        // Sanitize inputs để tránh injection attacks
        const sanitizedAreaName = this.sanitizeQueryInput(areaName);
        const sanitizedAdminLevel = this.sanitizeQueryInput(adminLevel);

        const query = `
            [out:json][timeout:25];
            area["name"~"${sanitizedAreaName}"]["admin_level"="${sanitizedAdminLevel}"]->.searchArea;
            (
                relation(area.searchArea)["boundary"="administrative"];
            );
            out body;
            >;
            out skel qt;
        `;

        return this.executeQuery(query);
    }

    /**
     * Kiểm tra tính hợp lệ của Overpass API response
     * @param response Phản hồi từ Overpass API
     * @returns true nếu response hợp lệ, false nếu không
     */
    private isValidOverpassResponse(response: any): response is OverpassResponse {
        if (!response || typeof response !== 'object') {
            return false;
        }

        // Kiểm tra các trường bắt buộc
        if (!response.elements || !Array.isArray(response.elements)) {
            return false;
        }

        // Kiểm tra version và generator (optional nhưng nên có)
        if (response.version === undefined) {
            console.warn('Overpass response thiếu trường version', {
                hasElements: response.elements?.length,
                hasGenerator: !!response.generator
            });
        }

        return true;
    }

    /**
     * Sanitize input để tránh query injection
     * @param input Chuỗi đầu vào
     * @returns Chuỗi đã được sanitize
     */
    private sanitizeQueryInput(input: string): string {
        // Loại bỏ các ký tự đặc biệt có thể gây injection
        // Chỉ cho phép chữ cái, số, khoảng trắng, và dấu gạch ngang
        return input.replace(/[^\w\s\-ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/g, '');
    }
}
