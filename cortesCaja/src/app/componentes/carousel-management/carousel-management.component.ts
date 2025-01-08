import { Component, OnInit } from '@angular/core';
import { CarouselService, CarouselImage } from '../../services/carousel.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-carousel-management',
  templateUrl: './carousel-management.component.html',
  styleUrls: ['./carousel-management.component.css'],
})
export class CarouselManagementComponent implements OnInit {
  carouselImages: CarouselImage[] = [];
  homeImages: CarouselImage[] = [];
  newImage: CarouselImage = { title: '', description: '', imageUrl: '', section: 'carousel' };
  fileToUpload: File | null = null;

  constructor(
    private carouselService: CarouselService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    ['carousel', 'home'].forEach((section) => this.loadImagesBySection(section));
  }

  // Cargar imágenes por sección
  loadImagesBySection(section: string): void {
    this.carouselService.getImagesBySection(section).subscribe(
      (images) => {
        if (section === 'carousel') {
          this.carouselImages = images;
        } else if (section === 'home') {
          this.homeImages = images;
        }
      },
      (error) => {
        console.error(`Error al cargar imágenes de la sección ${section}`, error);
      }
    );
  }

  // Manejar el archivo seleccionado
  handleFileInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.fileToUpload = target.files[0];
      console.log('Archivo seleccionado:', this.fileToUpload.name);
    }
  }

  // Agregar una nueva imagen
  addImage(): void {
    if (!this.fileToUpload) {
      console.error('No se ha seleccionado ninguna imagen.');
      return;
    }

    if (!this.newImage.title) {
      console.error('El título es obligatorio.');
      return;
    }

    this.carouselService
      .uploadImageWithSection(
        this.fileToUpload,
        this.newImage.title,
        this.newImage.section,
        this.newImage.description
      )
      .subscribe(
        (response) => {
          console.log('Imagen subida con éxito:', response);
          this.loadImagesBySection(this.newImage.section); // Recargar la sección correspondiente
          this.newImage = { title: '', description: '', imageUrl: '', section: 'carousel' };
          this.fileToUpload = null; // Limpiar el archivo seleccionado
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
        }
      );
  }

  // Eliminar una imagen
  deleteImage(id: number, section: string): void {
    this.carouselService.deleteCarouselImage(id).subscribe(
      () => {
        console.log('Imagen eliminada con éxito');
        this.loadImagesBySection(section); // Recargar la sección correspondiente
      },
      (error) => {
        console.error('Error al eliminar la imagen', error);
      }
    );
  }
  goBack(): void{
    this.location.back();
  }
}
