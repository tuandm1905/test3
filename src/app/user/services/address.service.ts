import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private jsonURL = 'assets/address.json';

  constructor(private http: HttpClient) { }

  getAddresses(): Observable<any> {
    return this.http.get(this.jsonURL);
  }
}
