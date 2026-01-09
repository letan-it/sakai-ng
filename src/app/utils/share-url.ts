export function getJobShareUrl(jobId: number): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    return `${baseUrl}/rms/jobs/${jobId}`;
}
