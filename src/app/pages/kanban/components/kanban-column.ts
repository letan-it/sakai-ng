import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Column, Task } from '@/models/kanban.models';
import { KanbanTaskCardComponent } from './kanban-task-card';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { KanbanService } from '@/services/kanban.service';
import { RenameColumnDialogComponent } from './rename-column-dialog';
import { ConfirmDialogComponent } from './confirm-dialog';

@Component({
    selector: 'app-kanban-column',
    imports: [CommonModule, DragDropModule, KanbanTaskCardComponent, ButtonModule, MenuModule, RenameColumnDialogComponent, ConfirmDialogComponent],
    template: `
        <div class="kanban-column min-w-[320px] flex flex-col" style="height: 70vh;">
            <!-- Column Header - Fixed -->
            <div class="mb-4 flex items-center justify-between flex-shrink-0">
                <div class="flex items-center gap-2">
                    <span class="h-4 w-4 rounded-full" [style.background-color]="columnColor"></span>
                    <h3 class="text-sm font-bold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                        {{ column.name }} ({{ column.tasks.length }})
                    </h3>
                </div>
                <p-button icon="pi pi-ellipsis-v" [text]="true" severity="secondary" size="small" (onClick)="menu.toggle($event)" />
                <p-menu #menu [model]="menuItems" [popup]="true" />
            </div>

            <!-- Tasks List - Scrollable -->
            <div
                cdkDropList
                [cdkDropListData]="column.tasks"
                (cdkDropListDropped)="onDrop($event)"
                class="flex-1 space-y-4 overflow-y-auto rounded-lg p-2"
                [class.bg-surface-50]="column.tasks.length === 0"
                [class.dark:bg-surface-800]="column.tasks.length === 0"
                [class.border-2]="column.tasks.length === 0"
                [class.border-dashed]="column.tasks.length === 0"
                [class.border-surface-300]="column.tasks.length === 0"
                [class.dark:border-surface-600]="column.tasks.length === 0"
            >
                <app-kanban-task-card *ngFor="let task of column.tasks" [task]="task" cdkDrag />

                <!-- Empty State -->
                <div *ngIf="column.tasks.length === 0" class="flex h-32 items-center justify-center">
                    <p class="text-sm text-surface-400">Kéo thả task vào đây</p>
                </div>
            </div>
        </div>

        <!-- Rename Column Dialog -->
        <app-rename-column-dialog
            [(visible)]="renameDialogVisible"
            [currentName]="column.name"
            (columnRenamed)="onColumnRenamed($event)"
        />

        <!-- Delete Confirmation Dialog -->
        <app-confirm-dialog
            [(visible)]="deleteDialogVisible"
            header="Xác nhận xóa cột"
            [message]="'Bạn có chắc muốn xóa cột \"' + column.name + '\"? Tất cả tasks trong cột sẽ bị xóa.'"
            confirmLabel="Xóa"
            severity="danger"
            (confirmed)="onDeleteConfirmed()"
        />
    `,
    styles: [
        `
            :host {
                display: block;
            }

            .cdk-drag-preview {
                opacity: 0.8;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }

            .cdk-drag-animating {
                transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
            }

            .cdk-drop-list-dragging .cdk-drag {
                transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
            }
        `
    ]
})
export class KanbanColumnComponent implements OnInit {
    @Input() column!: Column;
    @Input() colorIndex: number = 0;
    @Output() taskMoved = new EventEmitter<{ drop: CdkDragDrop<Task[]>; columnId: string }>();

    menuItems: MenuItem[] = [];
    renameDialogVisible = false;
    deleteDialogVisible = false;

    private colors = ['#635FC7', '#49C4E5', '#67E2AE', '#8471F2', '#FF6B9D'];

    constructor(private kanbanService: KanbanService) {}

    ngOnInit(): void {
        this.menuItems = [
            {
                label: 'Đổi tên',
                icon: 'pi pi-pencil',
                command: () => this.renameColumn()
            },
            {
                label: 'Xóa cột',
                icon: 'pi pi-trash',
                command: () => this.deleteColumn()
            }
        ];
    }

    get columnColor(): string {
        return this.colors[this.colorIndex % this.colors.length];
    }

    onDrop(event: CdkDragDrop<Task[]>): void {
        this.taskMoved.emit({ drop: event, columnId: this.column.id });
    }

    renameColumn(): void {
        this.renameDialogVisible = true;
    }

    onColumnRenamed(newName: string): void {
        this.kanbanService.updateColumn(this.column.id, newName);
        this.renameDialogVisible = false;
    }

    deleteColumn(): void {
        this.deleteDialogVisible = true;
    }

    onDeleteConfirmed(): void {
        this.kanbanService.deleteColumn(this.column.id);
        this.deleteDialogVisible = false;
    }
}
