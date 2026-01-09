import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { combineLatest } from 'rxjs';
import { RMSDataService } from '@/services/rms-data.service';
import { SocialShareService } from '@/services/social-share.service';
import { JobWithDetails, Candidate, Hunter } from '@/models/rms.models';
import { ShareJobModal } from './components/share-job-modal';

@Component({
    selector: 'app-job-detail',
    imports: [CommonModule, RouterModule, FormsModule, CardModule, TableModule, TagModule, ChipModule, ProgressBarModule, ButtonModule, DividerModule, DialogModule, SelectModule, ToastModule, ShareJobModal],
    providers: [MessageService],
    template: `
        <div class="grid grid-cols-12 gap-6" *ngIf="job">
            <p-toast />

            <div class="col-span-12">
                <div class="flex justify-between items-start">
                    <div>
                        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ job.title }}</h1>
                        <p class="text-surface-600 dark:text-surface-400 mt-2">
                            <i class="pi pi-building mr-2"></i>
                            {{ job.customer?.name }} - {{ job.customer?.industry }}
                        </p>
                    </div>
                    <div class="flex gap-2">
                        <p-button label="Chia sẻ" icon="pi pi-share-alt" severity="info" (onClick)="openShareDialog()" />
                        <p-button label="Quay lại" icon="pi pi-arrow-left" [text]="true" [routerLink]="['/rms/jobs']" />
                    </div>
                </div>
            </div>

            <!-- Thông tin công việc -->
            <div class="col-span-12 lg:col-span-8">
                <p-card header="Thông tin Công việc">
                    <div class="space-y-4">
                        <div>
                            <h3 class="font-semibold text-surface-700 dark:text-surface-300 mb-2">Mô tả công việc</h3>
                            <p class="text-surface-600 dark:text-surface-400">{{ job.description }}</p>
                        </div>

                        <p-divider />

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Địa điểm</h4>
                                <p class="font-medium">
                                    <i class="pi pi-map-marker text-primary mr-2"></i>
                                    {{ job.location }}
                                </p>
                            </div>
                            <div>
                                <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Mức lương</h4>
                                <p class="font-medium">{{ formatSalary(job.salary_min) }} - {{ formatSalary(job.salary_max) }} VND</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Trình độ học vấn</h4>
                                <p class="font-medium">{{ job.education_level }}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Kinh nghiệm</h4>
                                <p class="font-medium">{{ job.experience_min }} - {{ job.experience_max }} năm</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Trạng thái</h4>
                                <p-tag [value]="job.status" [severity]="job.status === 'Open' ? 'success' : 'danger'" />
                            </div>
                        </div>

                        <p-divider />

                        <div>
                            <h3 class="font-semibold text-surface-700 dark:text-surface-300 mb-3">Kỹ năng yêu cầu</h3>
                            <div class="flex flex-wrap gap-2">
                                <p-chip *ngFor="let skill of job.skills" [label]="skill.name + ' (' + getImportanceText(skill.importance_level) + ')'" [styleClass]="getImportanceClass(skill.importance_level)" />
                            </div>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Thông tin liên hệ -->
            <div class="col-span-12 lg:col-span-4">
                <p-card header="Thông tin Liên hệ">
                    <div class="space-y-3">
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Công ty</h4>
                            <p class="font-medium">{{ job.customer?.name }}</p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Ngành nghề</h4>
                            <p class="font-medium">{{ job.customer?.industry }}</p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Email</h4>
                            <p class="font-medium">{{ job.customer?.contact_email }}</p>
                        </div>
                        <div>
                            <h4 class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1">Điện thoại</h4>
                            <p class="font-medium">{{ job.customer?.contact_phone }}</p>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Ứng viên đã ứng tuyển -->
            <div class="col-span-12">
                <p-card header="Ứng viên đã ứng tuyển">
                    <ng-template #header>
                        <div class="flex justify-between items-center p-4">
                            <h3 class="text-xl font-semibold">Ứng viên đã ứng tuyển</h3>
                            <p-button label="Thêm Ứng viên" icon="pi pi-user-plus" (onClick)="openAddCandidateDialog()" severity="success" />
                        </div>
                    </ng-template>

                    <p-table [value]="job.candidates || []" [tableStyle]="{ 'min-width': '50rem' }">
                        <ng-template #header>
                            <tr>
                                <th>Tên ứng viên</th>
                                <th>Vị trí hiện tại</th>
                                <th>Địa điểm</th>
                                <th>Trạng thái</th>
                                <th>Matching Score</th>
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
                                <td>{{ candidate.current_position }}</td>
                                <td>{{ candidate.location }}</td>
                                <td>
                                    <p-tag [value]="candidate.status" [severity]="getStatusSeverity(candidate.status)" />
                                </td>
                                <td>
                                    <div class="flex items-center gap-3">
                                        <p-progressBar [value]="candidate.matching_score.overall_score" [showValue]="false" [style]="{ width: '120px', height: '8px' }" />
                                        <span class="font-semibold text-primary">{{ candidate.matching_score.overall_score }}%</span>
                                    </div>
                                </td>
                                <td>
                                    <p-button label="Xem" icon="pi pi-eye" [text]="true" size="small" [routerLink]="['/rms/candidates', candidate.id]" />
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template #emptymessage>
                            <tr>
                                <td colspan="6" class="text-center text-surface-500 dark:text-surface-400 py-8">Chưa có ứng viên nào ứng tuyển</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </p-card>
            </div>
        </div>

        <!-- Dialog Thêm Ứng viên -->
        <p-dialog maskStyleClass="backdrop-blur-sm" styleClass="!border-0" [(visible)]="displayAddCandidateDialog" header="Thêm Ứng viên vào Công việc" [modal]="true" [style]="{ width: '700px' }">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Chọn Ứng viên <span style="color:red">*</span></label>
                    <p-select
                        appendTo="body"
                        [(ngModel)]="selectedCandidateId"
                        [options]="availableCandidates"
                        optionLabel="full_name"
                        optionValue="id"
                        placeholder="Chọn ứng viên từ danh sách"
                        class="w-full"
                        [filter]="true"
                        filterBy="full_name,email,current_position"
                    >
                        <ng-template #item let-candidate>
                            <div class="flex items-center gap-3 py-2">
                                <div>
                                    <div class="font-semibold">{{ candidate.full_name }}</div>
                                    <div class="text-sm text-surface-600 dark:text-surface-400">{{ candidate.current_position }} - {{ candidate.location }}</div>
                                    <div class="text-xs text-surface-500 dark:text-surface-500">{{ candidate.email }}</div>
                                </div>
                            </div>
                        </ng-template>
                    </p-select>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Headhunter phụ trách <span style="color:red">*</span></label>
                    <p-select appendTo="body" [(ngModel)]="selectedHunterId" [options]="hunters" optionLabel="name" optionValue="id" placeholder="Chọn headhunter" class="w-full">
                        <ng-template #item let-hunter>
                            <div>
                                <div class="font-semibold">{{ hunter.name }}</div>
                                <div class="text-sm text-surface-600 dark:text-surface-400">{{ hunter.specialization }}</div>
                            </div>
                        </ng-template>
                    </p-select>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Trạng thái ban đầu <span style="color:red">*</span></label>
                    <p-select appendTo="body" [(ngModel)]="selectedStatus" [options]="statusOptions" optionLabel="label" optionValue="value" placeholder="Chọn trạng thái" class="w-full" />
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2 mt-4">
                    <p-button label="Hủy" icon="pi pi-times" [text]="true" (onClick)="closeAddCandidateDialog()" />
                    <p-button label="Thêm Ứng viên" icon="pi pi-check" (onClick)="addCandidateToJob()" />
                </div>
            </ng-template>
        </p-dialog>

        <!-- Modal chia sẻ công việc -->
        <app-share-job-modal [(visible)]="displayShareDialog" [job]="job" (confirmShare)="handleShareConfirm()" />
    `
})
export class JobDetail implements OnInit {
    job: JobWithDetails | null = null;
    displayAddCandidateDialog = false;
    displayShareDialog = false;
    availableCandidates: Candidate[] = [];
    hunters: Hunter[] = [];
    selectedCandidateId: number | null = null;
    selectedHunterId: number | null = null;
    selectedStatus: 'Applied' | 'Screening' | 'Interviewing' | 'Offered' | 'Hired' | 'Rejected' = 'Applied';

