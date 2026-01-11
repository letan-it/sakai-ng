/**
 * Interface cho Google User Profile
 * Chứa thông tin người dùng từ Google OAuth
 */
export interface GoogleUserProfile {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    token: string;
}
