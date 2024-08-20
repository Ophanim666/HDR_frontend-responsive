import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gestion-tipo-parametros',
  templateUrl: './gestion-tipo-parametros.component.html',
  styleUrls: ['./gestion-tipo-parametros.component.css']
})
export class GestionTipoParametrosComponent implements OnInit {
  tipoParametros: any[] = [];
  showCreateModal = false;
  showEditModal = false;
  showConfirmationDialog = false;
  currentTipoParametro: any = {};
  newTipoParametro: any = {};
  tipoParametroToDelete: number | null = null;


  private apiUrl = 'https://localhost:7125/api/TipoParametro';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTipoParametros();
  }

  // Listar datos de tipo de parámetro
  loadTipoParametros(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: response => this.tipoParametros = response,
      error: error => console.error('Error al cargar los datos:', error),
      complete: () => console.log('Carga de tipos de parámetros completa')
    });
  }

  // Abrir el modal de creación
  openCreateModal(): void {
    this.newTipoParametro = {
      id: 0,
      tipO_PARAMETRO: '',
      estado: 1,
      usuariO_CREACION: '',
      fechA_CREACION: ''
    };
    this.showCreateModal = true;
  }

  // Cerrar el modal de creación
  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  // Crear tipo de parámetro
  createTipoParametro(): void {
    this.http.post(this.apiUrl, this.newTipoParametro, { responseType: 'text' })
      .subscribe({
        next: response => {
          console.log('Tipo de Parámetro creado:', response);
          alert('Tipo de Parámetro creado exitosamente.');
          this.loadTipoParametros(); // Actualizar la lista
          this.closeCreateModal();
        },
        error: error => {
          console.error('Error al crear el Tipo de Parámetro:', error);
          alert('Error al crear el Tipo de Parámetro.');
        }
      });
  }

  // Abrir el modal de edición
  openEditModal(tipoParametro: any): void {
    this.currentTipoParametro = { ...tipoParametro }; // Copiar los datos para edición
    this.showEditModal = true;
  }

  // Cerrar el modal de edición
  closeEditModal(): void {
    this.showEditModal = false;
  }

  // Actualizar el tipo de parámetro
  updateTipoParametro(): void {
    const url = `${this.apiUrl}/${this.currentTipoParametro.id}`;
    const updatedData = {
      tipO_PARAMETRO: this.currentTipoParametro.tipO_PARAMETRO,
      estado: this.currentTipoParametro.estado,
      usuariO_CREACION: this.currentTipoParametro.usuariO_CREACION,
      fechA_CREACION: this.currentTipoParametro.fechA_CREACION
    };

    this.http.put(url, updatedData, { responseType: 'text' }).subscribe({
      next: response => {
        console.log('Tipo de Parámetro actualizado:', response);
        alert('Tipo de Parámetro actualizado exitosamente.');
        this.loadTipoParametros(); // Actualizar la lista
        this.closeEditModal();
      },
      error: error => {
        console.error('Error al actualizar el Tipo de Parámetro:', error);
        alert('Error al actualizar el Tipo de Parámetro.');
      }
    });
  }

  // Abrir el modal de confirmación de eliminación
  confirmDelete(id: number): void {
    this.tipoParametroToDelete = id;
    this.showConfirmationDialog = true;
  }

  // Eliminar tipo de parámetro
  deleteTipoParametro(): void {
    if (this.tipoParametroToDelete !== null) {
      this.http.delete(`${this.apiUrl}/${this.tipoParametroToDelete}`, { responseType: 'text' }).subscribe({
        next: response => {
          console.log('Tipo de Parámetro eliminado:', response);
          alert('Tipo de Parámetro eliminado exitosamente.');
          this.loadTipoParametros(); // Actualizar la lista
          this.closeConfirmationDialog();
        },
        error: error => {
          console.error('Error al eliminar el Tipo de Parámetro:', error);
          alert('Error al eliminar el Tipo de Parámetro.');
        }
      });
    }
  }

  // Cerrar el modal de confirmación
  closeConfirmationDialog(): void {
    this.showConfirmationDialog = false;
    this.tipoParametroToDelete = null;
  }


}
