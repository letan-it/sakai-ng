import { Injectable, signal } from '@angular/core';
import { Task, Column } from '@/models/kanban.models';

export interface DialogState {
    // Create Board Dialog
    createBoard: {
        visible: boolean;
    };

    // Create Task Dialog
    createTask: {
        visible: boolean;
        columns?: Column[];
    };

    // Edit Task Dialog
    editTask: {
        visible: boolean;
        task?: Task;
    };

    // Task Details Dialog
    taskDetails: {
        visible: boolean;
        task?: Task;
    };

    // Confirm Dialog
    confirm: {
        visible: boolean;
        header?: string;
        message?: string;
        confirmLabel?: string;
        severity?: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'secondary' | 'contrast';
        onConfirm?: () => void;
        onCancel?: () => void;
    };

    // Add Column Dialog
    addColumn: {
        visible: boolean;
    };

    // Rename Column Dialog
    renameColumn: {
        visible: boolean;
        columnId?: string;
        currentName?: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class KanbanDialogService {
    private initialState: DialogState = {
        createBoard: { visible: false },
        createTask: { visible: false, columns: [] },
        editTask: { visible: false, task: undefined },
        taskDetails: { visible: false, task: undefined },
        confirm: {
            visible: false,
            header: 'Xác nhận',
            message: 'Bạn có chắc chắn?',
            confirmLabel: 'Xác nhận',
            severity: 'danger',
            onConfirm: undefined,
            onCancel: undefined
        },
        addColumn: { visible: false },
        renameColumn: { visible: false, columnId: undefined, currentName: '' }
    };

    dialogState = signal<DialogState>(this.initialState);

    // Create Board Dialog
    showCreateBoardDialog(): void {
        this.updateDialogState('createBoard', { visible: true });
    }

    hideCreateBoardDialog(): void {
        this.updateDialogState('createBoard', { visible: false });
    }

    // Create Task Dialog
    showCreateTaskDialog(columns: Column[]): void {
        this.updateDialogState('createTask', { visible: true, columns });
    }

    hideCreateTaskDialog(): void {
        this.updateDialogState('createTask', { visible: false });
    }

    // Edit Task Dialog
    showEditTaskDialog(task: Task): void {
        this.updateDialogState('editTask', { visible: true, task });
    }

    hideEditTaskDialog(): void {
        this.updateDialogState('editTask', { visible: false, task: undefined });
    }

    // Task Details Dialog
    showTaskDetailsDialog(task: Task): void {
        this.updateDialogState('taskDetails', { visible: true, task });
    }

    hideTaskDetailsDialog(): void {
        this.updateDialogState('taskDetails', { visible: false, task: undefined });
    }

    // Confirm Dialog
    showConfirmDialog(config: {
        header: string;
        message: string;
        confirmLabel?: string;
        severity?: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'secondary' | 'contrast';
        onConfirm: () => void;
        onCancel?: () => void;
    }): void {
        this.updateDialogState('confirm', {
            visible: true,
            header: config.header,
            message: config.message,
            confirmLabel: config.confirmLabel || 'Xác nhận',
            severity: config.severity || 'danger',
            onConfirm: config.onConfirm,
            onCancel: config.onCancel
        });
    }

    hideConfirmDialog(): void {
        this.updateDialogState('confirm', {
            visible: false,
            onConfirm: undefined,
            onCancel: undefined
        });
    }

    // Add Column Dialog
    showAddColumnDialog(): void {
        this.updateDialogState('addColumn', { visible: true });
    }

    hideAddColumnDialog(): void {
        this.updateDialogState('addColumn', { visible: false });
    }

    // Rename Column Dialog
    showRenameColumnDialog(columnId: string, currentName: string): void {
        this.updateDialogState('renameColumn', { visible: true, columnId, currentName });
    }

    hideRenameColumnDialog(): void {
        this.updateDialogState('renameColumn', { visible: false, columnId: undefined, currentName: '' });
    }

    // Helper method to update dialog state
    private updateDialogState<K extends keyof DialogState>(dialogKey: K, updates: Partial<DialogState[K]>): void {
        this.dialogState.update((state) => ({
            ...state,
            [dialogKey]: {
                ...state[dialogKey],
                ...updates
            }
        }));
    }

    // Reset all dialogs
    resetAllDialogs(): void {
        this.dialogState.set(this.initialState);
    }
}
