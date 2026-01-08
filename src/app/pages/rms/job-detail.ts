import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RMSDataService } from '@/services/rms-data.service';
import { JobWithDetails } from '@/models/rms.models';

@Component({
    selector: 'app-job-detail',
    imports: [CommonModule, RouterModule, CardModule, TableModule, TagModule, ChipModule, ProgressBarModule, ButtonModule, DividerModule],
    template: `
        <div class="grid grid-cols-12 gap-6" *ngIf="job">
            <div class="col-span-12">
                <div class="flex justify-between items-start">
                    <div>
                        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ job.title }}</h1>
                        <p class="text-surface-600 dark:text-surface-400 mt-2">
                            <i class="pi pi-building mr-2"></i>
                            {{ job.customer?.name }} - {{ job.customer?.industry }}
                        </p>
                    </div>
                    <p-button label="Quay lại" icon="pi pi-arrow-left" [text]="true" [routerLink]="['/rms/jobs']" />
                </div>
            </div>

            <!-- Thông tin công việc -->
            <div class="col-span-12 lg:col-span-8">
                <p-card header="Thông tin Công việc">
                    <div class="space-y-4">
                        <div>
                            <h3 class="font-semibold text-surface-700 dark:text-surface-300 mb-2">Mô tả công việc</h3>
                            <p class="text-surface-600 dark:text-surface-400">{{ job.description }}</p>
                        </div>

                        <p-divider />

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Địa điểm</h4>
                                <p class="font-medium">
                                    <i class="pi pi-map-marker text-primary mr-2"></i>
                                    {{ job.location }}
                                </p>
                            </div>
                            <div>
                                <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Mức lương</h4>
                                <p class="font-medium">{{ formatSalary(job.salary_min) }} - {{ formatSalary(job.salary_max) }} VND</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Trình độ học vấn</h4>
                                <p class="font-medium">{{ job.education_level }}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Kinh nghiệm</h4>
                                <p class="font-medium">{{ job.experience_min }} - {{ job.experience_max }} năm</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Trạng thái</h4>
                                <p-tag [value]="job.status" [severity]="job.status === 'Open' ? 'success' : 'danger'" />
                            </div>
                        </div>

                        <p-divider />

                        <div>
                            <h3 class="font-semibold text-surface-700 dark:text-surface-300 mb-3">Kỹ năng yêu cầu</h3>
                            <div class="flex flex-wrap gap-2">
                                <p-chip
                                    *ngFor="let skill of job.skills"
                                    [label]="skill.name + ' (' + getImportanceText(skill.importance_level) + ')'"
                                    [styleClass]="getImportanceClass(skill.importance_level)"
                                />
                            </div>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Thông tin liên hệ -->
            <div class="col-span-12 lg:col-span-4">
                <p-card header="Thông tin Liên hệ">
                    <div class="space-y-3">
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Công ty</h4>
                            <p class="font-medium">{{ job.customer?.name }}</p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Ngành nghề</h4>
                            <p class="font-medium">{{ job.customer?.industry }}</p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Email</h4>
                            <p class="font-medium">{{ job.customer?.contact_email }}</p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Điện thoại</h4>
                            <p class="font-medium">{{ job.customer?.contact_phone }}</p>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Ứng viên đã ứng tuyển -->
            <div class="col-span-12">
                <p-card header="Ứng viên đã ứng tuyển">
                    <p-table [value]="job.candidates" [tableStyle]="{ 'min-width': '50rem' }">
                        <ng-template #header>
                            <tr>
                                <th>Tên ứng viên</th>
                                <th>Vị trí hiện tại</th>
                                <th>Địa điểm</th>
                                <th>Trạng thái</th>
                                <th>Matching Score</th>
                                <th style="width: 150px">Hành động</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-candidate>
                            <tr>
                                <td>
                                    <div class="flex items-center gap-2">
                                        <i class="pi pi-user text-primary"></i>
                                        <span class="font-semibold">{{ candidate.full_name }}</span>
                                    </div>
                                </td>
                                <td>{{ candidate.current_position }}</td>
                                <td>{{ candidate.location }}</td>
                                <td>
                                    <p-tag [value]="candidate.status" [severity]="getStatusSeverity(candidate.status)" />
                                </td>
                                <td>
                                    <div class="flex items-center gap-3">
                                        <p-progressBar [value]="candidate.matching_score.overall_score" [showValue]="false" [style]="{ width: '120px', height: '8px' }" />
                                        <span class="font-semibold text-primary">{{ candidate.matching_score.overall_score }}%</span>
                                    </div>
                                </td>
                                <td>
                                    <p-button label="Xem" icon="pi pi-eye" [text]="true" size="small" [routerLink]="['/rms/candidates', candidate.id]" />
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template #emptymessage>
                            <tr>
                                <td colspan="6" class="text-center text-surface-500 dark:text-surface-400 py-8">Chưa có ứng viên nào ứng tuyển</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-card>
            </div>
        </div>
    `
})
export class JobDetail implements OnInit {
    job: JobWithDetails | null = null;

    constructor(
        private route: ActivatedRoute,
        private rmsService: RMSDataService
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.rmsService.getJobById(id).subscribe((job) => {
            this.job = job || null;
        });
    }

    formatSalary(amount: number): string {
        return (amount / 1000000).toFixed(0) + ' triệu';
    }

    getImportanceText(level: number): string {
        const labels = ['', 'Tốt nếu có', 'Cơ bản', 'Quan trọng', 'Rất quan trọng', 'Bắt buộc'];

        return labels[level] || '';
    }

    getImportanceClass(level: number): string {
        if (level >= 5) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
        if (level >= 4) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
        if (level >= 3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';

        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    }

    getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
        const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
            Pending: 'warning',
            Interviewing: 'info',
            Hired: 'success',
            Rejected: 'danger'
        };

        return severityMap[status] || 'secondary';
    }
}
