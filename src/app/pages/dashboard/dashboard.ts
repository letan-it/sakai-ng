import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SearchWidget } from './components/searchwidget';
import { WorkStatsWidget } from './components/workstatswidget';
import { AppIconsWidget } from './components/appiconswidget';

@Component({
    selector: 'app-dashboard',
    imports: [ToastModule, SearchWidget, WorkStatsWidget, AppIconsWidget],
    providers: [MessageService],
    template: `
        <p-toast position="bottom-right" />
        <div class="grid grid-cols-12 gap-6">
            <app-search-widget class="contents" />

            <app-icons-widget class="contents" />
        </div>
    `
})
export class Dashboard {}
