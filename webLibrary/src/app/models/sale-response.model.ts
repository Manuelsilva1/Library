export interface SaleResponse {
  saleId: number; // Corresponds to Long
  timestamp: string; // Backend LocalDateTime typically maps to ISO string in JSON
  totalAmount: number; // Backend BigDecimal maps to number
}
