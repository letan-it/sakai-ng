import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { JobWithDetails } from '@/models/rms.models';
import { getJobShareUrl } from '@/utils/share-url';
import * as htmlToImage from 'html-to-image';

@Component({
    selector: 'app-share-job-modal',
    imports: [CommonModule, DialogModule, ButtonModule, ChipModule, DividerModule],
    providers: [MessageService],
    template: `
        <p-dialog [(visible)]="visible" (visibleChange)="visibleChange.emit($event)" header="Xem trước nội dung chia sẻ" [modal]="true" [style]="{ width: '600px' }" maskStyleClass="backdrop-blur-sm" styleClass="!border-0">
            <div #previewContent class="space-y-4" *ngIf="job">
                <!-- Hình ảnh thumbnail -->
                <div class="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <div class="text-center text-white">
                        <i class="pi pi-briefcase text-6xl mb-2"></i>
                        <h3 class="text-xl font-bold">{{ job.title }}</h3>
                    </div>
                </div>

                <!-- Tóm tắt mô tả -->
                <div>
                    <h4 class="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">Mô tả công việc</h4>
                    <p class="text-surface-600 dark:text-surface-400 text-sm">
                        {{ getJobSummary() }}
                    </p>
                </div>

                <p-divider />

                <!-- Thông tin lương và địa điểm -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <h4 class="text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">Mức lương</h4>
                        <p class="font-medium text-sm">{{ formatSalary(job.salary_min) }} - {{ formatSalary(job.salary_max) }} VND</p>
                    </div>
                    <div>
                        <h4 class="text-xs font-semibold text-surface-600 dark:text-surface-400 mb-1">Địa điểm</h4>
                        <p class="font-medium text-sm">
                            <i class="pi pi-map-marker text-primary mr-1"></i>
                            {{ job.location }}
                        </p>
                    </div>
                </div>

                <!-- Kỹ năng yêu cầu -->
                <div *ngIf="job.skills && job.skills.length > 0">
                    <h4 class="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">Kỹ năng yêu cầu</h4>
                    <div class="flex flex-wrap gap-2">
                        <p-chip *ngFor="let skill of getTopSkills()" [label]="skill.name" styleClass="text-xs" />
                        <p-chip *ngIf="job.skills.length > 5" [label]="'+' + (job.skills.length - 5) + ' kỹ năng khác'" styleClass="text-xs bg-surface-200 dark:bg-surface-700" />
                    </div>
                </div>

                <p-divider />

                <!-- Footer công ty -->
                <div class="bg-surface-50 dark:bg-surface-800 p-4 rounded-lg">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {{ getCompanyInitials() }}
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-surface-900 dark:text-surface-0">{{ job.customer?.name }}</h4>
                            <p class="text-sm text-surface-600 dark:text-surface-400">{{ job.customer?.industry }}</p>
                            <p class="text-xs text-primary mt-1">
                                <i class="pi pi-globe mr-1"></i>
                                Tuyển dụng nhân tài - Xây dựng tương lai
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Link chia sẻ và nội dung -->
                <div class="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg space-y-2">
                    <p class="text-xs text-surface-600 dark:text-surface-400 mb-1">Link chia sẻ:</p>
                    <p class="text-sm font-mono text-primary break-all">{{ getShareLink() }}</p>

                    <p-divider styleClass="my-2" />

                    <p class="text-xs text-surface-600 dark:text-surface-400 mb-1">Nội dung chia sẻ:</p>
                    <div class="bg-white dark:bg-surface-900 p-3 rounded border border-surface-200 dark:border-surface-700">
                        <pre class="text-xs whitespace-pre-wrap font-sans text-surface-900 dark:text-surface-0">{{ getShareText() }}</pre>
                    </div>
                    <p-button label="Copy nội dung chia sẻ" icon="pi pi-copy" [outlined]="true" size="small" class="w-full mt-2" (onClick)="copyShareText()" />
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2 mt-4">
                    <p-button label="Hủy" icon="pi pi-times" [text]="true" (onClick)="onCancel()" />
                    <p-button label="Tạo ảnh và tải xuống" icon="pi pi-download" [outlined]="true" (onClick)="generateAndDownloadImage()" severity="secondary" />
                    <p-button label="Copy & Chia sẻ lên Facebook" icon="pi pi-facebook" (onClick)="onConfirmShare()" severity="info" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class ShareJobModal {
    @Input() visible = false;
    @Input() job: JobWithDetails | null = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() confirmShare = new EventEmitter<void>();
    @ViewChild('previewContent', { read: ElementRef }) previewContent?: ElementRef;

    private readonly MAX_SUMMARY_LENGTH = 200;

    constructor(private messageService: MessageService) {}

    getJobSummary(): string {
        if (!this.job) return '';

        const description = this.job.description;

        if (description.length <= this.MAX_SUMMARY_LENGTH) return description;

        return description.substring(0, this.MAX_SUMMARY_LENGTH) + '...';
    }

    formatSalary(amount: number): string {
        return (amount / 1000000).toFixed(0) + ' triệu';
    }

    getTopSkills() {
        if (!this.job?.skills) return [];

        return this.job.skills.slice(0, 5);
    }

    getCompanyInitials(): string {
        if (!this.job?.customer?.name) return '??';

        return this.job.customer.name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    getShareLink(): string {
        if (!this.job) return '';

        return getJobShareUrl(this.job.id);
    }

    getShareText(): string {
        if (!this.job) return '';

        const salary = `${this.formatSalary(this.job.salary_min)} - ${this.formatSalary(this.job.salary_max)} VND`;
        const experience = `${this.job.experience_min} - ${this.job.experience_max} năm kinh nghiệm`;

        const skillsList =
            this.job.skills && this.job.skills.length > 0
                ? this.job.skills
                      .slice(0, 5)
                      .map((s) => s.name)
                      .join(', ')
                : 'Nhiều kỹ năng đa dạng';

        const moreSkills = this.job.skills && this.job.skills.length > 5 ? ` và ${this.job.skills.length - 5} kỹ năng khác` : '';

        const companyInfo = this.job.customer ? `${this.job.customer.name} - ${this.job.customer.industry}` : 'Công ty hàng đầu';

        return `🚀 TUYỂN DỤNG: ${this.job.title}

📍 Địa điểm: ${this.job.location}
💰 Mức lương: ${salary}
💼 Kinh nghiệm: ${experience}
🎓 Trình độ: ${this.job.education_level}

✨ Kỹ năng yêu cầu: ${skillsList}${moreSkills}

📋 Mô tả công việc:
${this.job.description}

🏢 ${companyInfo}

Tuyển dụng nhân tài - Xây dựng tương lai

🔗 Chi tiết & Ứng tuyển: ${this.getShareLink()}

#TuyenDung #JobOpportunity #Career #${this.job.location.replace(/\s+/g, '')}`;
    }

    async copyShareText(): Promise<void> {
        const shareText = this.getShareText();

        try {
            await navigator.clipboard.writeText(shareText);
            this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã copy nội dung chia sẻ vào clipboard'
            });
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');

            textArea.value = shareText;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đã copy nội dung chia sẻ vào clipboard'
                });
            } catch (e) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không thể copy nội dung. Vui lòng copy thủ công.'
                });
            }

            document.body.removeChild(textArea);
        }
    }

    private sanitizeFilename(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);
    }

    async generateAndDownloadImage(): Promise<void> {
        if (!this.previewContent?.nativeElement || !this.job) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tạo ảnh. Vui lòng thử lại.'
            });

            return;
        }

        try {
            // Show loading message
            this.messageService.add({
                severity: 'info',
                summary: 'Đang xử lý',
                detail: 'Đang tạo ảnh, vui lòng đợi...'
            });

            const element = this.previewContent.nativeElement;

            // Generate image using html-to-image
            const dataUrl = await htmlToImage.toPng(element, {
                quality: 1,
                pixelRatio: 2, // Higher resolution for better quality
                backgroundColor: '#ffffff',
                style: {
                    padding: '20px'
                }
            });

            // Create download link
            const link = document.createElement('a');
            const sanitizedTitle = this.sanitizeFilename(this.job.title);
            const fileName = `tuyen-dung-${sanitizedTitle}-${Date.now()}.png`;

            link.download = fileName;
            link.href = dataUrl;
            link.click();

            this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã tải ảnh xuống thành công'
            });
        } catch (error) {
            console.error('Error generating image:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tạo ảnh. Vui lòng thử lại.'
            });
        }
    }

    onCancel(): void {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    async onConfirmShare(): Promise<void> {
        // Copy the share text first
        await this.copyShareText();
        // Then emit the confirm event to open Facebook
        this.confirmShare.emit();
    }
}
