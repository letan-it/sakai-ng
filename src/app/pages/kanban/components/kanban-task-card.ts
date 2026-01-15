import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Task } from '@/models/kanban.models';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { KanbanService } from '@/services/kanban.service';
import { DialogModule } from 'primeng/dialog';
import { ChipModule } from 'primeng/chip';
import { EditTaskDialogComponent } from './edit-task-dialog';
import { ConfirmDialogComponent } from './confirm-dialog';

@Component({
    selector: 'app-kanban-task-card',
    imports: [CommonModule, CardModule, TagModule, ButtonModule, DialogModule, ChipModule, EditTaskDialogComponent, ConfirmDialogComponent],
    template: `
        <div class="task-card cursor-move rounded-lg bg-white dark:bg-surface-700 p-4 shadow-md hover:shadow-lg transition-shadow mt-4" (click)="viewTaskDetails()">
            <!-- Priority Badge -->
            <div class="mb-2 flex items-center justify-between">
                <p-tag [value]="priorityLabel" [severity]="prioritySeverity" />
                <div class="flex gap-1">
                    <p-button icon="pi pi-pencil" [text]="true" [rounded]="true" severity="secondary" size="small" (onClick)="editTask($event)" />
                    <p-button icon="pi pi-trash" [text]="true" [rounded]="true" severity="danger" size="small" (onClick)="deleteTask($event)" />
                </div>
            </div>

            <!-- Task Title -->
            <h4 class="mb-2 text-base font-semibold text-surface-900 dark:text-surface-0">
                {{ task.title }}
            </h4>

            <!-- Task Description -->
            <div *ngIf="task.description" class="mb-3 text-sm text-surface-600 dark:text-surface-300 line-clamp-2" [innerHTML]="sanitizeHtml(task.description)"></div>
             <p-editor *ngIf="task.description" [(ngModel)]="task.description" [style]="{ height: '320px' }" class="mb-3 text-sm text-surface-600 dark:text-surface-300 line-clamp-2">
                <ng-template #header>
                    
                </ng-template>
            </p-editor>
            <!-- Tags -->
            <div *ngIf="task.tags && task.tags.length > 0" class="mb-2 flex flex-wrap gap-1">
                <p-chip *ngFor="let tag of task.tags" [label]="'#' + tag" styleClass="text-xs" />
            </div>

            <!-- Mentions -->
            <div *ngIf="task.mentions && task.mentions.length > 0" class="mb-2 flex flex-wrap gap-1">
                <p-chip *ngFor="let mention of task.mentions" [label]="'@' + mention" styleClass="text-xs bg-blue-100 dark:bg-blue-900" />
            </div>

            <!-- Task Meta -->
            <div class="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400">
                <div *ngIf="task.assignee" class="flex items-center gap-1">
                    <i class="pi pi-user"></i>
                    <span>{{ task.assignee }}</span>
                </div>
                <div *ngIf="task.dueDate" class="flex items-center gap-1">
                    <i class="pi pi-calendar"></i>
                    <span>{{ task.dueDate | date: 'dd/MM/yyyy' }}</span>
                </div>
            </div>
        </div>

        <!-- Task Details Dialog -->
        <p-dialog [(visible)]="detailsVisible" [header]="task.title" [modal]="true" [style]="{ width: '600px' }" maskStyleClass="backdrop-blur-sm" styleClass="!border-0">
            <div class="space-y-4">
                <!-- Priority -->
                <div>
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Độ ưu tiên</label>
                    <p-tag [value]="priorityLabel" [severity]="prioritySeverity" />
                </div>

                <!-- Description -->
                <div *ngIf="task.description">
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Mô tả</label>
                    <div class="text-surface-600 dark:text-surface-300" [innerHTML]="sanitizeHtml(task.description)"></div>
                </div>

                <!-- Assignee -->
                <div *ngIf="task.assignee">
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Người thực hiện</label>
                    <p class="text-surface-600 dark:text-surface-300">{{ task.assignee }}</p>
                </div>

                <!-- Due Date -->
                <div *ngIf="task.dueDate">
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Hạn chót</label>
                    <p class="text-surface-600 dark:text-surface-300">{{ task.dueDate | date: 'dd/MM/yyyy' }}</p>
                </div>

                <!-- Tags -->
                <div *ngIf="task.tags && task.tags.length > 0">
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Hashtags</label>
                    <div class="flex flex-wrap gap-2">
                        <p-chip *ngFor="let tag of task.tags" [label]="'#' + tag" />
                    </div>
                </div>

                <!-- Mentions -->
                <div *ngIf="task.mentions && task.mentions.length > 0">
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Người theo dõi</label>
                    <div class="flex flex-wrap gap-2">
                        <p-chip *ngFor="let mention of task.mentions" [label]="'@' + mention" styleClass="bg-blue-100 dark:bg-blue-900" />
                    </div>
                </div>

                <!-- Created At -->
                <div>
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Ngày tạo</label>
                    <p class="text-surface-600 dark:text-surface-300">{{ task.createdAt | date: 'dd/MM/yyyy HH:mm' }}</p>
                </div>
            </div>

            <ng-template #footer>
                <div class="flex justify-end gap-2">
                    <p-button label="Chỉnh sửa" severity="secondary" (onClick)="editTaskFromDetails()" />
                    <p-button label="Đóng" severity="secondary" (onClick)="detailsVisible = false" />
                </div>
            </ng-template>
        </p-dialog>

        <!-- Edit Task Dialog -->
        <app-edit-task-dialog [(visible)]="editVisible" [task]="task" (taskUpdated)="onTaskUpdated()" />

        <!-- Delete Confirmation Dialog -->
        <app-confirm-dialog [(visible)]="deleteDialogVisible" header="Xác nhận xóa task" [message]="deleteConfirmMessage" confirmLabel="Xóa" severity="danger" (confirmed)="onDeleteConfirmed()" />
    `,
    styles: [
        `
            .task-card {
                cursor: grab;
            }

            .task-card:active {
                cursor: grabbing;
            }

            .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
        `
    ]
})
export class KanbanTaskCardComponent {
    @Input() task!: Task;

    detailsVisible = false;
    editVisible = false;
    deleteDialogVisible = false;

    constructor(
        private kanbanService: KanbanService,
        private sanitizer: DomSanitizer
    ) {}

    get priorityLabel(): string {
        const labels = {
            low: 'Thấp',
            medium: 'Trung bình',
            high: 'Cao'
        };

        return labels[this.task.priority];
    }

    get prioritySeverity(): 'success' | 'warn' | 'danger' {
        const severities = {
            low: 'success' as const,
            medium: 'warn' as const,
            high: 'danger' as const
        };

        return severities[this.task.priority];
    }

    get deleteConfirmMessage(): string {
        return `Bạn có chắc muốn xóa task "${this.task.title}"?`;
    }

    viewTaskDetails(): void {
        this.detailsVisible = true;
    }

    editTask(event: Event): void {
        event.stopPropagation();
        this.editVisible = true;
    }

    editTaskFromDetails(): void {
        this.detailsVisible = false;
        this.editVisible = true;
    }

    onTaskUpdated(): void {
        this.editVisible = false;
    }

    deleteTask(event: Event): void {
        event.stopPropagation();
        this.deleteDialogVisible = true;
    }

    onDeleteConfirmed(): void {
        this.kanbanService.deleteTask(this.task.id);
        this.deleteDialogVisible = false;
    }

    sanitizeHtml(html: string | undefined): SafeHtml {
        if (!html) {
            return '';
        }

        return this.sanitizer.sanitize(1, html) || '';
    }
}
