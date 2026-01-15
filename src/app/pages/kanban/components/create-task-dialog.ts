import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { KanbanService } from '@/services/kanban.service';
import { Column, CreateTaskInput, Task } from '@/models/kanban.models';

@Component({
    selector: 'app-create-task-dialog',
    imports: [CommonModule, FormsModule, DialogModule, InputTextModule, EditorModule, ButtonModule, SelectModule, DatePickerModule],
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
                    <p-editor [(ngModel)]="taskData.description" [style]="{ height: '200px' }" placeholder="Mô tả chi tiết về task...">
                        <ng-template #header>
                            <span class="ql-formats">
                                <select class="ql-size">
                                    <option value="small">Nhỏ</option>
                                    <option selected>Bình thường</option>
                                    <option value="large">Lớn</option>
                                    <option value="huge">Rất lớn</option>
                                </select>
                                <select class="ql-font">
                                    <option selected>Sans Serif</option>
                                    <option value="serif">Serif</option>
                                    <option value="monospace">Monospace</option>
                                </select>
                            </span>
                            <span class="ql-formats">
                                <button class="ql-bold" aria-label="Bold"></button>
                                <button class="ql-italic" aria-label="Italic"></button>
                                <button class="ql-underline" aria-label="Underline"></button>
                            </span>
                            <span class="ql-formats">
                                <select class="ql-color"></select>
                                <select class="ql-background"></select>
                            </span>
                            <span class="ql-formats">
                                <button class="ql-list" value="ordered" aria-label="Ordered List"></button>
                                <button class="ql-list" value="bullet" aria-label="Bullet List"></button>
                            </span>
                        </ng-template>
                    </p-editor>
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

                <!-- Tags -->
                <div>
                    <label for="taskTags" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Hashtags
                    </label>
                    <input
                        pInputText
                        id="taskTags"
                        [(ngModel)]="tagsInput"
                        placeholder="Nhập tags (phân cách bằng dấu phẩy, ví dụ: #urgent, #backend, #api)"
                        class="w-full"
                    />
                    <small class="text-surface-500">Phân cách bằng dấu phẩy. Ký tự # sẽ được tự động thêm nếu bạn chưa nhập.</small>
                </div>

                <!-- Mentions -->
                <div>
                    <label for="taskMentions" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Tag người theo dõi
                    </label>
                    <input
                        pInputText
                        id="taskMentions"
                        [(ngModel)]="mentionsInput"
                        placeholder="Tag người theo dõi (phân cách bằng dấu phẩy, ví dụ: @user1, @user2)"
                        class="w-full"
                    />
                    <small class="text-surface-500">Phân cách bằng dấu phẩy. Ký tự @ sẽ được tự động thêm nếu bạn chưa nhập.</small>
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
        dueDate: undefined,
        tags: [],
        mentions: []
    };

    tagsInput = '';
    mentionsInput = '';
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

        // Parse tags and mentions
        this.taskData.tags = this.parseInputToArray(this.tagsInput, '#');
        this.taskData.mentions = this.parseInputToArray(this.mentionsInput, '@');

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
            dueDate: undefined,
            tags: [],
            mentions: []
        };
        this.tagsInput = '';
        this.mentionsInput = '';
        this.submitted = false;
    }

    private parseInputToArray(input: string, prefix: string): string[] {
        if (!input || !input.trim()) {
            return [];
        }

        return input
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
            .map((item) => {
                // Remove existing prefix if any
                if (item.startsWith(prefix)) {
                    return item.substring(1);
                }

                return item;
            });
    }
}
