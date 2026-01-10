import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import maplibregl from 'maplibre-gl';

// Dữ liệu marker demo cho Việt Nam
interface LocationMarker {
    id: number;
    name: string;
    lng: number;
    lat: number;
    description: string;
    image?: string;
    category: string;
}

const DEMO_LOCATIONS: LocationMarker[] = [
    {
        id: 1,
        name: 'Hà Nội',
        lng: 105.8342,
        lat: 21.0278,
        description: 'Thủ đô của Việt Nam, nơi có nhiều di tích lịch sử và văn hóa.',
        category: 'Thành phố'
    },
    {
        id: 2,
        name: 'Thành phố Hồ Chí Minh',
        lng: 106.6297,
        lat: 10.8231,
        description: 'Thành phố lớn nhất Việt Nam, trung tâm kinh tế năng động.',
        category: 'Thành phố'
    },
    {
        id: 3,
        name: 'Đà Nẵng',
        lng: 108.2022,
        lat: 16.0544,
        description: 'Thành phố đáng sống với bãi biển đẹp và cơ sở hạ tầng hiện đại.',
        category: 'Thành phố'
    },
    {
        id: 4,
        name: 'Hội An',
        lng: 108.3380,
        lat: 15.8801,
        description: 'Phố cổ Hội An - Di sản văn hóa thế giới với kiến trúc độc đáo.',
        category: 'Di sản'
    },
    {
        id: 5,
        name: 'Huế',
        lng: 107.5909,
        lat: 16.4637,
        description: 'Cố đô Huế với Đại Nội và nhiều lăng tẩm vua chúa.',
        category: 'Di sản'
    },
    {
        id: 6,
        name: 'Hạ Long',
        lng: 107.0431,
        lat: 20.9101,
        description: 'Vịnh Hạ Long - Di sản thiên nhiên thế giới với cảnh quan tuyệt đẹp.',
        category: 'Di sản'
    },
    {
        id: 7,
        name: 'Nha Trang',
        lng: 109.1967,
        lat: 12.2388,
        description: 'Thành phố biển nổi tiếng với bãi tắm đẹp và đời sống du lịch sôi động.',
        category: 'Du lịch'
    },
    {
        id: 8,
        name: 'Phú Quốc',
        lng: 103.9860,
        lat: 10.2269,
        description: 'Đảo ngọc Phú Quốc với bãi biển hoang sơ và hệ sinh thái phong phú.',
        category: 'Du lịch'
    },
    {
        id: 9,
        name: 'Đà Lạt',
        lng: 108.4583,
        lat: 11.9404,
        description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm.',
        category: 'Du lịch'
    },
    {
        id: 10,
        name: 'Sa Pa',
        lng: 103.8409,
        lat: 22.3364,
        description: 'Vùng núi phía Bắc với ruộng bậc thang tuyệt đẹp.',
        category: 'Du lịch'
    }
];

@Component({
    selector: 'app-map-demo',
    imports: [CommonModule, ButtonModule, CardModule],
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="card">
            <div class="font-semibold text-2xl mb-4">Bản Đồ Demo</div>
            <p class="text-muted-color mb-4 line-height-3">
                Trang demo tích hợp thư viện bản đồ với các tính năng: hiển thị marker, popup, cluster và controls.
            </p>

            <div class="grid grid-cols-12 gap-6">
                <!-- Bản đồ cơ bản -->
                <div class="col-span-12 lg:col-span-6">
                    <div class="card">
                        <h3 class="font-semibold text-xl mb-3">Bản Đồ Cơ Bản</h3>
                        <div id="basic-map" class="w-full h-[400px] rounded-border"></div>
                    </div>
                </div>

                <!-- Bản đồ với Markers -->
                <div class="col-span-12 lg:col-span-6">
                    <div class="card">
                        <h3 class="font-semibold text-xl mb-3">Markers & Popups</h3>
                        <div id="markers-map" class="w-full h-[400px] rounded-border"></div>
                    </div>
                </div>

                <!-- Standalone Popup -->
                <div class="col-span-12 lg:col-span-6">
                    <div class="card">
                        <h3 class="font-semibold text-xl mb-3">Standalone Popup</h3>
                        <div class="mb-3">
                            <p-button
                                [label]="showStandalonePopup ? 'Ẩn Popup' : 'Hiển Thị Popup'"
                                [severity]="showStandalonePopup ? 'secondary' : 'primary'"
                                (onClick)="toggleStandalonePopup()"
                                size="small"
                            />
                        </div>
                        <div id="standalone-popup-map" class="w-full h-[400px] rounded-border"></div>
                    </div>
                </div>

                <!-- Cluster Map -->
                <div class="col-span-12 lg:col-span-6">
                    <div class="card">
                        <h3 class="font-semibold text-xl mb-3">Cluster Demo</h3>
                        <p class="text-sm text-muted-color mb-3">
                            Các marker được nhóm lại khi zoom out, click vào cluster để zoom in.
                        </p>
                        <div id="cluster-map" class="w-full h-[400px] rounded-border"></div>
                    </div>
                </div>

                <!-- Rich Popup Map -->
                <div class="col-span-12">
                    <div class="card">
                        <h3 class="font-semibold text-xl mb-3">Rich Popups với Nội Dung Chi Tiết</h3>
                        <p class="text-sm text-muted-color mb-3">
                            Click vào các marker để xem popup với hình ảnh và thông tin chi tiết.
                        </p>
                        <div id="rich-popup-map" class="w-full h-[500px] rounded-border"></div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: `
        @import 'maplibre-gl/dist/maplibre-gl.css';

        .maplibregl-popup-content {
            padding: 0;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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

        .marker {
            cursor: pointer;
            transition: transform 0.2s;
        }

        .marker:hover {
            transform: scale(1.1);
        }

        .cluster-marker {
            cursor: pointer;
            transition: transform 0.2s;
        }

        .cluster-marker:hover {
            transform: scale(1.15);
        }

        .popup-content {
            padding: 1rem;
            min-width: 200px;
        }

        .popup-content h4 {
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-color);
        }

        .popup-content p {
            margin: 0;
            color: var(--text-color-secondary);
            font-size: 0.9rem;
        }

        .rich-popup-content {
            max-width: 300px;
        }

        .rich-popup-content img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px 8px 0 0;
        }

        .rich-popup-content .content {
            padding: 1rem;
        }

        .rich-popup-content h4 {
            margin: 0 0 0.5rem 0;
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--text-color);
        }

        .rich-popup-content .category {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: var(--primary-color);
            color: white;
            border-radius: 12px;
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
        }

        .rich-popup-content p {
            margin: 0;
            color: var(--text-color-secondary);
            line-height: 1.5;
        }
    `
})
export class MapDemo implements OnInit, OnDestroy {
    private maps: Map<string, maplibregl.Map> = new Map();
    private markers: maplibregl.Marker[] = [];
    showStandalonePopup = false;
    private standalonePopup: maplibregl.Popup | null = null;

