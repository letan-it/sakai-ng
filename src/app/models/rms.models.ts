export interface Customer {
    id: number;
    name: string;
    industry: string;
    location: string;
    contact_email: string;
    contact_phone: string;
    created_at: string;
    updated_at: string;
}

export interface Job {
    id: number;
    customer_id: number;
    title: string;
    description: string;
    location: string;
    salary_min: number;
    salary_max: number;
    education_level: string;
    experience_min: number;
    experience_max: number;
    status: 'Open' | 'Closed';
    created_at: string;
    updated_at: string;
}

export interface Skill {
    id: number;
    name: string;
    category: string;
    created_at: string;
}

export interface JobSkill {
    id: number;
    job_id: number;
    skill_id: number;
    importance_level: number;
}

export interface Candidate {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    cv_link: string;
    location: string;
    current_position: string;
    status: 'Pending' | 'Interviewing' | 'Hired' | 'Rejected';
    created_at: string;
    updated_at: string;
}

export interface CandidateSkill {
    id: number;
    candidate_id: number;
    skill_id: number;
    proficiency_level: number;
    years_of_experience: number;
}

export interface CandidateExperience {
    id: number;
    candidate_id: number;
    company_name: string;
    position: string;
    start_date: string;
    end_date: string | null;
    description: string;
}

export interface Hunter {
    id: number;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    created_at: string;
    updated_at: string;
}

export interface CandidateJob {
    id: number;
    candidate_id: number;
    job_id: number;
    hunter_id: number;
    applied_date: string;
    current_status: 'Applied' | 'Screening' | 'Interviewing' | 'Offered' | 'Hired' | 'Rejected';
}

export interface MatchingScore {
    id: number;
    candidate_id: number;
    job_id: number;
    overall_score: number;
    skill_match_score: number;
    experience_match_score: number;
    education_match_score: number;
    calculated_at: string;
}

export interface RecruitmentProcess {
    id: number;
    candidate_job_id: number;
    process_name: string;
    status: 'In Progress' | 'Completed' | 'Cancelled';
    started_at: string;
    completed_at: string | null;
}

export interface InterviewRound {
    id: number;
    recruitment_process_id: number;
    round_number: number;
    round_name: string;
    interviewer_name: string;
    scheduled_date: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface CandidateRound {
    id: number;
    candidate_id: number;
    interview_round_id: number;
    attendance_status: 'Scheduled' | 'Attended' | 'No-show' | 'Cancelled';
    score: number | null;
    feedback: string | null;
    outcome: 'Pass' | 'Fail' | 'Pending';
    evaluated_at: string | null;
}

export interface RMSData {
    customers: Customer[];
    jobs: Job[];
    skills: Skill[];
    jobSkills: JobSkill[];
    candidates: Candidate[];
    candidateSkills: CandidateSkill[];
    candidateExperiences: CandidateExperience[];
    hunters: Hunter[];
    candidateJobs: CandidateJob[];
    matchingScores: MatchingScore[];
    recruitmentProcesses: RecruitmentProcess[];
    interviewRounds: InterviewRound[];
    candidateRounds: CandidateRound[];
}

export interface JobWithDetails extends Job {
    customer?: Customer;
    skills?: Array<Skill & { importance_level: number }>;
    candidates?: Array<Candidate & { matching_score: MatchingScore }>;
}

export interface CandidateWithDetails extends Candidate {
    skills?: Array<Skill & CandidateSkill>;
    experiences?: CandidateExperience[];
    jobs?: Array<Job & { matching_score: MatchingScore }>;
}
