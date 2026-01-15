import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KanbanService } from '@/services/kanban.service';
import { Board } from '@/models/kanban.models';
import { KanbanBoardComponent } from './components/kanban-board';
import { CreateBoardDialogComponent } from './components/create-board-dialog';
import { CreateTaskDialogComponent } from './components/create-task-dialog';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-kanban',
    imports: [CommonModule, FormsModule, KanbanBoardComponent, CreateBoardDialogComponent, CreateTaskDialogComponent, ButtonModule, DialogModule, SelectModule],
    template: `
        <div class="kanban-container">
            <!-- Header -->
            <div class="mb-6 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">Quản lý Kanban</h1>
                    <p-select *ngIf="boards.length > 0" [options]="boards" [(ngModel)]="selectedBoard" (onChange)="onBoardChange($event)" optionLabel="name" placeholder="Chọn board" styleClass="w-64" />
                </div>
                <div class="flex gap-3">
                    <p-button label="Board mới" icon="pi pi-plus" severity="secondary" (onClick)="showCreateBoardDialog()" />
                    <p-button *ngIf="currentBoard" label="Task mới" icon="pi pi-plus" (onClick)="showCreateTaskDialog()" />
                </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="boards.length === 0" class="flex h-96 items-center justify-center">
                <div class="text-center">
                    <i class="pi pi-inbox mb-4 text-6xl text-surface-400"></i>
                    <h3 class="mb-2 text-xl font-semibold text-surface-700 dark:text-surface-300">Chưa có board nào</h3>
                    <p class="mb-4 text-surface-500 dark:text-surface-400">Tạo board đầu tiên để bắt đầu quản lý công việc</p>
                    <p-button label="Tạo Board Đầu Tiên" icon="pi pi-plus" (onClick)="showCreateBoardDialog()" />
                </div>
            </div>

            <!-- Kanban Board -->
            <app-kanban-board *ngIf="currentBoard" [board]="currentBoard" />

            <!-- Create Board Dialog -->
            <app-create-board-dialog [(visible)]="createBoardDialogVisible" (boardCreated)="onBoardCreated($event)" />

            <!-- Create Task Dialog -->
            <app-create-task-dialog *ngIf="currentBoard" [(visible)]="createTaskDialogVisible" [columns]="currentBoard.columns" (taskCreated)="onTaskCreated()" />
        </div>
    `
})
export class Kanban implements OnInit {
    selectedBoard: Board | null = null;
    createBoardDialogVisible = false;
    createTaskDialogVisible = false;

    constructor(private kanbanService: KanbanService) {}

    get boards() {
        return this.kanbanService.allBoards();
    }

    get currentBoard() {
        return this.kanbanService.currentBoard();
    }

    ngOnInit(): void {
        const current = this.currentBoard;
        if (current) {
            this.selectedBoard = current;
        }
    }

    onBoardChange(event: { value: Board }): void {
        if (event.value) {
            this.kanbanService.selectBoard(event.value.id);
            this.selectedBoard = event.value;
        }
    }

    showCreateBoardDialog(): void {
        this.createBoardDialogVisible = true;
    }

    showCreateTaskDialog(): void {
        this.createTaskDialogVisible = true;
    }

    onBoardCreated(board: Board): void {
        this.selectedBoard = board;
        this.createBoardDialogVisible = false;
    }

    onTaskCreated(): void {
        this.createTaskDialogVisible = false;
    }
}
