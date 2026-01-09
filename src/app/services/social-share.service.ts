import { Injectable } from '@angular/core';
import { JobWithDetails } from '@/models/rms.models';
import { getJobShareUrl } from '@/utils/share-url';

@Injectable({
    providedIn: 'root'
})
export class SocialShareService {
    shareOnFacebook(job: JobWithDetails): void {
        const url = getJobShareUrl(job.id);
        const quote = this.createShareText(job);

        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`;

        window.open(facebookUrl, '_blank', 'width=600,height=400');
    }

    private createShareText(job: JobWithDetails): string {
        const salary = `${(job.salary_min / 1000000).toFixed(0)} - ${(job.salary_max / 1000000).toFixed(0)} triệu VND`;
        const experience = `${job.experience_min} - ${job.experience_max} năm kinh nghiệm`;

        const skillsList =
            job.skills && job.skills.length > 0
                ? job.skills
                      .slice(0, 5)
                      .map((s) => s.name)
                      .join(', ')
                : 'Nhiều kỹ năng đa dạng';

        const companyInfo = job.customer ? `${job.customer.name} - ${job.customer.industry}` : 'Công ty hàng đầu';

        return `🚀 TUYỂN DỤNG: ${job.title}

📍 Địa điểm: ${job.location}
💰 Mức lương: ${salary}
💼 Kinh nghiệm: ${experience}

✨ Kỹ năng yêu cầu: ${skillsList}

🏢 ${companyInfo}

Tuyển dụng nhân tài - Xây dựng tương lai

#TuyenDung #JobOpportunity #Career`;
    }
}
