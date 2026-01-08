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
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RMSDataService } from '@/services/rms-data.service';
import { Job, Customer } from '@/models/rms.models';

@Component({
    selector: 'app-jobs-list',
    imports: [CommonModule, RouterModule, FormsModule, CardModule, TableModule, TagModule, ButtonModule, DialogModule, InputTextModule, TextareaModule, InputNumberModule, SelectModule, ConfirmDialogModule, ToastModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="card">
            <p-toast />
            <p-confirmDialog />

            <div class="flex justify-between items-center mb-4">
                <div>
                    <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Danh sách Công việc</h2>
                    <p class="text-surface-600 dark:text-surface-400 mt-1">Tất cả các vị trí tuyển dụng</p>
                </div>
                <div class="flex gap-2">
                    <p-button label="Thêm Công việc" icon="pi pi-plus" (onClick)="openCreateDialog()" />
                    <p-button label="Quay lại Dashboard" icon="pi pi-arrow-left" [text]="true" [routerLink]="['/rms']" />
                </div>
            </div>

            <p-table [value]="jobs" [tableStyle]="{ 'min-width': '60rem' }">
                <ng-template #header>
                    <tr>
                        <th>Tiêu đề</th>
                        <th>Địa điểm</th>
                        <th>Lương (VND)</th>
                        <th>Kinh nghiệm</th>
                        <th>Trạng thái</th>
                        <th style="width: 250px">Hành động</th>
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
                            <div class="flex gap-1">
                                <p-button label="Xem" icon="pi pi-eye" [text]="true" size="small" [routerLink]="['/rms/jobs', job.id]" />
                                <p-button label="Sửa" icon="pi pi-pencil" [text]="true" size="small" severity="warn" (onClick)="openEditDialog(job)" />
                                <p-button label="Xóa" icon="pi pi-trash" [text]="true" size="small" severity="danger" (onClick)="confirmDelete(job)" />
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <!-- Dialog Thêm/Sửa Công việc -->
        <p-dialog [(visible)]="displayDialog" [header]="isEditMode ? 'Sửa Công việc' : 'Thêm Công việc mới'" [modal]="true" [style]="{ width: '600px' }">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Tiêu đề *</label>
                    <input pInputText [(ngModel)]="jobForm.title" class="w-full" placeholder="VD: Senior Frontend Developer" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Mô tả *</label>
                    <textarea pInputTextarea [(ngModel)]="jobForm.description" rows="4" class="w-full" placeholder="Mô tả chi tiết về công việc..."></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Khách hàng *</label>
                        <p-select
                            [(ngModel)]="jobForm.customer_id"
                            [options]="customers"
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Chọn khách hàng"
                            class="w-full"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Trạng thái *</label>
                        <p-select [(ngModel)]="jobForm.status" [options]="statusOptions" optionLabel="label" optionValue="value" placeholder="Chọn trạng thái" class="w-full" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Địa điểm *</label>
                    <input pInputText [(ngModel)]="jobForm.location" class="w-full" placeholder="VD: Ho Chi Minh City" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Lương tối thiểu (VND) *</label>
                        <p-inputNumber [(ngModel)]="jobForm.salary_min" mode="decimal" [min]="0" class="w-full" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Lương tối đa (VND) *</label>
                        <p-inputNumber [(ngModel)]="jobForm.salary_max" mode="decimal" [min]="0" class="w-full" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Trình độ học vấn *</label>
                    <input pInputText [(ngModel)]="jobForm.education_level" class="w-full" placeholder="VD: Bachelor's Degree" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Kinh nghiệm tối thiểu (năm) *</label>
                        <p-inputNumber [(ngModel)]="jobForm.experience_min" [min]="0" [max]="50" class="w-full" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Kinh nghiệm tối đa (năm) *</label>
                        <p-inputNumber [(ngModel)]="jobForm.experience_max" [min]="0" [max]="50" class="w-full" />
                    </div>
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2 mt-4">
                    <p-button label="Hủy" icon="pi pi-times" [text]="true" (onClick)="closeDialog()" />
                    <p-button label="Lưu" icon="pi pi-check" (onClick)="saveJob()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class JobsList implements OnInit {
    jobs: Job[] = [];
    customers: Customer[] = [];
    displayDialog = false;
    isEditMode = false;
    selectedJob: Job | null = null;

    jobForm: any = {
        title: '',
        description: '',
        customer_id: null,
        location: '',
        salary_min: 0,
        salary_max: 0,
        education_level: '',
        experience_min: 0,
        experience_max: 0,
        status: 'Open'
    };

    statusOptions = [
        { label: 'Mở', value: 'Open' },
        { label: 'Đóng', value: 'Closed' }
    ];

    constructor(
        private rmsService: RMSDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loadJobs();
        this.loadCustomers();
    }

    loadJobs(): void {
        this.rmsService.getJobs().subscribe((jobs) => {
            this.jobs = jobs;
        });
    }

    loadCustomers(): void {
        this.rmsService.getData().subscribe((data) => {
            this.customers = data.customers;
        });
    }

    openCreateDialog(): void {
        this.isEditMode = false;
        this.selectedJob = null;
        this.resetForm();
        this.displayDialog = true;
    }

    openEditDialog(job: Job): void {
        this.isEditMode = true;
        this.selectedJob = job;
        this.jobForm = { ...job };
        this.displayDialog = true;
    }

    closeDialog(): void {
        this.displayDialog = false;
        this.resetForm();
    }

    resetForm(): void {
        this.jobForm = {
            title: '',
            description: '',
            customer_id: null,
            location: '',
            salary_min: 0,
            salary_max: 0,
            education_level: '',
            experience_min: 0,
            experience_max: 0,
            status: 'Open'
        };
    }

    saveJob(): void {
        if (!this.validateForm()) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc' });

            return;
        }

        if (this.isEditMode && this.selectedJob) {
            this.rmsService.updateJob(this.selectedJob.id, this.jobForm);
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật công việc thành công' });
        } else {
            this.rmsService.createJob(this.jobForm);
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm công việc mới thành công' });
        }

        this.closeDialog();
        this.loadJobs();
    }

    validateForm(): boolean {
        return (
            this.jobForm.title &&
            this.jobForm.description &&
            this.jobForm.customer_id &&
            this.jobForm.location &&
            this.jobForm.education_level &&
            this.jobForm.salary_min > 0 &&
            this.jobForm.salary_max > 0
        );
    }

    confirmDelete(job: Job): void {
        this.confirmationService.confirm({
            message: `Bạn có chắc chắn muốn xóa công việc "${job.title}"? Hành động này không thể hoàn tác.`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: () => {
                this.deleteJob(job);
            }
        });
    }

    deleteJob(job: Job): void {
        this.rmsService.deleteJob(job.id);
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa công việc thành công' });
        this.loadJobs();
    }

    formatSalary(amount: number): string {
        return (amount / 1000000).toFixed(0) + 'M';
    }
}
