import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { createWorker, Worker } from 'tesseract.js';

interface CccdInfo {
    idNumber: string;
    fullName: string;
    issueDate: string;
    issuePlace: string;
    address: string;
}

// Tên cơ quan cấp mặc định khi phát hiện "cục cảnh sát"
const DEFAULT_ISSUE_PLACE = 'CỤC CSQLHC VỀ TTXH';

// Bảng chuyển đổi ký tự tiếng Việt thường sang hoa
const VIETNAMESE_LOWER_TO_UPPER: Record<string, string> = {
    à: 'À', á: 'Á', â: 'Â', ã: 'Ã', ä: 'Ä',
    è: 'È', é: 'É', ê: 'Ê', ë: 'Ë',
    ì: 'Ì', í: 'Í', î: 'Î', ï: 'Ï',
    ò: 'Ò', ó: 'Ó', ô: 'Ô', õ: 'Õ',
    ù: 'Ù', ú: 'Ú', û: 'Û',
    ă: 'Ă', đ: 'Đ', ĩ: 'Ĩ', ũ: 'Ũ',
    ơ: 'Ơ', ư: 'Ư',
    ả: 'Ả', ấ: 'Ấ', ầ: 'Ầ', ẩ: 'Ẩ', ẫ: 'Ẫ', ậ: 'Ậ',
    ắ: 'Ắ', ằ: 'Ằ', ẳ: 'Ẳ', ẵ: 'Ẵ', ặ: 'Ặ',
    ẻ: 'Ẻ', ẽ: 'Ẽ', ế: 'Ế', ề: 'Ề', ể: 'Ể', ễ: 'Ễ', ệ: 'Ệ',
    ỉ: 'Ỉ', ị: 'Ị',
    ỏ: 'Ỏ', ố: 'Ố', ồ: 'Ồ', ổ: 'Ổ', ỗ: 'Ỗ', ộ: 'Ộ',
    ớ: 'Ớ', ờ: 'Ờ', ở: 'Ở', ỡ: 'Ỡ', ợ: 'Ợ',
    ụ: 'Ụ', ủ: 'Ủ', ứ: 'Ứ', ừ: 'Ừ', ử: 'Ử', ữ: 'Ữ', ự: 'Ự',
    ỳ: 'Ỳ', ý: 'Ý', ỷ: 'Ỷ', ỹ: 'Ỹ', ỵ: 'Ỵ'
};

@Component({
    selector: 'app-cccd-scanner',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TextareaModule, FileUploadModule, CardModule, ProgressBarModule, DividerModule, ToastModule, TagModule],
    providers: [MessageService],
    templateUrl: './cccd.html',
    styleUrls: ['./cccd.scss']
})
export class CccdScanner implements OnDestroy {
    // Trạng thái xử lý
    isProcessing = false;
    ocrProgress = 0;
    ocrStatus = '';

    // Ảnh preview
    previewUrl: string | null = null;

    // Thông tin CCCD sau khi trích xuất
    cccdInfo: CccdInfo = {
        idNumber: '',
        fullName: '',
        issueDate: '',
        issuePlace: '',
        address: ''
    };

    // Raw OCR text để debug
    rawText = '';

    private worker: Worker | null = null;

    constructor(private messageService: MessageService) {}

    ngOnDestroy(): void {
        if (this.worker) {
            this.worker.terminate();
        }
    }

    /**
     * Xử lý khi người dùng chọn file ảnh
     */
    async onFileSelect(event: any): Promise<void> {
        const file: File = event.files[0];

        if (!file) {
            return;
        }

        // Tạo preview URL
        const reader = new FileReader();

        reader.onload = (e) => {
            this.previewUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);

        // Bắt đầu OCR
        await this.runOcr(file);
    }

    /**
     * Chạy OCR trên ảnh CCCD
     */
    private async runOcr(imageFile: File): Promise<void> {
        this.isProcessing = true;
        this.ocrProgress = 0;
        this.ocrStatus = 'Đang khởi tạo OCR engine...';
        this.resetCccdInfo();

        try {
            // Terminate worker cũ nếu có
            if (this.worker) {
                await this.worker.terminate();
                this.worker = null;
            }

            // Tạo worker mới với tiếng Việt
            this.worker = await createWorker('vie', 1, {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        this.ocrProgress = Math.round(m.progress * 100);
                        this.ocrStatus = `Đang nhận dạng văn bản... ${this.ocrProgress}%`;
                    } else if (m.status === 'loading language traineddata') {
                        this.ocrStatus = 'Đang tải ngôn ngữ tiếng Việt...';
                    } else if (m.status === 'initializing api') {
                        this.ocrStatus = 'Đang khởi tạo API...';
                    }
                    console.log('[OCR Progress]', m);
                }
            });

            this.ocrStatus = 'Đang nhận dạng văn bản CCCD...';

            const result = await this.worker.recognize(imageFile);
            this.rawText = result.data.text;

            console.log('[OCR Raw Text]:', this.rawText);

            // Trích xuất thông tin từ văn bản OCR
            this.cccdInfo = this.extractCccdInfo(this.rawText);

            this.ocrProgress = 100;
            this.ocrStatus = 'Hoàn tất!';

