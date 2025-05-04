import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EcommerceService } from 'src/app/services/ecommerce.service';
import { Location } from '@angular/common';
import { IProduct } from 'src/app/interfaces/interface';
import { ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  form: FormGroup;
  categories: any[] = [];
  loading: boolean = false;
  selectedFile: File | null = null;
  importedProducts: any[] = [];
  searchQuery: string = '';
  isEditing: boolean = false;
  searchResults: IProduct[] = [];
  showSearchModal: boolean = false;
  deletingProductId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private ecommerceService: EcommerceService,
    private toastr: ToastrService,
    private router: Router,
    private location: Location
  ) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      cost: ['', Validators.required],
      price: ['', Validators.required],
      barcode: ['', Validators.required],
      image: [''],
      categoryId: [''],
      options: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProductOptions();
  }

  loadCategories() {
    this.ecommerceService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadProductOptions() {
    this.ecommerceService.getProductOptions().subscribe((options: any[]) => {
      options.forEach(option => this.addOptionToForm(option));
    });
  }

  get options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  addOptionToForm(option?: any) {
    const optionGroup = this.fb.group({
      description: [option?.description || '', Validators.required],
      price: [option?.price || '', Validators.required]
    });
    this.options.push(optionGroup);
  }

  addNewPriceOption() {
    this.addOptionToForm();
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  addProduct() {
    if (this.form.invalid && this.importedProducts.length === 0) {
      this.toastr.error('Formulario inválido o no hay productos importados');
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('cost', this.form.get('cost')?.value);
    formData.append('price', this.form.get('price')?.value);
    formData.append('barcode', this.form.get('barcode')?.value);
    formData.append('categoryId', this.form.get('categoryId')?.value);
    formData.append('options', JSON.stringify(this.options.value));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditing) {
      const productId = this.form.get('id')?.value;
      this.ecommerceService.updateProduct(productId, formData).subscribe(
        () => {
          this.loading = false;
          this.toastr.success('Producto actualizado con éxito');
          this.isEditing = false;
          this.form.reset();
          this.router.navigate(['/admin-products']);
        },
        (error) => {
          this.loading = false;
          this.toastr.error('Error al actualizar el producto');
        }
      );
    } else {
      this.ecommerceService.createProduct(formData).subscribe(
        () => {
          this.loading = false;
          this.toastr.success('Producto agregado con éxito');
          this.router.navigate(['/admin-products']);
           // ✅ Limpiar formulario
          this.form.reset();
          this.options.clear(); // limpia las opciones
          this.selectedFile = null;
          this.isEditing = false;
          this.searchQuery = '';
          // ✅ Limpiar manualmente el campo de imagen en el DOM
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        },
        (error) => {
          this.loading = false;
          this.toastr.error('Error al agregar el producto');
        }
      );
    }
  }

  searchProduct() {
    if (!this.searchQuery.trim()) return;

    this.ecommerceService.searchProducts(this.searchQuery).subscribe(products => {
      if (products.length > 0) {
        this.searchResults = products;
        this.showSearchModal = true;
        this.searchQuery = '';
      } else {
        this.toastr.error('Producto no encontrado');
      }
    }, error => {
      this.toastr.error('Error en la búsqueda de productos');
    });
  }

  selectProduct(product: IProduct): void {
    this.showSearchModal = false;
    this.isEditing = true;

    this.form.patchValue({
      id: product.id,
      name: product.name,
      cost: product.cost,
      price: product.price,
      stock: product.stock,
      barcode: product.barcode,
      categoryId: product.categoryId
    });

    this.options.clear();
    if (product.options?.length) {
      product.options.forEach(opt => this.addOptionToForm(opt));
    }
  }

  confirmDelete(productId: number): void {
    this.deletingProductId = productId;
  }

  cancelDelete(): void {
    this.deletingProductId = null;
  }

  deleteProduct(): void {
    if (!this.deletingProductId) return;

    this.ecommerceService.deleteProduct(this.deletingProductId).subscribe({
      next: () => {
        this.toastr.success('Producto eliminado correctamente');
        this.searchResults = this.searchResults.filter(p => p.id !== this.deletingProductId);
        this.deletingProductId = null;
      },
      error: (err) => {
        this.toastr.error('Error al eliminar el producto');
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
