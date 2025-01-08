import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/interfaces/order';

@Component({
  selector: 'app-orders-by-date',
  templateUrl: './orders-by-date.component.html',
  styleUrls: ['./orders-by-date.component.css']
})
export class OrdersByDateComponent implements OnInit {
  selectedDate: string = '';
  orders: Order[] = [];
  subdomain: string = ''; // Subdominio dinámico

  constructor(private _orderService: OrderService) {
    
  }

  ngOnInit(): void {
    this.getSubdomain();
  }


  getSubdomain(): void {
    const hostname = window.location.hostname; // Obtener el hostname completo
    const parts = hostname.split('.'); // Dividir por '.'

    // Si hay más de 2 partes (por ejemplo, subdominio.dominio.com)
    if (parts.length > 2) {
      this.subdomain = parts[0]; // El primer segmento es el subdominio
    } else {
      
    }
  }

  onSubmit(): void {
    if (this.selectedDate) {
      this._orderService.getOrdersByDate(this.selectedDate).subscribe((data: Order[]) => {
        this.orders = data;
      });
    }
  }
}
