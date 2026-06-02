
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { DashboardData } from '../../models/index';
import {
  ApiResponse, PaginatedResponse,
  CashBook, CashBookPayload, CashEntry, CashEntryPayload,
} from  '../../models/index';

@Injectable({ providedIn: 'root' })
export class CashBookService {

  constructor(private http: HttpClient) {}

  // ── Books ──────────────────────────────────────────────
  getAll(params?: { search?: string; page?: number; per_page?: number }): Observable<PaginatedResponse<CashBook>> {
    let httpParams = new HttpParams();
    if (params?.search)   httpParams = httpParams.set('search', params.search);
    if (params?.page)     httpParams = httpParams.set('page', String(params.page));
    if (params?.per_page) httpParams = httpParams.set('per_page', String(params.per_page));
    return this.http.get<PaginatedResponse<CashBook>>(API_ENDPOINTS.CASH_BOOKS.INDEX, { params: httpParams });
  }

  getById(id: number): Observable<ApiResponse<CashBook>> {
    return this.http.get<ApiResponse<CashBook>>(API_ENDPOINTS.CASH_BOOKS.SHOW(id));
  }

  create(payload: CashBookPayload): Observable<ApiResponse<CashBook>> {
    return this.http.post<ApiResponse<CashBook>>(API_ENDPOINTS.CASH_BOOKS.CREATE, payload);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(API_ENDPOINTS.CASH_BOOKS.DELETE(id));
  }

  // ── Entries ────────────────────────────────────────────
  getEntries(bookId: number, params?: {
    search?: string;
    category?: string;
    page?: number;
    per_page?: number;
  }): Observable<PaginatedResponse<CashEntry>> {
    let httpParams = new HttpParams();
    if (params?.search)   httpParams = httpParams.set('search', params.search);
    if (params?.category) httpParams = httpParams.set('category', params.category);
    if (params?.page)     httpParams = httpParams.set('page', String(params.page));
    if (params?.per_page) httpParams = httpParams.set('per_page', String(params.per_page));
    return this.http.get<PaginatedResponse<CashEntry>>(API_ENDPOINTS.CASH_BOOKS.ENTRIES(bookId), { params: httpParams });
  }

  addEntry(bookId: number, payload: CashEntryPayload): Observable<ApiResponse<CashEntry>> {
    return this.http.post<ApiResponse<CashEntry>>(API_ENDPOINTS.CASH_BOOKS.ADD_ENTRY(bookId), payload);
  }

  deleteEntry(bookId: number, entryId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(API_ENDPOINTS.CASH_BOOKS.DEL_ENTRY(bookId, entryId));
  }
}
