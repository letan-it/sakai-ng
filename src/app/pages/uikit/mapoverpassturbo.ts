import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-map-overpass-turbo-demo',
    standalone: true,
    imports: [CommonModule, ButtonModule, CardModule],
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-full">
                <div class="card">
                    <h2 class="text-2xl font-semibold mb-4">Map Overpass Turbo Demo</h2>
                    <p class="mb-4 text-muted-color">
                        Đây là demo tích hợp bản đồ với Overpass Turbo API để truy vấn dữ liệu OpenStreetMap.
                    </p>
                    
                    <div class="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden" style="height: 600px;">
                        <iframe
                            src="https://demo-recruitment.vercel.app/uikit/map-overpass-turbo"
                            style="width: 100%; height: 100%; border: none;"
                            title="Map Overpass Turbo Demo"
                        ></iframe>
                    </div>
                    
                    <div class="mt-4">
                        <h3 class="text-lg font-semibold mb-2">Thông tin</h3>
                        <p class="text-muted-color mb-2">
                            Overpass Turbo là một công cụ web-based để truy vấn dữ liệu từ OpenStreetMap sử dụng Overpass API.
                        </p>
                        <p class="text-muted-color">
                            Demo này cho phép bạn tìm kiếm và hiển thị các địa điểm, tuyến đường và các đối tượng địa lý khác trên bản đồ.
                        </p>
                    </div>
                    
                    <div class="mt-4 flex gap-2">
                        <p-button 
                            label="Mở trong tab mới" 
                            icon="pi pi-external-link" 
                            (onClick)="openInNewTab()"
                            severity="secondary"
                        />
                    </div>
                </div>
            </div>
        </div>
    `
})
export class MapOverpassTurboDemo {
    openInNewTab() {
        window.open('https://demo-recruitment.vercel.app/uikit/map-overpass-turbo', '_blank');
    }
}
