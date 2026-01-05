import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'pricing-widget',
    imports: [ButtonModule, RippleModule],
    template: `
        <div id="pricing" class="py-20 px-6 lg:px-20 bg-surface-0 dark:bg-surface-900">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <span class="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        GIÁ CẢ MINH BẠCH
                    </span>
                    <h2 class="text-4xl md:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                        Chọn gói phù hợp với bạn
                    </h2>
                    <p class="text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
                        Linh hoạt, không ràng buộc, hủy bất cứ lúc nào
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Free Plan -->
                    <div class="group relative p-8 bg-white dark:bg-surface-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-surface-200 dark:border-surface-700 hover:border-blue-400">
                        <div class="text-center mb-8">
                            <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">Free</h3>
                            <p class="text-surface-600 dark:text-surface-300">Cho cá nhân và dự án nhỏ</p>
                        </div>
                        
                        <div class="flex items-center justify-center mb-8">
                            <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-2xl flex items-center justify-center">
                                <i class="pi pi-box text-4xl text-blue-600 dark:text-blue-400"></i>
                            </div>
                        </div>

                        <div class="text-center mb-8">
                            <div class="flex items-baseline justify-center gap-1">
                                <span class="text-5xl font-bold text-surface-900 dark:text-surface-0">$0</span>
                                <span class="text-surface-600 dark:text-surface-300">/tháng</span>
                            </div>
                        </div>

                        <button 
                            pButton 
                            pRipple 
                            label="Bắt đầu miễn phí" 
                            [outlined]="true"
                            class="w-full mb-8 py-3! text-lg! border-2!">
                        </button>

                        <ul class="space-y-4">
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-green-500 mt-0.5"></i>
                                <span class="text-surface-700 dark:text-surface-200">Responsive layout</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-green-500 mt-0.5"></i>
                                <span class="text-surface-700 dark:text-surface-200">Dark mode support</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-green-500 mt-0.5"></i>
                                <span class="text-surface-700 dark:text-surface-200">Basic components</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-green-500 mt-0.5"></i>
                                <span class="text-surface-700 dark:text-surface-200">Community support</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Startup Plan - Featured -->
                    <div class="group relative p-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span class="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                PHỔ BIẾN NHẤT
                            </span>
                        </div>

                        <div class="text-center mb-8 mt-4">
                            <h3 class="text-2xl font-bold text-white mb-2">Startup</h3>
                            <p class="text-white/80">Cho startup và doanh nghiệp nhỏ</p>
                        </div>
                        
                        <div class="flex items-center justify-center mb-8">
                            <div class="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <i class="pi pi-star text-4xl text-white"></i>
                            </div>
                        </div>

                        <div class="text-center mb-8">
                            <div class="flex items-baseline justify-center gap-1">
                                <span class="text-5xl font-bold text-white">$49</span>
                                <span class="text-white/80">/tháng</span>
                            </div>
                        </div>

                        <button 
                            pButton 
                            pRipple 
                            label="Bắt đầu ngay" 
                            class="w-full mb-8 py-3! text-lg! bg-white! text-purple-600! hover:bg-gray-100! border-0!">
                        </button>

                        <ul class="space-y-4">
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-white mt-0.5"></i>
                                <span class="text-white">Tất cả tính năng Free</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-white mt-0.5"></i>
                                <span class="text-white">Premium components</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-white mt-0.5"></i>
                                <span class="text-white">Advanced templates</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-white mt-0.5"></i>
                                <span class="text-white">Priority support</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-white mt-0.5"></i>
                                <span class="text-white">Free updates 1 năm</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Enterprise Plan -->
                    <div class="group relative p-8 bg-white dark:bg-surface-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-surface-200 dark:border-surface-700 hover:border-purple-400">
                        <div class="text-center mb-8">
                            <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-0 mb-2">Enterprise</h3>
                            <p class="text-surface-600 dark:text-surface-300">Cho doanh nghiệp lớn</p>
                        </div>
                        
                        <div class="flex items-center justify-center mb-8">
                            <div class="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-2xl flex items-center justify-center">
                                <i class="pi pi-briefcase text-4xl text-purple-600 dark:text-purple-400"></i>
                            </div>
                        </div>

                        <div class="text-center mb-8">
                            <div class="flex items-baseline justify-center gap-1">
                                <span class="text-5xl font-bold text-surface-900 dark:text-surface-0">$199</span>
                                <span class="text-surface-600 dark:text-surface-300">/tháng</span>
                            </div>
                        </div>

                        <button 
                            pButton 
                            pRipple 
                            label="Liên hệ tư vấn" 
                            [outlined]="true"
                            class="w-full mb-8 py-3! text-lg! border-2!">
                        </button>

                        <ul class="space-y-4">
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-green-500 mt-0.5"></i>
                                <span class="text-surface-700 dark:text-surface-200">Tất cả tính năng Startup</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-green-500 mt-0.5"></i>
                                <span class="text-surface-700 dark:text-surface-200">Custom development</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-green-500 mt-0.5"></i>
                                <span class="text-surface-700 dark:text-surface-200">Dedicated support</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-green-500 mt-0.5"></i>
                                <span class="text-surface-700 dark:text-surface-200">SLA guarantee</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check text-xl text-green-500 mt-0.5"></i>
                                <span class="text-surface-700 dark:text-surface-200">Lifetime updates</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="mt-16 text-center">
                    <p class="text-surface-600 dark:text-surface-300 text-lg">
                        Tất cả gói đều bao gồm <span class="font-semibold text-surface-900 dark:text-surface-0">30 ngày hoàn tiền</span> nếu không hài lòng
                    </p>
                </div>
            </div>
        </div>
    `
})
export class PricingWidget {}
