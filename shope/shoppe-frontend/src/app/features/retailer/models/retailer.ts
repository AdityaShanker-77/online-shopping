import { Product } from '../../product/models/product';

export interface RetailerProfile {
    id: number;
    storeName: string;
    ownerName: string;
    email: string;
    revenue: number;
    approved: boolean;
}
