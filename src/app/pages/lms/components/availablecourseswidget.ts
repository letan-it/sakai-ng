import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Course } from '@/models/lms.models';

@Component({
    selector: 'app-available-courses-widget',
    imports: [CommonModule, CardModule, ButtonModule, TagModule, TooltipModule],
    template: `
        <p-card styleClass="h-full">
            <ng-template #header>
                <div class="px-6 pt-6 pb-4 border-b border-surface-200 dark:border-surface-700">
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0">Khóa học Khả dụng</h2>
                    <p class="text-sm text-surface-600 dark:text-surface-400 mt-1">Available Courses</p>
                </div>
            </ng-template>

            <div class="space-y-4">
                <div *ngFor="let course of courses" class="border border-surface-200 dark:border-surface-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-1">{{ course.title }}</h3>
                            <p class="text-sm text-surface-600 dark:text-surface-400">{{ course.description }}</p>
                        </div>
                        <p-tag [value]="course.status" [severity]="getStatusSeverity(course.status)" styleClass="ml-3" />
                    </div>

                    <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div class="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                            <i class="pi pi-clock text-primary"></i>
                            <span>{{ course.duration }}</span>
                        </div>

                        <div class="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                            <i class="pi pi-user text-primary"></i>
                            <span>{{ course.instructor }}</span>
                        </div>

                        <div class="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                            <i class="pi pi-calendar text-primary"></i>
                            <span>{{ formatDate(course.startDate) }}</span>
                        </div>

                        <div class="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                            <i [class]="getFormatIcon(course.format)" class="text-primary"></i>
                            <span>{{ course.format }}</span>
                        </div>
                    </div>

                    <div class="flex items-center justify-between" *ngIf="course.maxParticipants">
                        <div class="text-sm text-surface-600 dark:text-surface-400">
                            <i class="pi pi-users mr-2"></i>
                            {{ course.currentParticipants }}/{{ course.maxParticipants }} học viên
                        </div>

                        <div class="flex gap-2">
                            <p-button
                                *ngIf="course.format === 'Online' && course.status === 'Available'"
                                label="Đăng ký"
                                icon="pi pi-check"
                                size="small"
                                (onClick)="onRegister(course)"
                                [disabled]="isEnrolled(course.id)"
                                [pTooltip]="isEnrolled(course.id) ? 'Đã đăng ký' : 'Đăng ký khóa học'"
                            />

                            <p-button
                                *ngIf="course.format !== 'Online' || course.status === 'Full'"
                                label="Danh sách chờ"
                                icon="pi pi-list"
                                size="small"
                                severity="secondary"
                                [outlined]="true"
                                (onClick)="onWaitlist(course)"
                                [disabled]="isEnrolled(course.id)"
                                [pTooltip]="isEnrolled(course.id) ? 'Đã ở trong danh sách chờ' : 'Tham gia danh sách chờ'"
                            />
                        </div>
                    </div>
                </div>

                <div *ngIf="courses.length === 0" class="text-center py-8 text-surface-500 dark:text-surface-400">
                    <i class="pi pi-inbox text-4xl mb-3"></i>
                    <p>Không có khóa học khả dụng</p>
                </div>
            </div>
        </p-card>
    `
})
export class AvailableCoursesWidget {
    @Input() courses: Course[] = [];
    @Input() enrolledCourseIds: number[] = [];
    @Output() register = new EventEmitter<Course>();
    @Output() waitlist = new EventEmitter<Course>();

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
        switch (status) {
            case 'Available':
                return 'success';
            case 'Full':
                return 'danger';
            case 'Upcoming':
                return 'info';
            default:
                return 'secondary';
        }
    }

    getFormatIcon(format: string): string {
        switch (format) {
            case 'Online':
                return 'pi pi-desktop';
            case 'Offline':
                return 'pi pi-building';
            case 'Hybrid':
                return 'pi pi-globe';
            default:
                return 'pi pi-book';
        }
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);

        return date.toLocaleDateString('vi-VN');
    }

    isEnrolled(courseId: number): boolean {
        return this.enrolledCourseIds.includes(courseId);
    }

    onRegister(course: Course): void {
        this.register.emit(course);
    }

    onWaitlist(course: Course): void {
        this.waitlist.emit(course);
    }
}
