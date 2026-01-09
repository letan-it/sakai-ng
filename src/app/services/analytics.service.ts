import { Injectable } from '@angular/core';
import { inject } from '@vercel/analytics';

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    constructor() {
        this.initializeAnalytics();
    }

    private initializeAnalytics(): void {
        inject();
    }
}
