import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactInfoService {
  private apiUrl = 'https://codeconnectivity.com/apilinea/api/contact';

  constructor(private http: HttpClient) {}

  // Obtener la información de contacto
  getContactInfo(): Observable<{
    phoneNumber: string;
    ubication: string;
    openedTime: string;
    bankAccount: string;
    clabe: string;
    bankName: string;
    accountHolder: string;
  }> {
    return this.http.get<{
      phoneNumber: string;
      ubication: string;
      openedTime: string;
      bankAccount: string;
      clabe: string;
      bankName: string;
      accountHolder: string;
    }>(`${this.apiUrl}`);
  }

  // Actualizar la información de contacto
  updateContactInfo(contactInfo: {
    phoneNumber: string;
    ubication: string;
    openedTime: string;
    bankAccount: string;
    clabe: string;
    bankName: string;
    accountHolder: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, contactInfo);
  }
}
