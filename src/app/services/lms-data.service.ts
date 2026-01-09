import { Injectable } from '@angular/core';
import { Employee, Competency, EmployeeCompetency, Course, CourseEnrollment, CareerPath, LMSData } from '@/models/lms.models';

@Injectable({
    providedIn: 'root'
})
export class LMSDataService {
    private mockData: LMSData;

    constructor() {
        this.mockData = this.generateMockData();
    }

    private generateMockData(): LMSData {
        const employees: Employee[] = [
            {
                id: 1,
                name: 'Nguyễn Văn An',
                email: 'nguyen.van.an@company.com',
                department: 'Phát triển Phần mềm',
                position: 'Senior Developer',
                joinDate: '2020-03-15'
            },
            {
                id: 2,
                name: 'Trần Thị Bình',
                email: 'tran.thi.binh@company.com',
                department: 'Marketing',
                position: 'Marketing Manager',
                joinDate: '2019-06-01'
            }
        ];

        const competencies: Competency[] = [
            { id: 1, name: 'Angular Framework', category: 'Kỹ thuật', description: 'Kiến thức và kỹ năng về Angular framework', requiredLevel: 4 },
            { id: 2, name: 'TypeScript', category: 'Kỹ thuật', description: 'Lập trình TypeScript nâng cao', requiredLevel: 4 },
            { id: 3, name: 'RxJS', category: 'Kỹ thuật', description: 'Reactive Programming với RxJS', requiredLevel: 3 },
            { id: 4, name: 'Quản lý Dự án', category: 'Quản lý', description: 'Kỹ năng quản lý và điều phối dự án', requiredLevel: 3 },
            { id: 5, name: 'Giao tiếp', category: 'Mềm', description: 'Kỹ năng giao tiếp và làm việc nhóm', requiredLevel: 4 },
            { id: 6, name: 'Lãnh đạo', category: 'Mềm', description: 'Kỹ năng lãnh đạo và truyền cảm hứng', requiredLevel: 3 },
            { id: 7, name: 'Cloud Architecture', category: 'Kỹ thuật', description: 'Thiết kế và triển khai giải pháp Cloud', requiredLevel: 4 },
            { id: 8, name: 'DevOps', category: 'Kỹ thuật', description: 'CI/CD và tự động hóa', requiredLevel: 3 }
        ];

        const employeeCompetencies: EmployeeCompetency[] = [
            { id: 1, employeeId: 1, competencyId: 1, currentLevel: 3, targetLevel: 4, gap: 1, lastAssessed: '2024-12-01' },
            { id: 2, employeeId: 1, competencyId: 2, currentLevel: 4, targetLevel: 4, gap: 0, lastAssessed: '2024-12-01' },
            { id: 3, employeeId: 1, competencyId: 3, currentLevel: 2, targetLevel: 3, gap: 1, lastAssessed: '2024-12-01' },
            { id: 4, employeeId: 1, competencyId: 4, currentLevel: 2, targetLevel: 3, gap: 1, lastAssessed: '2024-12-01' },
            { id: 5, employeeId: 1, competencyId: 7, currentLevel: 1, targetLevel: 4, gap: 3, lastAssessed: '2024-12-01' },
            { id: 6, employeeId: 1, competencyId: 8, currentLevel: 2, targetLevel: 3, gap: 1, lastAssessed: '2024-12-01' }
        ];

        const courses: Course[] = [
            {
                id: 1,
                title: 'Angular Advanced Patterns',
                description: 'Học các pattern nâng cao trong Angular: State Management, Architecture, Performance Optimization',
                duration: '6 tuần',
                format: 'Online',
                status: 'Available',
                instructor: 'Phạm Minh Tuấn',
                startDate: '2025-02-01',
                endDate: '2025-03-15',
                competencyIds: [1, 2],
                maxParticipants: 30,
                currentParticipants: 12
            },
            {
                id: 2,
                title: 'RxJS Mastery',
                description: 'Làm chủ RxJS: Operators, Subjects, Error Handling và Testing',
                duration: '4 tuần',
                format: 'Online',
                status: 'Available',
                instructor: 'Lê Thị Hương',
                startDate: '2025-02-10',
                endDate: '2025-03-10',
                competencyIds: [3],
                maxParticipants: 25,
                currentParticipants: 8
            },
            {
                id: 3,
                title: 'Project Management Fundamentals',
                description: 'Khóa học cơ bản về quản lý dự án: Planning, Execution, Monitoring & Control',
                duration: '3 ngày',
                format: 'Offline',
                status: 'Available',
                instructor: 'Nguyễn Đức Anh',
                startDate: '2025-02-20',
                competencyIds: [4],
                maxParticipants: 20,
                currentParticipants: 18
            },
            {
                id: 4,
                title: 'Cloud Architecture Workshop',
                description: 'Workshop thực hành thiết kế kiến trúc Cloud trên AWS và Azure',
                duration: '5 ngày',
                format: 'Offline',
                status: 'Full',
                instructor: 'Trần Văn Hùng',
                startDate: '2025-03-01',
                competencyIds: [7],
                maxParticipants: 15,
                currentParticipants: 15
            },
            {
                id: 5,
                title: 'DevOps Bootcamp',
                description: 'Bootcamp toàn diện về DevOps: Docker, Kubernetes, CI/CD Pipelines',
                duration: '8 tuần',
                format: 'Hybrid',
                status: 'Available',
                instructor: 'Hoàng Minh Khôi',
                startDate: '2025-03-15',
                competencyIds: [8],
                maxParticipants: 20,
                currentParticipants: 5
            },
            {
                id: 6,
                title: 'Leadership Skills',
                description: 'Phát triển kỹ năng lãnh đạo và quản lý đội nhóm hiệu quả',
                duration: '2 ngày',
                format: 'Offline',
                status: 'Upcoming',
                instructor: 'Võ Thị Mai',
                startDate: '2025-04-01',
                competencyIds: [6],
                maxParticipants: 25,
                currentParticipants: 0
            }
        ];

        const courseEnrollments: CourseEnrollment[] = [
            { id: 1, employeeId: 1, courseId: 1, enrollmentDate: '2024-12-15', status: 'Registered' },
            { id: 2, employeeId: 1, courseId: 2, enrollmentDate: '2024-12-20', status: 'Registered' }
        ];

        const careerPaths: CareerPath[] = [
            {
                id: 1,
                name: 'Software Developer Career Path',
                description: 'Lộ trình phát triển nghề nghiệp cho Software Developer',
                positions: [
                    {
                        id: 1,
                        title: 'Junior Developer',
                        level: 1,
                        requiredCompetencies: [
                            { competencyId: 1, minimumLevel: 2 },
                            { competencyId: 2, minimumLevel: 2 }
                        ]
                    },
                    {
                        id: 2,
                        title: 'Senior Developer',
                        level: 2,
                        requiredCompetencies: [
                            { competencyId: 1, minimumLevel: 4 },
                            { competencyId: 2, minimumLevel: 4 },
                            { competencyId: 3, minimumLevel: 3 }
                        ]
                    },
                    {
                        id: 3,
                        title: 'Tech Lead',
                        level: 3,
                        requiredCompetencies: [
                            { competencyId: 1, minimumLevel: 4 },
                            { competencyId: 2, minimumLevel: 4 },
                            { competencyId: 3, minimumLevel: 4 },
                            { competencyId: 4, minimumLevel: 3 },
                            { competencyId: 6, minimumLevel: 3 }
                        ]
                    },
                    {
                        id: 4,
                        title: 'Engineering Manager',
                        level: 4,
                        requiredCompetencies: [
                            { competencyId: 4, minimumLevel: 4 },
                            { competencyId: 5, minimumLevel: 4 },
                            { competencyId: 6, minimumLevel: 4 },
                            { competencyId: 7, minimumLevel: 4 }
                        ]
                    }
                ]
            }
        ];

        return {
            employees,
            competencies,
            employeeCompetencies,
            courses,
            courseEnrollments,
            careerPaths
        };
    }

