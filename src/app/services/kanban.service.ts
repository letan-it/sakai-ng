import { Injectable, signal, computed, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Board, Column, Task, CreateBoardInput, CreateTaskInput } from '../models/kanban.models';

@Injectable({
    providedIn: 'root'
})
export class KanbanService {
    private boards = signal<Board[]>([]);
    private currentBoardId = signal<string | null>(null);

    readonly allBoards = this.boards.asReadonly();
    readonly currentBoard = computed(() => {
        const boardId = this.currentBoardId();

        return boardId ? this.boards().find((b) => b.id === boardId) || null : null;
    });

    private readonly STORAGE_KEY = 'kanban_boards';

    constructor(@Inject(PLATFORM_ID) private platformId: object) {
        this.loadBoards();

        // Auto-save boards to localStorage whenever they change
        effect(() => {
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.boards()));
            }
        });
    }

    private loadBoards(): void {
        if (isPlatformBrowser(this.platformId)) {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const boards = JSON.parse(stored) as Board[];
                this.boards.set(boards);
                if (boards.length > 0 && !this.currentBoardId()) {
                    this.currentBoardId.set(boards[0].id);
                }
            } else {
                // Initialize with demo data
                this.initializeDemoData();
            }
        }
    }

    private initializeDemoData(): void {
        const demoBoards: Board[] = [
            {
                id: this.generateId(),
                name: 'Dự án Website Mới',
                description: 'Phát triển website cho khách hàng',
                color: '#635FC7',
                createdAt: new Date(),
                columns: [
                    {
                        id: this.generateId(),
                        name: 'Backlog',
                        boardId: '',
                        order: 0,
                        tasks: [
                            {
                                id: this.generateId(),
                                title: 'Thiết kế giao diện trang chủ',
                                description: 'Tạo mockup và wireframe cho trang chủ',
                                priority: 'high',
                                columnId: '',
                                assignee: 'Nguyễn Văn A',
                                createdAt: new Date(),
                                order: 0,
                                tags: ['urgent', 'design', 'frontend'],
                                mentions: ['user1', 'designer']
                            },
                            {
                                id: this.generateId(),
                                title: 'Nghiên cứu UX/UI',
                                description: 'Phân tích trải nghiệm người dùng',
                                priority: 'medium',
                                columnId: '',
                                createdAt: new Date(),
                                order: 1,
                                tags: ['research', 'ux'],
                                mentions: ['user2']
                            }
                        ]
                    },
                    {
                        id: this.generateId(),
                        name: 'In Progress',
                        boardId: '',
                        order: 1,
                        tasks: [
                            {
                                id: this.generateId(),
                                title: 'Phát triển API Backend',
                                description: 'Xây dựng RESTful API',
                                priority: 'high',
                                columnId: '',
                                assignee: 'Trần Thị B',
                                createdAt: new Date(),
                                order: 0,
                                tags: ['backend', 'api', 'urgent'],
                                mentions: ['developer1', 'teamlead']
                            }
                        ]
                    },
                    {
                        id: this.generateId(),
                        name: 'In Review',
                        boardId: '',
                        order: 2,
                        tasks: [
                            {
                                id: this.generateId(),
                                title: 'Code review module đăng nhập',
                                description: 'Review và test module authentication',
                                priority: 'medium',
                                columnId: '',
                                createdAt: new Date(),
                                order: 0,
                                tags: ['review', 'security'],
                                mentions: ['reviewer1']
                            }
                        ]
                    },
                    {
                        id: this.generateId(),
                        name: 'Done',
                        boardId: '',
                        order: 3,
                        tasks: [
                            {
                                id: this.generateId(),
                                title: 'Setup môi trường development',
                                description: 'Cài đặt Angular, Node.js và database',
                                priority: 'high',
                                columnId: '',
                                createdAt: new Date(),
                                order: 0,
                                tags: ['setup', 'devops'],
                                mentions: []
                            }
                        ]
                    }
                ]
            }
        ];

        // Update IDs for relationships
        demoBoards.forEach((board) => {
            board.columns.forEach((column) => {
                column.boardId = board.id;
                column.tasks.forEach((task) => {
                    task.columnId = column.id;
                });
            });
        });

        this.boards.set(demoBoards);
        if (demoBoards.length > 0) {
            this.currentBoardId.set(demoBoards[0].id);
        }
    }

    selectBoard(boardId: string): void {
        this.currentBoardId.set(boardId);
    }

    createBoard(input: CreateBoardInput): Board {
        const newBoard: Board = {
            id: this.generateId(),
            name: input.name,
            description: input.description,
            color: input.color || '#635FC7',
            createdAt: new Date(),
            columns: [
                {
                    id: this.generateId(),
                    name: 'Backlog',
                    boardId: '',
                    order: 0,
                    tasks: []
                },
                {
                    id: this.generateId(),
                    name: 'In Progress',
                    boardId: '',
                    order: 1,
                    tasks: []
                },
                {
                    id: this.generateId(),
                    name: 'In Review',
                    boardId: '',
                    order: 2,
                    tasks: []
                },
                {
                    id: this.generateId(),
                    name: 'Done',
                    boardId: '',
                    order: 3,
                    tasks: []
                }
            ]
        };

        // Update column boardIds
        newBoard.columns.forEach((col) => {
            col.boardId = newBoard.id;
        });

        this.boards.update((boards) => [...boards, newBoard]);
        this.currentBoardId.set(newBoard.id);

        return newBoard;
    }

    updateBoard(id: string, updates: Partial<Board>): void {
        this.boards.update((boards) => boards.map((board) => (board.id === id ? { ...board, ...updates } : board)));
    }

    deleteBoard(id: string): void {
        this.boards.update((boards) => boards.filter((board) => board.id !== id));

        const remainingBoards = this.boards();
        if (this.currentBoardId() === id) {
            this.currentBoardId.set(remainingBoards.length > 0 ? remainingBoards[0].id : null);
        }
    }

    createTask(input: CreateTaskInput): Task {
        const newTask: Task = {
            id: this.generateId(),
            title: input.title,
            description: input.description,
            priority: input.priority,
            columnId: input.columnId,
            assignee: input.assignee,
            dueDate: input.dueDate,
            createdAt: new Date(),
            order: 0,
            tags: input.tags,
            mentions: input.mentions
        };

        this.boards.update((boards) =>
            boards.map((board) => {
                if (board.id === this.currentBoardId()) {
                    return {
                        ...board,
                        columns: board.columns.map((column) => {
                            if (column.id === input.columnId) {
                                const newOrder = column.tasks.length;
                                newTask.order = newOrder;

                                return {
                                    ...column,
                                    tasks: [...column.tasks, newTask]
                                };
                            }

                            return column;
                        })
                    };
                }

                return board;
            })
        );

        return newTask;
    }

    updateTask(id: string, updates: Partial<Task>): void {
        this.boards.update((boards) =>
            boards.map((board) => {
                if (board.id === this.currentBoardId()) {
                    return {
                        ...board,
                        columns: board.columns.map((column) => ({
                            ...column,
                            tasks: column.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
                        }))
                    };
                }

                return board;
            })
        );
    }

    deleteTask(id: string): void {
        this.boards.update((boards) =>
            boards.map((board) => {
                if (board.id === this.currentBoardId()) {
                    return {
                        ...board,
                        columns: board.columns.map((column) => ({
                            ...column,
                            tasks: column.tasks.filter((task) => task.id !== id)
                        }))
                    };
                }

                return board;
            })
        );
    }

    moveTask(taskId: string, targetColumnId: string, newOrder: number): void {
        this.boards.update((boards) =>
            boards.map((board) => {
                if (board.id === this.currentBoardId()) {
                    let foundTask: Task | undefined;
                    let sourceColId: string | undefined;

                    // Find the task and its source column
                    for (const column of board.columns) {
                        const task = column.tasks.find((t) => t.id === taskId);
                        if (task) {
                            foundTask = { ...task };
                            sourceColId = column.id;
                            break;
                        }
                    }

                    if (!foundTask || !sourceColId) {
                        return board;
                    }

                    const sourceColumnId: string = sourceColId;
                    const isSameColumn = sourceColumnId === targetColumnId;

                    return {
                        ...board,
                        columns: board.columns.map((column) => {
                            if (column.id === sourceColumnId && column.id === targetColumnId) {
                                // Reorder within same column
                                const tasksCopy = [...column.tasks];
                                const oldIndex = tasksCopy.findIndex((t) => t.id === taskId);
                                const [movedTask] = tasksCopy.splice(oldIndex, 1);
                                tasksCopy.splice(newOrder, 0, movedTask);

                                return {
                                    ...column,
                                    tasks: tasksCopy.map((t, idx) => ({ ...t, order: idx }))
                                };
                            } else if (column.id === sourceColumnId) {
                                // Remove from source column (different column move)
                                return {
                                    ...column,
                                    tasks: column.tasks.filter((t) => t.id !== taskId).map((t, idx) => ({ ...t, order: idx }))
                                };
                            } else if (column.id === targetColumnId) {
                                // Add to target column (different column move)
                                const updatedTask: Task = {
                                    ...foundTask,
                                    columnId: targetColumnId,
                                    order: newOrder
                                };
                                const newTasks = [...column.tasks];
                                newTasks.splice(newOrder, 0, updatedTask);

                                return {
                                    ...column,
                                    tasks: newTasks.map((t, idx) => ({ ...t, order: idx }))
                                };
                            }

                            return column;
                        })
                    };
                }

                return board;
            })
        );
    }

    addColumn(name: string): void {
        const board = this.currentBoard();
        if (!board) return;

        const newColumn: Column = {
            id: this.generateId(),
            name,
            boardId: board.id,
            order: board.columns.length,
            tasks: []
        };

        this.boards.update((boards) =>
            boards.map((b) => {
                if (b.id === board.id) {
                    return {
                        ...b,
                        columns: [...b.columns, newColumn]
                    };
                }

                return b;
            })
        );
    }

    updateColumn(columnId: string, name: string): void {
        this.boards.update((boards) =>
            boards.map((board) => {
                if (board.id === this.currentBoardId()) {
                    return {
                        ...board,
                        columns: board.columns.map((column) => (column.id === columnId ? { ...column, name } : column))
                    };
                }

                return board;
            })
        );
    }

    deleteColumn(columnId: string): void {
        this.boards.update((boards) =>
            boards.map((board) => {
                if (board.id === this.currentBoardId()) {
                    return {
                        ...board,
                        columns: board.columns.filter((column) => column.id !== columnId)
                    };
                }

                return board;
            })
        );
    }

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }
}
