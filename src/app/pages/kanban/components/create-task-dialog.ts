import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { KanbanService } from '@/services/kanban.service';
import { Column, CreateTaskInput, Task } from '@/models/kanban.models';

@Component({
    selector: 'app-create-task-dialog',
    imports: [CommonModule, FormsModule, DialogModule, InputTextModule, TextareaModule, ButtonModule, SelectModule, DatePickerModule],
    template: `
        <p-dialog
            [(visible)]="visible"
            (visibleChange)="visibleChange.emit($event)"
            header="Tạo Task Mới"
            [modal]="true"
            [style]="{ width: '600px' }"
            maskStyleClass="backdrop-blur-sm"
            styleClass="!border-0"
        >
            <div class="space-y-4">
                <!-- Task Title -->
                <div>
                    <label for="taskTitle" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Tiêu đề <span class="text-red-500">*</span>
                    </label>
                    <input
                        pInputText
                        id="taskTitle"
                        [(ngModel)]="taskData.title"
                        placeholder="Ví dụ: Thiết kế giao diện trang chủ"
                        class="w-full"
                        [class.ng-invalid]="submitted && !taskData.title"
                    />
                    <small *ngIf="submitted && !taskData.title" class="text-red-500">Tiêu đề là bắt buộc</small>
                </div>

                <!-- Description -->
                <div>
                    <label for="taskDescription" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Mô tả
                    </label>
                    <textarea
                        pTextarea
                        id="taskDescription"
                        [(ngModel)]="taskData.description"
                        placeholder="Mô tả chi tiết về task..."
                        rows="4"
                        class="w-full"
                    ></textarea>
                </div>

                <!-- Column Selection -->
                <div>
                    <label for="taskColumn" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Cột <span class="text-red-500">*</span>
                    </label>
                    <p-select
                        [(ngModel)]="taskData.columnId"
                        [options]="columns"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Chọn cột"
                        class="w-full"
                        [class.ng-invalid]="submitted && !taskData.columnId"
                    />
                    <small *ngIf="submitted && !taskData.columnId" class="text-red-500">Vui lòng chọn cột</small>
                </div>

                <!-- Priority -->
                <div>
                    <label for="taskPriority" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Độ ưu tiên <span class="text-red-500">*</span>
                    </label>
                    <p-select
                        [(ngModel)]="taskData.priority"
                        [options]="priorityOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Chọn độ ưu tiên"
                        class="w-full"
                    />
                </div>

                <!-- Assignee -->
                <div>
                    <label for="taskAssignee" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Người thực hiện
                    </label>
                    <input pInputText id="taskAssignee" [(ngModel)]="taskData.assignee" placeholder="Tên người thực hiện" class="w-full" />
                </div>

                <!-- Due Date -->
                <div>
                    <label for="taskDueDate" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Hạn chót
                    </label>
                    <p-datepicker [(ngModel)]="taskData.dueDate" [showIcon]="true" placeholder="Chọn ngày" dateFormat="dd/mm/yy" class="w-full" />
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2">
                    <p-button label="Hủy" severity="secondary" (onClick)="cancel()" />
                    <p-button label="Tạo Task" (onClick)="createTask()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class CreateTaskDialogComponent {
    @Input() visible = false;
    @Input() columns: Column[] = [];
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() taskCreated = new EventEmitter<Task>();

    taskData: CreateTaskInput = {
        title: '',
        description: '',
        priority: 'medium',
        columnId: '',
        assignee: '',
        dueDate: undefined
    };

    submitted = false;

    priorityOptions = [
        { label: 'Thấp', value: 'low' },
        { label: 'Trung bình', value: 'medium' },
        { label: 'Cao', value: 'high' }
    ];

    constructor(private kanbanService: KanbanService) {}

    createTask(): void {
        this.submitted = true;

        if (!this.taskData.title || !this.taskData.title.trim() || !this.taskData.columnId) {
            return;
        }

        const newTask = this.kanbanService.createTask(this.taskData);
        this.taskCreated.emit(newTask);
        this.resetForm();
    }

    cancel(): void {
        this.visible = false;
        this.visibleChange.emit(false);
        this.resetForm();
    }

    resetForm(): void {
        this.taskData = {
            title: '',
            description: '',
            priority: 'medium',
            columnId: this.columns.length > 0 ? this.columns[0].id : '',
            assignee: '',
            dueDate: undefined
        };
        this.submitted = false;
    }
}
