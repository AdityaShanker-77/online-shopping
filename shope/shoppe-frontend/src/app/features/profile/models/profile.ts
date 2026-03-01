export interface UserProfile {
    id: number;
    name: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    roles: string[];
    wishlistCount: number;
    orderCount: number;
    profilePictureUrl: string;
}
