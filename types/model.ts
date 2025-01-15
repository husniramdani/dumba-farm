export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T
  totalCount: number
  totalPages: number
  currentPage: number
}
