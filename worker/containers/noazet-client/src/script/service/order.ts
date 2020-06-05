import { Service } from './service';

export class OrderService extends Service {
    createOrder(order: any) {
        return this.request.post('/orders', {
            productId: order.productId,
            side: ['buy', 'sell'][order.side],
            type: ['market', 'limit'][order.type],
            price: order.price,
            size: order.size,
            funds: order.quote
        }, { headers: {HideError: true} });
    }

    getOrders(productId: string, limit: number, status: string[] = [], pagination: any = {}) {
        let query = status.map((item: string) => {
            return `status=${item}`;
        }, status);
        for(let key in pagination) {
            query.push(`${key}=${pagination[key]}`);
        }
        return this.request.get(
            `/orders?productId=${productId}&limit=${30}&${query.join('&')}`, 
            { headers: { ResponseAll: true }})
            .then((response: any) => {
                return {
                    after: response.headers['gbe-after'],
                    before: response.headers['gbe-before'],
                    items: response.data,
                };
        });
    }

    cancelOrder(orderId: string) {
        return this.request.delete(`/orders/${orderId}`);
    }

    cancelAll(productId: string) {
        return this.request.delete(`/orders?productId=${productId}`);
    }
}