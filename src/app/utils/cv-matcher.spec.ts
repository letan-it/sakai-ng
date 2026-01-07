import { compareCV, normalizeText } from './cv-matcher';

describe('compareCV', () => {
    describe('So sánh cơ bản / Basic comparison', () => {
        it('nên tìm thấy kỹ năng phù hợp chính xác', () => {
            const cvText = 'I have experience with JavaScript, React, and Node.js';
            const requiredSkills = 'JavaScript, React';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(100);
            expect(result.matchedSkills).toEqual(['JavaScript', 'React']);
            expect(result.missingSkills).toEqual([]);
        });

        it('nên tìm thấy một số kỹ năng phù hợp', () => {
            const cvText = 'I know JavaScript and TypeScript';
            const requiredSkills = 'JavaScript, TypeScript, React, Angular';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(50);
            expect(result.matchedSkills).toEqual(['JavaScript', 'TypeScript']);
            expect(result.missingSkills).toEqual(['React', 'Angular']);
        });

        it('nên trả về 0% khi không có kỹ năng nào phù hợp', () => {
            const cvText = 'I only know Java and Python';
            const requiredSkills = 'JavaScript, React, Angular';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(0);
            expect(result.matchedSkills).toEqual([]);
            expect(result.missingSkills.length).toBe(3);
        });
    });

    describe('Từ đồng nghĩa / Synonyms', () => {
        it('nên nhận diện JavaScript và JS như nhau', () => {
            const cvText = 'I have 5 years of experience with JS and ES6';
            const requiredSkills = 'JavaScript';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(100);
            expect(result.matchedSkills).toEqual(['JavaScript']);
        });

        it('nên nhận diện TypeScript và TS như nhau', () => {
            const cvText = 'Strong knowledge of TS and React';
            const requiredSkills = 'TypeScript, React';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(100);
            expect(result.matchedSkills).toEqual(['TypeScript', 'React']);
        });

        it('nên nhận diện React và ReactJS như nhau', () => {
            const cvText = 'I am experienced in ReactJS development';
            const requiredSkills = 'React';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(100);
            expect(result.matchedSkills).toEqual(['React']);
        });

        it('nên nhận diện Node và Node.js như nhau', () => {
            const cvText = 'Backend development with NodeJS';
            const requiredSkills = 'Node';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(100);
            expect(result.matchedSkills).toEqual(['Node']);
        });

        it('nên nhận diện AWS và Amazon Web Services như nhau', () => {
            const cvText = 'Cloud experience with Amazon Web Services';
            const requiredSkills = 'AWS';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(100);
            expect(result.matchedSkills).toEqual(['AWS']);
        });

        it('nên nhận diện Kubernetes và K8s như nhau', () => {
            const cvText = 'DevOps experience with k8s';
            const requiredSkills = 'Kubernetes';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(100);
            expect(result.matchedSkills).toEqual(['Kubernetes']);
        });
    });

    describe('Chuẩn hóa văn bản / Text normalization', () => {
        it('nên không phân biệt hoa thường', () => {
            const cvText = 'JAVASCRIPT and REACT';
            const requiredSkills = 'javascript, react';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(100);
            expect(result.matchedSkills.length).toBe(2);
        });

        it('nên bỏ qua dấu trong tiếng Việt', () => {
            const cvText = 'Có kinh nghiệm với Angular và TypeScript';
            const requiredSkills = 'Angular, TypeScript';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(100);
            expect(result.matchedSkills.length).toBe(2);
        });

        it('nên xử lý ký tự đặc biệt', () => {
            const cvText = 'Skills: JavaScript, React.js, Node.js';
            const requiredSkills = 'JavaScript, React, Node';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(100);
            expect(result.matchedSkills.length).toBe(3);
        });
    });

    describe('Xử lý edge cases / Edge cases', () => {
        it('nên trả về kết quả rỗng với CV text rỗng', () => {
            const result = compareCV('', 'JavaScript, React');

            expect(result.percentage).toBe(0);
            expect(result.matchedSkills).toEqual([]);
            expect(result.missingSkills).toEqual([]);
        });

        it('nên trả về kết quả rỗng với required skills rỗng', () => {
            const result = compareCV('JavaScript and React', '');

            expect(result.percentage).toBe(0);
            expect(result.matchedSkills).toEqual([]);
            expect(result.missingSkills).toEqual([]);
        });

        it('nên xử lý khoảng trắng thừa trong required skills', () => {
            const cvText = 'JavaScript and React';
            const requiredSkills = '  JavaScript  ,  React  ,  ';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(100);
            expect(result.matchedSkills.length).toBe(2);
        });
    });

    describe('Kịch bản thực tế / Real-world scenarios', () => {
        it('nên so sánh CV với JD trong tuyển dụng Frontend', () => {
            const cvText = `
                KINH NGHIỆM LÀM VIỆC
                - Frontend Developer tại Công ty ABC (2020-2023)
                  + Phát triển ứng dụng web với ReactJS và TypeScript
                  + Sử dụng Redux cho state management
                  + Làm việc với REST API
                  + Styling với CSS3 và TailwindCSS
            `;
            const requiredSkills = 'React, TypeScript, Redux, REST API, CSS';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(100);
            expect(result.matchedSkills.length).toBe(5);
        });

        it('nên so sánh CV với JD trong tuyển dụng Backend', () => {
            const cvText = `
                KỸ NĂNG
                - Backend: Node.js, Express.js, NestJS
                - Database: PostgreSQL, MongoDB
                - Cloud: AWS (EC2, S3, Lambda)
                - DevOps: Docker, Kubernetes
            `;
            const requiredSkills = 'Node, PostgreSQL, MongoDB, AWS, Docker, Kubernetes';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(100);
            expect(result.matchedSkills.length).toBe(6);
        });

        it('nên tính toán phần trăm phù hợp chính xác', () => {
            const cvText = `
                Skills: JavaScript, TypeScript, React, Angular, Vue
            `;
            const requiredSkills = 'JavaScript, TypeScript, React, Node, Express';
            const result = compareCV(cvText, requiredSkills);

            expect(result.percentage).toBe(60); // 3/5 = 60%
            expect(result.matchedSkills).toEqual(['JavaScript', 'TypeScript', 'React']);
            expect(result.missingSkills).toEqual(['Node', 'Express']);
        });
    });
});

describe('normalizeText', () => {
    it('nên chuyển đổi về chữ thường', () => {
        expect(normalizeText('JAVASCRIPT')).toBe('javascript');
        expect(normalizeText('React')).toBe('react');
    });

    it('nên loại bỏ dấu tiếng Việt', () => {
        expect(normalizeText('Có kinh nghiệm')).toBe('co kinh nghiem');
        expect(normalizeText('Trình độ cao')).toBe('trinh do cao');
    });

    it('nên chuyển đổi đ thành d', () => {
        expect(normalizeText('Đại học')).toBe('dai hoc');
        expect(normalizeText('Điện thoại')).toBe('dien thoai');
    });

    it('nên loại bỏ ký tự đặc biệt', () => {
        expect(normalizeText('React.js')).toBe('react js');
        expect(normalizeText('Node.js')).toBe('node js');
        expect(normalizeText('C++')).toBe('c');
    });

    it('nên chuẩn hóa khoảng trắng', () => {
        expect(normalizeText('  multiple   spaces  ')).toBe('multiple spaces');
    });

    it('nên xử lý văn bản phức tạp', () => {
        const input = 'Có kinh nghiệm với JavaScript, React.js và Node.js!!!';
        const expected = 'co kinh nghiem voi javascript react js va node js';

        expect(normalizeText(input)).toBe(expected);
    });
});