            this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã nhận dạng xong! Vui lòng kiểm tra và chỉnh sửa nếu cần.'
            });
        } catch (error) {
            console.error('[OCR Error]:', error);
            this.ocrStatus = 'Có lỗi xảy ra';
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi OCR',
                detail: 'Không thể nhận dạng ảnh. Vui lòng thử lại với ảnh rõ hơn.'
            });
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Trích xuất thông tin CCCD từ văn bản OCR
     */
    private extractCccdInfo(text: string): CccdInfo {
        // Chuẩn hóa văn bản: loại bỏ ký tự thừa, về chữ thường
        const normalized = text
            .toLowerCase()
            .replace(/\r\n/g, '\n')
            .replace(/[ \t]+/g, ' ')
            .trim();

        console.log('[OCR Normalized]:', normalized);

        return {
            idNumber: this.extractIdNumber(normalized),
            fullName: this.extractFullName(normalized),
            issueDate: this.extractIssueDate(normalized),
            issuePlace: this.extractIssuePlace(normalized),
            address: this.extractAddress(normalized)
        };
    }

    /**
     * Trích xuất số CCCD (12 chữ số liên tiếp)
     */
    private extractIdNumber(text: string): string {
        const match = text.match(/\b(\d{12})\b/);

        return match ? match[1] : '';
    }

    /**
     * Trích xuất họ và tên
     */
    private extractFullName(text: string): string {
        const patterns = [
            /họ\s+và\s+tên[:\s]*([^\n]+)/i,
            /họ\s+tên[:\s]*([^\n]+)/i,
            /full\s+name[:\s]*([^\n]+)/i
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);

            if (match) {
                return this.toUpperCaseVietnamese(match[1].trim());
            }
        }

        return '';
    }

    /**
     * Trích xuất ngày cấp (định dạng dd/mm/yyyy).
     * Lưu ý: độ chính xác phụ thuộc vào chất lượng ảnh và bố cục CCCD.
     * Người dùng cần kiểm tra lại kết quả.
     */
    private extractIssueDate(text: string): string {
        // Tìm gần từ khóa "ngày cấp" hoặc "date of issue"
        const contextMatch = text.match(/ng[àa]y\s+c[aấ]p[:\s]*(\d{2}[\/\-.]\d{2}[\/\-.]\d{4})/i);

        if (contextMatch) {
            return contextMatch[1].replace(/[-.]/g, '/');
        }

        // Fallback: tìm ngày cuối cùng (thường là ngày cấp trên CCCD)
        const dates = text.match(/\d{2}[\/\-.]\d{2}[\/\-.]\d{4}/g);

        if (dates && dates.length > 0) {
            return dates[dates.length - 1].replace(/[-.]/g, '/');
        }

        return '';
    }

    /**
     * Trích xuất nơi cấp
     */
    private extractIssuePlace(text: string): string {
        if (/c[uụ]c\s+c[aả]nh\s+s[aá]t/i.test(text)) {
            return DEFAULT_ISSUE_PLACE;
        }

        const patterns = [/n[oơ]i\s+c[aấ]p[:\s]*([^\n]+)/i, /issued\s+by[:\s]*([^\n]+)/i];

        for (const pattern of patterns) {
            const match = text.match(pattern);

            if (match) {
                return this.toUpperCaseVietnamese(match[1].trim());
            }
        }

        return '';
    }

    /**
     * Trích xuất địa chỉ thường trú
     */
    private extractAddress(text: string): string {
        const patterns = [
            /th[uưừ][oờ]ng\s+tr[uú][:\s]*(.*?)(?=ng[àa]y|n[oơ]i\s+c[aấ]p|$)/is,
            /n[oơ]i\s+[oở]\s+hi[eệ]n\s+t[aạ]i[:\s]*(.*?)(?=ng[àa]y|$)/is,
            /address[:\s]*(.*?)(?=\n|$)/i
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);

            if (match && match[1].trim()) {
                return this.toUpperCaseVietnamese(match[1].replace(/\n/g, ' ').trim());
            }
        }

        return '';
    }

    /**
     * Chuyển đổi chuỗi thành chữ hoa (hỗ trợ tiếng Việt)
     */
    private toUpperCaseVietnamese(text: string): string {
        return text.replace(/[àáâãäèéêëìíîïòóôõùúûăđĩũơưảấầẩẫậắằẳẵặẻẽếềểễệỉịỏốồổỗộớờởỡợụủứừửữựỳýỷỹỵ]/g, (c) => VIETNAMESE_LOWER_TO_UPPER[c] || c).toUpperCase();
    }

    /**
     * Reset form thông tin CCCD
     */
    resetCccdInfo(): void {
        this.cccdInfo = {
            idNumber: '',
            fullName: '',
            issueDate: '',
            issuePlace: '',
            address: ''
        };
        this.rawText = '';
    }

    /**
     * Xóa ảnh và reset form
     */
    clearAll(): void {
        this.previewUrl = null;
        this.resetCccdInfo();
        this.ocrProgress = 0;
        this.ocrStatus = '';
    }

    /**
     * Kiểm tra xem có thông tin nào được trích xuất không
     */
    get hasExtractedInfo(): boolean {
        return !!(this.cccdInfo.idNumber || this.cccdInfo.fullName || this.cccdInfo.issueDate || this.cccdInfo.address);
    }
}
