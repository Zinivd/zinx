
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import {
  ApiResponse, PaginatedResponse,
  Project, ProjectPayload, ProjectDropdown,
} from '../../models/index';

@Injectable({ providedIn: 'root' })
export class ProjectService {

  constructor(private http: HttpClient) {}

  getAll(params?: {
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
  }): Observable<PaginatedResponse<Project>> {
    let httpParams = new HttpParams();
    if (params?.search)   httpParams = httpParams.set('search', params.search);
    if (params?.is_active !== undefined) httpParams = httpParams.set('is_active', String(params.is_active));
    if (params?.page)     httpParams = httpParams.set('page', String(params.page));
    if (params?.per_page) httpParams = httpParams.set('per_page', String(params.per_page));

    return this.http.get<PaginatedResponse<Project>>(API_ENDPOINTS.PROJECTS.INDEX, { params: httpParams });
  }

  getAllForDropdown(): Observable<ApiResponse<ProjectDropdown[]>> {
    return this.http.get<ApiResponse<ProjectDropdown[]>>(API_ENDPOINTS.PROJECTS.ALL);
  }

  getById(id: number): Observable<ApiResponse<Project>> {
    return this.http.get<ApiResponse<Project>>(API_ENDPOINTS.PROJECTS.SHOW(id));
  }

  create(payload: ProjectPayload): Observable<ApiResponse<Project>> {
    return this.http.post<ApiResponse<Project>>(API_ENDPOINTS.PROJECTS.CREATE, payload);
  }

  update(id: number, payload: Partial<ProjectPayload>): Observable<ApiResponse<Project>> {
    return this.http.put<ApiResponse<Project>>(API_ENDPOINTS.PROJECTS.UPDATE(id), payload);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(API_ENDPOINTS.PROJECTS.DELETE(id));
  }

  toggleStatus(id: number): Observable<ApiResponse<{ is_active: boolean }>> {
    return this.http.patch<ApiResponse<{ is_active: boolean }>>(API_ENDPOINTS.PROJECTS.TOGGLE(id), {});
  }
}
