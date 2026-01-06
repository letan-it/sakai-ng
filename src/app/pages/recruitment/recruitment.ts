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

// Cấu hình worker cho PDF.js - sử dụng worker local thay vì CDN
const PDF_WORKER_SRC = '/pdf.worker.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;

// Regex patterns cho email và phone
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
// Vietnamese phone pattern: hỗ trợ các đầu số phổ biến của VN
// Ví dụ: 0912345678, +84912345678, 84912345678
const VIETNAMESE_PHONE_PATTERN = /(?:\+84|84|0)(?:3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])\d{7}/g;

interface MatchResult {
    percentage: number;
    matchedSkills: string[];
    missingSkills: string[];
}

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

    compareCV(): void {
        if (!this.cvText || !this.requiredSkills) {
            return;
        }

        const skills = this.requiredSkills
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        const normalizedCV = this.normalizeText(this.cvText);
        const matchedSkills: string[] = [];
        const missingSkills: string[] = [];

        skills.forEach((skill) => {
            const normalizedSkill = this.normalizeText(skill);

            if (normalizedCV.includes(normalizedSkill)) {
                matchedSkills.push(skill);
            } else {
                missingSkills.push(skill);
            }
        });

        const percentage = skills.length > 0 ? Math.round((matchedSkills.length / skills.length) * 100) : 0;

        this.matchResult = {
            percentage,
            matchedSkills,
            missingSkills
        };

        // Highlight matched skills trong CV
        this.highlightSkills(matchedSkills);
    }

    highlightSkills(skills: string[]): void {
        let highlightedText = this.escapeHtml(this.cvText);

        skills.forEach((skill) => {
            const regex = new RegExp(`(${this.escapeRegex(skill)})`, 'gi');

            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });

        this.highlightedCvText = highlightedText;
    }

    normalizeText(text: string): string {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }

    escapeHtml(text: string): string {
        const div = document.createElement('div');

        div.textContent = text;

        return div.innerHTML.replace(/\n/g, '<br>');
    }

    escapeRegex(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    detectEmailAndPhone(): void {
        // Detect email
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emailMatches = this.cvText.match(emailRegex);

        if (emailMatches && emailMatches.length > 0) {
            this.suggestedEmail = emailMatches[0];
        }

        // Detect Vietnamese phone number
        const phoneRegex = /(?:\+84|84|0)(?:3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])\d{7}/g;
        const phoneMatches = this.cvText.match(phoneRegex);

        if (phoneMatches && phoneMatches.length > 0) {
            this.suggestedPhone = phoneMatches[0];
        }
    }

    autoFillEmail(): void {
        if (this.suggestedEmail) {
            this.candidateEmail = this.suggestedEmail;
        }
    }

    autoFillPhone(): void {
        if (this.suggestedPhone) {
            this.candidatePhone = this.suggestedPhone;
        }
    }
}
