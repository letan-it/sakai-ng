import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';
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
import { CandidateWithDetails, CandidateExperience, Skill } from '@/models/rms.models';

@Component({
    selector: 'app-candidate-profile',
    imports: [CommonModule, RouterModule, FormsModule, CardModule, TableModule, TagModule, ChipModule, ProgressBarModule, ButtonModule, DividerModule, TimelineModule, DialogModule, InputTextModule, TextareaModule, InputNumberModule, SelectModule, DatePickerModule, ConfirmDialogModule, ToastModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="grid grid-cols-12 gap-6" *ngIf="candidate">
            <p-toast />
            <p-confirmDialog />

            <div class="col-span-12">
                <div class="flex justify-between items-start">
                    <div>
                        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ candidate.full_name }}</h1>
                        <p class="text-surface-600 dark:text-surface-400 mt-2">{{ candidate.current_position }}</p>
                    </div>
                    <div class="flex gap-2">
                        <p-tag [value]="candidate.status" [severity]="getStatusSeverity(candidate.status)" styleClass="text-lg px-4 py-2" />
                        <p-button label="Sửa" icon="pi pi-pencil" severity="warn" [outlined]="true" (onClick)="openEditCandidateDialog()" />
                        <p-button label="Xóa" icon="pi pi-trash" severity="danger" [outlined]="true" (onClick)="confirmDeleteCandidate()" />
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
                <p-card styleClass="mt-6">
                    <ng-template #header>
                        <div class="flex justify-between items-center p-4">
                            <span class="text-lg font-semibold">Kỹ năng & Trình độ</span>
                            <p-button label="Thêm kỹ năng" icon="pi pi-plus" size="small" (onClick)="openAddSkillDialog()" />
                        </div>
                    </ng-template>
                    <div class="space-y-4">
                        <div *ngFor="let skill of candidate.skills" class="flex items-center gap-3">
                            <div class="flex-1">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="font-semibold text-surface-700 dark:text-surface-300">{{ skill.name }}</span>
                                    <span class="text-sm text-surface-600 dark:text-surface-400">{{ skill.years_of_experience }} năm</span>
                                </div>
                                <p-progressBar [value]="skill.proficiency_level * 20" [showValue]="false" [style]="{ height: '8px' }" />
                                <div class="text-xs text-surface-500 dark:text-surface-400 mt-1">{{ getProficiencyText(skill.proficiency_level) }}</div>
                            </div>
                            <p-button icon="pi pi-trash" [text]="true" severity="danger" size="small" (onClick)="confirmDeleteSkill(skill)" />
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Kinh nghiệm làm việc -->
            <div class="col-span-12 lg:col-span-8">
                <p-card>
                    <ng-template #header>
                        <div class="flex justify-between items-center p-4">
                            <span class="text-lg font-semibold">Kinh nghiệm Làm việc</span>
                            <p-button label="Thêm kinh nghiệm" icon="pi pi-plus" size="small" (onClick)="openAddExperienceDialog()" />
                        </div>
                    </ng-template>
                    <p-timeline [value]="candidate.experiences" align="left">
                        <ng-template #content let-exp>
                            <div class="mb-4">
                                <div class="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 class="text-lg font-bold text-surface-900 dark:text-surface-0">{{ exp.position }}</h3>
                                        <p class="text-primary font-semibold">{{ exp.company_name }}</p>
                                    </div>
                                    <div class="flex gap-2 items-center">
                                        <p-chip [label]="formatDateRange(exp)" styleClass="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100" />
                                        <p-button icon="pi pi-pencil" [text]="true" size="small" severity="warn" (onClick)="openEditExperienceDialog(exp)" />
                                        <p-button icon="pi pi-trash" [text]="true" size="small" severity="danger" (onClick)="confirmDeleteExperience(exp)" />
                                    </div>
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

        <!-- Dialog Sửa Thông tin Ứng viên -->
        <p-dialog maskStyleClass="backdrop-blur-sm" styleClass="!border-0" [(visible)]="displayEditDialog" header="Sửa Thông tin Ứng viên" [modal]="true" [style]="{ width: '600px' }">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Họ và tên <span style="color:red">*</span></label>
                    <input pInputText [(ngModel)]="candidateForm.full_name" class="w-full" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Email <span style="color:red">*</span></label>
                        <input pInputText [(ngModel)]="candidateForm.email" type="email" class="w-full" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Số điện thoại <span style="color:red">*</span></label>
                        <input pInputText [(ngModel)]="candidateForm.phone" class="w-full" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Vị trí hiện tại <span style="color:red">*</span></label>
                    <input pInputText [(ngModel)]="candidateForm.current_position" class="w-full" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Địa điểm <span style="color:red">*</span></label>
                        <input pInputText [(ngModel)]="candidateForm.location" class="w-full" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Trạng thái <span style="color:red">*</span></label>
                        <p-select appendTo="body" [(ngModel)]="candidateForm.status" [options]="statusOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Link CV</label>
                    <input pInputText [(ngModel)]="candidateForm.cv_link" class="w-full" />
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2 mt-4">
                    <p-button label="Hủy" icon="pi pi-times" [text]="true" (onClick)="closeEditDialog()" />
                    <p-button label="Lưu" icon="pi pi-check" (onClick)="saveCandidate()" />
                </div>
            </ng-template>
        </p-dialog>

        <!-- Dialog Thêm Kỹ năng -->
        <p-dialog maskStyleClass="backdrop-blur-sm" styleClass="!border-0" [(visible)]="displaySkillDialog" header="Thêm Kỹ năng" [modal]="true" [style]="{ width: '500px' }">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Kỹ năng <span style="color:red">*</span></label>
                    <p-select appendTo="body" [(ngModel)]="skillForm.skill_id" [options]="availableSkills" optionLabel="name" optionValue="id" placeholder="Chọn kỹ năng" class="w-full" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Trình độ (1-5) <span style="color:red">*</span></label>
                    <p-inputNumber [(ngModel)]="skillForm.proficiency_level" [min]="1" [max]="5" class="w-full" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Số năm kinh nghiệm <span style="color:red">*</span></label>
                    <p-inputNumber [(ngModel)]="skillForm.years_of_experience" [min]="0" [max]="50" class="w-full" />
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2 mt-4">
                    <p-button label="Hủy" icon="pi pi-times" [text]="true" (onClick)="closeSkillDialog()" />
                    <p-button label="Thêm" icon="pi pi-check" (onClick)="saveSkill()" />
                </div>
            </ng-template>
        </p-dialog>

        <!-- Dialog Thêm/Sửa Kinh nghiệm -->
        <p-dialog maskStyleClass="backdrop-blur-sm" styleClass="!border-0" [(visible)]="displayExperienceDialog" [header]="isEditExperience ? 'Sửa Kinh nghiệm' : 'Thêm Kinh nghiệm'" [modal]="true" [style]="{ width: '600px' }">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Vị trí <span style="color:red">*</span></label>
                    <input pInputText [(ngModel)]="experienceForm.position" class="w-full" placeholder="VD: Senior Developer" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Công ty <span style="color:red">*</span></label>
                    <input pInputText [(ngModel)]="experienceForm.company_name" class="w-full" placeholder="VD: Tech Company" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Ngày bắt đầu <span style="color:red">*</span></label>
                        <p-datePicker appendTo="body" [(ngModel)]="experienceForm.start_date" dateFormat="yy-mm-dd" [showIcon]="true" class="w-full" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">Ngày kết thúc</label>
                        <p-datePicker appendTo="body" [(ngModel)]="experienceForm.end_date" dateFormat="yy-mm-dd" [showIcon]="true" class="w-full" placeholder="Để trống nếu đang làm" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Mô tả</label>
                    <textarea pInputTextarea [(ngModel)]="experienceForm.description" rows="4" class="w-full" placeholder="Mô tả công việc và thành tích..."></textarea>
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2 mt-4">
                    <p-button label="Hủy" icon="pi pi-times" [text]="true" (onClick)="closeExperienceDialog()" />
                    <p-button label="Lưu" icon="pi pi-check" (onClick)="saveExperience()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class CandidateProfile implements OnInit {
    candidate: CandidateWithDetails | null = null;
    candidateId!: number;

    displayEditDialog = false;
    displaySkillDialog = false;
    displayExperienceDialog = false;
    isEditExperience = false;
    selectedExperience: CandidateExperience | null = null;

    availableSkills: Skill[] = [];

    candidateForm: any = {
        full_name: '',
        email: '',
        phone: '',
        cv_link: '',
        location: '',
        current_position: '',
        status: 'Pending'
    };

    skillForm: any = {
        skill_id: null,
        proficiency_level: 3,
        years_of_experience: 0
    };

    experienceForm: any = {
        company_name: '',
        position: '',
        start_date: null,
        end_date: null,
        description: ''
    };

    statusOptions = [
        { label: 'Đang chờ', value: 'Pending' },
        { label: 'Đang phỏng vấn', value: 'Interviewing' },
        { label: 'Đã tuyển', value: 'Hired' },
        { label: 'Từ chối', value: 'Rejected' }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private rmsService: RMSDataService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.candidateId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadCandidate();
        this.loadSkills();
    }

    loadCandidate(): void {
        this.rmsService.getCandidateById(this.candidateId).subscribe((candidate) => {
            this.candidate = candidate || null;
        });
    }

    loadSkills(): void {
        this.rmsService.getSkills().subscribe((skills) => {
            this.availableSkills = skills;
        });
    }

    // ===== Candidate Edit =====

    openEditCandidateDialog(): void {
        if (this.candidate) {
            this.candidateForm = { ...this.candidate };
            this.displayEditDialog = true;
        }
    }

    closeEditDialog(): void {
        this.displayEditDialog = false;
    }

    saveCandidate(): void {
        this.rmsService.updateCandidate(this.candidateId, this.candidateForm);
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật thông tin ứng viên thành công' });
        this.closeEditDialog();
        this.loadCandidate();
    }

    confirmDeleteCandidate(): void {
        this.confirmationService.confirm({
            message: `Bạn có chắc chắn muốn xóa ứng viên "${this.candidate?.full_name}"? Hành động này không thể hoàn tác.`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: () => {
                this.deleteCandidate();
            }
        });
    }

    deleteCandidate(): void {
        this.rmsService.deleteCandidate(this.candidateId);
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa ứng viên thành công' });
        this.router.navigate(['/rms/candidates']);
    }

    // ===== Skills Management =====

    openAddSkillDialog(): void {
        this.resetSkillForm();
        this.displaySkillDialog = true;
    }

    closeSkillDialog(): void {
        this.displaySkillDialog = false;
        this.resetSkillForm();
    }

    resetSkillForm(): void {
        this.skillForm = {
            skill_id: null,
            proficiency_level: 3,
            years_of_experience: 0
        };
    }

    saveSkill(): void {
        if (!this.skillForm.skill_id) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn kỹ năng' });

            return;
        }

        this.rmsService.addCandidateSkill({
            candidate_id: this.candidateId,
            skill_id: this.skillForm.skill_id,
            proficiency_level: this.skillForm.proficiency_level,
            years_of_experience: this.skillForm.years_of_experience
        });

        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm kỹ năng thành công' });
        this.closeSkillDialog();
        this.loadCandidate();
    }

    confirmDeleteSkill(skill: any): void {
        this.confirmationService.confirm({
            message: `Bạn có chắc chắn muốn xóa kỹ năng "${skill.name}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: () => {
                this.deleteSkill(skill);
            }
        });
    }

    deleteSkill(skill: any): void {
        this.rmsService.removeCandidateSkill(skill.id);
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa kỹ năng thành công' });
        this.loadCandidate();
    }

    // ===== Experience Management =====

    openAddExperienceDialog(): void {
        this.isEditExperience = false;
        this.selectedExperience = null;
        this.resetExperienceForm();
        this.displayExperienceDialog = true;
    }

    openEditExperienceDialog(exp: CandidateExperience): void {
        this.isEditExperience = true;
        this.selectedExperience = exp;
        this.experienceForm = {
            company_name: exp.company_name,
            position: exp.position,
            start_date: new Date(exp.start_date),
            end_date: exp.end_date ? new Date(exp.end_date) : null,
            description: exp.description
        };
        this.displayExperienceDialog = true;
    }

    closeExperienceDialog(): void {
        this.displayExperienceDialog = false;
        this.resetExperienceForm();
    }

    resetExperienceForm(): void {
        this.experienceForm = {
            company_name: '',
            position: '',
            start_date: null,
            end_date: null,
            description: ''
        };
    }

    saveExperience(): void {
        if (!this.experienceForm.company_name || !this.experienceForm.position || !this.experienceForm.start_date) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng điền đầy đủ thông tin bắt buộc' });

            return;
        }

        const expData = {
            candidate_id: this.candidateId,
            company_name: this.experienceForm.company_name,
            position: this.experienceForm.position,
            start_date: this.formatDate(this.experienceForm.start_date),
            end_date: this.experienceForm.end_date ? this.formatDate(this.experienceForm.end_date) : null,
            description: this.experienceForm.description
        };

        if (this.isEditExperience && this.selectedExperience) {
            this.rmsService.updateCandidateExperience(this.selectedExperience.id, expData);
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật kinh nghiệm thành công' });
        } else {
            this.rmsService.addCandidateExperience(expData);
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Thêm kinh nghiệm thành công' });
        }

        this.closeExperienceDialog();
        this.loadCandidate();
    }

    confirmDeleteExperience(exp: CandidateExperience): void {
        this.confirmationService.confirm({
            message: `Bạn có chắc chắn muốn xóa kinh nghiệm tại "${exp.company_name}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy',
            accept: () => {
                this.deleteExperience(exp);
            }
        });
    }

    deleteExperience(exp: CandidateExperience): void {
        this.rmsService.deleteCandidateExperience(exp.id);
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa kinh nghiệm thành công' });
        this.loadCandidate();
    }

    // ===== Helper Methods =====

    formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
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
