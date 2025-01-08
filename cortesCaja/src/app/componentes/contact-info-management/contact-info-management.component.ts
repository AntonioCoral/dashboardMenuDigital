import { Component, OnInit } from '@angular/core';
import { ContactInfoService } from '../../services/contactInfo.service';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-contact-info-management',
  templateUrl: './contact-info-management.component.html',
  styleUrls: ['./contact-info-management.component.css'],
})
export class ContactInfoManagementComponent implements OnInit {
  phoneNumber: string = '';
  ubication: string = '';
  openedTime: string = '';
  bankAccount: string = '';
  clabe: string = '';
  bankName: string = '';
  accountHolder: string = '';

  constructor(
    private contactInfoService: ContactInfoService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.loadContactInfo();
  }

  // Cargar la información de contacto
  loadContactInfo(): void {
    this.contactInfoService.getContactInfo().subscribe(
      (response) => {
        this.phoneNumber = response?.phoneNumber || '';
        this.ubication = response?.ubication || '';
        this.openedTime = response?.openedTime || '';
        this.bankAccount = response?.bankAccount || '';
        this.clabe = response?.clabe || '';
        this.bankName = response?.bankName || '';
        this.accountHolder = response?.accountHolder || '';
      },
      (error) => {
        console.error('Error al cargar la información de contacto:', error);
      }
    );
  }

  // Guardar la información de contacto
  saveContactInfo(): void {
    if (!this.phoneNumber) {
      console.error('El número de teléfono es obligatorio');
      return;
    }

    const updatedInfo = {
      phoneNumber: this.phoneNumber,
      ubication: this.ubication,
      openedTime: this.openedTime,
      bankAccount: this.bankAccount,
      clabe: this.clabe,
      bankName: this.bankName,
      accountHolder: this.accountHolder,
    };

    this.contactInfoService.updateContactInfo(updatedInfo).subscribe(
      (response) => {
        console.log('Información de contacto actualizada:', response);
        alert('Información de contacto actualizada con éxito');
      },
      (error) => {
        console.error('Error al actualizar la información de contacto:', error);
      }
    );
  }
  goBack(): void {
    this.location.back();
  }
}
