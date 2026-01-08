import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RMSDataService } from '@/services/rms-data.service';
import { Hunter } from '@/models/rms.models';

@Component({
    selector: 'app-hunters-management',
    imports: [CommonModule, RouterModule, FormsModule, CardModule, TableModule, TagModule, ButtonModule, AccordionModule, DialogModule, InputTextModule, ConfirmDialogModule, ToastModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="card">
            <p-toast />
            <p-confirmDialog />

            <div class="flex justify-between items-center mb-4">
                <div>
                    <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Quản lý Hunters</h2>
                    <p class="text-surface-600 dark:text-surface-400 mt-1">Danh sách hunters và ứng viên họ quản lý</p>
                </div>
                <div class="flex gap-2">
                    <p-button label="Thêm Hunter" icon="pi pi-plus" (onClick)="openCreateDialog()" />
                    <p-button label="Quay lại Dashboard" icon="pi pi-arrow-left" [text]="true" [routerLink]="['/rms']" />
                </div>
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

                        <div class="flex gap-2">
                            <p-button label="Xem ứng viên" icon="pi pi-users" [outlined]="true" styleClass="flex-1" (onClick)="loadHunterCandidates(hunter.id)" />
                            <p-button icon="pi pi-pencil" [outlined]="true" severity="warn" (onClick)="openEditDialog(hunter)" />
                            <p-button icon="pi pi-trash" [outlined]="true" severity="danger" (onClick)="confirmDelete(hunter)" />
                        </div>
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

        <!-- Dialog Thêm/Sửa Hunter -->
        <p-dialog maskStyleClass="backdrop-blur-sm" styleClass="!border-0" [(visible)]="displayDialog" [header]="isEditMode ? 'Sửa Hunter' : 'Thêm Hunter mới'" [modal]="true" [style]="{ width: '500px' }">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Tên *</label>
                    <input pInputText [(ngModel)]="hunterForm.name" class="w-full" placeholder="VD: Nguyễn Văn A" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Email *</label>
                    <input pInputText [(ngModel)]="hunterForm.email" type="email" class="w-full" placeholder="email@example.com" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Số điện thoại *</label>
                    <input pInputText [(ngModel)]="hunterForm.phone" class="w-full" placeholder="+84 xxx xxx xxx" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Chuyên môn *</label>
                    <input pInputText [(ngModel)]="hunterForm.specialization" class="w-full" placeholder="VD: IT Recruitment" />
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2 mt-4">
                    <p-button label="Hủy" icon="pi pi-times" [text]="true" (onClick)="closeDialog()" />
                    <p-button label="Lưu" icon="pi pi-check" (onClick)="saveHunter()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class HuntersManagement implements OnInit {
    hunters: Hunter[] = [];
    selectedHunter: any = null;
    displayDialog = false;
    isEditMode = false;
    selectedHunterForEdit: Hunter | null = null;

    hunterForm: any = {
        name: '',
        email: '',
        phone: '',
        specialization: ''
    };

    constructor(
        private rmsService: RMSDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loadHunters();
    }

    loadHunters(): void {
        this.rmsService.getHunters().subscribe((hunters) => {
            this.hunters = hunters;
        });
    }

    loadHunterCandidates(hunterId: number): void {
        this.rmsService.getHunterWithCandidates(hunterId).subscribe((hunter) => {
            this.selectedHunter = hunter;
        });
    }

    openCreateDialog(): void {
        this.isEditMode = false;
        this.selectedHunterForEdit = null;
        this.resetForm();
        this.displayDialog = true;
    }

    openEditDialog(hunter: Hunter): void {
        this.isEditMode = true;
        this.selectedHunterForEdit = hunter;
        this.hunterForm = { ...hunter };
        this.displayDialog = true;
    }

    closeDialog(): void {
        this.displayDialog = false;
        this.resetForm();
    }

    resetForm(): void {
        this.hunterForm = {
            name: '',
            email: '',
            phone: '',
            specialization: ''
        };
    }

    saveHunter(): void {
        if (!this.validateForm()) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc' });

            return;
        }

        if (this.isEditMode && this.selectedHunterForEdit) {
            this.rmsService.updateHunter(this.selectedHunterForEdit.id, this.hunterForm);
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật hunter thành công' });
        } else {
            this.rmsService.createHunter(this.hunterForm);
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm hunter mới thành công' });
        }

        this.closeDialog();
        this.loadHunters();
    }

    validateForm(): boolean {
        return this.hunterForm.name && this.hunterForm.email && this.hunterForm.phone && this.hunterForm.specialization;
    }

    confirmDelete(hunter: Hunter): void {
        this.confirmationService.confirm({
            message: `Bạn có chắc chắn muốn xóa hunter "${hunter.name}"? Hành động này không thể hoàn tác.`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: () => {
                this.deleteHunter(hunter);
            }
        });
    }

    deleteHunter(hunter: Hunter): void {
        this.rmsService.deleteHunter(hunter.id);
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa hunter thành công' });
        this.loadHunters();
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
