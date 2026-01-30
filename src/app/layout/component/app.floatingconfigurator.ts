import { Component, computed, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
    selector: 'app-floating-configurator',
    imports: [CommonModule, ButtonModule, StyleClassModule, AppConfigurator],
    template: `
        <div class="flex gap-4 top-8 right-8" [ngClass]="{ fixed: float() }">
            <p-button type="button" (onClick)="toggleDarkMode()" [rounded]="true" [icon]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'" severity="secondary" />
            <p-button type="button" (onClick)="toggleLanguage()" [rounded]="true" severity="secondary">
                <div class="flex items-center gap-2 px-1">
                    <img [src]="languageService.getCurrentLanguage() === 'vi' ? '/assets/image/flag_VN.png' : '/assets/image/flag_EN.png'" class="w-6 h-4 border border-surface-200 dark:border-surface-700 shadow-sm" [alt]="languageService.getCurrentLanguage()" />
                    <span class="font-bold text-xs">{{ languageService.getCurrentLanguage() === 'vi' ? 'VI' : 'EN' }}</span>
                </div>
            </p-button>
            <div class="relative">
                <p-button icon="pi pi-palette" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true" type="button" rounded />
                <app-configurator />
            </div>
        </div>
    `
})
export class AppFloatingConfigurator {
    LayoutService = inject(LayoutService);
    languageService = inject(LanguageService);

    float = input<boolean>(true);

    isDarkTheme = computed(() => this.LayoutService.layoutConfig().darkTheme);

    toggleDarkMode() {
        this.LayoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    toggleLanguage() {
        const newLang = this.languageService.getCurrentLanguage() === 'vi' ? 'en' : 'vi';
        this.languageService.changeLanguage(newLang);
    }
}
