import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-rename-column-dialog',
    imports: [CommonModule, FormsModule, DialogModule, InputTextModule, ButtonModule],
    template: `
        <p-dialog [(visible)]="visible" (visibleChange)="visibleChange.emit($event)" header="Đổi Tên Cột" [modal]="true" [style]="{ width: '450px' }" maskStyleClass="backdrop-blur-sm" styleClass="!border-0">
            <div class="space-y-4">
                <div>
                    <label for="newColumnName" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200"> Tên cột mới <span class="text-red-500">*</span> </label>
                    <input pInputText id="newColumnName" [(ngModel)]="newName" placeholder="Nhập tên mới" class="w-full" [class.ng-invalid]="submitted && !newName" (keyup.enter)="confirm()" />
                    <small *ngIf="submitted && !newName" class="text-red-500">Tên cột là bắt buộc</small>
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2">
                    <p-button label="Hủy" severity="secondary" (onClick)="cancel()" />
                    <p-button label="Đổi tên" (onClick)="confirm()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class RenameColumnDialogComponent implements OnChanges {
    @Input() visible = false;
    @Input() currentName = '';
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() columnRenamed = new EventEmitter<string>();

    newName = '';
    submitted = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['currentName'] && this.currentName) {
            this.newName = this.currentName;
        }
    }

    confirm(): void {
        this.submitted = true;

        if (!this.newName || !this.newName.trim()) {
            return;
        }

        this.columnRenamed.emit(this.newName.trim());
        this.reset();
    }

    cancel(): void {
        this.reset();
    }

    reset(): void {
        this.newName = '';
        this.submitted = false;
        this.visible = false;
        this.visibleChange.emit(false);
    }
}
