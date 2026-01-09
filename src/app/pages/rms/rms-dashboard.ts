import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { RMSDataService } from '@/services/rms-data.service';
import { Candidate, MatchingScore } from '@/models/rms.models';

@Component({
    selector: 'app-rms-dashboard',
    imports: [CommonModule, RouterModule, CardModule, TableModule, TagModule, ProgressBarModule, ButtonModule],
    template: `
        <div class="grid grid-cols-12 gap-6">
            <!-- Tiêu đề -->
            <div class="col-span-12">
                <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Recruitment Management System</h1>
                <p class="text-surface-600 dark:text-surface-400 mt-2">Tổng quan hệ thống quản lý tuyển dụng</p>
            </div>

            <!-- Thống kê trạng thái công việc -->
            <div class="col-span-12 lg:col-span-6">
                <p-card header="Trạng thái Công việc">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <i class="pi pi-briefcase text-4xl text-green-600 dark:text-green-400 mb-2"></i>
                            <div class="text-3xl font-bold text-green-700 dark:text-green-300">{{ jobStats.Open }}</div>
                            <div class="text-sm text-surface-600 dark:text-surface-400">Công việc Mở</div>
                        </div>
                        <div class="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <i class="pi pi-lock text-4xl text-red-600 dark:text-red-400 mb-2"></i>
                            <div class="text-3xl font-bold text-red-700 dark:text-red-300">{{ jobStats.Closed }}</div>
                            <div class="text-sm text-surface-600 dark:text-surface-400">Công việc Đóng</div>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Thống kê trạng thái ứng viên -->
            <div class="col-span-12 lg:col-span-6">
                <p-card header="Trạng thái Ứng viên">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <i class="pi pi-clock text-3xl text-yellow-600 dark:text-yellow-400 mb-2"></i>
                            <div class="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{{ candidateStats.Pending }}</div>
                            <div class="text-sm text-surface-600 dark:text-surface-400">Pending</div>
                        </div>
                        <div class="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <i class="pi pi-users text-3xl text-blue-600 dark:text-blue-400 mb-2"></i>
                            <div class="text-2xl font-bold text-blue-700 dark:text-blue-300">{{ candidateStats.Interviewing }}</div>
                            <div class="text-sm text-surface-600 dark:text-surface-400">Interviewing</div>
                        </div>
                        <div class="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <i class="pi pi-check-circle text-3xl text-green-600 dark:text-green-400 mb-2"></i>
                            <div class="text-2xl font-bold text-green-700 dark:text-green-300">{{ candidateStats.Hired }}</div>
                            <div class="text-sm text-surface-600 dark:text-surface-400">Hired</div>
                        </div>
                        <div class="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <i class="pi pi-times-circle text-3xl text-red-600 dark:text-red-400 mb-2"></i>
                            <div class="text-2xl font-bold text-red-700 dark:text-red-300">{{ candidateStats.Rejected }}</div>
                            <div class="text-sm text-surface-600 dark:text-surface-400">Rejected</div>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Top Candidates -->
            <div class="col-span-12">
                <p-card header="Top Ứng viên theo Matching Score">
                    <p-table [value]="topCandidates" [tableStyle]="{ 'min-width': '50rem' }">
                        <ng-template #header>
                            <tr>
                                <th>Tên ứng viên</th>
                                <th>Vị trí hiện tại</th>
                                <th>Địa điểm</th>
                                <th>Trạng thái</th>
                                <th>Matching Score</th>
                                <th style="width: 180px">Hành động</th>
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
                                        <p-progressBar [value]="candidate.overall_score" [showValue]="false" [style]="{ width: '120px', height: '8px' }" />
                                        <span class="font-semibold text-primary">{{ candidate.overall_score }}%</span>
                                    </div>
                                </td>
                                <td>
                                    <p-button label="Xem chi tiết" icon="pi pi-eye" [text]="true" size="small" [routerLink]="['/rms/candidates', candidate.id]" />
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-card>
            </div>

            <!-- Quick Actions -->
            <div class="col-span-12">
                <p-card header="Truy cập nhanh">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button pButton label="Danh sách Công việc" icon="pi pi-briefcase" [routerLink]="['/rms/jobs']" class="w-full p-button-outlined"></button>
                        <button pButton label="Danh sách Ứng viên" icon="pi pi-users" [routerLink]="['/rms/candidates']" class="w-full p-button-outlined"></button>
                        <button pButton label="Quy trình Tuyển dụng" icon="pi pi-sitemap" [routerLink]="['/rms/processes']" class="w-full p-button-outlined"></button>
                        <button pButton label="Quản lý Hunters" icon="pi pi-user-plus" [routerLink]="['/rms/hunters']" class="w-full p-button-outlined"></button>
                    </div>
                </p-card>
            </div>
        </div>
    `
})
export class RMSDashboard implements OnInit {
    jobStats = { Open: 0, Closed: 0 };
    candidateStats = { Pending: 0, Interviewing: 0, Hired: 0, Rejected: 0 };
    topCandidates: Array<Candidate & { overall_score: number }> = [];

    constructor(private rmsService: RMSDataService) {}

    ngOnInit(): void {
        this.rmsService.getJobStatusStats().subscribe((stats) => {
            this.jobStats = stats as any;
        });

        this.rmsService.getCandidateStatusStats().subscribe((stats) => {
            this.candidateStats = stats as any;
        });

        this.rmsService.getTopCandidates(5).subscribe((candidates) => {
            this.topCandidates = candidates;
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
}
