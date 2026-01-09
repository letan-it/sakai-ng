import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

interface AppIcon {
    name: string;
    icon: string;
    color: string;
    bgColor: string;
}

@Component({
    standalone: true,
    selector: 'app-icons-widget',
    imports: [CommonModule, RippleModule],
    providers: [],
    template: `
        <div class="col-span-12">
            <div class="card">
                <h5 class="text-xl font-semibold mb-6">Chức năng & Ứng dụng</h5>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    <div 
                        *ngFor="let app of applications" 
                        class="flex flex-col items-center justify-center p-6 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                        [ngClass]="app.bgColor"
                        (click)="onAppClick(app.name)"
                        pRipple
                    >
                        <div class="flex items-center justify-center mb-3 rounded-full w-16 h-16" [ngClass]="'bg-white/80'">
                            <i [class]="'pi ' + app.icon + ' text-3xl ' + app.color"></i>
                        </div>
                        <span class="text-sm font-medium text-center text-surface-700 dark:text-surface-200">{{ app.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AppIconsWidget {
    applications: AppIcon[] = [
        { name: 'Nhân sự', icon: 'pi-users', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
        { name: 'Lương thưởng', icon: 'pi-dollar', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' },
        { name: 'Chấm công', icon: 'pi-clock', color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
        { name: 'Đào tạo', icon: 'pi-book', color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
        { name: 'Dự án', icon: 'pi-briefcase', color: 'text-cyan-600', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20' },
        { name: 'Tài liệu', icon: 'pi-file', color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
        { name: 'Tin nhắn', icon: 'pi-comments', color: 'text-pink-600', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
        { name: 'Lịch họp', icon: 'pi-calendar', color: 'text-teal-600', bgColor: 'bg-teal-50 dark:bg-teal-900/20' },
        { name: 'Báo cáo', icon: 'pi-chart-bar', color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20' },
        { name: 'Cài đặt', icon: 'pi-cog', color: 'text-gray-600', bgColor: 'bg-gray-50 dark:bg-gray-900/20' },
        { name: 'Thông báo', icon: 'pi-bell', color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
        { name: 'Hỗ trợ', icon: 'pi-question-circle', color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' }
    ];

    constructor(private messageService: MessageService) {}

    onAppClick(appName: string) {
        this.messageService.add({
            severity: 'info',
            summary: 'Thông báo',
            detail: `Chức năng "${appName}" đang được phát triển`,
            life: 3000
        });
    }
}
