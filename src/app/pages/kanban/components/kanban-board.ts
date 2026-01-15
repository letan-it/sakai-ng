import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board, Column, Task } from '@/models/kanban.models';
import { KanbanService } from '@/services/kanban.service';
import { KanbanColumnComponent } from './kanban-column';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-kanban-board',
    imports: [CommonModule, DragDropModule, KanbanColumnComponent, ButtonModule],
    template: `
        <div class="kanban-board overflow-x-auto" >
            <div class="flex gap-6 pb-4" style="height: 70vh;" cdkDropListGroup>
                <app-kanban-column
                    *ngFor="let column of board.columns; let i = index"
                    [column]="column"
                    [colorIndex]="i"
                    (taskMoved)="onTaskMoved($event)"
                />

                <!-- Add Column Button -->
                <div class="min-w-[320px]">
                    <div class="rounded-lg bg-surface-50 dark:bg-surface-800 p-6 h-full flex items-center justify-center">
                        <p-button
                            label="+ Thêm Cột"
                            [text]="true"
                            severity="secondary"
                            (onClick)="addNewColumn()"
                            styleClass="text-lg font-semibold"
                        />
                    </div>
                </div>
            </div>
        </div>
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

    constructor(private kanbanService: KanbanService) {}

    onTaskMoved(event: { drop: CdkDragDrop<Task[]>; columnId: string }): void {
        const { drop, columnId } = event;

        if (drop.previousContainer === drop.container) {
            // Reorder within same column
            moveItemInArray(drop.container.data, drop.previousIndex, drop.currentIndex);

            // Update order in service
            drop.container.data.forEach((task, index) => {
                this.kanbanService.updateTask(task.id, { order: index });
            });
        } else {
            // Move to different column
            const taskId = drop.previousContainer.data[drop.previousIndex].id;

            transferArrayItem(drop.previousContainer.data, drop.container.data, drop.previousIndex, drop.currentIndex);

            // Update in service
            this.kanbanService.moveTask(taskId, columnId, drop.currentIndex);
        }
    }

    addNewColumn(): void {
        const columnName = prompt('Nhập tên cột mới:');
        if (columnName && columnName.trim()) {
            this.kanbanService.addColumn(columnName.trim());
        }
    }
}
