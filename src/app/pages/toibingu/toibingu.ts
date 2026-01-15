import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';

@Component({
    selector: 'app-toibingu',
    standalone: true,
    imports: [CommonModule, ButtonModule, RippleModule],
    template: `
        <div class="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-yellow-300 overflow-hidden relative">
            <!-- Background animated patterns -->
            <div class="absolute inset-0 opacity-20">
                <div class="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-bounce" style="animation-delay: 0s; animation-duration: 3s;"></div>
                <div class="absolute top-40 right-20 w-24 h-24 bg-yellow-200 rounded-full animate-bounce" style="animation-delay: 0.5s; animation-duration: 2.5s;"></div>
                <div class="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-200 rounded-full animate-bounce" style="animation-delay: 1s; animation-duration: 3.5s;"></div>
                <div class="absolute bottom-40 right-1/3 w-28 h-28 bg-purple-200 rounded-full animate-bounce" style="animation-delay: 1.5s; animation-duration: 2s;"></div>
            </div>

            <!-- Main content -->
            <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
                <!-- Badge -->
                <div class="mb-8 animate-pulse">
                    <span class="inline-block bg-white/80 text-purple-700 px-6 py-3 rounded-full text-lg font-bold shadow-lg backdrop-blur-sm border-4 border-yellow-300"> 🎉 Trang Web Vui Nhộn 🎉 </span>
                </div>

                <!-- Main meme text -->
                <div class="text-center mb-8">
                    <h1 class="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-4 animate-wiggle" style="text-shadow: 4px 4px 0 #ff00ff, 8px 8px 0 #00ffff, 12px 12px 0 #ffff00;">TÔI BỊ NGU</h1>
                    <div class="text-3xl md:text-4xl font-bold text-yellow-300 mb-4" style="text-shadow: 2px 2px 0 #000;">😂 Nhưng tôi vui! 😂</div>
                </div>

                <!-- Fun emoji grid -->
                <div class="grid grid-cols-4 md:grid-cols-8 gap-4 mb-12 max-w-4xl">
                    <div class="text-4xl md:text-6xl animate-spin-slow" style="animation-duration: 3s;">🤪</div>
                    <div class="text-4xl md:text-6xl animate-bounce" style="animation-delay: 0.1s;">😜</div>
                    <div class="text-4xl md:text-6xl animate-pulse" style="animation-delay: 0.2s;">🥴</div>
                    <div class="text-4xl md:text-6xl animate-wiggle" style="animation-delay: 0.3s;">😵</div>
                    <div class="text-4xl md:text-6xl animate-bounce" style="animation-delay: 0.4s;">🤡</div>
                    <div class="text-4xl md:text-6xl animate-spin-slow" style="animation-delay: 0.5s; animation-duration: 2.5s;">🎭</div>
                    <div class="text-4xl md:text-6xl animate-pulse" style="animation-delay: 0.6s;">🎪</div>
                    <div class="text-4xl md:text-6xl animate-wiggle" style="animation-delay: 0.7s;">🎨</div>
                </div>

                <!-- Fun stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto mb-12">
                    <div class="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 transform hover:scale-110 transition-all duration-300 border-4 border-pink-300">
                        <div class="text-5xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">100%</div>
                        <div class="text-sm font-bold text-gray-700 mt-2">Độ Vui</div>
                    </div>
                    <div class="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 transform hover:scale-110 transition-all duration-300 border-4 border-yellow-300">
                        <div class="text-5xl font-black bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">∞</div>
                        <div class="text-sm font-bold text-gray-700 mt-2">Độ Hài</div>
                    </div>
                    <div class="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 transform hover:scale-110 transition-all duration-300 border-4 border-purple-300">
                        <div class="text-5xl font-black bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">999</div>
                        <div class="text-sm font-bold text-gray-700 mt-2">IQ Âm</div>
                    </div>
                    <div class="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 transform hover:scale-110 transition-all duration-300 border-4 border-green-300">
                        <div class="text-5xl font-black bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">😎</div>
                        <div class="text-sm font-bold text-gray-700 mt-2">Cool Hết Ý</div>
                    </div>
                </div>

                <!-- Fun messages -->
                <div class="max-w-3xl mx-auto mb-12">
                    <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-4 border-dashed border-purple-400">
                        <p class="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">🌟 Đừng lo lắng! 🌟</p>
                        <p class="text-lg md:text-xl text-gray-700 text-center leading-relaxed">
                            Dù bạn có <span class="font-black text-pink-600">NGU</span> hay không thì cuộc sống vẫn phải <span class="font-black text-yellow-600">VUI VẺ</span> và <span class="font-black text-purple-600">HÀI HƯỚC</span>! Hãy cười thật
                            nhiều và tận hưởng mỗi khoảnh khắc! 😄
                        </p>
                    </div>
                </div>

                <!-- Action buttons -->
                <div class="flex gap-6 justify-center items-center flex-wrap">
                    <button
                        pButton
                        pRipple
                        [rounded]="true"
                        type="button"
                        label="Về Trang Chủ 🏠"
                        icon="pi pi-home"
                        class="text-2xl! px-8! py-4! bg-gradient-to-r! from-pink-500! to-purple-600! text-white! hover:from-pink-600! hover:to-purple-700! shadow-2xl! hover:shadow-3xl! transition-all! duration-300! border-4! border-white! transform! hover:scale-110!"
                        (click)="navigateToHome()"
                    ></button>
                    <button
                        pButton
                        pRipple
                        [rounded]="true"
                        [outlined]="true"
                        type="button"
                        label="Xem Dashboard 📊"
                        icon="pi pi-chart-bar"
                        class="text-2xl! px-8! py-4! border-4! border-white! text-white! bg-white/20! hover:bg-white/30! backdrop-blur-md! transition-all! duration-300! transform! hover:scale-110!"
                        (click)="navigateToDashboard()"
                    ></button>
                </div>

                <!-- Footer fun text -->
                <div class="mt-16 text-center">
                    <p class="text-white text-xl md:text-2xl font-bold" style="text-shadow: 2px 2px 0 #000;">Made with 💜 and lots of 😂 by Team Sakai-NG</p>
                </div>
            </div>

            <!-- Floating elements -->
            <div class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div class="absolute text-6xl animate-float" style="top: 20%; left: 5%; animation-duration: 6s;">🎈</div>
                <div class="absolute text-6xl animate-float" style="top: 60%; right: 10%; animation-duration: 5s; animation-delay: 1s;">🎉</div>
                <div class="absolute text-6xl animate-float" style="bottom: 10%; left: 15%; animation-duration: 7s; animation-delay: 2s;">🎊</div>
                <div class="absolute text-6xl animate-float" style="top: 40%; right: 20%; animation-duration: 5.5s; animation-delay: 0.5s;">✨</div>
            </div>
        </div>

        <style>
            @keyframes wiggle {
                0%,
                100% {
                    transform: rotate(-3deg);
                }
                50% {
                    transform: rotate(3deg);
                }
            }

            @keyframes float {
                0%,
                100% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0.8;
                }
                50% {
                    transform: translateY(-30px) rotate(10deg);
                    opacity: 1;
                }
            }

            @keyframes spin-slow {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }

            .animate-wiggle {
                animation: wiggle 1s ease-in-out infinite;
            }

            .animate-float {
                animation: float 6s ease-in-out infinite;
            }

            .animate-spin-slow {
                animation: spin-slow 3s linear infinite;
            }
        </style>
    `
})
export class ToiBiNgu {
    constructor(private router: Router) {}

    navigateToHome() {
        this.router.navigate(['/landing']);
    }

    navigateToDashboard() {
        this.router.navigate(['/']);
    }
}
