
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import {
  ApiResponse, PaginatedResponse,
  Invoice, InvoicePayload, InvoiceStatus,
} from  '../../models/index';

@Injectable({ providedIn: 'root' })
export class InvoiceService {

  constructor(private http: HttpClient) {}

  getAll(params?: {
    search?: string;
    status?: InvoiceStatus;
    page?: number;
    per_page?: number;
  }): Observable<PaginatedResponse<Invoice>> {
    let httpParams = new HttpParams();
    if (params?.search)   httpParams = httpParams.set('search', params.search);
    if (params?.status)   httpParams = httpParams.set('status', params.status);
    if (params?.page)     httpParams = httpParams.set('page', String(params.page));
    if (params?.per_page) httpParams = httpParams.set('per_page', String(params.per_page));
    return this.http.get<PaginatedResponse<Invoice>>(API_ENDPOINTS.INVOICES.INDEX, { params: httpParams });
  }

  getById(id: number): Observable<ApiResponse<Invoice>> {
    return this.http.get<ApiResponse<Invoice>>(API_ENDPOINTS.INVOICES.SHOW(id));
  }

  create(payload: InvoicePayload): Observable<ApiResponse<Invoice>> {
    return this.http.post<ApiResponse<Invoice>>(API_ENDPOINTS.INVOICES.CREATE, payload);
  }

  updateStatus(id: number, status: InvoiceStatus): Observable<ApiResponse<Invoice>> {
    return this.http.patch<ApiResponse<Invoice>>(API_ENDPOINTS.INVOICES.UPDATE_STATUS(id), { status });
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(API_ENDPOINTS.INVOICES.DELETE(id));
  }
}

