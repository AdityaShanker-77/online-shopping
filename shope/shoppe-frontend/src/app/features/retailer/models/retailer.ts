import { Product } from '../../product/models/product';

export interface RetailerProfile {
    id: number;
    userId: number;
    storeName: string;
    ownerName: string;
    email: string;
    revenue: number;
    approved: boolean;
}
