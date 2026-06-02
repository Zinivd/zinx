
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { ApiResponse, UserProfile, ProfileUpdatePayload, ChangePasswordPayload } from  '../../models/index';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(API_ENDPOINTS.PROFILE.SHOW);
  }

  updateProfile(payload: ProfileUpdatePayload): Observable<ApiResponse<UserProfile>> {
    const fd = new FormData();
    if (payload.name)        fd.append('name', payload.name);
    if (payload.phone)       fd.append('phone', payload.phone);
    if (payload.designation) fd.append('designation', payload.designation);
    if (payload.address)     fd.append('address', payload.address);
    if (payload.profile_image instanceof File) fd.append('profile_image', payload.profile_image);
    fd.append('_method', 'PUT');
    return this.http.post<ApiResponse<UserProfile>>(API_ENDPOINTS.PROFILE.UPDATE, fd);
  }

  changePassword(payload: ChangePasswordPayload): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, payload);
  }
}
