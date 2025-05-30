export interface ApiError {
  timestamp: string; // Backend LocalDateTime maps to ISO string
  status: number;
  message: string;
  errors?: string[];
  path?: string;
}
