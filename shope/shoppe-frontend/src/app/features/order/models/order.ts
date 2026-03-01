export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    priceAtPurchase: number;
}

export interface Order {
    id: number;
    userId: number;
    orderDate: string;
    totalAmount: number;
    status: string;
    shippingAddress: string;
    items: OrderItem[];
}
