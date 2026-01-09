import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { LMSDataService } from '@/services/lms-data.service';
import { Employee, Competency, EmployeeCompetency, Course } from '@/models/lms.models';
import { EmployeeInfoWidget } from './components/employeeinfowidget';
import { CompetencyGapsWidget } from './components/competencygapswidget';
import { AvailableCoursesWidget } from './components/availablecourseswidget';
import { CareerRoadmapWidget } from './components/careerroadmapwidget';

interface CompetencyGapItem {
    competency: Competency;
    current: number;
    target: number;
    gap: number;
    lastAssessed: string;
}

@Component({
    selector: 'app-lms',
    imports: [CommonModule, ToastModule, DialogModule, ButtonModule, EmployeeInfoWidget, CompetencyGapsWidget, AvailableCoursesWidget, CareerRoadmapWidget],
    providers: [MessageService],
    template: `
        <!-- Toast for notifications -->
        <p-toast />

        <!-- Dialog giới thiệu -->
        <p-dialog header="Chào mừng đến với LMS Demo" [(visible)]="displayIntroDialog" [modal]="true" [style]="{ width: '500px' }" [closable]="true" maskStyleClass="backdrop-blur-sm" styleClass="!border-0">
            <div class="flex flex-col gap-4">
                <p class="text-lg leading-relaxed">Đây là giao diện demo của <strong class="text-primary">Hệ thống Quản lý Học tập (LMS)</strong>.</p>
                <p class="text-surface-600 dark:text-surface-400">Hệ thống giúp nhân viên:</p>
                <ul class="list-disc list-inside space-y-2 text-surface-600 dark:text-surface-400">
                    <li>Xem thông tin cá nhân và vị trí công việc</li>
                    <li>Theo dõi khoảng cách năng lực cần phát triển</li>
                    <li>Đăng ký các khóa học phù hợp</li>
                    <li>Xem lộ trình phát triển nghề nghiệp</li>
                </ul>
                <p class="text-sm text-muted-color italic">Sản phẩm do AI Agents của LQT tạo ra, chỉ dùng để demo giao diện chức năng.</p>
            </div>
            <ng-template #footer>
                <p-button label="Bắt đầu" icon="pi pi-check" (onClick)="displayIntroDialog = false" styleClass="w-full" />
            </ng-template>
        </p-dialog>

        <div class="grid grid-cols-12 gap-6">
            <!-- Thông tin nhân viên -->
            <div class="col-span-12">
                <app-employee-info-widget [employee]="currentEmployee" />
            </div>

            <!-- Khoảng cách năng lực -->
            <div class="col-span-12 xl:col-span-8">
                <app-competency-gaps-widget [competencyGaps]="competencyGaps" />
            </div>

            <!-- Lộ trình nghề nghiệp -->
            <div class="col-span-12 xl:col-span-4">
                <app-career-roadmap-widget [careerPath]="careerPath" [competencies]="allCompetencies" />
            </div>

            <!-- Khóa học khả dụng -->
            <div class="col-span-12">
                <app-available-courses-widget [courses]="availableCourses" [enrolledCourseIds]="enrolledCourseIds" (register)="onRegisterCourse($event)" (waitlist)="onJoinWaitlist($event)" />
            </div>
        </div>
    `
})
export class LMS implements OnInit {
    displayIntroDialog = false;

    currentEmployee: Employee | null = null;
    competencyGaps: CompetencyGapItem[] = [];
    availableCourses: Course[] = [];
    careerPath: any = null;
    allCompetencies: Competency[] = [];
    enrolledCourseIds: number[] = [];

    constructor(
        private lmsDataService: LMSDataService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        // Hiển thị dialog giới thiệu
        this.displayIntroDialog = true;

        // Load dữ liệu cho nhân viên ID = 1
        this.loadEmployeeData(1);
    }

    loadEmployeeData(employeeId: number): void {
        // Load employee info
        this.currentEmployee = this.lmsDataService.getEmployeeById(employeeId) || null;

        // Load competencies
        const employeeCompetencies = this.lmsDataService.getEmployeeCompetencies(employeeId);

        this.competencyGaps = employeeCompetencies
            .map((ec: EmployeeCompetency) => {
                const competency = this.lmsDataService.getCompetencyById(ec.competencyId);

                if (!competency) return null;

                return {
                    competency,
                    current: ec.currentLevel,
                    target: ec.targetLevel,
                    gap: ec.gap,
                    lastAssessed: ec.lastAssessed
                };
            })
            .filter((item): item is CompetencyGapItem => item !== null)
            .filter((item) => item.gap > 0) // Chỉ hiển thị những năng lực còn khoảng cách
            .sort((a, b) => b.gap - a.gap); // Sắp xếp theo khoảng cách giảm dần

        // Load all competencies for reference
        this.allCompetencies = [1, 2, 3, 4, 5, 6, 7, 8].map((id) => this.lmsDataService.getCompetencyById(id)).filter((c): c is Competency => c !== undefined);

        // Load available courses
        this.availableCourses = this.lmsDataService.getCourses();

        // Load enrolled course IDs
        const enrollments = this.lmsDataService.getEmployeeEnrollments(employeeId);

        this.enrolledCourseIds = enrollments.map((e) => e.courseId);

        // Load career path
        this.careerPath = this.lmsDataService.getCareerPath(1);
    }

    onRegisterCourse(course: Course): void {
        if (!this.currentEmployee) return;

        try {
            this.lmsDataService.enrollCourse(this.currentEmployee.id, course.id, false);
            this.enrolledCourseIds.push(course.id);

            this.messageService.add({
                severity: 'success',
                summary: 'Đăng ký thành công',
                detail: `Bạn đã đăng ký khóa học "${course.title}"`
            });
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể đăng ký khóa học'
            });
        }
    }

    onJoinWaitlist(course: Course): void {
        if (!this.currentEmployee) return;

        try {
            this.lmsDataService.enrollCourse(this.currentEmployee.id, course.id, true);
            this.enrolledCourseIds.push(course.id);

            this.messageService.add({
                severity: 'info',
                summary: 'Tham gia danh sách chờ',
                detail: `Bạn đã tham gia danh sách chờ cho khóa học "${course.title}"`
            });
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể tham gia danh sách chờ'
            });
        }
    }
}
