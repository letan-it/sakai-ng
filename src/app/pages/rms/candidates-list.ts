import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { RMSDataService } from '@/services/rms-data.service';
import { Candidate } from '@/models/rms.models';

@Component({
    selector: 'app-candidates-list',
    imports: [CommonModule, RouterModule, CardModule, TableModule, TagModule, ButtonModule],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Danh sách Ứng viên</h2>
                    <p class="text-surface-600 dark:text-surface-400 mt-1">Tất cả ứng viên trong hệ thống</p>
                </div>
                <p-button label="Quay lại Dashboard" icon="pi pi-arrow-left" [text]="true" [routerLink]="['/rms']" />
            </div>

            <p-table [value]="candidates" [tableStyle]="{ 'min-width': '60rem' }">
                <ng-template #header>
                    <tr>
                        <th>Tên ứng viên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Vị trí hiện tại</th>
                        <th>Địa điểm</th>
                        <th>Trạng thái</th>
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
                        <td>
                            <i class="pi pi-envelope text-surface-400 mr-2"></i>
                            {{ candidate.email }}
                        </td>
                        <td>
                            <i class="pi pi-phone text-surface-400 mr-2"></i>
                            {{ candidate.phone }}
                        </td>
                        <td>{{ candidate.current_position }}</td>
                        <td>
                            <i class="pi pi-map-marker text-surface-400 mr-2"></i>
                            {{ candidate.location }}
                        </td>
                        <td>
                            <p-tag [value]="candidate.status" [severity]="getStatusSeverity(candidate.status)" />
                        </td>
                        <td>
                            <p-button label="Chi tiết" icon="pi pi-eye" [text]="true" size="small" [routerLink]="['/rms/candidates', candidate.id]" />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class CandidatesList implements OnInit {
    candidates: Candidate[] = [];

    constructor(private rmsService: RMSDataService) {}

    ngOnInit(): void {
        this.rmsService.getCandidates().subscribe((candidates) => {
            this.candidates = candidates;
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
