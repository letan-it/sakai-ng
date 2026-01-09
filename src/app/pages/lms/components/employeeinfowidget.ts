import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { Employee } from '@/models/lms.models';

@Component({
    selector: 'app-employee-info-widget',
    imports: [CommonModule, CardModule, AvatarModule],
    template: `
        <p-card styleClass="h-full">
            <ng-template #header>
                <div class="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <h2 class="text-2xl font-bold mb-1">Thông tin Nhân viên</h2>
                    <p class="text-blue-100">Employee Information</p>
                </div>
            </ng-template>

            <div class="flex items-center gap-6" *ngIf="employee">
                <p-avatar [label]="getInitials(employee.name)" size="xlarge" shape="circle" styleClass="bg-primary text-primary-contrast text-2xl" />

                <div class="flex-1">
                    <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">{{ employee.name }}</h3>

                    <div class="grid grid-cols-1 gap-3 text-surface-700 dark:text-surface-300">
                        <div class="flex items-center gap-3">
                            <i class="pi pi-envelope text-primary"></i>
                            <span>{{ employee.email }}</span>
                        </div>

                        <div class="flex items-center gap-3">
                            <i class="pi pi-building text-primary"></i>
                            <span><strong>Phòng ban:</strong> {{ employee.department }}</span>
                        </div>

                        <div class="flex items-center gap-3">
                            <i class="pi pi-briefcase text-primary"></i>
                            <span><strong>Vị trí:</strong> {{ employee.position }}</span>
                        </div>

                        <div class="flex items-center gap-3">
                            <i class="pi pi-calendar text-primary"></i>
                            <span><strong>Ngày vào:</strong> {{ formatDate(employee.joinDate) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </p-card>
    `
})
export class EmployeeInfoWidget {
    @Input() employee: Employee | null = null;

    getInitials(name: string): string {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);

        return date.toLocaleDateString('vi-VN');
    }
}