    getEmployeeById(id: number): Employee | undefined {
        return this.mockData.employees.find((e) => e.id === id);
    }

    getEmployeeCompetencies(employeeId: number): EmployeeCompetency[] {
        return this.mockData.employeeCompetencies.filter((ec) => ec.employeeId === employeeId);
    }

    getCompetencyById(id: number): Competency | undefined {
        return this.mockData.competencies.find((c) => c.id === id);
    }

    getCourses(): Course[] {
        return this.mockData.courses;
    }

    getCoursesForCompetency(competencyId: number): Course[] {
        return this.mockData.courses.filter((c) => c.competencyIds.includes(competencyId));
    }

    getEmployeeEnrollments(employeeId: number): CourseEnrollment[] {
        return this.mockData.courseEnrollments.filter((e) => e.employeeId === employeeId);
    }

    getCareerPath(id: number): CareerPath | undefined {
        return this.mockData.careerPaths.find((cp) => cp.id === id);
    }

    enrollCourse(employeeId: number, courseId: number, isWaitlist: boolean = false): CourseEnrollment {
        const enrollment: CourseEnrollment = {
            id: this.mockData.courseEnrollments.length + 1,
            employeeId,
            courseId,
            enrollmentDate: new Date().toISOString(),
            status: isWaitlist ? 'Waitlist' : 'Registered'
        };

        this.mockData.courseEnrollments.push(enrollment);

        // Update course participant count
        const course = this.mockData.courses.find((c) => c.id === courseId);

        if (course && course.currentParticipants !== undefined) {
            course.currentParticipants++;
        }

        return enrollment;
    }

    isEnrolled(employeeId: number, courseId: number): boolean {
        return this.mockData.courseEnrollments.some((e) => e.employeeId === employeeId && e.courseId === courseId && (e.status === 'Registered' || e.status === 'Waitlist'));
    }
}
