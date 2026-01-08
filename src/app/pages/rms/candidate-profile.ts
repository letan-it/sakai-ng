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
import { TimelineModule } from 'primeng/timeline';
import { RMSDataService } from '@/services/rms-data.service';
import { CandidateWithDetails, CandidateExperience } from '@/models/rms.models';

@Component({
    selector: 'app-candidate-profile',
    imports: [CommonModule, RouterModule, CardModule, TableModule, TagModule, ChipModule, ProgressBarModule, ButtonModule, DividerModule, TimelineModule],
    template: `
        <div class="grid grid-cols-12 gap-6" *ngIf="candidate">
            <div class="col-span-12">
                <div class="flex justify-between items-start">
                    <div>
                        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ candidate.full_name }}</h1>
                        <p class="text-surface-600 dark:text-surface-400 mt-2">{{ candidate.current_position }}</p>
                    </div>
                    <div class="flex gap-2">
                        <p-tag [value]="candidate.status" [severity]="getStatusSeverity(candidate.status)" styleClass="text-lg px-4 py-2" />
                        <p-button label="Quay lại" icon="pi pi-arrow-left" [text]="true" [routerLink]="['/rms/candidates']" />
                    </div>
                </div>
            </div>

            <!-- Thông tin cá nhân -->
            <div class="col-span-12 lg:col-span-4">
                <p-card header="Thông tin Cá nhân">
                    <div class="space-y-4">
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Email</h4>
                            <p class="font-medium">
                                <i class="pi pi-envelope text-primary mr-2"></i>
                                {{ candidate.email }}
                            </p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Số điện thoại</h4>
                            <p class="font-medium">
                                <i class="pi pi-phone text-primary mr-2"></i>
                                {{ candidate.phone }}
                            </p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Địa điểm</h4>
                            <p class="font-medium">
                                <i class="pi pi-map-marker text-primary mr-2"></i>
                                {{ candidate.location }}
                            </p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">CV Link</h4>
                            <a [href]="candidate.cv_link" target="_blank" class="text-primary hover:underline">
                                <i class="pi pi-file-pdf mr-2"></i>
                                Tải CV
                            </a>
                        </div>
                    </div>
                </p-card>

                <!-- Kỹ năng -->
                <p-card header="Kỹ năng & Trình độ" styleClass="mt-6">
                    <div class="space-y-4">
                        <div *ngFor="let skill of candidate.skills">
                            <div class="flex justify-between items-center mb-2">
                                <span class="font-semibold text-surface-700 dark:text-surface-300">{{ skill.name }}</span>
                                <span class="text-sm text-surface-600 dark:text-surface-400">{{ skill.years_of_experience }} năm</span>
                            </div>
                            <p-progressBar [value]="skill.proficiency_level * 20" [showValue]="false" [style]="{ height: '8px' }" />
                            <div class="text-xs text-surface-500 dark:text-surface-400 mt-1">{{ getProficiencyText(skill.proficiency_level) }}</div>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Kinh nghiệm làm việc -->
            <div class="col-span-12 lg:col-span-8">
                <p-card header="Kinh nghiệm Làm việc">
                    <p-timeline [value]="candidate.experiences" align="left">
                        <ng-template #content let-exp>
                            <div class="mb-4">
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 class="text-lg font-bold text-surface-900 dark:text-surface-0">{{ exp.position }}</h3>
                                        <p class="text-primary font-semibold">{{ exp.company_name }}</p>
                                    </div>
                                    <p-chip [label]="formatDateRange(exp)" styleClass="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100" />
                                </div>
                                <p class="text-surface-600 dark:text-surface-400">{{ exp.description }}</p>
                            </div>
                        </ng-template>
                        <ng-template #marker let-exp>
                            <span class="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full">
                                <i class="pi pi-briefcase"></i>
                            </span>
                        </ng-template>
                    </p-timeline>
                </p-card>

                <!-- Công việc đã ứng tuyển -->
                <p-card header="Công việc đã Ứng tuyển" styleClass="mt-6">
                    <p-table [value]="candidate.jobs || []" [tableStyle]="{ 'min-width': '40rem' }">
                        <ng-template #header>
                            <tr>
                                <th>Tiêu đề công việc</th>
                                <th>Địa điểm</th>
                                <th>Matching Score</th>
                                <th style="width: 150px">Hành động</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-job>
                            <tr>
                                <td>
                                    <div class="font-semibold text-primary">{{ job.title }}</div>
                                    <div class="text-sm text-surface-600 dark:text-surface-400">{{ job.description | slice : 0 : 60 }}...</div>
                                </td>
                                <td>
                                    <i class="pi pi-map-marker text-surface-400 mr-2"></i>
                                    {{ job.location }}
                                </td>
                                <td>
                                    <div class="space-y-2">
                                        <div class="flex items-center gap-3">
                                            <span class="text-sm text-surface-600 dark:text-surface-400 w-20">Overall:</span>
                                            <p-progressBar [value]="job.matching_score.overall_score" [showValue]="false" [style]="{ width: '100px', height: '6px' }" />
                                            <span class="text-sm font-semibold">{{ job.matching_score.overall_score }}%</span>
                                        </div>
                                        <div class="flex items-center gap-3">
                                            <span class="text-sm text-surface-600 dark:text-surface-400 w-20">Skills:</span>
                                            <p-progressBar [value]="job.matching_score.skill_match_score" [showValue]="false" [style]="{ width: '100px', height: '6px' }" />
                                            <span class="text-sm">{{ job.matching_score.skill_match_score }}%</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <p-button label="Xem" icon="pi pi-eye" [text]="true" size="small" [routerLink]="['/rms/jobs', job.id]" />
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template #emptymessage>
                            <tr>
                                <td colspan="4" class="text-center text-surface-500 dark:text-surface-400 py-8">Chưa ứng tuyển công việc nào</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-card>
            </div>
        </div>
    `
})
export class CandidateProfile implements OnInit {
    candidate: CandidateWithDetails | null = null;

    constructor(
        private route: ActivatedRoute,
        private rmsService: RMSDataService
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.rmsService.getCandidateById(id).subscribe((candidate) => {
            this.candidate = candidate || null;
        });
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

    getProficiencyText(level: number): string {
        const labels = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];

        return labels[level] || '';
    }

    formatDateRange(exp: CandidateExperience): string {
        const startDate = new Date(exp.start_date);
        const endDate = exp.end_date ? new Date(exp.end_date) : null;
        const startStr = startDate.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
        const endStr = endDate ? endDate.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }) : 'Hiện tại';

        return `${startStr} - ${endStr}`;
    }
}
