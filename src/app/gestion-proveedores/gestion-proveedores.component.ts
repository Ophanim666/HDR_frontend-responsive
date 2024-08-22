import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-gestion-proveedores',
  templateUrl: './gestion-proveedores.component.html',
  styleUrls: ['./gestion-proveedores.component.css']
})
export class GestionProveedoresComponent implements OnInit {
  proveedores: any[] = [];
  showConfirmationDialog = false;
  proveedorIdToDelete: number | null = null;
  nuevoProveedor: any = {};
  showCreateModal = false;
  proveedorToEdit: any = null;

  private apiUrl = 'https://localhost:7125/api/Proveedor';

  // Abrir el modal de creación
  openCreateModal(): void {
    this.nuevoProveedor = {
        nombre: '',
        razoN_SOCIAL: '',
        rut: '',
        dv: '',
        nombrE_CONTACTO_PRINCIPAL: '',
        numerO_CONTACTO_PRINCIPAL: '',
        nombrE_CONTACTO_SECUNDARIO: '',
        numerO_CONTACTO_SECUNDARIO: '',
        estado: '',
        usuariO_CREACION: '',
        fechA_CREACION: ''
    };
    this.showCreateModal = true;
  }

  // Cerrar el modal de creación
  closeCreateModal(): void {
    this.showCreateModal = false;
  }


  // //Modal de Edicion
  // openCreateModal(): void {
  //   this.nuevoProveedor = {
  //       nombre: '',
  //       razoN_SOCIAL: '',
  //       rut: '',
  //       dv: '',
  //       nombrE_CONTACTO_PRINCIPAL: '',
  //       numerO_CONTACTO_PRINCIPAL: '',
  //       nombrE_CONTACTO_SECUNDARIO: '',
  //       numerO_CONTACTO_SECUNDARIO: '',
  //       estado: '',
  //       usuariO_CREACION: '',
  //       fechA_CREACION: ''
  //   };
  //   this.showCreateModal = true;
  // }


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  // Listar datos de proveedores
loadProveedores(): void {
  this.http.get<any[]>(this.apiUrl).subscribe({
    next: response => this.proveedores = response,
    error: error => console.log(error),
    complete: () => console.log('La solicitud está completa')
  });
}

// Agregar Proveedor
 addProveedor(): void {
   this.http.post(this.apiUrl, this.nuevoProveedor,{ responseType:'text'}).subscribe({
     next: response => {
      console.log('Proveedor Agregado Exitosamente!!', response);
      alert('Proveedor Agregado Exitosamente');
      this.loadProveedores();
      this.closeCreateModal();
    },
    error: error => console.log('Error al agregar proveedor:', error),
     complete: () => console.log('La solicitud de agregar proveedor está completa')
   });
 }


  // Confirmar eliminación
  confirmDelete(id: number): void {
    this.proveedorIdToDelete = id;
    this.showConfirmationDialog = true;
  }

  // Eliminar proveedor
  deleteProveedor(): void {
    if (this.proveedorIdToDelete !== null) {
      const url = `${this.apiUrl}/${this.proveedorIdToDelete}`;
      this.http.delete(url, { responseType: 'text' })
        .subscribe({
          next: response => {
            console.log(response);
            alert(response); // Mostrar la respuesta del servidor
            // Actualizar la lista después de eliminar
            this.proveedores = this.proveedores.filter(proveedor => proveedor.id !== this.proveedorIdToDelete);
            this.cancelDelete();
          },
          error: error => {
            console.error('Error eliminando el proveedor:', error);
            alert('Error eliminando el proveedor.');
          }
        });
    }
  }

  // Cancelar eliminación
  cancelDelete(): void {
    this.showConfirmationDialog = false;
    this.proveedorIdToDelete = null;
  }
}
