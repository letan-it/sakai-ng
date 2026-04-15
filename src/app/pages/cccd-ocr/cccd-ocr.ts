import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { createWorker, Worker } from 'tesseract.js';

interface CccdOcrInfo {
    idNumber: string;
    fullName: string;
    dob: string;
    gender: 'NAM' | 'NU' | '';
    address: string;
}

@Component({
    selector: 'app-cccd-ocr-demo',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        ButtonModule,
        FileUploadModule,
        ProgressBarModule,
        InputTextModule,
        TextareaModule,
        TagModule,
        DividerModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './cccd-ocr.html',
    styleUrl: './cccd-ocr.scss'
})
export class CccdOcrDemo implements OnDestroy {
    previewUrl: string | null = null;
    isProcessing = false;
    ocrStatus = '';
    ocrProgress = 0;
    rawText = '';
    showRawText = false;

    cccdInfo: CccdOcrInfo = {
        idNumber: '',
        fullName: '',
        dob: '',
        gender: '',
        address: ''
    };

    private worker: Worker | null = null;

    get hasExtractedInfo(): boolean {
        return !!(
            this.cccdInfo.idNumber ||
            this.cccdInfo.fullName ||
            this.cccdInfo.dob ||
            this.cccdInfo.gender ||
            this.cccdInfo.address
        );
    }

