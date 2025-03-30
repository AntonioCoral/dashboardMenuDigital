import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import path from 'path';

export interface CarouselImage {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  isActive?: boolean;
  section: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  private baseUrl = 'http://localhost:500/'; // Cambia la URL según tu configuración
  private apiUrl = 'api/carousel'

  constructor(private http: HttpClient) {}

  // Obtener todas las imágenes

  getImagesBySection(section: string): Observable<CarouselImage[]> {
    return this.http.get<CarouselImage[]>(`${this.baseUrl}${this.apiUrl}/${section}`).pipe(
      map(images =>
        images.map(image => ({
          ...image,  
        }))
      )
    );
  }
  

  // Agregar una nueva imagen
  addCarouselImage(image: CarouselImage): Observable<CarouselImage> {
    return this.http.post<CarouselImage>(`${this.baseUrl}${this.apiUrl}`, image);
  }

  // Actualizar una imagen
  updateCarouselImage(id: number, image: CarouselImage): Observable<any> {
    return this.http.put(`${this.apiUrl}${this.apiUrl}/${id}`, image);
  }

  // Eliminar una imagen
  deleteCarouselImage(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${this.apiUrl}/${id}`);
  }
  //subir imagen por seccion al servidor

  uploadImageWithSection(file: File, title: string, section: string, description?: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('section', section);
    if (description) formData.append('description', description);
  
    return this.http.post(`${this.baseUrl}${this.apiUrl}/upload`, formData);
  }
  
}
