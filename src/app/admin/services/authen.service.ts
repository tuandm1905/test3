import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseApiService } from '../helpers/base-api.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
	providedIn: 'root'
})
export class AuthenService {

	private apiUrl = 'Authentication';

	constructor(private http: HttpClient, private baseApiService: BaseApiService) { }

	loginAdmin(data: any): Observable<any> {
		const formData = this.baseApiService.setFormData({ ...data, 'Role': 'Admin' })
		return this.baseApiService.postMethod(`${this.apiUrl}/login-admin`, formData)
	}

	decodeToken(token: any) {
		return  jwtDecode(token);
	}


	loginUser(email: string, password: string): Observable<any> {
		const formData = new FormData();
		formData.append('Email', email);
		formData.append('Password', password);
		formData.append('Role', 'User');

		return this.http.post<any>(`${this.apiUrl}/login-user`, formData);
	}

	getUserInfo(): Observable<any> {
		const token = this.getToken();
		const headers = {
			'Authorization': `Bearer ${token}`
		};
		return this.http.get<any>(`${this.apiUrl}/Account`, { headers });
	}

	getToken(): string | null {
		if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
			return localStorage.getItem('token');
		}
		return null;
	}

	getUser(): any {
		if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
			const user = localStorage.getItem('user');
			try {
				return user ? JSON.parse(user) : null;
			} catch (e) {
				console.error('Failed to parse user from localStorage', e);
				return null;
			}
		}
		return null;
	}

	getUserType(): string | null {
		if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
			return localStorage.getItem('userType');
		}
		return null;
	}

	isLoggedIn(): boolean {
		return this.getToken() !== null;
	}

	forgotPassword(email: string): Observable<any> {
		const url = `${this.apiUrl}/forgot-password`;
		const body = JSON.stringify(email);
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http.post<any>(url, body, { headers, responseType: 'text' as 'json' });
	}

	verifyCode(email: string, code: string): Observable<any> {
		const url = `${this.apiUrl}/verify-code`;
		const body = { email, code };
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http.post(url, body, { headers, responseType: 'text' });
	}

	resetPassword(email: string, newPassword: string, confirmPassword: string): Observable<any> {
		const url = `${this.apiUrl}/reset-password`;
		const body = { email, newPassword, confirmPassword };
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http.post<any>(url, body, { headers });
	}

	registerUser(user: any): Observable<any> {
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http.post<any>(`${this.apiUrl}/register-user`, user, { headers, responseType: 'text' as 'json' });
	}

	verifyUser(user: any): Observable<any> {
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http.post<any>(`${this.apiUrl}/verify-user`, user, { headers, responseType: 'text' as 'json' });
	}


	logout(): void {
		if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
			localStorage.removeItem('token');
			localStorage.removeItem('userType');
			localStorage.removeItem('user');
		}
	}
}