    onFileSelect(event: { files: File[] }): void {
        const file = event.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            this.previewUrl = e.target?.result as string;
            this.runOcr(file);
        };
        reader.readAsDataURL(file);
    }

    private async runOcr(file: File): Promise<void> {
        this.isProcessing = true;
        this.ocrProgress = 0;
        this.ocrStatus = 'Đang khởi tạo OCR engine...';
        this.rawText = '';
        this.showRawText = false;
        this.resetCccdInfo();

        try {
            this.worker = await createWorker('vie', 1, {
                logger: (m: { status: string; progress: number }) => {
                    if (m.status === 'loading tesseract core') {
                        this.ocrStatus = 'Đang tải Tesseract core...';
                        this.ocrProgress = Math.round(m.progress * 20);
                    } else if (m.status === 'initializing tesseract') {
                        this.ocrStatus = 'Đang khởi tạo Tesseract...';
                        this.ocrProgress = 20 + Math.round(m.progress * 20);
                    } else if (m.status === 'loading language traineddata') {
                        this.ocrStatus = 'Đang tải dữ liệu ngôn ngữ Việt...';
                        this.ocrProgress = 40 + Math.round(m.progress * 20);
                    } else if (m.status === 'initializing api') {
                        this.ocrStatus = 'Đang khởi tạo API...';
                        this.ocrProgress = 60 + Math.round(m.progress * 10);
                    } else if (m.status === 'recognizing text') {
                        this.ocrStatus = 'Đang nhận dạng văn bản...';
                        this.ocrProgress = 70 + Math.round(m.progress * 30);
                    }
                }
            });

            const result = await this.worker.recognize(file);

            this.rawText = result.data.text;
            this.ocrProgress = 100;
            this.ocrStatus = 'Hoàn tất!';

            const extracted = this.extractCccdInfo(this.rawText);

            this.cccdInfo = extracted;
        } catch (err) {
            this.ocrStatus = 'Lỗi OCR';
            console.error('OCR error:', err);
        } finally {
            this.isProcessing = false;
            if (this.worker) {
                await this.worker.terminate();
                this.worker = null;
            }
        }
    }

    clearAll(): void {
        this.previewUrl = null;
        this.rawText = '';
        this.showRawText = false;
        this.ocrProgress = 0;
        this.ocrStatus = '';
        this.resetCccdInfo();
    }

    private resetCccdInfo(): void {
        this.cccdInfo = {
            idNumber: '',
            fullName: '',
            dob: '',
            gender: '',
            address: ''
        };
    }

    private extractCccdInfo(text: string): CccdOcrInfo {
        const normalized = this.normalizeText(text);

        return {
            idNumber: this.extractIdNumber(normalized),
            fullName: this.extractFullName(normalized),
            dob: this.extractDob(normalized),
            gender: this.extractGender(normalized),
            address: this.extractAddress(normalized)
        };
    }

    /**
     * Chuẩn hoá văn bản OCR: loại bỏ ký tự thừa, chuẩn hoá khoảng trắng
     */
    private normalizeText(text: string): string {
        return text
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/[ \t]+/g, ' ')
            .trim();
    }

    /**
     * Trích xuất số CCCD (12 chữ số liên tiếp hoặc có khoảng trắng/xuống dòng).
     * Sử dụng word boundary `\b` để tránh match một phần trong dãy số dài hơn.
     */
    private extractIdNumber(text: string): string {
        // khớp 12 chữ số liên tiếp, đảm bảo không phải phần của dãy dài hơn
        const direct = text.match(/(?<!\d)(\d{12})(?!\d)/);

        if (direct) {
            return direct[1];
        }

        // khớp 12 chữ số có thể bị ngắt bởi khoảng trắng/xuống dòng
        // Regex đảm bảo chính xác 12 chữ số (không nhiều hơn)
        const spaced = text.match(/(?<!\d)(?:\d[\s\n]*?){12}(?!\d)/);

        if (spaced) {
            const digits = spaced[0].replace(/\s/g, '');

            if (digits.length === 12) {
                return digits;
            }
        }

        return '';
    }

    /**
     * Trích xuất họ tên: ưu tiên dòng sau nhãn "Họ và tên" / "HO VA TEN"
     */
    private extractFullName(text: string): string {
        const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

        // tìm nhãn "họ và tên" / "ho va ten" (không phân biệt hoa thường, có dấu hoặc không)
        const labelPattern = /h[oọ]\s+v[aà]\s+t[eê]n/i;

        for (let i = 0; i < lines.length - 1; i++) {
            if (labelPattern.test(lines[i])) {
                const candidate = lines[i + 1];

                // dòng tiếp theo phải chủ yếu là chữ cái (tên người)
                if (candidate && /^[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂẮẶẤẨẪẬẺẼẸ ]{3,}/i.test(candidate)) {
                    return candidate.trim();
                }
            }
        }

        // fallback: tìm dòng toàn chữ in hoa có vẻ là tên (3-5 từ)
        for (const line of lines) {
            const words = line.trim().split(/\s+/);

            if (
                words.length >= 2 &&
                words.length <= 6 &&
                /^[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂẮẶẤẨẪẬẺẼẸ]+$/i.test(words.join('')) &&
                !/\d/.test(line)
            ) {
                return line.trim();
            }
        }

        return '';
    }

    /**
     * Trích xuất ngày sinh (dd/mm/yyyy).
     * Ưu tiên ngữ cảnh: "ngày sinh", "sinh ngày", "date of birth"
     * Fallback: lấy ngày đầu tiên trong văn bản.
     * Lưu ý: pattern chỉ là heuristic (dd: 01-39, mm: 01-19) để phù hợp
     * với nhiễu OCR; cần validation bổ sung nếu dùng thực tế.
     */
    private extractDob(text: string): string {
        const datePattern = '[0-3]\\d[/\\-\\.][01]\\d[/\\-\\.](?:19|20)\\d{2}';

        const contextPatterns = [
            new RegExp(`(?:ng[aà]y\\s*sinh|sinh\\s*ng[aà]y)[:\\s]*?(${datePattern})`, 'i'),
            new RegExp(`(?:date\\s+of\\s+birth)[:\\s]*?(${datePattern})`, 'i')
        ];

        for (const p of contextPatterns) {
            const m = text.match(p);

            if (m) {
                return m[1].replace(/[-\.]/g, '/');
            }
        }

        // fallback: lấy ngày đầu tiên
        const all = text.match(new RegExp(datePattern, 'g'));

        if (all && all.length > 0) {
            return all[0].replace(/[-\.]/g, '/');
        }

        return '';
    }

    /**
     * Trích xuất giới tính: chuẩn hoá thành 'NAM' hoặc 'NU'.
     * Dùng Unicode normalize để xử lý các biến thể dấu của ký tự tiếng Việt.
     */
    private extractGender(text: string): 'NAM' | 'NU' | '' {
        const m = text.match(/\b(nam|n[ữu])\b/i);

        if (!m) {
            return '';
        }

        // chuẩn hoá: bỏ dấu, chuyển thường để so sánh
        const normalized = m[1]
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        return normalized === 'nam' ? 'NAM' : 'NU';
    }

    /**
     * Trích xuất địa chỉ thường trú:
     * Ưu tiên sau nhãn "Nơi thường trú" / "NOI THUONG TRU"
     * Thu thập nhiều dòng cho đến khi gặp từ khoá dừng
     */
    private extractAddress(text: string): string {
        const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

        // nhãn địa chỉ
        const labelPattern = /n[oơ]i?\s+th[uư][oờ]ng\s+tr[uú]|place\s+of\s+residence/i;

        // từ khoá dừng (trường thông tin khác trên CCCD)
        const stopPattern = /ng[aà]y\s*,?\s*th[aá]ng\s*,?\s*n[aă]m|ng[aà]y\s+c[aấ]p|c[oơ]\s+quan\s+c[aấ]p|date\s+of\s+expiry|expiry|gi[aá]\s+tr[iị]|valid/i;

        let collecting = false;
        const parts: string[] = [];

        for (const line of lines) {
            if (!collecting) {
                if (labelPattern.test(line)) {
                    // kiểm tra xem nhãn và giá trị nằm trên cùng dòng không
                    const afterLabel = line.replace(labelPattern, '').replace(/^[\s:]+/, '').trim();

                    if (afterLabel.length > 3) {
                        parts.push(afterLabel);
                    }
                    collecting = true;
                }
            } else {
                if (stopPattern.test(line) || parts.length >= 4) {
                    break;
                }
                if (line.length > 3) {
                    parts.push(line);
                }
            }
        }

        return parts.join(', ').trim();
    }

    async ngOnDestroy(): Promise<void> {
        if (this.worker) {
            await this.worker.terminate();
        }
    }
}
