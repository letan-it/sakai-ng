import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RMSDataService } from '@/services/rms-data.service';
import { Candidate } from '@/models/rms.models';

@Component({
    selector: 'app-candidates-list',
    imports: [CommonModule, RouterModule, FormsModule, CardModule, TableModule, TagModule, ButtonModule, DialogModule, InputTextModule, TextareaModule, SelectModule, ConfirmDialogModule, ToastModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="card">
            <p-toast />
            <p-confirmDialog />

            <div class="flex justify-between items-center mb-4">
                <div>
                    <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Danh sách Ứng viên</h2>
                    <p class="text-surface-600 dark:text-surface-400 mt-1">Tất cả ứng viên trong hệ thống</p>
                </div>
                <div class="flex gap-2">
                    <p-button label="Thêm Ứng viên" icon="pi pi-plus" (onClick)="openCreateDialog()" />
                    <p-button label="Quay lại Dashboard" icon="pi pi-arrow-left" [text]="true" [routerLink]="['/rms']" />
                </div>
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
                        <th style="width: 250px">Hành động</th>
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
                            <div class="flex gap-1">
                                <p-button label="Chi tiết" icon="pi pi-eye" [text]="true" size="small" [routerLink]="['/rms/candidates', candidate.id]" />
                                <p-button label="Sửa" icon="pi pi-pencil" [text]="true" size="small" severity="warn" (onClick)="openEditDialog(candidate)" />
                                <p-button label="Xóa" icon="pi pi-trash" [text]="true" size="small" severity="danger" (onClick)="confirmDelete(candidate)" />
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Dialog Thêm/Sửa Ứng viên -->
        <p-dialog [(visible)]="displayDialog" [header]="isEditMode ? 'Sửa Ứng viên' : 'Thêm Ứng viên mới'" [modal]="true" [style]="{ width: '600px' }">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Họ và tên <span style="color:red">*</span></label>
                    <input pInputText [(ngModel)]="candidateForm.full_name" class="w-full" placeholder="VD: Nguyễn Văn A" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Email <span style="color:red">*</span></label>
                        <input pInputText [(ngModel)]="candidateForm.email" type="email" class="w-full" placeholder="email@example.com" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Số điện thoại <span style="color:red">*</span></label>
                        <input pInputText [(ngModel)]="candidateForm.phone" class="w-full" placeholder="+84 xxx xxx xxx" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Vị trí hiện tại <span style="color:red">*</span></label>
                    <input pInputText [(ngModel)]="candidateForm.current_position" class="w-full" placeholder="VD: Senior Developer" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Địa điểm <span style="color:red">*</span></label>
                        <input pInputText [(ngModel)]="candidateForm.location" class="w-full" placeholder="VD: Ho Chi Minh City" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Trạng thái <span style="color:red">*</span></label>
                        <p-select appendTo="body" [(ngModel)]="candidateForm.status" [options]="statusOptions" optionLabel="label" optionValue="value" placeholder="Chọn trạng thái" class="w-full" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Link CV</label>
                    <input pInputText [(ngModel)]="candidateForm.cv_link" class="w-full" placeholder="https://..." />
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2 mt-4">
                    <p-button label="Hủy" icon="pi pi-times" [text]="true" (onClick)="closeDialog()" />
                    <p-button label="Lưu" icon="pi pi-check" (onClick)="saveCandidate()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class CandidatesList implements OnInit {
    candidates: Candidate[] = [];
    displayDialog = false;
    isEditMode = false;
    selectedCandidate: Candidate | null = null;

    candidateForm: any = {
        full_name: '',
        email: '',
        phone: '',
        cv_link: '',
        location: '',
        current_position: '',
        status: 'Pending'
    };

    statusOptions = [
        { label: 'Đang chờ', value: 'Pending' },
        { label: 'Đang phỏng vấn', value: 'Interviewing' },
        { label: 'Đã tuyển', value: 'Hired' },
        { label: 'Từ chối', value: 'Rejected' }
    ];

    constructor(
        private rmsService: RMSDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loadCandidates();
    }

    loadCandidates(): void {
        this.rmsService.getCandidates().subscribe((candidates) => {
            this.candidates = candidates;
        });
    }

    openCreateDialog(): void {
        this.isEditMode = false;
        this.selectedCandidate = null;
        this.resetForm();
        this.displayDialog = true;
    }

    openEditDialog(candidate: Candidate): void {
        this.isEditMode = true;
        this.selectedCandidate = candidate;
        this.candidateForm = { ...candidate };
        this.displayDialog = true;
    }

    closeDialog(): void {
        this.displayDialog = false;
        this.resetForm();
    }

    resetForm(): void {
        this.candidateForm = {
            full_name: '',
            email: '',
            phone: '',
            cv_link: '',
            location: '',
            current_position: '',
            status: 'Pending'
        };
    }

    saveCandidate(): void {
        if (!this.validateForm()) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc' });

            return;
        }

        if (this.isEditMode && this.selectedCandidate) {
            this.rmsService.updateCandidate(this.selectedCandidate.id, this.candidateForm);
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật ứng viên thành công' });
        } else {
            this.rmsService.createCandidate(this.candidateForm);
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm ứng viên mới thành công' });
        }

        this.closeDialog();
        this.loadCandidates();
    }

    validateForm(): boolean {
        return (
            this.candidateForm.full_name &&
            this.candidateForm.email &&
            this.candidateForm.phone &&
            this.candidateForm.location &&
            this.candidateForm.current_position
        );
    }

    confirmDelete(candidate: Candidate): void {
        this.confirmationService.confirm({
            message: `Bạn có chắc chắn muốn xóa ứng viên "${candidate.full_name}"? Hành động này không thể hoàn tác.`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: () => {
                this.deleteCandidate(candidate);
            }
        });
    }

    deleteCandidate(candidate: Candidate): void {
        this.rmsService.deleteCandidate(candidate.id);
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa ứng viên thành công' });
        this.loadCandidates();
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
