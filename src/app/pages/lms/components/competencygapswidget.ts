import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { EmployeeCompetency, Competency } from '@/models/lms.models';

interface CompetencyGapItem {
    competency: Competency;
    current: number;
    target: number;
    gap: number;
    lastAssessed: string;
}

@Component({
    selector: 'app-competency-gaps-widget',
    imports: [CommonModule, CardModule, TableModule, TagModule, ProgressBarModule],
    template: `
        <p-card styleClass="h-full">
            <ng-template #header>
                <div class="px-6 pt-6 pb-4 border-b border-surface-200 dark:border-surface-700">
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0">Khoảng cách Năng lực</h2>
                    <p class="text-sm text-surface-600 dark:text-surface-400 mt-1">Competency Gaps</p>
                </div>
            </ng-template>

            <p-table [value]="competencyGaps" [tableStyle]="{ 'min-width': '100%' }" styleClass="p-datatable-sm">
                <ng-template #header>
                    <tr>
                        <th>Năng lực</th>
                        <th>Loại</th>
                        <th class="text-center">Hiện tại</th>
                        <th class="text-center">Mục tiêu</th>
                        <th class="text-center">Khoảng cách</th>
                        <th>Đánh giá lần cuối</th>
                    </tr>
                </ng-template>
                <ng-template #body let-item>
                    <tr>
                        <td>
                            <div class="font-semibold text-surface-900 dark:text-surface-0">{{ item.competency.name }}</div>
                            <div class="text-sm text-surface-600 dark:text-surface-400">{{ item.competency.description }}</div>
                        </td>
                        <td>
                            <p-tag [value]="item.competency.category" [severity]="getCategorySeverity(item.competency.category)" />
                        </td>
                        <td class="text-center">
                            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 font-bold">
                                {{ item.current }}
                            </span>
                        </td>
                        <td class="text-center">
                            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 font-bold">
                                {{ item.target }}
                            </span>
                        </td>
                        <td class="text-center">
                            <div class="flex flex-col items-center gap-2">
                                <p-tag [value]="item.gap.toString()" [severity]="getGapSeverity(item.gap)" styleClass="font-bold" />
                                <p-progressBar [value]="getProgressPercentage(item.current, item.target)" [showValue]="false" [style]="{ height: '6px', width: '60px' }" />
                            </div>
                        </td>
                        <td>
                            <span class="text-sm text-surface-600 dark:text-surface-400">{{ formatDate(item.lastAssessed) }}</span>
                        </td>
                    </tr>
                </ng-template>
                <ng-template #emptymessage>
                    <tr>
                        <td colspan="6" class="text-center py-8">
                            <div class="text-surface-500 dark:text-surface-400">
                                <i class="pi pi-info-circle text-3xl mb-3"></i>
                                <p>Không có khoảng cách năng lực nào được tìm thấy</p>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </p-card>
    `
})
export class CompetencyGapsWidget {
    @Input() competencyGaps: CompetencyGapItem[] = [];

    getCategorySeverity(category: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        switch (category) {
            case 'Kỹ thuật':
                return 'info';
            case 'Quản lý':
                return 'warn';
            case 'Mềm':
                return 'success';
            default:
                return 'secondary';
        }
    }

    getGapSeverity(gap: number): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        if (gap === 0) return 'success';
        if (gap === 1) return 'info';
        if (gap === 2) return 'warn';

        return 'danger';
    }

    getProgressPercentage(current: number, target: number): number {
        return (current / target) * 100;
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);

        return date.toLocaleDateString('vi-VN');
    }
}
