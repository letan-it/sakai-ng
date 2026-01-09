import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';
import { CareerPath, Competency } from '@/models/lms.models';

@Component({
    selector: 'app-career-roadmap-widget',
    imports: [CommonModule, CardModule, ButtonModule, DialogModule, TagModule, OrganizationChartModule],
    template: `
        <p-card styleClass="h-full">
            <ng-template #header>
                <div class="px-6 pt-6 pb-4 border-b border-surface-200 dark:border-surface-700">
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0">Lộ trình Nghề nghiệp</h2>
                    <p class="text-sm text-surface-600 dark:text-surface-400 mt-1">Career Roadmap</p>
                </div>
            </ng-template>

            <div *ngIf="careerPath" class="space-y-4">
                <div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg">
                    <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0 mb-2">{{ careerPath.name }}</h3>
                    <p class="text-surface-600 dark:text-surface-400">{{ careerPath.description }}</p>
                </div>

                <div class="flex justify-center">
                    <p-button label="Xem Sơ đồ Nghề nghiệp" icon="pi pi-sitemap" size="large" (onClick)="showDialog()" styleClass="w-full lg:w-auto" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div *ngFor="let position of careerPath.positions" class="border border-surface-200 dark:border-surface-700 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="text-lg font-semibold text-surface-900 dark:text-surface-0">{{ position.title }}</h4>
                            <p-tag [value]="'Level ' + position.level" severity="info" styleClass="font-bold" />
                        </div>

                        <div class="text-sm text-surface-600 dark:text-surface-400">
                            <p class="font-semibold mb-2">Năng lực yêu cầu:</p>
                            <ul class="space-y-1 list-disc list-inside">
                                <li *ngFor="let req of position.requiredCompetencies">
                                    {{ getCompetencyName(req.competencyId) }}
                                    <span class="text-primary font-semibold">(Level {{ req.minimumLevel }})</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div *ngIf="!careerPath" class="text-center py-8 text-surface-500 dark:text-surface-400">
                <i class="pi pi-info-circle text-4xl mb-3"></i>
                <p>Chưa có lộ trình nghề nghiệp</p>
            </div>
        </p-card>

        <!-- Dialog hiển thị sơ đồ -->
        <p-dialog header="Sơ đồ Lộ trình Nghề nghiệp" [(visible)]="displayDialog" [modal]="true" [style]="{ width: '90vw', maxWidth: '1200px' }" maskStyleClass="backdrop-blur-sm" styleClass="!border-0">
            <div *ngIf="careerPath" class="py-4">
                <p-organizationChart [value]="organizationChartData" styleClass="company">
                    <ng-template #default let-node>
                        <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-0 dark:bg-surface-900 min-w-[200px]">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-bold text-surface-900 dark:text-surface-0">{{ node.label }}</span>
                                <p-tag [value]="'L' + node.data.level" severity="info" styleClass="text-xs" />
                            </div>
                            <div class="text-xs text-surface-600 dark:text-surface-400">
                                <p class="font-semibold mb-1">Yêu cầu:</p>
                                <div class="flex flex-wrap gap-1">
                                    <p-tag *ngFor="let comp of node.data.competencies" [value]="comp" severity="secondary" styleClass="text-xs" />
                                </div>
                            </div>
                        </div>
                    </ng-template>
                </p-organizationChart>
            </div>
        </p-dialog>
    `,
    styles: [
        `
            ::ng-deep .company.p-organizationchart .p-organizationchart-node-content {
                border: none;
                padding: 0;
            }
        `
    ]
})
export class CareerRoadmapWidget {
    @Input() careerPath: CareerPath | null = null;
    @Input() competencies: Competency[] = [];

    displayDialog = false;
    organizationChartData: TreeNode[] = [];

    showDialog(): void {
        this.buildOrganizationChart();
        this.displayDialog = true;
    }

    buildOrganizationChart(): void {
        if (!this.careerPath) return;

        // Sắp xếp positions theo level
        const sortedPositions = [...this.careerPath.positions].sort((a, b) => a.level - b.level);

        // Tạo cấu trúc tree từ dưới lên
        this.organizationChartData = [];

        let currentNode: TreeNode | null = null;

        for (let i = sortedPositions.length - 1; i >= 0; i--) {
            const position = sortedPositions[i];
            const competencyNames = position.requiredCompetencies.map((req) => {
                const comp = this.getCompetencyName(req.competencyId);

                return `${comp} (L${req.minimumLevel})`;
            });

            const node: TreeNode = {
                label: position.title,
                type: 'person',
                expanded: true,
                data: {
                    level: position.level,
                    competencies: competencyNames
                },
                children: currentNode ? [currentNode] : []
            };

            currentNode = node;
        }

        if (currentNode) {
            this.organizationChartData = [currentNode];
        }
    }

    getCompetencyName(competencyId: number): string {
        const competency = this.competencies.find((c) => c.id === competencyId);

        return competency ? competency.name : `Competency ${competencyId}`;
    }
}
