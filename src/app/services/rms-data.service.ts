import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { RMSData, Job, Candidate, JobWithDetails, CandidateWithDetails, MatchingScore, Hunter, RecruitmentProcess, InterviewRound, CandidateRound } from '@/models/rms.models';

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
                const skills = jobSkills.map((js) => {
                    const skill = data.skills.find((s) => s.id === js.skill_id);

                    return skill ? { ...skill, importance_level: js.importance_level } : null;
                }).filter((s) => s !== null);

                const matchingScores = data.matchingScores.filter((ms) => ms.job_id === id);
                const candidates = matchingScores.map((ms) => {
                    const candidate = data.candidates.find((c) => c.id === ms.candidate_id);

                    return candidate ? { ...candidate, matching_score: ms } : null;
                }).filter((c) => c !== null);

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
                const skills = candidateSkills.map((cs) => {
                    const skill = data.skills.find((s) => s.id === cs.skill_id);

                    return skill ? { ...skill, ...cs } : null;
                }).filter((s) => s !== null);

                const experiences = data.candidateExperiences.filter((ce) => ce.candidate_id === id);

                const matchingScores = data.matchingScores.filter((ms) => ms.candidate_id === id);
                const jobs = matchingScores.map((ms) => {
                    const job = data.jobs.find((j) => j.id === ms.job_id);

                    return job ? { ...job, matching_score: ms } : null;
                }).filter((j) => j !== null);

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

                const candidatesWithScores = data.matchingScores.map((ms) => {
                    const candidate = data.candidates.find((c) => c.id === ms.candidate_id);

                    return candidate ? { ...candidate, overall_score: ms.overall_score } : null;
                }).filter((c) => c !== null);

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

                const candidates = candidateJobs.map((cj) => {
                    const candidate = data.candidates.find((c) => c.id === cj.candidate_id);
                    const job = data.jobs.find((j) => j.id === cj.job_id);

                    return candidate && job ? { ...candidate, job, status: cj.current_status } : null;
                }).filter((c) => c !== null);

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
}
