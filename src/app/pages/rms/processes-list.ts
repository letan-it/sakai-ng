import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RMSDataService } from '@/services/rms-data.service';
import { RecruitmentProcess } from '@/models/rms.models';

@Component({
    selector: 'app-processes-list',
    imports: [CommonModule, RouterModule, CardModule, TableModule, TagModule, ButtonModule],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Quy trình Tuyển dụng</h2>
                    <p class="text-surface-600 dark:text-surface-400 mt-1">Theo dõi các quy trình tuyển dụng</p>
                </div>
                <p-button label="Quay lại Dashboard" icon="pi pi-arrow-left" [text]="true" [routerLink]="['/rms']" />
            </div>

            <p-table [value]="processes" [tableStyle]="{ 'min-width': '60rem' }">
                <ng-template #header>
                    <tr>
                        <th>Tên quy trình</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày hoàn thành</th>
                        <th>Trạng thái</th>
                        <th style="width: 150px">Hành động</th>
                    </tr>
                </ng-template>
                <ng-template #body let-process>
                    <tr>
                        <td>
                            <div class="font-semibold text-primary">{{ process.process_name }}</div>
                        </td>
                        <td>
                            <i class="pi pi-calendar text-surface-400 mr-2"></i>
                            {{ formatDate(process.started_at) }}
                        </td>
                        <td>
                            <i class="pi pi-calendar text-surface-400 mr-2"></i>
                            {{ process.completed_at ? formatDate(process.completed_at) : 'Đang tiến hành' }}
                        </td>
                        <td>
                            <p-tag [value]="process.status" [severity]="getStatusSeverity(process.status)" />
                        </td>
                        <td>
                            <p-button label="Chi tiết" icon="pi pi-eye" [text]="true" size="small" [routerLink]="['/rms/processes', process.id]" />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class ProcessesList implements OnInit {
    processes: RecruitmentProcess[] = [];

    constructor(private rmsService: RMSDataService) {}

    ngOnInit(): void {
        this.rmsService.getRecruitmentProcesses().subscribe((processes) => {
            this.processes = processes;
        });
    }

    formatDate(dateStr: string): string {
        const date = new Date(dateStr);

        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
        const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
            'In Progress': 'info',
            Completed: 'success',
            Cancelled: 'danger'
        };

        return severityMap[status] || 'secondary';
    }
}
