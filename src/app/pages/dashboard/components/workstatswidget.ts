import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-work-stats-widget',
    imports: [CommonModule],
    template: `
        <div class="col-span-12 lg:col-span-4">
            <div class="card mb-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="block text-blue-100 font-medium mb-2">Công thực tế</span>
                        <div class="text-white font-bold text-3xl">22</div>
                    </div>
                    <div class="flex items-center justify-center bg-white/20 rounded-border" style="width: 3rem; height: 3rem">
                        <i class="pi pi-briefcase text-white text-2xl"></i>
                    </div>
                </div>
                <div class="text-blue-100 text-sm">
                    <i class="pi pi-calendar mr-2"></i>
                    <span>Tháng này</span>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-4">
            <div class="card mb-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="block text-green-100 font-medium mb-2">Nghỉ có lương</span>
                        <div class="text-white font-bold text-3xl">3</div>
                    </div>
                    <div class="flex items-center justify-center bg-white/20 rounded-border" style="width: 3rem; height: 3rem">
                        <i class="pi pi-check-circle text-white text-2xl"></i>
                    </div>
                </div>
                <div class="text-green-100 text-sm">
                    <i class="pi pi-calendar mr-2"></i>
                    <span>Ngày được phép</span>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-4">
            <div class="card mb-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="block text-orange-100 font-medium mb-2">Nghỉ không lương</span>
                        <div class="text-white font-bold text-3xl">1</div>
                    </div>
                    <div class="flex items-center justify-center bg-white/20 rounded-border" style="width: 3rem; height: 3rem">
                        <i class="pi pi-times-circle text-white text-2xl"></i>
                    </div>
                </div>
                <div class="text-orange-100 text-sm">
                    <i class="pi pi-calendar mr-2"></i>
                    <span>Ngày tạm nghỉ</span>
                </div>
            </div>
        </div>
    `
})
export class WorkStatsWidget {}
