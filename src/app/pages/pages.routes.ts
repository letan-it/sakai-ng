import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Recruitment } from './recruitment/recruitment';
import { CccdScanner } from './cccd/cccd';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'recruitment', component: Recruitment },
    { path: 'empty', component: Empty },
    { path: 'cccd', component: CccdScanner },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
