import { Routes } from '@angular/router';
import { RMSDashboard } from './rms-dashboard';
import { JobsList } from './jobs-list';
import { JobDetail } from './job-detail';
import { CandidatesList } from './candidates-list';
import { CandidateProfile } from './candidate-profile';
import { ProcessesList } from './processes-list';
import { ProcessDetail } from './process-detail';
import { HuntersManagement } from './hunters-management';

export default [
    { path: '', component: RMSDashboard },
    { path: 'jobs', component: JobsList },
    { path: 'jobs/:id', component: JobDetail },
    { path: 'candidates', component: CandidatesList },
    { path: 'candidates/:id', component: CandidateProfile },
    { path: 'processes', component: ProcessesList },
    { path: 'processes/:id', component: ProcessDetail },
    { path: 'hunters', component: HuntersManagement }
] as Routes;
