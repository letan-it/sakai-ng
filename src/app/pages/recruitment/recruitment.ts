import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule, FileSelectEvent } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import * as pdfjsLib from 'pdfjs-dist';
import { detectVietnamesePhones, detectEmails, compareCV as compareCVUtil, MatchResult } from '@/utils';

// Cấu hình worker cho PDF.js - sử dụng worker local thay vì CDN
const PDF_WORKER_SRC = '/pdf.worker.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;

@Component({
    selector: 'app-recruitment',
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TextareaModule, FileUploadModule, CardModule, ChipModule, ProgressBarModule, DividerModule, TooltipModule, ToastModule, DialogModule],
    providers: [MessageService],
    template: `
        <!-- Toast for notifications -->
        <p-toast />

        <!-- Dialog giới thiệu -->
        <p-dialog header="Thông báo" [(visible)]="displayIntroDialog" [modal]="true" [style]="{ width: '450px' }" [closable]="true">
            <div class="flex flex-col gap-4">
                <p class="text-lg leading-relaxed">Sản phẩm do <strong class="text-primary">AI Agents của LQT</strong> tạo ra, sản phẩm này chỉ dùng để <strong>demo giao diện chức năng</strong>.</p>
            </div>
            <ng-template #footer>
                <p-button label="Đã hiểu" icon="pi pi-check" (onClick)="displayIntroDialog = false" styleClass="w-full" />
            </ng-template>
        </p-dialog>

        <div class="grid grid-cols-12 gap-6">
            <!-- Cột 1: CV Content -->
            <div class="col-span-12 lg:col-span-4">
                <p-card header="Nội dung CV" styleClass="h-full">
                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Upload CV (PDF)</label>
                            <p-fileUpload mode="basic" accept="application/pdf" [maxFileSize]="5000000" chooseLabel="Chọn file PDF" (onSelect)="onFileSelect($event)" [auto]="true" styleClass="w-full"></p-fileUpload>
                        </div>

                        <p-divider />

                        <div>
                            <label class="block text-sm font-medium mb-2">CV Text</label>
                            <div
                                class="border border-surface-300 dark:border-surface-600 rounded-lg p-4 bg-surface-0 dark:bg-surface-900 overflow-auto"
                                style="max-height: 600px; min-height: 400px;"
                                [innerHTML]="highlightedCvText || 'Chưa có nội dung CV. Vui lòng upload file PDF.'"
                            ></div>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Cột 2: Job Description -->
            <div class="col-span-12 lg:col-span-4">
                <p-card header="Mô tả Công việc (JD)" styleClass="h-full">
                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Tiêu đề công việc</label>
                            <input pInputText [(ngModel)]="jobTitle" placeholder="Ví dụ: Senior Frontend Developer" class="w-full" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-2">Kỹ năng yêu cầu (cách nhau bởi dấu phẩy)</label>
                            <textarea pTextarea [(ngModel)]="requiredSkills" placeholder="Ví dụ: Angular, TypeScript, RxJS, PrimeNG" rows="3" class="w-full"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-2">Mô tả công việc</label>
                            <textarea pTextarea [(ngModel)]="jobDescription" placeholder="Nhập mô tả công việc chi tiết..." rows="10" class="w-full"></textarea>
                        </div>

                        <p-button label="So sánh CV vs JD" icon="pi pi-search" (onClick)="compareCV()" [disabled]="!cvText || !requiredSkills" styleClass="w-full" severity="primary"></p-button>

                        <div *ngIf="matchResult" class="mt-4">
                            <p-divider />
                            <h3 class="text-lg font-semibold mb-3">Kết quả so sánh</h3>

                            <div class="mb-4">
                                <label class="block text-sm font-medium mb-2">Độ phù hợp</label>
                                <p-progressBar
                                    [value]="matchResult.percentage"
                                    [showValue]="true"
                                    [style]="{ height: '30px' }"
                                    [styleClass]="matchResult.percentage >= 70 ? 'bg-green-100' : matchResult.percentage >= 40 ? 'bg-yellow-100' : 'bg-red-100'"
                                ></p-progressBar>
                            </div>

                            <div class="mb-4" *ngIf="matchResult.matchedSkills.length > 0">
                                <label class="block text-sm font-medium mb-2">Kỹ năng phù hợp</label>
                                <div class="flex flex-wrap gap-2">
                                    <p-chip *ngFor="let skill of matchResult.matchedSkills" [label]="skill" styleClass="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" />
                                </div>
                            </div>

                            <div *ngIf="matchResult.missingSkills.length > 0">
                                <label class="block text-sm font-medium mb-2">Kỹ năng còn thiếu</label>
                                <div class="flex flex-wrap gap-2">
                                    <p-chip *ngFor="let skill of matchResult.missingSkills" [label]="skill" styleClass="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                </p-card>
            </div>

            <!-- Cột 3: Candidate Profile -->
            <div class="col-span-12 lg:col-span-4">
                <p-card header="Hồ sơ Ứng viên" styleClass="h-full">
                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Họ và tên</label>
                            <input pInputText [(ngModel)]="candidateName" placeholder="Nhập họ tên" class="w-full" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-2">Email</label>
                            <div class="flex gap-2">
                                <input pInputText [(ngModel)]="candidateEmail" placeholder="Nhập email" class="flex-1" />
                                <p-button icon="pi pi-bolt" (onClick)="autoFillEmail()" [disabled]="!cvText" severity="secondary" [outlined]="true" pTooltip="Tự động điền từ CV" />
                            </div>
                            <small *ngIf="suggestedEmail" class="text-muted-color"> Gợi ý: {{ suggestedEmail }} </small>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-2">Số điện thoại</label>
                            <div class="flex gap-2">
                                <input pInputText [(ngModel)]="candidatePhone" placeholder="Nhập số điện thoại" class="flex-1" />
                                <p-button icon="pi pi-bolt" (onClick)="autoFillPhone()" [disabled]="!cvText" severity="secondary" [outlined]="true" pTooltip="Tự động điền từ CV" />
                            </div>
                            <small *ngIf="suggestedPhone" class="text-muted-color"> Gợi ý: {{ suggestedPhone }} </small>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-2">Kỹ năng</label>
                            <textarea pTextarea [(ngModel)]="candidateSkills" placeholder="Nhập kỹ năng (cách nhau bởi dấu phẩy)" rows="3" class="w-full"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-2">Kinh nghiệm</label>
                            <textarea pTextarea [(ngModel)]="candidateExperience" placeholder="Nhập kinh nghiệm làm việc" rows="5" class="w-full"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium mb-2">Học vấn</label>
                            <textarea pTextarea [(ngModel)]="candidateEducation" placeholder="Nhập trình độ học vấn" rows="3" class="w-full"></textarea>
                        </div>
                    </div>
                </p-card>
            </div>
        </div>
    `,
    styles: [
        `
            ::ng-deep mark {
                background-color: #fef08a;
                color: #854d0e;
                padding: 2px 4px;
                border-radius: 3px;
                font-weight: 500;
            }

            ::ng-deep .dark mark {
                background-color: #713f12;
                color: #fef08a;
            }
        `
    ]
})
export class Recruitment implements OnInit {
    // Ngưỡng phần trăm phù hợp / Match percentage thresholds
    private readonly HIGH_MATCH_THRESHOLD = 70;
    private readonly MEDIUM_MATCH_THRESHOLD = 40;

