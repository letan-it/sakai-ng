import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { KanbanService } from '@/services/kanban.service';
import { Board, CreateBoardInput } from '@/models/kanban.models';

@Component({
    selector: 'app-create-board-dialog',
    imports: [CommonModule, FormsModule, DialogModule, InputTextModule, TextareaModule, ButtonModule],
    template: `
        <p-dialog
            [(visible)]="visible"
            (visibleChange)="visibleChange.emit($event)"
            header="Tạo Board Mới"
            [modal]="true"
            [style]="{ width: '500px' }"
            maskStyleClass="backdrop-blur-sm"
            styleClass="!border-0"
        >
            <div class="space-y-4">
                <!-- Board Name -->
                <div>
                    <label for="boardName" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Tên Board <span class="text-red-500">*</span>
                    </label>
                    <input
                        pInputText
                        id="boardName"
                        [(ngModel)]="boardData.name"
                        placeholder="Ví dụ: Dự án Website Mới"
                        class="w-full"
                        [class.ng-invalid]="submitted && !boardData.name"
                    />
                    <small *ngIf="submitted && !boardData.name" class="text-red-500">Tên board là bắt buộc</small>
                </div>

                <!-- Description -->
                <div>
                    <label for="boardDescription" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Mô tả
                    </label>
                    <textarea
                        pTextarea
                        id="boardDescription"
                        [(ngModel)]="boardData.description"
                        placeholder="Mô tả về board này..."
                        rows="3"
                        class="w-full"
                    ></textarea>
                </div>

                <!-- Color Picker -->
                <div>
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Màu sắc</label>
                    <div class="flex gap-3">
                        <div
                            *ngFor="let color of availableColors"
                            class="h-10 w-10 cursor-pointer rounded-full border-2 transition-all hover:scale-110"
                            [style.background-color]="color"
                            [class.border-surface-900]="boardData.color === color"
                            [class.dark:border-surface-0]="boardData.color === color"
                            [class.border-surface-300]="boardData.color !== color"
                            (click)="selectColor(color)"
                        ></div>
                    </div>
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2">
                    <p-button label="Hủy" severity="secondary" (onClick)="cancel()" />
                    <p-button label="Tạo Board" (onClick)="createBoard()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class CreateBoardDialogComponent {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() boardCreated = new EventEmitter<Board>();

    boardData: CreateBoardInput = {
        name: '',
        description: '',
        color: '#635FC7'
    };

    submitted = false;

    availableColors = ['#635FC7', '#49C4E5', '#67E2AE', '#8471F2', '#FF6B9D', '#FFA500', '#FF4757', '#5F27CD'];

    constructor(private kanbanService: KanbanService) {}

    selectColor(color: string): void {
        this.boardData.color = color;
    }

    createBoard(): void {
        this.submitted = true;

        if (!this.boardData.name || !this.boardData.name.trim()) {
            return;
        }

        const newBoard = this.kanbanService.createBoard(this.boardData);
        this.boardCreated.emit(newBoard);
        this.resetForm();
    }

    cancel(): void {
        this.visible = false;
        this.visibleChange.emit(false);
        this.resetForm();
    }

    resetForm(): void {
        this.boardData = {
            name: '',
            description: '',
            color: '#635FC7'
        };
        this.submitted = false;
    }
}
