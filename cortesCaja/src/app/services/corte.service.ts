import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CorteCaja, PedidosTransitos } from '../interfaces/corte';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CorteCajaService {
 //private apiUrl = 'https://codeconnectivity.com/api/api/caja/';
   private apiUrl = 'https://codeconnectivity.com/apilinea/api/caja/';
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para crear un nuevo corte de caja
  crearCorte(corte: CorteCaja): Observable<CorteCaja> {
    
    return this.http.post<CorteCaja>(this.apiUrl, corte, {
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para obtener todos los cortes de caja
  obtenerCortes(): Observable<CorteCaja[]> {
    return this.http.get<CorteCaja[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCortesByDate(date: string, subdomain: string): Observable<CorteCaja[]> {
    const token = this.authService.getToken();
    const companyId = this.authService.getCompanyId();

    if (!token || !companyId) {
      throw new Error('No autorizado: falta token o companyId');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<CorteCaja[]>(`${this.apiUrl}date/${date}`, {
      params: { companyId: companyId.toString() }, // Envía el companyId como parámetr
    }).pipe(
      map(cortes => cortes.map(corte => ({
        ...corte,
        denominaciones: corte.denominaciones.map(denom => ({
          id: denom.id,
          denominacion: denom.denominacion,
          cantidad: denom.cantidad
        }))
      })))
    );
  }
  
  


  getUltimoCorteByCaja(numeroCaja: number): Observable<CorteCaja> {
    return this.http.get<CorteCaja>(`${this.apiUrl}/ultimo-corte/${numeroCaja}`);
  }

  actualizarCorte(corte: CorteCaja): Observable<any> {
    return this.http.put(`${this.apiUrl}${corte.id}`, corte);
  }
  

  actualizarEstadoPedido(corteId: number, pedido: PedidosTransitos): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${corteId}/pedidos/${pedido.id}`, pedido);
  }

  // Método para manejar errores de la petición HTTP
  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    throw error;
  }
}
