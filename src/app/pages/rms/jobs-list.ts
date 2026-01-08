import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RMSDataService } from '@/services/rms-data.service';
import { Job } from '@/models/rms.models';

@Component({
    selector: 'app-jobs-list',
    imports: [CommonModule, RouterModule, CardModule, TableModule, TagModule, ButtonModule],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Danh sách Công việc</h2>
                    <p class="text-surface-600 dark:text-surface-400 mt-1">Tất cả các vị trí tuyển dụng</p>
                </div>
                <p-button label="Quay lại Dashboard" icon="pi pi-arrow-left" [text]="true" [routerLink]="['/rms']" />
            </div>

            <p-table [value]="jobs" [tableStyle]="{ 'min-width': '60rem' }">
                <ng-template #header>
                    <tr>
                        <th>Tiêu đề</th>
                        <th>Địa điểm</th>
                        <th>Lương (VND)</th>
                        <th>Kinh nghiệm</th>
                        <th>Trạng thái</th>
                        <th style="width: 150px">Hành động</th>
                    </tr>
                </ng-template>
                <ng-template #body let-job>
                    <tr>
                        <td>
                            <div class="font-semibold text-primary">{{ job.title }}</div>
                            <div class="text-sm text-surface-600 dark:text-surface-400">{{ job.description | slice : 0 : 80 }}...</div>
                        </td>
                        <td>
                            <i class="pi pi-map-marker text-surface-400 mr-2"></i>
                            {{ job.location }}
                        </td>
                        <td>
                            <div class="text-sm">
                                {{ formatSalary(job.salary_min) }} - {{ formatSalary(job.salary_max) }}
                            </div>
                        </td>
                        <td>{{ job.experience_min }} - {{ job.experience_max }} năm</td>
                        <td>
                            <p-tag [value]="job.status" [severity]="job.status === 'Open' ? 'success' : 'danger'" />
                        </td>
                        <td>
                            <p-button label="Chi tiết" icon="pi pi-eye" [text]="true" size="small" [routerLink]="['/rms/jobs', job.id]" />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class JobsList implements OnInit {
    jobs: Job[] = [];

    constructor(private rmsService: RMSDataService) {}

    ngOnInit(): void {
        this.rmsService.getJobs().subscribe((jobs) => {
            this.jobs = jobs;
        });
    }

    formatSalary(amount: number): string {
        return (amount / 1000000).toFixed(0) + 'M';
    }
}
