import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import maplibregl from 'maplibre-gl';
import { OverpassService } from '@/services/overpass.service';
import { LayoutService } from '@/layout/service/layout.service';
import { Subscription } from 'rxjs';

interface RenderStyle {
    fillColor: string;
    fillOpacity: number;
    strokeColor: string;
    strokeWidth: number;
}

@Component({
    selector: 'app-map-overpass-turbo-demo',
    standalone: true,
    imports: [CommonModule, ButtonModule, CardModule, ProgressSpinnerModule, MessageModule, SelectModule, InputTextModule, FormsModule],
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="card">
            <div class="font-semibold text-2xl mb-4">Bản Đồ Overpass Turbo - Ranh Giới Hành Chính</div>
            <p class="text-muted-color mb-4 line-height-3">Demo tích hợp Overpass Turbo API để truy vấn và hiển thị ranh giới hành chính của tỉnh Lâm Đồng từ OpenStreetMap.</p>

            <!-- Controls -->
            <div class="grid grid-cols-12 gap-4 mb-4">
                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <label class="block text-sm font-medium mb-2">Tỉnh/Thành phố</label>
                    <input type="text" pInputText [(ngModel)]="areaName" placeholder="VD: Lâm Đồng" class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <label class="block text-sm font-medium mb-2">Cấp hành chính</label>
                    <p-select [(ngModel)]="adminLevel" [options]="adminLevelOptions" optionLabel="label" optionValue="value" placeholder="Chọn cấp" class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <label class="block text-sm font-medium mb-2">Style hiển thị</label>
                    <p-select [(ngModel)]="selectedStyle" [options]="styleOptions" optionLabel="label" optionValue="value" (onChange)="applyStyle()" placeholder="Chọn style" class="w-full" />
                </div>
                <div class="col-span-12 md:col-span-6 lg:col-span-3 flex items-end">
                    <p-button label="Tải dữ liệu" icon="pi pi-refresh" (onClick)="loadData()" [loading]="loading" [disabled]="loading || !areaName" class="w-full" />
                </div>
            </div>

            <!-- Error Message -->
            @if (errorMessage) {
                <p-message severity="error" [text]="errorMessage" class="mb-4 w-full" />
            }

            <!-- Map Container with Loading Overlay -->
            <div class="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden relative" style="height: 600px;">
                <div id="overpass-map" class="w-full h-full"></div>
                @if (loading) {
                    <div class="absolute inset-0 bg-surface-0/80 dark:bg-surface-900/80 flex justify-center items-center z-10">
                        <p-progressSpinner styleClass="w-16 h-16" strokeWidth="4" animationDuration="1s" />
                    </div>
                }
            </div>

            <!-- Info Section -->
            <div class="mt-4 grid grid-cols-12 gap-4">
                <div class="col-span-12 md:col-span-6">
                    <div class="card bg-primary-50 dark:bg-primary-950/30">
                        <h3 class="text-lg font-semibold mb-2">Thông tin Overpass Turbo API</h3>
                        <p class="text-muted-color mb-2 text-sm">Overpass API là một dịch vụ web-based để truy vấn dữ liệu từ OpenStreetMap.</p>
                        <p class="text-muted-color text-sm">API này cho phép thực hiện các truy vấn phức tạp để lấy dữ liệu địa lý như ranh giới hành chính, đường phố, các địa điểm quan trọng và nhiều thông tin khác.</p>
                    </div>
                </div>
                <div class="col-span-12 md:col-span-6">
                    <div class="card bg-blue-50 dark:bg-blue-950/30">
                        <h3 class="text-lg font-semibold mb-2">Truy vấn mẫu</h3>
                        <pre class="text-xs bg-surface-100 dark:bg-surface-800 p-3 rounded overflow-x-auto">{{ sampleQuery }}</pre>
                    </div>
                </div>
            </div>

            <!-- Statistics -->
            @if (featureCount > 0) {
                <div class="mt-4">
                    <div class="card bg-green-50 dark:bg-green-950/30">
                        <div class="flex items-center gap-3">
                            <i class="pi pi-info-circle text-2xl text-green-600"></i>
                            <div>
                                <p class="font-semibold">Đã tải {{ featureCount }} ranh giới hành chính</p>
                                <p class="text-sm text-muted-color">Click vào các ranh giới để xem thông tin chi tiết</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    `,
    styles: `
        @import 'maplibre-gl/dist/maplibre-gl.css';

        .maplibregl-popup-content {
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
            min-width: 250px;
        }

        .maplibregl-popup-close-button {
            font-size: 20px;
            padding: 4px 8px;
            color: #666;
        }

        .maplibregl-popup-close-button:hover {
            background-color: rgba(0, 0, 0, 0.05);
            color: #333;
        }

        .boundary-popup h4 {
            margin: 0 0 0.75rem 0;
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-color);
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 0.5rem;
        }

        .boundary-popup .info-row {
            display: flex;
            justify-content: space-between;
            padding: 0.25rem 0;
            font-size: 0.9rem;
        }

        .boundary-popup .info-label {
            font-weight: 500;
            color: var(--text-color-secondary);
        }

        .boundary-popup .info-value {
            color: var(--text-color);
            font-weight: 600;
        }
    `
})
export class MapOverpassTurboDemo implements OnInit, OnDestroy {
    private map: maplibregl.Map | null = null;
    private overpassService = inject(OverpassService);
    private layoutService = inject(LayoutService);
    private themeSubscription: Subscription | null = null;

    loading = false;
    errorMessage = '';
    featureCount = 0;
    areaName = 'Lâm Đồng';
    adminLevel = '6';
    selectedStyle = 'default';

    adminLevelOptions = [
        { label: 'Cấp 4 (Tỉnh/Thành phố)', value: '4' },
        { label: 'Cấp 6 (Quận/Huyện)', value: '6' },
        { label: 'Cấp 8 (Phường/Xã)', value: '8' }
    ];

    styleOptions = [
        { label: 'Mặc định', value: 'default' },
        { label: 'Đậm màu', value: 'bold' },
        { label: 'Pastel', value: 'pastel' },
        { label: 'Neon', value: 'neon' }
    ];

    sampleQuery = `[out:json][timeout:25];
area["name"~"Lâm Đồng"]["admin_level"="4"]->.lamdong;
relation(area.lamdong)["admin_level"="6"]["boundary"="administrative"];
out body;
>;
out skel qt;`;

    ngOnInit(): void {
        // Wait for view to initialize before creating map
        setTimeout(() => {
            this.initMap();
            this.loadData();
        }, 0);

        // Subscribe to theme changes
        this.themeSubscription = this.layoutService.configUpdate$.subscribe(() => {
            this.updateMapTheme();
        });
    }

    ngOnDestroy(): void {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        this.themeSubscription?.unsubscribe();
    }

    private getMapStyle(): string {
        const isDark = this.layoutService.isDarkTheme();

        return isDark ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json' : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
    }

    private updateMapTheme(): void {
        if (this.map) {
            this.map.setStyle(this.getMapStyle());
        }
    }

    private initMap(): void {
        // Center map on Lâm Đồng province (approximately)
        this.map = new maplibregl.Map({
            container: 'overpass-map',
            style: this.getMapStyle(),
            center: [108.4583, 11.9404], // Đà Lạt coordinates
            zoom: 8
        });

        this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
        this.map.addControl(new maplibregl.FullscreenControl(), 'top-right');
        this.map.addControl(new maplibregl.ScaleControl(), 'bottom-left');
        this.map.addControl(new maplibregl.AttributionControl(), 'bottom-right');
    }

    loadData(): void {
        if (!this.map || !this.areaName) {
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        this.featureCount = 0;

        // Clear existing layers
        this.clearMapLayers();

        // Fetch data from Overpass API
        this.overpassService.getAdministrativeBoundaries(this.areaName, this.adminLevel).subscribe({
            next: (geojson) => {
                this.loading = false;
                this.featureCount = geojson.features.length;

                if (geojson.features.length === 0) {
                    this.errorMessage = 'Không tìm thấy dữ liệu cho khu vực này. Vui lòng thử lại với tên khác.';

                    return;
                }

                this.renderBoundaries(geojson);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = 'Lỗi khi tải dữ liệu: ' + err.message;
                console.error('Error loading Overpass data:', err);
            }
        });
    }

    private clearMapLayers(): void {
        if (!this.map) {
            return;
        }

        // Remove existing layers and sources
        if (this.map.getLayer('boundaries-fill')) {
            this.map.removeLayer('boundaries-fill');
        }
        if (this.map.getLayer('boundaries-outline')) {
            this.map.removeLayer('boundaries-outline');
        }
        if (this.map.getLayer('boundaries-highlight')) {
            this.map.removeLayer('boundaries-highlight');
        }
        if (this.map.getSource('boundaries')) {
            this.map.removeSource('boundaries');
        }
    }

    private renderBoundaries(geojson: any): void {
        if (!this.map) {
            return;
        }

        const map = this.map;

        // Wait for style to load
        const addLayers = () => {
            // Add source
            map.addSource('boundaries', {
                type: 'geojson',
                data: geojson
            });

            const style = this.getStyleConfig();

            // Add fill layer
            map.addLayer({
                id: 'boundaries-fill',
                type: 'fill',
                source: 'boundaries',
                paint: {
                    'fill-color': style.fillColor,
                    'fill-opacity': style.fillOpacity
                }
            });

            // Add outline layer
            map.addLayer({
                id: 'boundaries-outline',
                type: 'line',
                source: 'boundaries',
                paint: {
                    'line-color': style.strokeColor,
                    'line-width': style.strokeWidth
                }
            });

            // Add highlight layer (for hover effect)
            map.addLayer({
                id: 'boundaries-highlight',
                type: 'line',
                source: 'boundaries',
                paint: {
                    'line-color': '#ff6b6b',
                    'line-width': 3,
                    'line-opacity': 0
                }
            });

            // Add click handler for popups
            map.on('click', 'boundaries-fill', (e: any) => {
                if (e.features && e.features.length > 0) {
                    const feature = e.features[0];
                    const props = feature.properties;

                    const popupContent = `
                        <div class="boundary-popup">
                            <h4>${props.name || props['name:vi'] || 'Không rõ tên'}</h4>
                            <div class="info-row">
                                <span class="info-label">Loại:</span>
                                <span class="info-value">${props.boundary || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Cấp hành chính:</span>
                                <span class="info-value">${props.admin_level || 'N/A'}</span>
                            </div>
                            ${
                                props.population
                                    ? `
                                <div class="info-row">
                                    <span class="info-label">Dân số:</span>
                                    <span class="info-value">${Number(props.population).toLocaleString()}</span>
                                </div>
                            `
                                    : ''
                            }
                            ${
                                props.wikipedia && props.wikipedia.includes(':')
                                    ? `
                                <div class="info-row">
                                    <span class="info-label">Wikipedia:</span>
                                    <span class="info-value"><a href="https://vi.wikipedia.org/wiki/${encodeURIComponent(props.wikipedia.split(':')[1])}" target="_blank" rel="noopener noreferrer">Xem</a></span>
                                </div>
                            `
                                    : ''
                            }
                        </div>
                    `;

                    new maplibregl.Popup().setLngLat(e.lngLat).setHTML(popupContent).addTo(map);
                }
            });

            // Add hover effect
            map.on('mouseenter', 'boundaries-fill', () => {
                map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mousemove', 'boundaries-fill', (e: any) => {
                if (e.features && e.features.length > 0) {
                    map.setPaintProperty('boundaries-highlight', 'line-opacity', 1);
                }
            });

            map.on('mouseleave', 'boundaries-fill', () => {
                map.getCanvas().style.cursor = '';
                map.setPaintProperty('boundaries-highlight', 'line-opacity', 0);
            });

            // Fit bounds to show all features
            if (geojson.features.length > 0) {
                const bounds = new maplibregl.LngLatBounds();

                geojson.features.forEach((feature: any) => {
                    if (feature.geometry.type === 'Polygon') {
                        feature.geometry.coordinates[0].forEach((coord: number[]) => {
                            bounds.extend(coord as [number, number]);
                        });
                    } else if (feature.geometry.type === 'MultiPolygon') {
                        feature.geometry.coordinates.forEach((polygon: number[][][]) => {
                            polygon[0].forEach((coord: number[]) => {
                                bounds.extend(coord as [number, number]);
                            });
                        });
                    } else if (feature.geometry.type === 'LineString') {
                        feature.geometry.coordinates.forEach((coord: number[]) => {
                            bounds.extend(coord as [number, number]);
                        });
                    }
                });

                map.fitBounds(bounds, { padding: 50, maxZoom: 12 });
            }
        };

        if (map.isStyleLoaded()) {
            this.clearMapLayers();
            addLayers();
        } else {
            map.once('load', () => {
                addLayers();
            });
        }
    }

    private getStyleConfig(): RenderStyle {
        switch (this.selectedStyle) {
            case 'bold':
                return {
                    fillColor: '#3b82f6',
                    fillOpacity: 0.4,
                    strokeColor: '#1e40af',
                    strokeWidth: 3
                };
            case 'pastel':
                return {
                    fillColor: '#a5b4fc',
                    fillOpacity: 0.3,
                    strokeColor: '#6366f1',
                    strokeWidth: 2
                };
            case 'neon':
                return {
                    fillColor: '#22d3ee',
                    fillOpacity: 0.3,
                    strokeColor: '#06b6d4',
                    strokeWidth: 2.5
                };
            default:
                return {
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2,
                    strokeColor: '#2563eb',
                    strokeWidth: 2
                };
        }
    }

    applyStyle(): void {
        if (!this.map || !this.map.getLayer('boundaries-fill')) {
            return;
        }

        const style = this.getStyleConfig();

        this.map.setPaintProperty('boundaries-fill', 'fill-color', style.fillColor);
        this.map.setPaintProperty('boundaries-fill', 'fill-opacity', style.fillOpacity);
        this.map.setPaintProperty('boundaries-outline', 'line-color', style.strokeColor);
        this.map.setPaintProperty('boundaries-outline', 'line-width', style.strokeWidth);
    }
}
