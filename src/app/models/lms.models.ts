// LMS (Learning Management System) Data Models

export interface Employee {
    id: number;
    name: string;
    email: string;
    department: string;
    position: string;
    avatar?: string;
    joinDate: string;
}

export interface Competency {
    id: number;
    name: string;
    category: string;
    description: string;
    requiredLevel: number; // 1-5
}

export interface EmployeeCompetency {
    id: number;
    employeeId: number;
    competencyId: number;
    currentLevel: number; // 1-5
    targetLevel: number; // 1-5
    gap: number; // targetLevel - currentLevel
    lastAssessed: string;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    duration: string;
    format: 'Online' | 'Offline' | 'Hybrid';
    status: 'Available' | 'Full' | 'Upcoming';
    instructor: string;
    startDate: string;
    endDate?: string;
    competencyIds: number[]; // Competencies covered by this course
    maxParticipants?: number;
    currentParticipants?: number;
    thumbnail?: string;
}

export interface CourseEnrollment {
    id: number;
    employeeId: number;
    courseId: number;
    enrollmentDate: string;
    status: 'Registered' | 'Waitlist' | 'Completed' | 'In Progress' | 'Cancelled';
    completionDate?: string;
    score?: number;
}

export interface CareerPath {
    id: number;
    name: string;
    description: string;
    positions: CareerPosition[];
}

export interface CareerPosition {
    id: number;
    title: string;
    level: number;
    requiredCompetencies: Array<{
        competencyId: number;
        minimumLevel: number;
    }>;
}

export interface LMSData {
    employees: Employee[];
    competencies: Competency[];
    employeeCompetencies: EmployeeCompetency[];
    courses: Course[];
    courseEnrollments: CourseEnrollment[];
    careerPaths: CareerPath[];
}

export interface EmployeeWithDetails extends Employee {
    competencies?: Array<EmployeeCompetency & { competency: Competency }>;
    enrollments?: Array<CourseEnrollment & { course: Course }>;
    careerPath?: CareerPath;
}