    statusOptions = [
        { label: 'Đã ứng tuyển', value: 'Applied' },
        { label: 'Sàng lọc', value: 'Screening' },
        { label: 'Phỏng vấn', value: 'Interviewing' },
        { label: 'Đã đề nghị', value: 'Offered' },
        { label: 'Đã tuyển', value: 'Hired' },
        { label: 'Từ chối', value: 'Rejected' }
    ];

    constructor(
        private route: ActivatedRoute,
        private rmsService: RMSDataService,
        private messageService: MessageService,
        private socialShareService: SocialShareService
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.loadJob(id);
        this.loadHunters();
    }

    loadJob(id: number): void {
        this.rmsService.getJobById(id).subscribe((job) => {
            this.job = job || null;
            this.loadAvailableCandidates(id);
        });
    }

    loadAvailableCandidates(jobId: number): void {
        combineLatest([this.rmsService.getCandidates(), this.rmsService.getCandidateJobsByJobId(jobId)]).subscribe(([allCandidates, candidateJobs]) => {
            const assignedCandidateIds = candidateJobs.map((cj) => cj.candidate_id);

            this.availableCandidates = allCandidates.filter((c) => !assignedCandidateIds.includes(c.id));
        });
    }

    loadHunters(): void {
        this.rmsService.getHunters().subscribe((hunters) => {
            this.hunters = hunters;
        });
    }

