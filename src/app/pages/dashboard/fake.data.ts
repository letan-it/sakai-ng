// Fake data for HR Dashboard
export const hrDashboardData = {
    // Bộ lọc
    filters: {
        years: [2022, 2023, 2024, 2025, 2026],
        months: [
            { value: 1, label: 'Tháng 1' },
            { value: 2, label: 'Tháng 2' },
            { value: 3, label: 'Tháng 3' },
            { value: 4, label: 'Tháng 4' },
            { value: 5, label: 'Tháng 5' },
            { value: 6, label: 'Tháng 6' },
            { value: 7, label: 'Tháng 7' },
            { value: 8, label: 'Tháng 8' },
            { value: 9, label: 'Tháng 9' },
            { value: 10, label: 'Tháng 10' },
            { value: 11, label: 'Tháng 11' },
            { value: 12, label: 'Tháng 12' }
        ],
        workplaces: [
            { value: 'all', label: 'Tất cả' },
            { value: 'hn', label: 'Hà Nội' },
            { value: 'hcm', label: 'Hồ Chí Minh' },
            { value: 'dn', label: 'Đà Nẵng' }
        ]
    },

    // Thống kê tổng quan
    summary: {
        totalEmployees: 1247,
        newHires: 89,
        resignations: 23,
        turnoverRate: 1.84 // %
    },

    // Dữ liệu biểu đồ theo giới tính
    genderData: {
        labels: ['Nam', 'Nữ'],
        values: [687, 560],
        colors: ['#14beaf', '#f1638c']
    },

    // Dữ liệu biểu đồ theo phòng ban
    departmentData: {
        labels: ['Kỹ thuật', 'Kinh doanh', 'Marketing', 'Hành chính', 'Nhân sự', 'Tài chính'],
        values: [387, 245, 178, 156, 134, 147],
        colors: ['#14beaf', '#f1638c', '#ffc107', '#9c27b0', '#ff5722', '#3f51b5']
    },

    // Dữ liệu biểu đồ theo cấp bậc
    levelData: {
        labels: ['Nhân viên', 'Trưởng nhóm', 'Quản lý', 'Giám đốc'],
        values: [845, 267, 112, 23],
        colors: ['#14beaf', '#f1638c', '#ffc107', '#9c27b0']
    },

    // Dữ liệu biểu đồ theo trình độ học vấn
    educationData: {
        labels: ['Đại học', 'Thạc sĩ', 'Tiến sĩ', 'Cao đẳng', 'Khác'],
        values: [734, 289, 45, 156, 23],
        colors: ['#14beaf', '#f1638c', '#ffc107', '#9c27b0', '#ff5722']
    },

    // Dữ liệu biểu đồ theo tháng (tuyển dụng và nghỉ việc)
    monthlyTrendData: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        newHires: [45, 67, 89, 78, 56, 67, 89, 92, 78, 67, 89, 76],
        resignations: [12, 15, 23, 18, 14, 19, 23, 21, 18, 16, 23, 19]
    },

    // Nhân viên có sinh nhật trong tháng
    birthdayEmployees: [
        {
            id: 1,
            name: 'Nguyễn Văn An',
            position: 'Kỹ sư phần mềm',
            department: 'Kỹ thuật',
            birthday: '15/02/1990',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },
        {
            id: 2,
            name: 'Trần Thị Bình',
            position: 'Marketing Manager',
            department: 'Marketing',
            birthday: '20/02/1988',
            avatar: 'https://i.pravatar.cc/150?img=2'
        },
        {
            id: 3,
            name: 'Lê Văn Cường',
            position: 'Sales Executive',
            department: 'Kinh doanh',
            birthday: '25/02/1992',
            avatar: 'https://i.pravatar.cc/150?img=3'
        },
        {
            id: 4,
            name: 'Phạm Thị Dung',
            position: 'HR Specialist',
            department: 'Nhân sự',
            birthday: '28/02/1991',
            avatar: 'https://i.pravatar.cc/150?img=4'
        }
    ],

    // Nhân viên mới
    newEmployees: [
        {
            id: 5,
            name: 'Hoàng Văn Hải',
            position: 'Backend Developer',
            department: 'Kỹ thuật',
            joinDate: '01/02/2026',
            avatar: 'https://i.pravatar.cc/150?img=5'
        },
        {
            id: 6,
            name: 'Đỗ Thị Hương',
            position: 'UI/UX Designer',
            department: 'Kỹ thuật',
            joinDate: '05/02/2026',
            avatar: 'https://i.pravatar.cc/150?img=6'
        },
        {
            id: 7,
            name: 'Vũ Văn Khang',
            position: 'Account Manager',
            department: 'Kinh doanh',
            joinDate: '10/02/2026',
            avatar: 'https://i.pravatar.cc/150?img=7'
        },
        {
            id: 8,
            name: 'Bùi Thị Lan',
            position: 'Content Writer',
            department: 'Marketing',
            joinDate: '12/02/2026',
            avatar: 'https://i.pravatar.cc/150?img=8'
        },
        {
            id: 9,
            name: 'Phan Văn Minh',
            position: 'Data Analyst',
            department: 'Kỹ thuật',
            joinDate: '15/02/2026',
            avatar: 'https://i.pravatar.cc/150?img=9'
        }
    ],

    // Nhân viên nghỉ việc
    resignedEmployees: [
        {
            id: 10,
            name: 'Đinh Văn Nam',
            position: 'Software Engineer',
            department: 'Kỹ thuật',
            resignDate: '31/01/2026',
            reason: 'Cơ hội mới',
            avatar: 'https://i.pravatar.cc/150?img=10'
        },
        {
            id: 11,
            name: 'Trịnh Thị Oanh',
            position: 'Sales Manager',
            department: 'Kinh doanh',
            resignDate: '28/01/2026',
            reason: 'Lý do cá nhân',
            avatar: 'https://i.pravatar.cc/150?img=11'
        },
        {
            id: 12,
            name: 'Lý Văn Phong',
            position: 'Accountant',
            department: 'Tài chính',
            resignDate: '25/01/2026',
            reason: 'Học tập',
            avatar: 'https://i.pravatar.cc/150?img=12'
        }
    ]
};
