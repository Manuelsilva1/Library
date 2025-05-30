import { SaleItem } from './sale-item.model';

export interface SaleRequest {
  sellerId: number; // Corresponds to Long
  customerName?: string; // Optional
  items: SaleItem[];
}
