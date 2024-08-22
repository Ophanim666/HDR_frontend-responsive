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
  currentProveedor: any = {};
  showEditModal = false;

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

  // Abrir el modal de edición
  openEditModal(proveedores: any): void {
    this.currentProveedor = { ...proveedores }; 
    this.showEditModal = true;
  }

  // Cerrar el modal de edición
  closeEditModal(): void {
    this.showEditModal = false;
  }



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

 // Editar Proveedor
 updateProveedor(): void{
  const url = `${this.apiUrl}/${this.currentProveedor.id}`;
  const updatedData = {
        nombre: this.currentProveedor.nombre,
        razoN_SOCIAL: this.currentProveedor.razoN_SOCIAL,
        rut: this.currentProveedor.rut,
        dv: this.currentProveedor.dv,
        nombrE_CONTACTO_PRINCIPAL: this.currentProveedor.nombrE_CONTACTO_PRINCIPAL,
        numerO_CONTACTO_PRINCIPAL: this.currentProveedor.numerO_CONTACTO_PRINCIPAL,
        nombrE_CONTACTO_SECUNDARIO: this.currentProveedor.nombrE_CONTACTO_SECUNDARIO,
        numerO_CONTACTO_SECUNDARIO: this.currentProveedor.numerO_CONTACTO_SECUNDARIO,
        estado: this.currentProveedor.estado,
        usuariO_CREACION: this.currentProveedor.usuariO_CREACION,
        fechA_CREACION: this.currentProveedor.fechA_CREACION
  };

  this.http.put(url, updatedData, {responseType: 'text'}).subscribe({
    next: response => {
      console.log('Proveedor Actualizado',response);
      alert('Proveedor Actualizado Exitosamente');
      this.loadProveedores();
      this.closeEditModal();
    },
    error: error => {
      console.error ('Error al actualizar el Proveedor');
      alert ('Error al actualizar el Proveedor');
    }
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
