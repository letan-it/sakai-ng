import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-confirm-dialog',
    imports: [CommonModule, DialogModule, ButtonModule],
    template: `
        <p-dialog [(visible)]="visible" (visibleChange)="visibleChange.emit($event)" [header]="header" [modal]="true" [appendTo]="'body'" [blockScroll]="true" [style]="{ width: '450px' }" maskStyleClass="backdrop-blur-sm" styleClass="!border-0">
            <div class="space-y-4">
                <p class="text-surface-700 dark:text-surface-300">{{ message }}</p>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2">
                    <p-button label="Hủy" severity="secondary" (onClick)="onCancel()" />
                    <p-button [label]="confirmLabel" [severity]="severity" (onClick)="onConfirm()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class ConfirmDialogComponent {
    @Input() visible = false;
    @Input() header = 'Xác nhận';
    @Input() message = 'Bạn có chắc chắn?';
    @Input() confirmLabel = 'Xác nhận';
    @Input() severity: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'secondary' | 'contrast' = 'danger';
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    onConfirm(): void {
        this.confirmed.emit();
        this.visible = false;
        this.visibleChange.emit(false);
    }

    onCancel(): void {
        this.cancelled.emit();
        this.visible = false;
        this.visibleChange.emit(false);
    }
}
