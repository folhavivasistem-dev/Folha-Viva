/**
 * Tipos fundamentais e comuns da arquitetura do sistema
 */

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditFields {
  createdBy?: string;
  updatedBy?: string;
  version: number;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
}

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
