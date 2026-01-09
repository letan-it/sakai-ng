import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';
import { StepperModule } from 'primeng/stepper';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RMSDataService } from '@/services/rms-data.service';

@Component({
    selector: 'app-process-detail',
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        CardModule,
        TagModule,
        ButtonModule,
        DividerModule,
        TimelineModule,
        StepperModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        SelectModule,
        DatePickerModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="grid grid-cols-12 gap-6" *ngIf="process">
            <p-toast />
            <p-confirmDialog />

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
                        <p-button label="Xem hồ sơ ứng viên" icon="pi pi-user" [outlined]="true" styleClass="w-full" [routerLink]="['/rms/candidates', process.candidate?.id]" />
                    </div>

                    <div class="space-y-3 mt-4">
                        <h4 class="font-semibold text-surface-700 dark:text-surface-300">Thông tin Công việc</h4>
                        <p-button label="Xem chi tiết công việc" icon="pi pi-briefcase" [outlined]="true" styleClass="w-full" [routerLink]="['/rms/jobs', process.job?.id]" />
                    </div>
                </p-card>
            </div>

            <!-- Timeline các vòng phỏng vấn -->
            <div class="col-span-12 lg:col-span-8">
                <p-card>
                    <ng-template #header>
                        <div class="flex justify-between items-center p-4">
                            <span class="text-lg font-semibold">Lịch sử Phỏng vấn</span>
                            <p-button label="Thêm vòng phỏng vấn" icon="pi pi-plus" size="small" (onClick)="openAddRoundDialog()" />
                        </div>
                    </ng-template>
                    <p-timeline [value]="process.rounds" align="left">
                        <ng-template #content let-round>
                            <div class="mb-4">
                                <div class="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0">Vòng {{ round.round_number }}: {{ round.round_name }}</h3>
                                        <p class="text-surface-600 dark:text-surface-400 mt-1">
                                            <i class="pi pi-user mr-2"></i>
                                            Người phỏng vấn: {{ round.interviewer_name }}
                                        </p>
                                        <p class="text-surface-600 dark:text-surface-400 mt-1">
                                            <i class="pi pi-calendar mr-2"></i>
                                            {{ formatDateTime(round.scheduled_date) }}
                                        </p>
                                    </div>
                                    <div class="flex gap-2 items-center">
                                        <p-tag [value]="round.status" [severity]="getRoundStatusSeverity(round.status)" />
                                        <p-button icon="pi pi-pencil" [text]="true" size="small" severity="warn" (onClick)="openEditRoundDialog(round)" />
                                        <p-button icon="pi pi-trash" [text]="true" size="small" severity="danger" (onClick)="confirmDeleteRound(round)" />
                                    </div>
                                </div>

                                <!-- Kết quả vòng phỏng vấn -->
                                <div *ngIf="round.result" class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4 mt-3">
                                    <div class="flex justify-between items-start mb-3">
                                        <div class="flex-1">
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

                                            <div *ngIf="round.result.evaluated_at" class="text-xs text-surface-500 dark:text-surface-400 mt-2">Đánh giá lúc: {{ formatDateTime(round.result.evaluated_at) }}</div>
                                        </div>
                                        <p-button icon="pi pi-pencil" [text]="true" size="small" severity="warn" (onClick)="openUpdateResultDialog(round)" pTooltip="Cập nhật kết quả" />
                                    </div>
                                </div>

                                <div *ngIf="!round.result && round.status === 'Scheduled'" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-3">
                                    <div class="flex justify-between items-center">
                                        <p class="text-blue-700 dark:text-blue-300">
                                            <i class="pi pi-info-circle mr-2"></i>
                                            Vòng phỏng vấn đã được lên lịch, chờ kết quả đánh giá
                                        </p>
                                        <p-button label="Nhập kết quả" icon="pi pi-plus" size="small" (onClick)="openUpdateResultDialog(round)" />
                                    </div>
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

        <!-- Dialog Thêm/Sửa Vòng phỏng vấn -->
        <p-dialog maskStyleClass="backdrop-blur-sm" styleClass="!border-0" [(visible)]="displayRoundDialog" [header]="isEditRound ? 'Sửa Vòng phỏng vấn' : 'Thêm Vòng phỏng vấn'" [modal]="true" [style]="{ width: '600px' }">
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Số vòng <span style="color:red">*</span></label>
                        <p-inputNumber [(ngModel)]="roundForm.round_number" [min]="1" [max]="10" class="w-full" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Trạng thái <span style="color:red">*</span></label>
                        <p-select [(ngModel)]="roundForm.status" [options]="roundStatusOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Tên vòng phỏng vấn <span style="color:red">*</span></label>
                    <input pInputText [(ngModel)]="roundForm.round_name" class="w-full" placeholder="VD: Technical Interview" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Người phỏng vấn <span style="color:red">*</span></label>
                    <input pInputText [(ngModel)]="roundForm.interviewer_name" class="w-full" placeholder="VD: Nguyễn Văn A" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Ngày giờ phỏng vấn <span style="color:red">*</span></label>
                    <p-datePicker appendTo="body" [(ngModel)]="roundForm.scheduled_date" [showTime]="true" dateFormat="yy-mm-dd" [showIcon]="true" class="w-full" />
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2 mt-4">
                    <p-button label="Hủy" icon="pi pi-times" [text]="true" (onClick)="closeRoundDialog()" />
                    <p-button label="Lưu" icon="pi pi-check" (onClick)="saveRound()" />
                </div>
            </ng-template>
        </p-dialog>

        <!-- Dialog Cập nhật Kết quả -->
        <p-dialog maskStyleClass="backdrop-blur-sm" styleClass="!border-0" [(visible)]="displayResultDialog" header="Cập nhật Kết quả Phỏng vấn" [modal]="true" [style]="{ width: '600px' }">
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Trạng thái tham dự <span style="color:red">*</span></label>
                        <p-select appendTo="body" [(ngModel)]="resultForm.attendance_status" [options]="attendanceOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Kết quả <span style="color:red">*</span></label>
                        <p-select [(ngModel)]="resultForm.outcome" [options]="outcomeOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Điểm đánh giá (0-100)</label>
                    <p-inputNumber [(ngModel)]="resultForm.score" [min]="0" [max]="100" class="w-full" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Nhận xét</label>
                    <textarea pInputTextarea [(ngModel)]="resultForm.feedback" rows="4" class="w-full" placeholder="Nhận xét về ứng viên..."></textarea>
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2 mt-4">
                    <p-button label="Hủy" icon="pi pi-times" [text]="true" (onClick)="closeResultDialog()" />
                    <p-button label="Lưu" icon="pi pi-check" (onClick)="saveResult()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class ProcessDetail implements OnInit {
    process: any = null;
    processId!: number;

    displayRoundDialog = false;
    displayResultDialog = false;
    isEditRound = false;
    selectedRound: any = null;

    roundForm: any = {
        round_number: 1,
        round_name: '',
        interviewer_name: '',
        scheduled_date: null,
        status: 'Scheduled'
    };

    resultForm: any = {
        attendance_status: 'Scheduled',
        score: null,
        feedback: '',
        outcome: 'Pending'
    };

    roundStatusOptions = [
        { label: 'Đã lên lịch', value: 'Scheduled' },
        { label: 'Hoàn thành', value: 'Completed' },
        { label: 'Đã hủy', value: 'Cancelled' }
    ];

    attendanceOptions = [
        { label: 'Đã lên lịch', value: 'Scheduled' },
        { label: 'Đã tham dự', value: 'Attended' },
        { label: 'Vắng mặt', value: 'No-show' },
        { label: 'Đã hủy', value: 'Cancelled' }
    ];

    outcomeOptions = [
        { label: 'Đạt', value: 'Pass' },
        { label: 'Không đạt', value: 'Fail' },
        { label: 'Chờ kết quả', value: 'Pending' }
    ];

    constructor(
        private route: ActivatedRoute,
        private rmsService: RMSDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.processId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadProcess();
    }

    loadProcess(): void {
        this.rmsService.getRecruitmentProcessById(this.processId).subscribe((process) => {
            this.process = process;
        });
    }

    // ===== Round Management =====

    openAddRoundDialog(): void {
        this.isEditRound = false;
        this.selectedRound = null;
        this.resetRoundForm();
        const nextRoundNumber = (this.process.rounds?.length || 0) + 1;

        this.roundForm.round_number = nextRoundNumber;
        this.displayRoundDialog = true;
    }

    openEditRoundDialog(round: any): void {
        this.isEditRound = true;
        this.selectedRound = round;
        this.roundForm = {
            round_number: round.round_number,
            round_name: round.round_name,
            interviewer_name: round.interviewer_name,
            scheduled_date: new Date(round.scheduled_date),
            status: round.status
        };
        this.displayRoundDialog = true;
    }

    closeRoundDialog(): void {
        this.displayRoundDialog = false;
        this.resetRoundForm();
    }

    resetRoundForm(): void {
        this.roundForm = {
            round_number: 1,
            round_name: '',
            interviewer_name: '',
            scheduled_date: null,
            status: 'Scheduled'
        };
    }

    saveRound(): void {
        if (!this.roundForm.round_name || !this.roundForm.interviewer_name || !this.roundForm.scheduled_date) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc' });

            return;
        }

        const roundData = {
            recruitment_process_id: this.processId,
            round_number: this.roundForm.round_number,
            round_name: this.roundForm.round_name,
            interviewer_name: this.roundForm.interviewer_name,
            scheduled_date: this.formatDateTimeForSave(this.roundForm.scheduled_date),
            status: this.roundForm.status
        };

        if (this.isEditRound && this.selectedRound) {
            this.rmsService.updateInterviewRound(this.selectedRound.id, roundData);
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật vòng phỏng vấn thành công' });
        } else {
            this.rmsService.createInterviewRound(roundData);
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm vòng phỏng vấn thành công' });
        }

        this.closeRoundDialog();
        this.loadProcess();
    }

    confirmDeleteRound(round: any): void {
        this.confirmationService.confirm({
            message: `Bạn có chắc chắn muốn xóa vòng phỏng vấn "${round.round_name}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: () => {
                this.deleteRound(round);
            }
        });
    }

    deleteRound(round: any): void {
        this.rmsService.deleteInterviewRound(round.id);
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa vòng phỏng vấn thành công' });
        this.loadProcess();
    }

    // ===== Result Management =====

    openUpdateResultDialog(round: any): void {
        this.selectedRound = round;

        if (round.result) {
            this.resultForm = {
                attendance_status: round.result.attendance_status,
                score: round.result.score,
                feedback: round.result.feedback,
                outcome: round.result.outcome
            };
        } else {
            this.resetResultForm();
        }

        this.displayResultDialog = true;
    }

    closeResultDialog(): void {
        this.displayResultDialog = false;
        this.resetResultForm();
    }

    resetResultForm(): void {
        this.resultForm = {
            attendance_status: 'Scheduled',
            score: null,
            feedback: '',
            outcome: 'Pending'
        };
    }

    saveResult(): void {
        if (!this.selectedRound || !this.process.candidate) {
            return;
        }

        this.rmsService.updateCandidateRound(this.process.candidate.id, this.selectedRound.id, this.resultForm);

        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật kết quả phỏng vấn thành công' });
        this.closeResultDialog();
        this.loadProcess();
    }

    // ===== Helper Methods =====

    formatDate(dateStr: string): string {
        const date = new Date(dateStr);

        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    formatDateTime(dateStr: string): string {
        const date = new Date(dateStr);

        return date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    formatDateTimeForSave(date: Date): string {
        return date.toISOString();
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
