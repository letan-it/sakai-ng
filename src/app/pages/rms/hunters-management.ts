import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { RMSDataService } from '@/services/rms-data.service';
import { Hunter } from '@/models/rms.models';

@Component({
    selector: 'app-hunters-management',
    imports: [CommonModule, RouterModule, CardModule, TableModule, TagModule, ButtonModule, AccordionModule],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Quản lý Hunters</h2>
                    <p class="text-surface-600 dark:text-surface-400 mt-1">Danh sách hunters và ứng viên họ quản lý</p>
                </div>
                <p-button label="Quay lại Dashboard" icon="pi pi-arrow-left" [text]="true" [routerLink]="['/rms']" />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div *ngFor="let hunter of hunters" class="col-span-1">
                    <p-card>
                        <div class="flex items-start gap-4 mb-4">
                            <div class="flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full">
                                <i class="pi pi-user-plus text-3xl text-primary"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0">{{ hunter.name }}</h3>
                                <p class="text-sm text-surface-600 dark:text-surface-400">{{ hunter.specialization }}</p>
                            </div>
                        </div>

                        <div class="space-y-2 mb-4">
                            <div class="flex items-center gap-2 text-sm">
                                <i class="pi pi-envelope text-surface-400"></i>
                                <span class="text-surface-600 dark:text-surface-400">{{ hunter.email }}</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm">
                                <i class="pi pi-phone text-surface-400"></i>
                                <span class="text-surface-600 dark:text-surface-400">{{ hunter.phone }}</span>
                            </div>
                        </div>

                        <p-button
                            label="Xem ứng viên"
                            icon="pi pi-users"
                            [outlined]="true"
                            styleClass="w-full"
                            (onClick)="loadHunterCandidates(hunter.id)"
                        />
                    </p-card>
                </div>
            </div>

            <!-- Bảng ứng viên của hunter đã chọn -->
            <div *ngIf="selectedHunter" class="mt-6">
                <p-card [header]="'Ứng viên của ' + selectedHunter.name">
                    <p-table [value]="selectedHunter.candidates" [tableStyle]="{ 'min-width': '60rem' }">
                        <ng-template #header>
                            <tr>
                                <th>Tên ứng viên</th>
                                <th>Email</th>
                                <th>Vị trí ứng tuyển</th>
                                <th>Trạng thái ứng viên</th>
                                <th>Trạng thái ứng tuyển</th>
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
                                <td>{{ candidate.email }}</td>
                                <td>
                                    <span class="font-medium text-primary">{{ candidate.job?.title }}</span>
                                </td>
                                <td>
                                    <p-tag [value]="candidate.status" [severity]="getStatusSeverity(candidate.status)" />
                                </td>
                                <td>
                                    <p-tag [value]="candidate.status" [severity]="getJobStatusSeverity(candidate.status)" />
                                </td>
                                <td>
                                    <p-button label="Xem" icon="pi pi-eye" [text]="true" size="small" [routerLink]="['/rms/candidates', candidate.id]" />
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template #emptymessage>
                            <tr>
                                <td colspan="6" class="text-center text-surface-500 dark:text-surface-400 py-8">Hunter này chưa quản lý ứng viên nào</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-card>
            </div>
        </div>
    `
})
export class HuntersManagement implements OnInit {
    hunters: Hunter[] = [];
    selectedHunter: any = null;

    constructor(private rmsService: RMSDataService) {}

    ngOnInit(): void {
        this.rmsService.getHunters().subscribe((hunters) => {
            this.hunters = hunters;
        });
    }

    loadHunterCandidates(hunterId: number): void {
        this.rmsService.getHunterWithCandidates(hunterId).subscribe((hunter) => {
            this.selectedHunter = hunter;
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

    getJobStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
        const severityMap: { [key: string]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
            Applied: 'info',
            Screening: 'info',
            Interviewing: 'warning',
            Offered: 'contrast',
            Hired: 'success',
            Rejected: 'danger'
        };

        return severityMap[status] || 'secondary';
    }
}
