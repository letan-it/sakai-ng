export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    columnId: string;
    assignee?: string;
    dueDate?: Date;
    createdAt: Date;
    order: number;
}

export interface Column {
    id: string;
    name: string;
    boardId: string;
    order: number;
    tasks: Task[];
}

export interface Board {
    id: string;
    name: string;
    description?: string;
    color?: string;
    createdAt: Date;
    columns: Column[];
}

export interface CreateBoardInput {
    name: string;
    description?: string;
    color?: string;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    columnId: string;
    assignee?: string;
    dueDate?: Date;
}
