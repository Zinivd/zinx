
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import {
  ApiResponse, PaginatedResponse,
  Employee, EmployeePayload, EmployeeDropdown,
} from '../../models/index';

@Injectable({ providedIn: 'root' })
export class EmployeeService {

  constructor(private http: HttpClient) {}

  getAll(params?: {
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
  }): Observable<PaginatedResponse<Employee>> {
    let httpParams = new HttpParams();
    if (params?.search)    httpParams = httpParams.set('search', params.search);
    if (params?.is_active !== undefined) httpParams = httpParams.set('is_active', String(params.is_active));
    if (params?.page)      httpParams = httpParams.set('page', String(params.page));
    if (params?.per_page)  httpParams = httpParams.set('per_page', String(params.per_page));

    return this.http.get<PaginatedResponse<Employee>>(API_ENDPOINTS.EMPLOYEES.INDEX, { params: httpParams });
  }

  getAllForDropdown(): Observable<ApiResponse<EmployeeDropdown[]>> {
    return this.http.get<ApiResponse<EmployeeDropdown[]>>(API_ENDPOINTS.EMPLOYEES.ALL);
  }

  getById(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(API_ENDPOINTS.EMPLOYEES.SHOW(id));
  }

  create(payload: EmployeePayload): Observable<ApiResponse<Employee>> {
    const form = this.toFormData(payload);
    return this.http.post<ApiResponse<Employee>>(API_ENDPOINTS.EMPLOYEES.CREATE, form);
  }

  update(id: number, payload: Partial<EmployeePayload>): Observable<ApiResponse<Employee>> {
    const form = this.toFormData(payload);
    // Use POST with _method override for file uploads
    form.append('_method', 'PUT');
    return this.http.post<ApiResponse<Employee>>(API_ENDPOINTS.EMPLOYEES.UPDATE(id), form);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(API_ENDPOINTS.EMPLOYEES.DELETE(id));
  }

  toggleStatus(id: number): Observable<ApiResponse<{ is_active: boolean }>> {
    return this.http.patch<ApiResponse<{ is_active: boolean }>>(API_ENDPOINTS.EMPLOYEES.TOGGLE(id), {});
  }

  private toFormData(obj: Record<string, any>): FormData {
    const fd = new FormData();
    Object.entries(obj).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        fd.append(key, val instanceof File ? val : String(val));
      }
    });
    return fd;
  }
}
