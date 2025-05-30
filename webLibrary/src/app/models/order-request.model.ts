import { OrderItem } from './order-item.model';

export interface OrderRequest {
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
}
