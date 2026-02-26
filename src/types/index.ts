// Shared API response envelope types

export interface ListEnvelope<T> {
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
