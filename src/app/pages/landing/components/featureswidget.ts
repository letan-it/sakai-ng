import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'features-widget',
    standalone: true,
    imports: [CommonModule],
    template: ` <div id="features" class="py-20 px-6 lg:px-20 bg-surface-0 dark:bg-surface-900">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-16">
                <span class="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    TÍNH NĂNG NỔI BẬT
                </span>
                <h2 class="text-4xl md:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                    Mọi thứ bạn cần để xây dựng
                </h2>
                <p class="text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
                    Template được thiết kế với các tính năng hiện đại và công nghệ tiên tiến nhất
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="group p-8 bg-white dark:bg-surface-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-surface-200 dark:border-surface-700 hover:border-purple-500 dark:hover:border-purple-500">
                    <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        <i class="pi pi-fw pi-bolt text-3xl text-white"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-3 text-surface-900 dark:text-surface-0">Hiệu suất cao</h3>
                    <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
                        Được tối ưu hóa với Angular 20 và build tools hiện đại để đảm bảo tốc độ tải nhanh chóng.
                    </p>
                </div>

                <div class="group p-8 bg-white dark:bg-surface-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-surface-200 dark:border-surface-700 hover:border-blue-500 dark:hover:border-blue-500">
                    <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        <i class="pi pi-fw pi-palette text-3xl text-white"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-3 text-surface-900 dark:text-surface-0">Thiết kế đẹp mắt</h3>
                    <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
                        Giao diện hiện đại với PrimeNG components và Tailwind CSS, tùy chỉnh dễ dàng.
                    </p>
                </div>

                <div class="group p-8 bg-white dark:bg-surface-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-surface-200 dark:border-surface-700 hover:border-cyan-500 dark:hover:border-cyan-500">
                    <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        <i class="pi pi-fw pi-mobile text-3xl text-white"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-3 text-surface-900 dark:text-surface-0">Responsive hoàn toàn</h3>
                    <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
                        Giao diện tối ưu cho mọi thiết bị, từ mobile đến desktop với Tailwind grid system.
                    </p>
                </div>

                <div class="group p-8 bg-white dark:bg-surface-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-surface-200 dark:border-surface-700 hover:border-pink-500 dark:hover:border-pink-500">
                    <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-700 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        <i class="pi pi-fw pi-moon text-3xl text-white"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-3 text-surface-900 dark:text-surface-0">Dark Mode</h3>
                    <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
                        Hỗ trợ theme sáng/tối với PrimeUI themes, chuyển đổi mượt mà và trải nghiệm tốt.
                    </p>
                </div>

                <div class="group p-8 bg-white dark:bg-surface-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-surface-200 dark:border-surface-700 hover:border-green-500 dark:hover:border-green-500">
                    <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        <i class="pi pi-fw pi-code text-3xl text-white"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-3 text-surface-900 dark:text-surface-0">Code sạch sẽ</h3>
                    <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
                        Tuân thủ best practices của Angular, TypeScript strict mode và ESLint standards.
                    </p>
                </div>

                <div class="group p-8 bg-white dark:bg-surface-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-surface-200 dark:border-surface-700 hover:border-orange-500 dark:hover:border-orange-500">
                    <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        <i class="pi pi-fw pi-book text-3xl text-white"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-3 text-surface-900 dark:text-surface-0">Tài liệu chi tiết</h3>
                    <p class="text-surface-600 dark:text-surface-300 leading-relaxed">
                        Hướng dẫn đầy đủ, examples rõ ràng giúp bạn dễ dàng tùy chỉnh và mở rộng.
                    </p>
                </div>
            </div>

            <div class="mt-20 p-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-surface-800 dark:to-surface-700 rounded-3xl shadow-xl">
                <div class="text-center max-w-4xl mx-auto">
                    <div class="mb-6">
                        <i class="pi pi-star-fill text-yellow-500 text-3xl"></i>
                        <i class="pi pi-star-fill text-yellow-500 text-3xl mx-1"></i>
                        <i class="pi pi-star-fill text-yellow-500 text-3xl"></i>
                        <i class="pi pi-star-fill text-yellow-500 text-3xl mx-1"></i>
                        <i class="pi pi-star-fill text-yellow-500 text-3xl"></i>
                    </div>
                    <blockquote class="text-2xl md:text-3xl font-medium text-surface-900 dark:text-surface-0 mb-6 italic">
                        "Template Angular tốt nhất tôi từng sử dụng. Thiết kế đẹp, code chất lượng cao và documentation xuất sắc. Highly recommended!"
                    </blockquote>
                    <div class="flex items-center justify-center gap-4">
                        <div class="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            JM
                        </div>
                        <div class="text-left">
                            <div class="font-bold text-surface-900 dark:text-surface-0 text-xl">Joséphine Miller</div>
                            <div class="text-surface-600 dark:text-surface-300">Lead Developer, Peak Interactive</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
})
export class FeaturesWidget {}
