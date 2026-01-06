import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';

@Component({
    selector: 'hero-widget',
    imports: [ButtonModule, RippleModule],
    template: `
        <div id="hero" class="relative flex flex-col pt-24 pb-12 px-6 lg:px-20 overflow-hidden" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 600px;">
            <div
                class="absolute inset-0 opacity-10"
                style="background-image: url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"
            ></div>

            <div class="relative z-10 mx-auto max-w-7xl text-center">
                <div class="mb-6">
                    <span class="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm"> Phiên bản 20.0.0 - Angular 20 & PrimeNG 20 </span>
                </div>
                <h1 class="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in">
                    Xây dựng ứng dụng
                    <span class="block bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">hiện đại & mạnh mẽ</span>
                </h1>
                <p class="font-normal text-xl md:text-2xl leading-relaxed text-white/90 max-w-3xl mx-auto mb-8">
                    Sakai-NG là template Angular hiện đại với PrimeNG, Tailwind CSS và thiết kế responsive. Bắt đầu dự án của bạn với foundation mạnh mẽ và UI components đẹp mắt.
                </p>
                <div class="flex gap-4 justify-center items-center flex-wrap">
                    <button
                        pButton
                        pRipple
                        [rounded]="true"
                        type="button"
                        label="Bắt đầu ngay"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        class="text-xl! px-8! py-3! bg-white! text-purple-700! hover:bg-gray-100! shadow-lg! hover:shadow-xl! transition-all! duration-300!"
                        (click)="navigateToDashboard()"
                    ></button>
                    <button pButton pRipple [rounded]="true" [outlined]="true" type="button" label="Xem Demo" icon="pi pi-play" class="text-xl! px-8! py-3! border-white! text-white! hover:bg-white/10! transition-all! duration-300!"></button>
                </div>
            </div>

            <div class="relative z-10 mt-16 mx-auto max-w-6xl">
                <div class="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-2 border border-white/20">
                    <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-white">
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div class="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">20+</div>
                                <div class="text-sm text-gray-400 mt-2">UI Components</div>
                            </div>
                            <div>
                                <div class="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">100%</div>
                                <div class="text-sm text-gray-400 mt-2">Responsive</div>
                            </div>
                            <div>
                                <div class="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">Dark</div>
                                <div class="text-sm text-gray-400 mt-2">Mode Ready</div>
                            </div>
                            <div>
                                <div class="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">Fast</div>
                                <div class="text-sm text-gray-400 mt-2">Performance</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface-0 dark:from-surface-900 to-transparent"></div>
        </div>
    `
})
export class HeroWidget {
    constructor(private router: Router) {}

    navigateToDashboard() {
        this.router.navigate(['/']);
    }
}
