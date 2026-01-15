import { Component, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KanbanDialogService } from '@/services/kanban-dialog.service';
import { KanbanService } from '@/services/kanban.service';
import { CreateBoardDialogComponent } from '@/pages/kanban/components/create-board-dialog';
import { CreateTaskDialogComponent } from '@/pages/kanban/components/create-task-dialog';
import { EditTaskDialogComponent } from '@/pages/kanban/components/edit-task-dialog';
import { ConfirmDialogComponent } from '@/pages/kanban/components/confirm-dialog';
import { AddColumnDialogComponent } from '@/pages/kanban/components/add-column-dialog';
import { RenameColumnDialogComponent } from '@/pages/kanban/components/rename-column-dialog';
import { Board, Task } from '@/models/kanban.models';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        CreateBoardDialogComponent,
        CreateTaskDialogComponent,
        EditTaskDialogComponent,
        ConfirmDialogComponent,
        AddColumnDialogComponent,
        RenameColumnDialogComponent
    ],
    template: `
        <router-outlet></router-outlet>

        <!-- Kanban Dialogs - Rendered at Root Level -->

        <!-- Create Board Dialog -->
        <app-create-board-dialog
            [visible]="dialogState().createBoard.visible"
            (visibleChange)="onCreateBoardDialogClose()"
            (boardCreated)="onBoardCreated($event)"
        />

        <!-- Create Task Dialog -->
        <app-create-task-dialog
            [visible]="dialogState().createTask.visible"
            [columns]="dialogState().createTask.columns || []"
            (visibleChange)="onCreateTaskDialogClose()"
            (taskCreated)="onTaskCreated()"
        />

        <!-- Edit Task Dialog -->
        <app-edit-task-dialog
            [visible]="dialogState().editTask.visible"
            [task]="dialogState().editTask.task || null"
            (visibleChange)="onEditTaskDialogClose()"
            (taskUpdated)="onTaskUpdated()"
        />

        <!-- Confirm Dialog -->
        <app-confirm-dialog
            [visible]="dialogState().confirm.visible"
            [header]="dialogState().confirm.header || 'Xác nhận'"
            [message]="dialogState().confirm.message || 'Bạn có chắc chắn?'"
            [confirmLabel]="dialogState().confirm.confirmLabel || 'Xác nhận'"
            [severity]="dialogState().confirm.severity || 'danger'"
            (visibleChange)="onConfirmDialogClose()"
            (confirmed)="onConfirmDialogConfirmed()"
            (cancelled)="onConfirmDialogCancelled()"
        />

        <!-- Add Column Dialog -->
        <app-add-column-dialog
            [visible]="dialogState().addColumn.visible"
            (visibleChange)="onAddColumnDialogClose()"
            (columnAdded)="onColumnAdded($event)"
        />

        <!-- Rename Column Dialog -->
        <app-rename-column-dialog
            [visible]="dialogState().renameColumn.visible"
            [currentName]="dialogState().renameColumn.currentName || ''"
            (visibleChange)="onRenameColumnDialogClose()"
            (columnRenamed)="onColumnRenamed($event)"
        />
    `
})
export class AppComponent {
    dialogState = computed(() => this.kanbanDialogService.dialogState());

    constructor(
        private kanbanDialogService: KanbanDialogService,
        private kanbanService: KanbanService
    ) {}

    // Create Board Dialog Handlers
    onCreateBoardDialogClose(): void {
        this.kanbanDialogService.hideCreateBoardDialog();
    }

    onBoardCreated(board: Board): void {
        this.kanbanService.selectBoard(board.id);
        this.kanbanDialogService.hideCreateBoardDialog();
    }

    // Create Task Dialog Handlers
    onCreateTaskDialogClose(): void {
        this.kanbanDialogService.hideCreateTaskDialog();
    }

    onTaskCreated(): void {
        this.kanbanDialogService.hideCreateTaskDialog();
    }

    // Edit Task Dialog Handlers
    onEditTaskDialogClose(): void {
        this.kanbanDialogService.hideEditTaskDialog();
    }

    onTaskUpdated(): void {
        this.kanbanDialogService.hideEditTaskDialog();
    }

    // Confirm Dialog Handlers
    onConfirmDialogClose(): void {
        this.kanbanDialogService.hideConfirmDialog();
    }

    onConfirmDialogConfirmed(): void {
        const onConfirm = this.dialogState().confirm.onConfirm;
        if (onConfirm) {
            onConfirm();
        }
        this.kanbanDialogService.hideConfirmDialog();
    }

    onConfirmDialogCancelled(): void {
        const onCancel = this.dialogState().confirm.onCancel;
        if (onCancel) {
            onCancel();
        }
        this.kanbanDialogService.hideConfirmDialog();
    }

    // Add Column Dialog Handlers
    onAddColumnDialogClose(): void {
        this.kanbanDialogService.hideAddColumnDialog();
    }

    onColumnAdded(columnName: string): void {
        this.kanbanService.addColumn(columnName);
        this.kanbanDialogService.hideAddColumnDialog();
    }

    // Rename Column Dialog Handlers
    onRenameColumnDialogClose(): void {
        this.kanbanDialogService.hideRenameColumnDialog();
    }

    onColumnRenamed(newName: string): void {
        const columnId = this.dialogState().renameColumn.columnId;
        if (columnId) {
            this.kanbanService.updateColumn(columnId, newName);
        }
        this.kanbanDialogService.hideRenameColumnDialog();
    }
}

