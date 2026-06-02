
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { ApiResponse, PaginatedResponse, Task, TaskPayload } from '../../models/index';

@Injectable({ providedIn: 'root' })
export class TaskService {

  constructor(private http: HttpClient) {}

  getAll(params?: {
    search?: string;
    status?: string;
    project_id?: number;
    page?: number;
    per_page?: number;
  }): Observable<PaginatedResponse<Task>> {
    let httpParams = new HttpParams();
    if (params?.search)     httpParams = httpParams.set('search', params.search);
    if (params?.status)     httpParams = httpParams.set('status', params.status);
    if (params?.project_id) httpParams = httpParams.set('project_id', String(params.project_id));
    if (params?.page)       httpParams = httpParams.set('page', String(params.page));
    if (params?.per_page)   httpParams = httpParams.set('per_page', String(params.per_page));

    return this.http.get<PaginatedResponse<Task>>(API_ENDPOINTS.TASKS.INDEX, { params: httpParams });
  }

  getById(id: number): Observable<ApiResponse<Task>> {
    return this.http.get<ApiResponse<Task>>(API_ENDPOINTS.TASKS.SHOW(id));
  }

  create(payload: TaskPayload): Observable<ApiResponse<Task>> {
    return this.http.post<ApiResponse<Task>>(API_ENDPOINTS.TASKS.CREATE, payload);
  }

  update(id: number, payload: Partial<TaskPayload>): Observable<ApiResponse<Task>> {
    return this.http.put<ApiResponse<Task>>(API_ENDPOINTS.TASKS.UPDATE(id), payload);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(API_ENDPOINTS.TASKS.DELETE(id));
  }
}
