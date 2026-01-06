import { Component } from '@angular/core';

@Component({
    selector: 'highlights-widget',
    template: `
        <div id="highlights" class="py-20 px-6 lg:px-20 bg-gradient-to-b from-surface-0 to-surface-50 dark:from-surface-900 dark:to-surface-800">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <span class="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"> ĐA NỀN TẢNG </span>
                    <h2 class="text-4xl md:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">Mạnh mẽ trên mọi thiết bị</h2>
                    <p class="text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">Trải nghiệm tối ưu cho người dùng trên mọi nền tảng</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    <div class="order-2 lg:order-1">
                        <div class="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-8 rounded-3xl shadow-2xl">
                            <div class="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-xl">
                                <div class="flex items-center gap-3 mb-4">
                                    <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <div class="space-y-3">
                                    <div class="h-4 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 rounded w-3/4"></div>
                                    <div class="h-4 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 rounded w-5/6"></div>
                                    <div class="h-4 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 rounded w-2/3"></div>
                                    <div class="h-20 bg-gradient-to-br from-purple-300 to-blue-300 dark:from-purple-600 dark:to-blue-600 rounded-xl mt-6"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="order-1 lg:order-2">
                        <div class="flex items-center justify-center lg:justify-start mb-6">
                            <div class="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl">
                                <i class="pi pi-fw pi-desktop text-5xl text-white"></i>
                            </div>
                        </div>
                        <h3 class="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-0 mb-6">Desktop Experience</h3>
                        <p class="text-xl text-surface-600 dark:text-surface-300 leading-relaxed mb-6">
                            Giao diện desktop với layout rộng rãi, tận dụng tối đa không gian màn hình. Hỗ trợ keyboard shortcuts và các tính năng nâng cao cho power users.
                        </p>
                        <ul class="space-y-4">
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check-circle text-2xl text-green-500 mt-1"></i>
                                <span class="text-lg text-surface-700 dark:text-surface-200">Tối ưu cho màn hình lớn</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check-circle text-2xl text-green-500 mt-1"></i>
                                <span class="text-lg text-surface-700 dark:text-surface-200">Multi-tasking hiệu quả</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check-circle text-2xl text-green-500 mt-1"></i>
                                <span class="text-lg text-surface-700 dark:text-surface-200">Keyboard navigation</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div class="flex items-center justify-center lg:justify-start mb-6">
                            <div class="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-2xl">
                                <i class="pi pi-fw pi-mobile text-5xl text-white"></i>
                            </div>
                        </div>
                        <h3 class="text-3xl md:text-4xl font-bold text-surface-900 dark:text-surface-0 mb-6">Mobile First Design</h3>
                        <p class="text-xl text-surface-600 dark:text-surface-300 leading-relaxed mb-6">Được thiết kế với mobile-first approach, đảm bảo trải nghiệm mượt mà trên smartphone và tablet với touch gestures tự nhiên.</p>
                        <ul class="space-y-4">
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check-circle text-2xl text-green-500 mt-1"></i>
                                <span class="text-lg text-surface-700 dark:text-surface-200">Touch-optimized UI</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check-circle text-2xl text-green-500 mt-1"></i>
                                <span class="text-lg text-surface-700 dark:text-surface-200">Fast loading trên 3G/4G</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="pi pi-check-circle text-2xl text-green-500 mt-1"></i>
                                <span class="text-lg text-surface-700 dark:text-surface-200">PWA ready</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <div class="bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 p-8 rounded-3xl shadow-2xl max-w-sm mx-auto">
                            <div class="bg-white dark:bg-surface-800 rounded-3xl p-4 shadow-xl">
                                <div class="bg-gradient-to-b from-purple-500 to-blue-600 rounded-2xl p-6 text-white mb-4">
                                    <div class="flex items-center justify-between mb-4">
                                        <span class="text-sm opacity-90">Dashboard</span>
                                        <i class="pi pi-bars text-xl"></i>
                                    </div>
                                    <h4 class="text-2xl font-bold mb-2">Welcome Back!</h4>
                                    <p class="text-sm opacity-90">Your app is ready</p>
                                </div>
                                <div class="space-y-2">
                                    <div class="h-12 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 rounded-xl"></div>
                                    <div class="h-12 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 rounded-xl"></div>
                                    <div class="h-12 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-700 dark:to-blue-700 rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class HighlightsWidget {}