    openAddCandidateDialog(): void {
        this.selectedCandidateId = null;
        this.selectedHunterId = null;
        this.selectedStatus = 'Applied';
        this.displayAddCandidateDialog = true;
    }

    closeAddCandidateDialog(): void {
        this.displayAddCandidateDialog = false;
    }

    addCandidateToJob(): void {
        if (!this.selectedCandidateId || !this.selectedHunterId || !this.job) {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn đầy đủ thông tin' });

            return;
        }

        const newCandidateJob = {
            candidate_id: this.selectedCandidateId,
            job_id: this.job.id,
            hunter_id: this.selectedHunterId,
            applied_date: new Date().toISOString(),
            current_status: this.selectedStatus
        };

        this.rmsService.addCandidateToJob(newCandidateJob);
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã thêm ứng viên vào công việc' });

        this.closeAddCandidateDialog();

        this.loadJob(this.job.id);
    }

    formatSalary(amount: number): string {
        return (amount / 1000000).toFixed(0) + ' triệu';
    }

    getImportanceText(level: number): string {
        const labels = ['', 'Tốt nếu có', 'Cơ bản', 'Quan trọng', 'Rất quan trọng', 'Bắt buộc'];

        return labels[level] || '';
    }

    getImportanceClass(level: number): string {
        if (level >= 5) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
        if (level >= 4) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
        if (level >= 3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';

        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
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

    openShareDialog(): void {
        this.displayShareDialog = true;
    }

    async handleShareConfirm(): Promise<void> {
        if (this.job) {
            try {
                const result = await this.socialShareService.shareOnFacebook(this.job);

                if (result.success) {
                    const message = result.method === 'native_app' ? 'Đã mở ứng dụng Facebook để chia sẻ' : 'Đang mở cửa sổ chia sẻ Facebook';

                    this.messageService.add({ severity: 'success', summary: 'Thành công', detail: message });
                } else {
                    let errorMessage = 'Không thể mở chia sẻ Facebook';

                    if (result.message === 'Popup blocked') {
                        errorMessage = 'Vui lòng cho phép popup để chia sẻ lên Facebook';
                    }

                    this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail: errorMessage });
                }

                this.displayShareDialog = false;
            } catch (error) {
                console.error('Lỗi khi chia sẻ lên Facebook:', error);
                this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi xảy ra khi chia sẻ' });
            }
        }
    }
}
