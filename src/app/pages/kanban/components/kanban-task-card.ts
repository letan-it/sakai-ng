import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '@/models/kanban.models';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { KanbanService } from '@/services/kanban.service';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-kanban-task-card',
    imports: [CommonModule, CardModule, TagModule, ButtonModule, DialogModule],
    template: `
        <div
            class="task-card cursor-move rounded-lg bg-white dark:bg-surface-700 p-4 shadow-md hover:shadow-lg transition-shadow"
            (click)="viewTaskDetails()"
        >
            <!-- Priority Badge -->
            <div class="mb-2 flex items-center justify-between">
                <p-tag [value]="priorityLabel" [severity]="prioritySeverity" />
                <p-button
                    icon="pi pi-trash"
                    [text]="true"
                    [rounded]="true"
                    severity="danger"
                    size="small"
                    (onClick)="deleteTask($event)"
                />
            </div>

            <!-- Task Title -->
            <h4 class="mb-2 text-base font-semibold text-surface-900 dark:text-surface-0">
                {{ task.title }}
            </h4>

            <!-- Task Description -->
            <p *ngIf="task.description" class="mb-3 text-sm text-surface-600 dark:text-surface-300 line-clamp-2">
                {{ task.description }}
            </p>

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
        <p-dialog
            [(visible)]="detailsVisible"
            [header]="task.title"
            [modal]="true"
            [style]="{ width: '600px' }"
            maskStyleClass="backdrop-blur-sm"
            styleClass="!border-0"
        >
            <div class="space-y-4">
                <!-- Priority -->
                <div>
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Độ ưu tiên</label>
                    <p-tag [value]="priorityLabel" [severity]="prioritySeverity" />
                </div>

                <!-- Description -->
                <div *ngIf="task.description">
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Mô tả</label>
                    <p class="text-surface-600 dark:text-surface-300">{{ task.description }}</p>
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

                <!-- Created At -->
                <div>
                    <label class="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-200">Ngày tạo</label>
                    <p class="text-surface-600 dark:text-surface-300">{{ task.createdAt | date: 'dd/MM/yyyy HH:mm' }}</p>
                </div>
            </div>

            <ng-template #footer>
                <p-button label="Đóng" severity="secondary" (onClick)="detailsVisible = false" />
            </ng-template>
        </p-dialog>
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

    constructor(private kanbanService: KanbanService) {}

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

    viewTaskDetails(): void {
        this.detailsVisible = true;
    }

    deleteTask(event: Event): void {
        event.stopPropagation();
        if (confirm(`Bạn có chắc muốn xóa task "${this.task.title}"?`)) {
            this.kanbanService.deleteTask(this.task.id);
        }
    }
}
