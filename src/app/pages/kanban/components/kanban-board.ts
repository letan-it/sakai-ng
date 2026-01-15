import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Board, Column, Task } from '@/models/kanban.models';
import { KanbanService } from '@/services/kanban.service';
import { KanbanColumnComponent } from './kanban-column';
import { ButtonModule } from 'primeng/button';
import { AddColumnDialogComponent } from './add-column-dialog';

@Component({
    selector: 'app-kanban-board',
    imports: [CommonModule, DragDropModule, KanbanColumnComponent, ButtonModule, AddColumnDialogComponent],
    template: `
        <div class="kanban-board overflow-x-auto">
            <div class="flex gap-6 pb-4" cdkDropListGroup>
                <app-kanban-column *ngFor="let column of board.columns; let i = index" [column]="column" [colorIndex]="i" (taskMoved)="onTaskMoved($event)" />

                <!-- Add Column Button -->
                <div class="min-w-[320px]">
                    <div class="rounded-lg bg-surface-50 dark:bg-surface-800 p-6 h-full flex items-center justify-center">
                        <p-button label="+ Thêm Cột" [text]="true" severity="secondary" (onClick)="addNewColumn()" styleClass="text-lg font-semibold" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Column Dialog -->
        <app-add-column-dialog [(visible)]="addColumnDialogVisible" (columnAdded)="onColumnAdded($event)" />
    `,
    styles: [
        `
            .kanban-board {
                min-height: 500px;
            }
        `
    ]
})
export class KanbanBoardComponent {
    @Input() board!: Board;

    addColumnDialogVisible = false;

    constructor(private kanbanService: KanbanService) {}

    onTaskMoved(event: { drop: CdkDragDrop<Task[]>; columnId: string }): void {
        const { drop, columnId } = event;

        if (drop.previousContainer === drop.container) {
            // Reorder within same column
            const taskId = drop.container.data[drop.previousIndex].id;
            this.kanbanService.moveTask(taskId, columnId, drop.currentIndex);
        } else {
            // Move to different column
            const taskId = drop.previousContainer.data[drop.previousIndex].id;
            this.kanbanService.moveTask(taskId, columnId, drop.currentIndex);
        }
    }

    addNewColumn(): void {
        this.addColumnDialogVisible = true;
    }

    onColumnAdded(columnName: string): void {
        this.kanbanService.addColumn(columnName);
        this.addColumnDialogVisible = false;
    }
}
