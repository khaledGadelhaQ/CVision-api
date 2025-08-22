export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorDetails {
  field?: string;
  code?: string;
  value?: any;
}
