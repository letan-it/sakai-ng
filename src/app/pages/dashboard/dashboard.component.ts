import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../layout/service/layout.service';
import { hrDashboardData } from './fake.data';

interface MonthOption {
    value: number;
    label: string;
}

interface WorkplaceOption {
    value: string;
    label: string;
}

interface Employee {
    id: number;
    name: string;
    position: string;
    department: string;
    avatar: string;
    birthday?: string;
    joinDate?: string;
    resignDate?: string;
    reason?: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        SelectModule,
        CardModule,
        TableModule,
        AvatarModule,
        TagModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class Dashboard implements OnInit, OnDestroy {
    // Bộ lọc
    selectedYear: number = 2026;
    selectedMonth: MonthOption = { value: 2, label: 'Tháng 2' };
    selectedWorkplace: WorkplaceOption = { value: 'all', label: 'Tất cả' };

    years: number[] = [];
    months: MonthOption[] = [];
    workplaces: WorkplaceOption[] = [];

    // Thống kê tổng quan
    totalEmployees: number = 0;
    newHires: number = 0;
    resignations: number = 0;
    turnoverRate: number = 0;

    // Dữ liệu biểu đồ
    genderChartData: any;
    genderChartOptions: any;

    departmentChartData: any;
    departmentChartOptions: any;

    levelChartData: any;
    levelChartOptions: any;

    educationChartData: any;
    educationChartOptions: any;

    trendChartData: any;
    trendChartOptions: any;

    // Dữ liệu bảng
    birthdayEmployees: Employee[] = [];
    newEmployees: Employee[] = [];
    resignedEmployees: Employee[] = [];

    subscription!: Subscription;

    constructor(private layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            this.initCharts();
        });
    }

    ngOnInit() {
        this.loadData();
        this.initCharts();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    loadData() {
        // Load filter options
        this.years = hrDashboardData.filters.years;
        this.months = hrDashboardData.filters.months;
        this.workplaces = hrDashboardData.filters.workplaces;

        // Load summary data
        this.totalEmployees = hrDashboardData.summary.totalEmployees;
        this.newHires = hrDashboardData.summary.newHires;
        this.resignations = hrDashboardData.summary.resignations;
        this.turnoverRate = hrDashboardData.summary.turnoverRate;

        // Load table data
        this.birthdayEmployees = hrDashboardData.birthdayEmployees;
        this.newEmployees = hrDashboardData.newEmployees;
        this.resignedEmployees = hrDashboardData.resignedEmployees;
    }

    initCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        // Biểu đồ giới tính (Doughnut)
        this.genderChartData = {
            labels: hrDashboardData.genderData.labels,
            datasets: [
                {
                    data: hrDashboardData.genderData.values,
                    backgroundColor: hrDashboardData.genderData.colors,
                    hoverBackgroundColor: ['#12a89d', '#e04d7a']
                }
            ]
        };

        this.genderChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 15
                    },
                    position: 'bottom'
                }
            }
        };

        // Biểu đồ phòng ban (Bar)
        this.departmentChartData = {
            labels: hrDashboardData.departmentData.labels,
            datasets: [
                {
                    label: 'Số lượng nhân viên',
                    data: hrDashboardData.departmentData.values,
                    backgroundColor: '#14beaf',
                    borderRadius: 6
                }
            ]
        };

       this.departmentChartOptions = {
            maintainAspectRatio: false,
            responsive: true,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };


        // Biểu đồ cấp bậc (Doughnut)
        this.levelChartData = {
            labels: hrDashboardData.levelData.labels,
            datasets: [
                {
                    data: hrDashboardData.levelData.values,
                    backgroundColor: hrDashboardData.levelData.colors,
                    hoverBackgroundColor: ['#12a89d', '#e04d7a', '#f5b800', '#8920a6']
                }
            ]
        };

        this.levelChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 15
                    },
                    position: 'bottom'
                }
            }
        };

        // Biểu đồ trình độ (Doughnut)
        this.educationChartData = {
            labels: hrDashboardData.educationData.labels,
            datasets: [
                {
                    data: hrDashboardData.educationData.values,
                    backgroundColor: hrDashboardData.educationData.colors,
                    hoverBackgroundColor: ['#12a89d', '#e04d7a', '#f5b800', '#8920a6', '#e84823']
                }
            ]
        };

        this.educationChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 15
                    },
                    position: 'bottom'
                }
            }
        };

        // Biểu đồ xu hướng theo tháng (Line)
        this.trendChartData = {
            labels: hrDashboardData.monthlyTrendData.labels,
            datasets: [
                {
                    label: 'Tuyển mới',
                    data: hrDashboardData.monthlyTrendData.newHires,
                    borderColor: '#14beaf',
                    backgroundColor: 'rgba(20, 190, 175, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Nghỉ việc',
                    data: hrDashboardData.monthlyTrendData.resignations,
                    borderColor: '#f1638c',
                    backgroundColor: 'rgba(241, 99, 140, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        };

        this.trendChartOptions = {
            maintainAspectRatio: false,
            responsive: true,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 15
                    },
                    position: 'top'
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    onFilterChange() {
        // Xử lý khi thay đổi bộ lọc
        // Trong thực tế, sẽ gọi API để lấy dữ liệu mới
        console.log('Filters changed:', {
            year: this.selectedYear,
            month: this.selectedMonth,
            workplace: this.selectedWorkplace
        });
    }
}
