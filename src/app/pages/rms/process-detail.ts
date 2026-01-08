import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';
import { StepperModule } from 'primeng/stepper';
import { RMSDataService } from '@/services/rms-data.service';

@Component({
    selector: 'app-process-detail',
    imports: [CommonModule, RouterModule, CardModule, TagModule, ButtonModule, DividerModule, TimelineModule, StepperModule],
    template: `
        <div class="grid grid-cols-12 gap-6" *ngIf="process">
            <div class="col-span-12">
                <div class="flex justify-between items-start">
                    <div>
                        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ process.process_name }}</h1>
                        <p class="text-surface-600 dark:text-surface-400 mt-2">
                            <i class="pi pi-user mr-2"></i>
                            Ứng viên: <strong>{{ process.candidate?.full_name }}</strong>
                        </p>
                        <p class="text-surface-600 dark:text-surface-400 mt-1">
                            <i class="pi pi-briefcase mr-2"></i>
                            Công việc: <strong>{{ process.job?.title }}</strong>
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <p-tag [value]="process.status" [severity]="getStatusSeverity(process.status)" styleClass="text-lg px-4 py-2" />
                        <p-button label="Quay lại" icon="pi pi-arrow-left" [text]="true" [routerLink]="['/rms/processes']" />
                    </div>
                </div>
            </div>

            <!-- Thông tin quy trình -->
            <div class="col-span-12 lg:col-span-4">
                <p-card header="Thông tin Quy trình">
                    <div class="space-y-4">
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Ngày bắt đầu</h4>
                            <p class="font-medium">
                                <i class="pi pi-calendar text-primary mr-2"></i>
                                {{ formatDate(process.started_at) }}
                            </p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Ngày hoàn thành</h4>
                            <p class="font-medium">
                                <i class="pi pi-calendar text-primary mr-2"></i>
                                {{ process.completed_at ? formatDate(process.completed_at) : 'Đang tiến hành' }}
                            </p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Tổng số vòng</h4>
                            <p class="font-medium">{{ process.rounds?.length || 0 }} vòng phỏng vấn</p>
                        </div>
                    </div>

                    <p-divider />

                    <div class="space-y-3">
                        <h4 class="font-semibold text-surface-700 dark:text-surface-300">Thông tin Ứng viên</h4>
                        <p-button
                            label="Xem hồ sơ ứng viên"
                            icon="pi pi-user"
                            [outlined]="true"
                            styleClass="w-full"
                            [routerLink]="['/rms/candidates', process.candidate?.id]"
                        />
                    </div>

                    <div class="space-y-3 mt-4">
                        <h4 class="font-semibold text-surface-700 dark:text-surface-300">Thông tin Công việc</h4>
                        <p-button
                            label="Xem chi tiết công việc"
                            icon="pi pi-briefcase"
                            [outlined]="true"
                            styleClass="w-full"
                            [routerLink]="['/rms/jobs', process.job?.id]"
                        />
                    </div>
                </p-card>
            </div>

            <!-- Timeline các vòng phỏng vấn -->
            <div class="col-span-12 lg:col-span-8">
                <p-card header="Lịch sử Phỏng vấn">
                    <p-timeline [value]="process.rounds" align="left">
                        <ng-template #content let-round>
                            <div class="mb-4">
                                <div class="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0">
                                            Vòng {{ round.round_number }}: {{ round.round_name }}
                                        </h3>
                                        <p class="text-surface-600 dark:text-surface-400 mt-1">
                                            <i class="pi pi-user mr-2"></i>
                                            Người phỏng vấn: {{ round.interviewer_name }}
                                        </p>
                                        <p class="text-surface-600 dark:text-surface-400 mt-1">
                                            <i class="pi pi-calendar mr-2"></i>
                                            {{ formatDateTime(round.scheduled_date) }}
                                        </p>
                                    </div>
                                    <p-tag [value]="round.status" [severity]="getRoundStatusSeverity(round.status)" />
                                </div>

                                <!-- Kết quả vòng phỏng vấn -->
                                <div *ngIf="round.result" class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4 mt-3">
                                    <div class="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <span class="text-sm text-surface-600 dark:text-surface-400">Trạng thái tham dự:</span>
                                            <p-tag [value]="round.result.attendance_status" [severity]="getAttendanceSeverity(round.result.attendance_status)" styleClass="ml-2" />
                                        </div>
                                        <div>
                                            <span class="text-sm text-surface-600 dark:text-surface-400">Kết quả:</span>
                                            <p-tag [value]="round.result.outcome" [severity]="getOutcomeSeverity(round.result.outcome)" styleClass="ml-2" />
                                        </div>
                                    </div>

                                    <div *ngIf="round.result.score !== null" class="mb-3">
                                        <span class="text-sm font-semibold text-surface-700 dark:text-surface-300">Điểm đánh giá:</span>
                                        <div class="flex items-center gap-3 mt-2">
                                            <div class="flex-1 bg-white dark:bg-surface-900 rounded-full h-3">
                                                <div
                                                    class="h-3 rounded-full transition-all"
                                                    [ngClass]="{
                                                        'bg-green-500': round.result.score >= 80,
                                                        'bg-blue-500': round.result.score >= 60 && round.result.score < 80,
                                                        'bg-yellow-500': round.result.score >= 40 && round.result.score < 60,
                                                        'bg-red-500': round.result.score < 40
                                                    }"
                                                    [style.width.%]="round.result.score"
                                                ></div>
                                            </div>
                                            <span class="text-xl font-bold text-primary">{{ round.result.score }}/100</span>
                                        </div>
                                    </div>

                                    <div *ngIf="round.result.feedback">
                                        <span class="text-sm font-semibold text-surface-700 dark:text-surface-300">Nhận xét:</span>
                                        <p class="text-surface-600 dark:text-surface-400 mt-1 italic">{{ round.result.feedback }}</p>
                                    </div>

                                    <div *ngIf="round.result.evaluated_at" class="text-xs text-surface-500 dark:text-surface-400 mt-2">
                                        Đánh giá lúc: {{ formatDateTime(round.result.evaluated_at) }}
                                    </div>
                                </div>

                                <div *ngIf="!round.result && round.status === 'Scheduled'" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-3">
                                    <p class="text-blue-700 dark:text-blue-300">
                                        <i class="pi pi-info-circle mr-2"></i>
                                        Vòng phỏng vấn đã được lên lịch, chờ kết quả đánh giá
                                    </p>
                                </div>
                            </div>
                        </ng-template>
                        <ng-template #marker let-round>
                            <span
                                class="flex items-center justify-center w-10 h-10 rounded-full"
                                [ngClass]="{
                                    'bg-green-500 text-white': round.status === 'Completed' && round.result?.outcome === 'Pass',
                                    'bg-red-500 text-white': round.status === 'Completed' && round.result?.outcome === 'Fail',
                                    'bg-blue-500 text-white': round.status === 'Scheduled',
                                    'bg-surface-300 text-surface-600': round.status === 'Cancelled'
                                }"
                            >
                                <i
                                    [ngClass]="{
                                        'pi pi-check': round.status === 'Completed' && round.result?.outcome === 'Pass',
                                        'pi pi-times': round.status === 'Completed' && round.result?.outcome === 'Fail',
                                        'pi pi-clock': round.status === 'Scheduled',
                                        'pi pi-ban': round.status === 'Cancelled'
                                    }"
                                ></i>
                            </span>
                        </ng-template>
                    </p-timeline>
                </p-card>
            </div>
        </div>
    `
})
export class ProcessDetail implements OnInit {
    process: any = null;

    constructor(
        private route: ActivatedRoute,
        private rmsService: RMSDataService
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.rmsService.getRecruitmentProcessById(id).subscribe((process) => {
            this.process = process;
        });
    }

    formatDate(dateStr: string): string {
        const date = new Date(dateStr);

        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    formatDateTime(dateStr: string): string {
        const date = new Date(dateStr);

        return date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
        const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
            'In Progress': 'info',
            Completed: 'success',
            Cancelled: 'danger'
        };

        return severityMap[status] || 'secondary';
    }

    getRoundStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
        const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
            Scheduled: 'info',
            Completed: 'success',
            Cancelled: 'danger'
        };

        return severityMap[status] || 'secondary';
    }

    getAttendanceSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
        const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
            Scheduled: 'info',
            Attended: 'success',
            'No-show': 'danger',
            Cancelled: 'secondary'
        };

        return severityMap[status] || 'secondary';
    }

    getOutcomeSeverity(outcome: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
        const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
            Pass: 'success',
            Fail: 'danger',
            Pending: 'warning'
        };

        return severityMap[outcome] || 'secondary';
    }
}
