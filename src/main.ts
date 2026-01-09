import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { AnalyticsService } from './app/services/analytics.service';

// Initialize analytics on app startup
new AnalyticsService();

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