    // Dialog state
    displayIntroDialog = false;

    // CV Data
    cvText = '';
    highlightedCvText = '';

    // Job Description
    jobTitle = '';
    requiredSkills = '';
    jobDescription = '';

    // Candidate Profile
    candidateName = '';
    candidateEmail = '';
    candidatePhone = '';
    candidateSkills = '';
    candidateExperience = '';
    candidateEducation = '';

    // Suggestions
    suggestedEmail = '';
    suggestedPhone = '';

    // Match Result
    matchResult: MatchResult | null = null;

    constructor(private messageService: MessageService) {}

    ngOnInit(): void {
        // Hiển thị dialog giới thiệu khi component được khởi tạo
        this.displayIntroDialog = true;
    }

    async onFileSelect(event: any): Promise<void> {
        const file = event.files[0];

        if (file && file.type === 'application/pdf') {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

                let fullText = '';

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: any) => item.str).join(' ');

                    fullText += pageText + '\n';
                }

                this.cvText = fullText.trim();
                this.highlightedCvText = this.escapeHtml(this.cvText);

                // Tự động phát hiện email và phone
                this.detectEmailAndPhone();

                // Hiển thị thông báo thành công
                this.messageService.add({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Đã tải và xử lý file PDF thành công'
                });
            } catch (error) {
                console.error('Lỗi khi đọc PDF:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: 'Không thể đọc file PDF. Vui lòng thử lại hoặc sử dụng file PDF khác.'
                });
            }
        }
    }

    /**
     * So sánh CV với Job Description
     * Compare CV with Job Description
     */
    compareCV(): void {
        if (!this.cvText || !this.requiredSkills) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Thiếu thông tin',
                detail: 'Vui lòng upload CV và nhập kỹ năng yêu cầu'
            });

            return;
        }

        try {
            // Sử dụng utility function để so sánh
            this.matchResult = compareCVUtil(this.cvText, this.requiredSkills);

            // Highlight matched skills trong CV
            this.highlightSkills(this.matchResult.matchedSkills);

            // Hiển thị thông báo kết quả
            const severity = this.getSeverityLevel(this.matchResult.percentage);

            this.messageService.add({
                severity: severity,
                summary: 'Kết quả so sánh',
                detail: `Độ phù hợp: ${this.matchResult.percentage}%`
            });
        } catch (error) {
            console.error('Lỗi khi so sánh CV:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể so sánh CV với JD'
            });
        }
    }

    /**
     * Xác định mức độ nghiêm trọng dựa trên phần trăm phù hợp
     * Determine severity level based on match percentage
     */
    private getSeverityLevel(percentage: number): 'success' | 'info' | 'warn' {
        if (percentage >= this.HIGH_MATCH_THRESHOLD) {
            return 'success';
        }

        if (percentage >= this.MEDIUM_MATCH_THRESHOLD) {
            return 'info';
        }

        return 'warn';
    }

    /**
     * Highlight các kỹ năng phù hợp trong CV text
     * Highlight matched skills in CV text
     */
    highlightSkills(skills: string[]): void {
        if (!skills || skills.length === 0) {
            this.highlightedCvText = this.escapeHtml(this.cvText);
            return;
        }

        let highlightedText = this.escapeHtml(this.cvText);

        skills.forEach((skill) => {
            const regex = new RegExp(`(${this.escapeRegex(skill)})`, 'gi');

            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });

        this.highlightedCvText = highlightedText;
    }

    /**
     * Escape HTML để hiển thị an toàn
     * Escape HTML for safe display
     */
    escapeHtml(text: string): string {
        const div = document.createElement('div');

        div.textContent = text;

        return div.innerHTML.replace(/\n/g, '<br>');
    }

    /**
     * Escape regex special characters
     * Escape các ký tự đặc biệt trong regex
     */
    escapeRegex(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Tự động phát hiện email và số điện thoại từ CV text
     * Auto-detect email and phone number from CV text
     */
    detectEmailAndPhone(): void {
        if (!this.cvText || this.cvText.trim().length === 0) {
            return;
        }

        try {
            // Phát hiện EMAIL - sử dụng utility function
            const emailResults = detectEmails(this.cvText);

            if (emailResults && emailResults.length > 0) {
                this.suggestedEmail = emailResults[0].normalized;
            }

            // Phát hiện PHONE - sử dụng utility function
            const phoneResults = detectVietnamesePhones(this.cvText);

            if (phoneResults && phoneResults.length > 0) {
                this.suggestedPhone = phoneResults[0].normalized;
            }
        } catch (error) {
            console.error('Lỗi khi phát hiện email/phone:', error);
        }
    }

    /**
     * Tự động điền email từ gợi ý
     * Auto-fill email from suggestion
     */
    autoFillEmail(): void {
        try {
            if (this.suggestedEmail) {
                this.candidateEmail = this.suggestedEmail;
                this.messageService.add({
                    severity: 'info',
                    summary: 'Đã điền email',
                    detail: `Email: ${this.suggestedEmail}`
                });
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Không tìm thấy email',
                    detail: 'Không tìm thấy email trong CV'
                });
            }
        } catch (error) {
            console.error('Lỗi khi tự động điền email:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tự động điền email'
            });
        }
    }

    /**
     * Tự động điền số điện thoại từ gợi ý
     * Auto-fill phone from suggestion
     */
    autoFillPhone(): void {
        try {
            if (this.suggestedPhone) {
                this.candidatePhone = this.suggestedPhone;
                this.messageService.add({
                    severity: 'info',
                    summary: 'Đã điền số điện thoại',
                    detail: `SĐT: ${this.suggestedPhone}`
                });
            } else {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Không tìm thấy số điện thoại',
                    detail: 'Không tìm thấy số điện thoại trong CV'
                });
            }
        } catch (error) {
            console.error('Lỗi khi tự động điền SĐT:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tự động điền số điện thoại'
            });
        }
    }
}
