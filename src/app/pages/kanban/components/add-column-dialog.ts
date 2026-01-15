import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-add-column-dialog',
    imports: [CommonModule, FormsModule, DialogModule, InputTextModule, ButtonModule],
    template: `
        <p-dialog [(visible)]="visible" (visibleChange)="visibleChange.emit($event)" header="Thêm Cột Mới" [modal]="true" [style]="{ width: '450px' }" maskStyleClass="backdrop-blur-sm" styleClass="!border-0">
            <div class="space-y-4">
                <div>
                    <label for="columnName" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200"> Tên cột <span class="text-red-500">*</span> </label>
                    <input pInputText id="columnName" [(ngModel)]="columnName" placeholder="Ví dụ: In Progress" class="w-full" [class.ng-invalid]="submitted && !columnName" (keyup.enter)="confirm()" />
                    <small *ngIf="submitted && !columnName" class="text-red-500">Tên cột là bắt buộc</small>
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2">
                    <p-button label="Hủy" severity="secondary" (onClick)="cancel()" />
                    <p-button label="Thêm" (onClick)="confirm()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class AddColumnDialogComponent {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() columnAdded = new EventEmitter<string>();

    columnName = '';
    submitted = false;

    confirm(): void {
        this.submitted = true;

        if (!this.columnName || !this.columnName.trim()) {
            return;
        }

        this.columnAdded.emit(this.columnName.trim());
        this.reset();
    }

    cancel(): void {
        this.reset();
    }

    reset(): void {
        this.columnName = '';
        this.submitted = false;
        this.visible = false;
        this.visibleChange.emit(false);
    }
}
