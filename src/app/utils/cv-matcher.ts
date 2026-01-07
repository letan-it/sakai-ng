/**
 * Kết quả so sánh CV với Job Description
 * Result of CV comparison with Job Description
 */
export interface MatchResult {
    percentage: number;
    matchedSkills: string[];
    missingSkills: string[];
}

/**
 * Từ điển đồng nghĩa cho các kỹ năng công nghệ
 * Synonym dictionary for technology skills
 */
const SKILL_SYNONYMS: Record<string, string[]> = {
    javascript: ['js', 'ecmascript', 'es6', 'es2015', 'es2020'],
    typescript: ['ts'],
    react: ['reactjs', 'react.js'],
    angular: ['angularjs', 'angular.js'],
    vue: ['vuejs', 'vue.js'],
    node: ['nodejs', 'node.js'],
    mongodb: ['mongo'],
    postgresql: ['postgres', 'pgsql'],
    mysql: ['my sql'],
    docker: ['containerization'],
    kubernetes: ['k8s'],
    'amazon web services': ['aws'],
    'google cloud platform': ['gcp'],
    'microsoft azure': ['azure'],
    'artificial intelligence': ['ai'],
    'machine learning': ['ml'],
    'deep learning': ['dl'],
    'natural language processing': ['nlp'],
    rest: ['restful', 'rest api'],
    graphql: ['graph ql'],
    css: ['css3', 'cascading style sheets'],
    html: ['html5', 'hypertext markup language'],
    sql: ['structured query language'],
    nosql: ['no sql'],
    'ci/cd': ['continuous integration', 'continuous deployment'],
    git: ['github', 'gitlab', 'version control']
};

/**
 * So sánh CV với Job Description và tính toán độ phù hợp
 * Compare CV with Job Description and calculate match percentage
 *
 * @param cvText - Nội dung CV
 * @param requiredSkillsText - Chuỗi kỹ năng yêu cầu (phân cách bởi dấu phẩy)
 * @returns Kết quả so sánh bao gồm phần trăm phù hợp và danh sách kỹ năng
 *
 * @example
 * ```ts
 * const cvText = 'I have experience with JavaScript, React, and Node.js';
 * const requiredSkills = 'JavaScript, TypeScript, React, Angular';
 * const result = compareCV(cvText, requiredSkills);
 * // result = {
 * //   percentage: 50,
 * //   matchedSkills: ['JavaScript', 'React'],
 * //   missingSkills: ['TypeScript', 'Angular']
 * // }
 * ```
 */
export function compareCV(cvText: string, requiredSkillsText: string): MatchResult {
    if (!cvText || !requiredSkillsText) {
        return {
            percentage: 0,
            matchedSkills: [],
            missingSkills: []
        };
    }

    // Phân tách và làm sạch danh sách kỹ năng yêu cầu
    const skills = requiredSkillsText
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    if (skills.length === 0) {
        return {
            percentage: 0,
            matchedSkills: [],
            missingSkills: []
        };
    }

    // Chuẩn hóa CV text để so sánh
    const normalizedCV = normalizeText(cvText);

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    // Kiểm tra từng kỹ năng
    skills.forEach((skill) => {
        const normalizedSkill = normalizeText(skill);

        // Kiểm tra kỹ năng chính
        if (normalizedCV.includes(normalizedSkill)) {
            matchedSkills.push(skill);
            return;
        }

        // Kiểm tra các từ đồng nghĩa
        if (hasSkillMatch(normalizedCV, normalizedSkill)) {
            matchedSkills.push(skill);
            return;
        }

        missingSkills.push(skill);
    });

    // Tính phần trăm phù hợp
    const percentage = Math.round((matchedSkills.length / skills.length) * 100);

    return {
        percentage,
        matchedSkills,
        missingSkills
    };
}

/**
 * Kiểm tra xem CV có chứa kỹ năng hoặc từ đồng nghĩa của nó không
 * Check if CV contains the skill or its synonyms
 *
 * @param normalizedCV - CV đã chuẩn hóa
 * @param normalizedSkill - Kỹ năng đã chuẩn hóa
 * @returns true nếu tìm thấy kỹ năng hoặc từ đồng nghĩa
 */
function hasSkillMatch(normalizedCV: string, normalizedSkill: string): boolean {
    // Tìm kiếm trong từ điển đồng nghĩa
    for (const [mainSkill, synonyms] of Object.entries(SKILL_SYNONYMS)) {
        // Kiểm tra xem skill có phải là một trong các từ chính không
        if (normalizedSkill === mainSkill || synonyms.includes(normalizedSkill)) {
            // Kiểm tra xem CV có chứa từ chính hoặc bất kỳ từ đồng nghĩa nào không
            if (normalizedCV.includes(mainSkill)) {
                return true;
            }

            for (const synonym of synonyms) {
                if (normalizedCV.includes(synonym)) {
                    return true;
                }
            }
        }
    }

    return false;
}

/**
 * Chuẩn hóa văn bản để so sánh
 * Normalize text for comparison
 *
 * @param text - Văn bản cần chuẩn hóa
 * @returns Văn bản đã được chuẩn hóa (chữ thường, không dấu)
 */
export function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd')
        .replace(/[^\w\s]/g, ' ') // Thay thế ký tự đặc biệt bằng khoảng trắng
        .replace(/\s+/g, ' ') // Chuẩn hóa khoảng trắng
        .trim();
}
