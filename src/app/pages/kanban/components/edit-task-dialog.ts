import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { KanbanService } from '@/services/kanban.service';
import { Task } from '@/models/kanban.models';

@Component({
    selector: 'app-edit-task-dialog',
    imports: [CommonModule, FormsModule, DialogModule, InputTextModule, TextareaModule, ButtonModule, SelectModule, DatePickerModule],
    template: `
        <p-dialog
            [(visible)]="visible"
            (visibleChange)="visibleChange.emit($event)"
            header="Chỉnh sửa Task"
            [modal]="true"
            [style]="{ width: '600px' }"
            maskStyleClass="backdrop-blur-sm"
            styleClass="!border-0"
        >
            <div class="space-y-4">
                <!-- Task Title -->
                <div>
                    <label for="editTaskTitle" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Tiêu đề <span class="text-red-500">*</span>
                    </label>
                    <input
                        pInputText
                        id="editTaskTitle"
                        [(ngModel)]="editedTask.title"
                        placeholder="Ví dụ: Thiết kế giao diện trang chủ"
                        class="w-full"
                        [class.ng-invalid]="submitted && !editedTask.title"
                    />
                    <small *ngIf="submitted && !editedTask.title" class="text-red-500">Tiêu đề là bắt buộc</small>
                </div>

                <!-- Description -->
                <div>
                    <label for="editTaskDescription" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Mô tả
                    </label>
                    <textarea
                        pTextarea
                        id="editTaskDescription"
                        [(ngModel)]="editedTask.description"
                        placeholder="Mô tả chi tiết về task..."
                        rows="4"
                        class="w-full"
                    ></textarea>
                </div>

                <!-- Priority -->
                <div>
                    <label for="editTaskPriority" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Độ ưu tiên <span class="text-red-500">*</span>
                    </label>
                    <p-select
                        [(ngModel)]="editedTask.priority"
                        [options]="priorityOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Chọn độ ưu tiên"
                        class="w-full"
                    />
                </div>

                <!-- Assignee -->
                <div>
                    <label for="editTaskAssignee" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Người thực hiện
                    </label>
                    <input pInputText id="editTaskAssignee" [(ngModel)]="editedTask.assignee" placeholder="Tên người thực hiện" class="w-full" />
                </div>

                <!-- Due Date -->
                <div>
                    <label for="editTaskDueDate" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Hạn chót
                    </label>
                    <p-datepicker [(ngModel)]="editedTask.dueDate" [showIcon]="true" placeholder="Chọn ngày" dateFormat="dd/mm/yy" class="w-full" />
                </div>

                <!-- Tags -->
                <div>
                    <label for="editTaskTags" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Hashtags
                    </label>
                    <input
                        pInputText
                        id="editTaskTags"
                        [(ngModel)]="tagsInput"
                        placeholder="Nhập tags (phân cách bằng dấu phẩy, ví dụ: #urgent, #backend, #api)"
                        class="w-full"
                    />
                    <small class="text-surface-500">Phân cách bằng dấu phẩy. Ký tự # sẽ được tự động thêm nếu bạn chưa nhập.</small>
                </div>

                <!-- Mentions -->
                <div>
                    <label for="editTaskMentions" class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">
                        Tag người theo dõi
                    </label>
                    <input
                        pInputText
                        id="editTaskMentions"
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
                    <p-button label="Cập nhật" (onClick)="updateTask()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class EditTaskDialogComponent implements OnChanges {
    @Input() visible = false;
    @Input() task: Task | null = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() taskUpdated = new EventEmitter<void>();

    editedTask: Partial<Task> = {};
    tagsInput = '';
    mentionsInput = '';
    submitted = false;

    priorityOptions = [
        { label: 'Thấp', value: 'low' },
        { label: 'Trung bình', value: 'medium' },
        { label: 'Cao', value: 'high' }
    ];

    constructor(private kanbanService: KanbanService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['task'] && this.task) {
            this.editedTask = {
                title: this.task.title,
                description: this.task.description,
                priority: this.task.priority,
                assignee: this.task.assignee,
                dueDate: this.task.dueDate
            };
            this.tagsInput = this.task.tags?.join(', ') || '';
            this.mentionsInput = this.task.mentions?.join(', ') || '';
        }
    }

    updateTask(): void {
        this.submitted = true;

        if (!this.editedTask.title || !this.editedTask.title.trim()) {
            return;
        }

        if (!this.task) {
            return;
        }

        // Parse tags and mentions
        const tags = this.parseInputToArray(this.tagsInput, '#');
        const mentions = this.parseInputToArray(this.mentionsInput, '@');

        this.kanbanService.updateTask(this.task.id, {
            ...this.editedTask,
            tags,
            mentions
        });

        this.taskUpdated.emit();
        this.close();
    }

    cancel(): void {
        this.close();
    }

    close(): void {
        this.visible = false;
        this.visibleChange.emit(false);
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