    ngOnInit(): void {
        this.initBasicMap();
        this.initMarkersMap();
        this.initStandalonePopupMap();
        this.initClusterMap();
        this.initRichPopupMap();
    }

    ngOnDestroy(): void {
        this.markers.forEach((marker) => marker.remove());
        this.maps.forEach((map) => map.remove());
        this.maps.clear();
        this.markers = [];
    }

    private initBasicMap(): void {
        const map = new maplibregl.Map({
            container: 'basic-map',
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            center: [106.6297, 15.5],
            zoom: 5,
            attributionControl: {
                compact: true
            }
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.addControl(new maplibregl.FullscreenControl(), 'top-right');

        this.maps.set('basic', map);
    }

    private initMarkersMap(): void {
        const map = new maplibregl.Map({
            container: 'markers-map',
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            center: [106.6297, 15.5],
            zoom: 5
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.on('load', () => {
            DEMO_LOCATIONS.slice(0, 5).forEach((location) => {
                const el = document.createElement('div');
                el.className = 'marker';
                el.style.width = '24px';
                el.style.height = '24px';
                el.style.borderRadius = '50%';
                el.style.backgroundColor = '#3b82f6';
                el.style.border = '2px solid white';
                el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

                const popup = new maplibregl.Popup({ offset: 25, closeButton: true }).setHTML(`
                    <div class="popup-content">
                        <h4>${location.name}</h4>
                        <p>${location.description}</p>
                    </div>
                `);

                const marker = new maplibregl.Marker(el)
                    .setLngLat([location.lng, location.lat])
                    .setPopup(popup)
                    .addTo(map);

                this.markers.push(marker);
            });
        });

        this.maps.set('markers', map);
    }

    private initStandalonePopupMap(): void {
        const map = new maplibregl.Map({
            container: 'standalone-popup-map',
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            center: [105.8342, 21.0278],
            zoom: 13
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        this.maps.set('standalone', map);
    }

    toggleStandalonePopup(): void {
        const map = this.maps.get('standalone');

        if (!map) {
            return;
        }

        this.showStandalonePopup = !this.showStandalonePopup;

        if (this.showStandalonePopup) {
            this.standalonePopup = new maplibregl.Popup({
                closeOnClick: false,
                closeButton: true
            })
                .setLngLat([105.8342, 21.0278])
                .setHTML(`
                    <div class="popup-content">
                        <h4>Hà Nội - Thủ Đô</h4>
                        <p>Thành phố ngàn năm văn hiến với nhiều di tích lịch sử.</p>
                        <p style="margin-top: 0.5rem; font-size: 0.85rem;">
                            <strong>Dân số:</strong> ~8.5 triệu người
                        </p>
                    </div>
                `)
                .addTo(map);

            this.standalonePopup.on('close', () => {
                this.showStandalonePopup = false;
                this.standalonePopup = null;
            });
        } else if (this.standalonePopup) {
            this.standalonePopup.remove();
            this.standalonePopup = null;
        }
    }

    private initClusterMap(): void {
        const map = new maplibregl.Map({
            container: 'cluster-map',
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            center: [106.6297, 15.5],
            zoom: 5
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.on('load', () => {
            // Tạo GeoJSON từ dữ liệu locations
            const geojson = {
                type: 'FeatureCollection',
                features: DEMO_LOCATIONS.map((loc) => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [loc.lng, loc.lat]
                    },
                    properties: {
                        name: loc.name,
                        description: loc.description,
                        category: loc.category
                    }
                }))
            };

            map.addSource('locations', {
                type: 'geojson',
                data: geojson as any,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50
            });

            // Layer cho clusters
            map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'locations',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': ['step', ['get', 'point_count'], '#22c55e', 5, '#eab308', 10, '#ef4444'],
                    'circle-radius': ['step', ['get', 'point_count'], 20, 5, 30, 10, 40]
                }
            });

            // Layer cho số lượng trong cluster
            map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'locations',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-size': 12
                },
                paint: {
                    'text-color': '#ffffff'
                }
            });

            // Layer cho các điểm đơn lẻ
            map.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'locations',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#3b82f6',
                    'circle-radius': 8,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#fff'
                }
            });

            // Click vào cluster để zoom
            map.on('click', 'clusters', (e: any) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ['clusters']
                });

                const clusterId = features[0].properties['cluster_id'];
                const source: any = map.getSource('locations');

                source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
                    if (err) {
                        return;
                    }

                    map.easeTo({
                        center: (features[0].geometry as any).coordinates,
                        zoom: zoom
                    });
                });
            });

            // Hiển thị popup khi click vào điểm đơn lẻ
            map.on('click', 'unclustered-point', (e: any) => {
                const coordinates = (e.features[0].geometry as any).coordinates.slice();
                const { name, description } = e.features[0].properties;

                new maplibregl.Popup().setLngLat(coordinates).setHTML(`
                    <div class="popup-content">
                        <h4>${name}</h4>
                        <p>${description}</p>
                    </div>
                `).addTo(map);
            });

            // Thay đổi con trỏ khi hover
            map.on('mouseenter', 'clusters', () => {
                map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', 'clusters', () => {
                map.getCanvas().style.cursor = '';
            });

            map.on('mouseenter', 'unclustered-point', () => {
                map.getCanvas().style.cursor = 'pointer';
            });

            map.on('mouseleave', 'unclustered-point', () => {
                map.getCanvas().style.cursor = '';
            });
        });

        this.maps.set('cluster', map);
    }

    private initRichPopupMap(): void {
        const map = new maplibregl.Map({
            container: 'rich-popup-map',
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            center: [106.6297, 15.5],
            zoom: 5
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.addControl(new maplibregl.FullscreenControl(), 'top-right');

        const locationImages: Record<string, string> = {
            'Hà Nội': 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=300&h=150&fit=crop',
            'Thành phố Hồ Chí Minh': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=300&h=150&fit=crop',
            'Đà Nẵng': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=300&h=150&fit=crop',
            'Hội An': 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=300&h=150&fit=crop',
            'Huế': 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=300&h=150&fit=crop',
            'Hạ Long': 'https://images.unsplash.com/photo-1528127269322-539801943592?w=300&h=150&fit=crop',
            'Nha Trang': 'https://images.unsplash.com/photo-1572967771481-0c4e4e6e0fce?w=300&h=150&fit=crop',
            'Phú Quốc': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=300&h=150&fit=crop',
            'Đà Lạt': 'https://images.unsplash.com/photo-1599802090336-0a5935f41d01?w=300&h=150&fit=crop',
            'Sa Pa': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=300&h=150&fit=crop'
        };

        map.on('load', () => {
            DEMO_LOCATIONS.forEach((location) => {
                const el = document.createElement('div');
                el.className = 'marker';
                el.style.width = '30px';
                el.style.height = '30px';
                el.style.borderRadius = '50%';

                // Màu sắc theo category
                const colors: Record<string, string> = {
                    'Thành phố': '#3b82f6',
                    'Di sản': '#ef4444',
                    'Du lịch': '#22c55e'
                };

                el.style.backgroundColor = colors[location.category] || '#6b7280';
                el.style.border = '3px solid white';
                el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

                const imageUrl = locationImages[location.name] || 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=150&fit=crop';

                const popup = new maplibregl.Popup({ offset: 25, closeButton: true, maxWidth: '300px' }).setHTML(`
                    <div class="rich-popup-content">
                        <img src="${imageUrl}" alt="${location.name}" />
                        <div class="content">
                            <span class="category">${location.category}</span>
                            <h4>${location.name}</h4>
                            <p>${location.description}</p>
                        </div>
                    </div>
                `);

                const marker = new maplibregl.Marker(el)
                    .setLngLat([location.lng, location.lat])
                    .setPopup(popup)
                    .addTo(map);

                this.markers.push(marker);
            });
        });

        this.maps.set('rich', map);
    }
}
