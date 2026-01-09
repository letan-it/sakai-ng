import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { RMSData, Job, Candidate, JobWithDetails, CandidateWithDetails, MatchingScore, Hunter, RecruitmentProcess, InterviewRound, CandidateRound, CandidateSkill, CandidateExperience, Skill, JobSkill, CandidateJob } from '@/models/rms.models';

@Injectable({
    providedIn: 'root'
})
export class RMSDataService {
    private dataSubject = new BehaviorSubject<RMSData | null>(null);
    public data$ = this.dataSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadData();
    }

    loadData(): void {
        this.http.get<RMSData>('/assets/data/rms-sample-data.json').subscribe({
            next: (data) => {
                this.dataSubject.next(data);
            },
            error: (error) => {
                console.error('Lỗi khi tải dữ liệu RMS:', error);
            }
        });
    }

    getData(): Observable<RMSData> {
        return this.data$.pipe(map((data) => data!));
    }

    getJobs(): Observable<Job[]> {
        return this.data$.pipe(map((data) => data?.jobs || []));
    }

    getJobById(id: number): Observable<JobWithDetails | undefined> {
        return this.data$.pipe(
            map((data) => {
                if (!data) return undefined;

                const job = data.jobs.find((j) => j.id === id);

                if (!job) return undefined;

                const customer = data.customers.find((c) => c.id === job.customer_id);

                const jobSkills = data.jobSkills.filter((js) => js.job_id === id);
                const skills = jobSkills
                    .map((js) => {
                        const skill = data.skills.find((s) => s.id === js.skill_id);

                        return skill ? { ...skill, importance_level: js.importance_level } : null;
                    })
                    .filter((s) => s !== null);

                const matchingScores = data.matchingScores.filter((ms) => ms.job_id === id);
                const candidates = matchingScores
                    .map((ms) => {
                        const candidate = data.candidates.find((c) => c.id === ms.candidate_id);

                        return candidate ? { ...candidate, matching_score: ms } : null;
                    })
                    .filter((c) => c !== null);

                return {
                    ...job,
                    customer,
                    skills: skills as any,
                    candidates: candidates as any
                };
            })
        );
    }

    getCandidates(): Observable<Candidate[]> {
        return this.data$.pipe(map((data) => data?.candidates || []));
    }

    getCandidateById(id: number): Observable<CandidateWithDetails | undefined> {
        return this.data$.pipe(
            map((data) => {
                if (!data) return undefined;

                const candidate = data.candidates.find((c) => c.id === id);

                if (!candidate) return undefined;

                const candidateSkills = data.candidateSkills.filter((cs) => cs.candidate_id === id);
                const skills = candidateSkills
                    .map((cs) => {
                        const skill = data.skills.find((s) => s.id === cs.skill_id);

                        return skill ? { ...skill, ...cs } : null;
                    })
                    .filter((s) => s !== null);

                const experiences = data.candidateExperiences.filter((ce) => ce.candidate_id === id);

                const matchingScores = data.matchingScores.filter((ms) => ms.candidate_id === id);
                const jobs = matchingScores
                    .map((ms) => {
                        const job = data.jobs.find((j) => j.id === ms.job_id);

                        return job ? { ...job, matching_score: ms } : null;
                    })
                    .filter((j) => j !== null);

                return {
                    ...candidate,
                    skills: skills as any,
                    experiences,
                    jobs: jobs as any
                };
            })
        );
    }

    getMatchingScores(): Observable<MatchingScore[]> {
        return this.data$.pipe(map((data) => data?.matchingScores || []));
    }

    getTopCandidates(limit: number = 5): Observable<Array<Candidate & { overall_score: number }>> {
        return this.data$.pipe(
            map((data) => {
                if (!data) return [];

                const candidatesWithScores = data.matchingScores
                    .map((ms) => {
                        const candidate = data.candidates.find((c) => c.id === ms.candidate_id);

                        return candidate ? { ...candidate, overall_score: ms.overall_score } : null;
                    })
                    .filter((c) => c !== null);

                return candidatesWithScores.sort((a: any, b: any) => b.overall_score - a.overall_score).slice(0, limit) as any;
            })
        );
    }

    getCandidateStatusStats(): Observable<{ [key: string]: number }> {
        return this.data$.pipe(
            map((data) => {
                if (!data) return {};

                const stats: { [key: string]: number } = {
                    Pending: 0,
                    Interviewing: 0,
                    Hired: 0,
                    Rejected: 0
                };

                data.candidates.forEach((c) => {
                    stats[c.status] = (stats[c.status] || 0) + 1;
                });

                return stats;
            })
        );
    }

    getJobStatusStats(): Observable<{ [key: string]: number }> {
        return this.data$.pipe(
            map((data) => {
                if (!data) return {};

                const stats: { [key: string]: number } = {
                    Open: 0,
                    Closed: 0
                };

                data.jobs.forEach((j) => {
                    stats[j.status] = (stats[j.status] || 0) + 1;
                });

                return stats;
            })
        );
    }

    getHunters(): Observable<Hunter[]> {
        return this.data$.pipe(map((data) => data?.hunters || []));
    }

    getHunterWithCandidates(hunterId: number): Observable<any> {
        return this.data$.pipe(
            map((data) => {
                if (!data) return null;

                const hunter = data.hunters.find((h) => h.id === hunterId);

                if (!hunter) return null;

                const candidateJobs = data.candidateJobs.filter((cj) => cj.hunter_id === hunterId);

                const candidates = candidateJobs
                    .map((cj) => {
                        const candidate = data.candidates.find((c) => c.id === cj.candidate_id);
                        const job = data.jobs.find((j) => j.id === cj.job_id);

                        return candidate && job ? { ...candidate, job, status: cj.current_status } : null;
                    })
                    .filter((c) => c !== null);

                return { ...hunter, candidates };
            })
        );
    }

    getRecruitmentProcesses(): Observable<RecruitmentProcess[]> {
        return this.data$.pipe(map((data) => data?.recruitmentProcesses || []));
    }

    getRecruitmentProcessById(id: number): Observable<any> {
        return this.data$.pipe(
            map((data) => {
                if (!data) return null;

                const process = data.recruitmentProcesses.find((rp) => rp.id === id);

                if (!process) return null;

                const candidateJob = data.candidateJobs.find((cj) => cj.id === process.candidate_job_id);

                if (!candidateJob) return null;

                const candidate = data.candidates.find((c) => c.id === candidateJob.candidate_id);
                const job = data.jobs.find((j) => j.id === candidateJob.job_id);

                const interviewRounds = data.interviewRounds.filter((ir) => ir.recruitment_process_id === id);

                const roundsWithResults = interviewRounds.map((ir) => {
                    const candidateRound = data.candidateRounds.find((cr) => cr.interview_round_id === ir.id && cr.candidate_id === candidateJob.candidate_id);

                    return { ...ir, result: candidateRound };
                });

                return {
                    ...process,
                    candidate,
                    job,
                    rounds: roundsWithResults
                };
            })
        );
    }

    getCandidateInterviewRounds(candidateId: number): Observable<CandidateRound[]> {
        return this.data$.pipe(map((data) => data?.candidateRounds.filter((cr) => cr.candidate_id === candidateId) || []));
    }

    // ========== CRUD Operations for Jobs ==========

    createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const newId = Math.max(...data.jobs.map((j) => j.id), 0) + 1;
        const now = new Date().toISOString();
        const newJob: Job = {
            ...job,
            id: newId,
            created_at: now,
            updated_at: now
        };

        data.jobs.push(newJob);
        this.dataSubject.next({ ...data });
    }

    updateJob(id: number, updates: Partial<Job>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const index = data.jobs.findIndex((j) => j.id === id);

        if (index !== -1) {
            data.jobs[index] = {
                ...data.jobs[index],
                ...updates,
                updated_at: new Date().toISOString()
            };
            this.dataSubject.next({ ...data });
        }
    }

    deleteJob(id: number): void {
        const data = this.dataSubject.value;

        if (!data) return;

        data.jobs = data.jobs.filter((j) => j.id !== id);
        data.jobSkills = data.jobSkills.filter((js) => js.job_id !== id);
        data.matchingScores = data.matchingScores.filter((ms) => ms.job_id !== id);
        data.candidateJobs = data.candidateJobs.filter((cj) => cj.job_id !== id);
        this.dataSubject.next({ ...data });
    }

    // ========== CRUD Operations for Candidates ==========

    createCandidate(candidate: Omit<Candidate, 'id' | 'created_at' | 'updated_at'>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const newId = Math.max(...data.candidates.map((c) => c.id), 0) + 1;
        const now = new Date().toISOString();
        const newCandidate: Candidate = {
            ...candidate,
            id: newId,
            created_at: now,
            updated_at: now
        };

        data.candidates.push(newCandidate);
        this.dataSubject.next({ ...data });
    }

    updateCandidate(id: number, updates: Partial<Candidate>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const index = data.candidates.findIndex((c) => c.id === id);

        if (index !== -1) {
            data.candidates[index] = {
                ...data.candidates[index],
                ...updates,
                updated_at: new Date().toISOString()
            };
            this.dataSubject.next({ ...data });
        }
    }

    deleteCandidate(id: number): void {
        const data = this.dataSubject.value;

        if (!data) return;

        data.candidates = data.candidates.filter((c) => c.id !== id);
        data.candidateSkills = data.candidateSkills.filter((cs) => cs.candidate_id !== id);
        data.candidateExperiences = data.candidateExperiences.filter((ce) => ce.candidate_id !== id);
        data.matchingScores = data.matchingScores.filter((ms) => ms.candidate_id !== id);
        data.candidateJobs = data.candidateJobs.filter((cj) => cj.candidate_id !== id);
        data.candidateRounds = data.candidateRounds.filter((cr) => cr.candidate_id !== id);
        this.dataSubject.next({ ...data });
    }

    // ========== CRUD Operations for Candidate Skills ==========

    addCandidateSkill(candidateSkill: Omit<CandidateSkill, 'id' | 'created_at'>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const newId = Math.max(...data.candidateSkills.map((cs) => cs.id), 0) + 1;
        const newSkill: CandidateSkill & { created_at: string } = {
            ...candidateSkill,
            id: newId,
            created_at: new Date().toISOString()
        };

        data.candidateSkills.push(newSkill as any);
        this.dataSubject.next({ ...data });
    }

    removeCandidateSkill(id: number): void {
        const data = this.dataSubject.value;

        if (!data) return;

        data.candidateSkills = data.candidateSkills.filter((cs) => cs.id !== id);
        this.dataSubject.next({ ...data });
    }

    // ========== CRUD Operations for Candidate Experiences ==========

    addCandidateExperience(experience: Omit<CandidateExperience, 'id' | 'created_at'>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const newId = Math.max(...data.candidateExperiences.map((ce) => ce.id), 0) + 1;
        const newExperience: CandidateExperience & { created_at: string } = {
            ...experience,
            id: newId,
            created_at: new Date().toISOString()
        };

        data.candidateExperiences.push(newExperience as any);
        this.dataSubject.next({ ...data });
    }

    updateCandidateExperience(id: number, updates: Partial<CandidateExperience>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const index = data.candidateExperiences.findIndex((ce) => ce.id === id);

        if (index !== -1) {
            data.candidateExperiences[index] = {
                ...data.candidateExperiences[index],
                ...updates
            };
            this.dataSubject.next({ ...data });
        }
    }

    deleteCandidateExperience(id: number): void {
        const data = this.dataSubject.value;

        if (!data) return;

        data.candidateExperiences = data.candidateExperiences.filter((ce) => ce.id !== id);
        this.dataSubject.next({ ...data });
    }

    // ========== CRUD Operations for Hunters ==========

    createHunter(hunter: Omit<Hunter, 'id' | 'created_at' | 'updated_at'>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const newId = Math.max(...data.hunters.map((h) => h.id), 0) + 1;
        const now = new Date().toISOString();
        const newHunter: Hunter = {
            ...hunter,
            id: newId,
            created_at: now,
            updated_at: now
        };

        data.hunters.push(newHunter);
        this.dataSubject.next({ ...data });
    }

    updateHunter(id: number, updates: Partial<Hunter>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const index = data.hunters.findIndex((h) => h.id === id);

        if (index !== -1) {
            data.hunters[index] = {
                ...data.hunters[index],
                ...updates,
                updated_at: new Date().toISOString()
            };
            this.dataSubject.next({ ...data });
        }
    }

    deleteHunter(id: number): void {
        const data = this.dataSubject.value;

        if (!data) return;

        data.hunters = data.hunters.filter((h) => h.id !== id);
        this.dataSubject.next({ ...data });
    }

    // ========== CRUD Operations for Interview Rounds ==========

    createInterviewRound(round: Omit<InterviewRound, 'id' | 'created_at'>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const newId = Math.max(...data.interviewRounds.map((ir) => ir.id), 0) + 1;
        const newRound: InterviewRound & { created_at: string } = {
            ...round,
            id: newId,
            created_at: new Date().toISOString()
        };

        data.interviewRounds.push(newRound as any);
        this.dataSubject.next({ ...data });
    }

    updateInterviewRound(id: number, updates: Partial<InterviewRound>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const index = data.interviewRounds.findIndex((ir) => ir.id === id);

        if (index !== -1) {
            data.interviewRounds[index] = {
                ...data.interviewRounds[index],
                ...updates
            };
            this.dataSubject.next({ ...data });
        }
    }

    deleteInterviewRound(id: number): void {
        const data = this.dataSubject.value;

        if (!data) return;

        data.interviewRounds = data.interviewRounds.filter((ir) => ir.id !== id);
        data.candidateRounds = data.candidateRounds.filter((cr) => cr.interview_round_id !== id);
        this.dataSubject.next({ ...data });
    }

    // ========== Update Candidate Round Result ==========

    updateCandidateRound(candidateId: number, roundId: number, updates: Partial<CandidateRound>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const index = data.candidateRounds.findIndex((cr) => cr.candidate_id === candidateId && cr.interview_round_id === roundId);

        if (index !== -1) {
            data.candidateRounds[index] = {
                ...data.candidateRounds[index],
                ...updates,
                evaluated_at: new Date().toISOString()
            };
        } else {
            const newId = Math.max(...data.candidateRounds.map((cr) => cr.id), 0) + 1;
            const newRound: CandidateRound & { created_at: string } = {
                id: newId,
                candidate_id: candidateId,
                interview_round_id: roundId,
                attendance_status: 'Scheduled',
                score: null,
                feedback: null,
                outcome: 'Pending',
                evaluated_at: null,
                created_at: new Date().toISOString(),
                ...updates
            };

            data.candidateRounds.push(newRound as any);
        }

        this.dataSubject.next({ ...data });
    }

    // ========== Helper Methods ==========

    getSkills(): Observable<Skill[]> {
        return this.data$.pipe(map((data) => data?.skills || []));
    }

    addJobSkill(jobSkill: Omit<JobSkill, 'id' | 'created_at'>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const newId = Math.max(...data.jobSkills.map((js) => js.id), 0) + 1;
        const newJobSkill: JobSkill & { created_at: string } = {
            ...jobSkill,
            id: newId,
            created_at: new Date().toISOString()
        };

        data.jobSkills.push(newJobSkill as any);
        this.dataSubject.next({ ...data });
    }

    removeJobSkill(id: number): void {
        const data = this.dataSubject.value;

        if (!data) return;

        data.jobSkills = data.jobSkills.filter((js) => js.id !== id);
        this.dataSubject.next({ ...data });
    }

    // ========== CRUD Operations for CandidateJobs ==========

    getCandidateJobs(): Observable<CandidateJob[]> {
        return this.data$.pipe(map((data) => data?.candidateJobs || []));
    }

    getCandidateJobsByJobId(jobId: number): Observable<CandidateJob[]> {
        return this.data$.pipe(map((data) => data?.candidateJobs.filter((cj) => cj.job_id === jobId) || []));
    }

    getCandidateJobsByCandidateId(candidateId: number): Observable<CandidateJob[]> {
        return this.data$.pipe(map((data) => data?.candidateJobs.filter((cj) => cj.candidate_id === candidateId) || []));
    }

    addCandidateToJob(candidateJob: Omit<CandidateJob, 'id'>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const newId = data.candidateJobs.length > 0 ? Math.max(...data.candidateJobs.map((cj) => cj.id)) + 1 : 1;
        const newCandidateJob: CandidateJob = {
            ...candidateJob,
            id: newId
        };

        data.candidateJobs.push(newCandidateJob);
        this.dataSubject.next({ ...data });
    }

    updateCandidateJob(id: number, updates: Partial<CandidateJob>): void {
        const data = this.dataSubject.value;

        if (!data) return;

        const index = data.candidateJobs.findIndex((cj) => cj.id === id);

        if (index !== -1) {
            data.candidateJobs[index] = {
                ...data.candidateJobs[index],
                ...updates
            };
            this.dataSubject.next({ ...data });
        }
    }

    removeCandidateJob(id: number): void {
        const data = this.dataSubject.value;

        if (!data) return;

        data.candidateJobs = data.candidateJobs.filter((cj) => cj.id !== id);
        this.dataSubject.next({ ...data });
    }

    // Kiểm tra xem candidate đã được thêm vào job chưa
    isCandidateInJob(candidateId: number, jobId: number): Observable<boolean> {
        return this.data$.pipe(
            map((data) => {
                if (!data) return false;

                return data.candidateJobs.some((cj) => cj.candidate_id === candidateId && cj.job_id === jobId);
            })
        );
    }
}
