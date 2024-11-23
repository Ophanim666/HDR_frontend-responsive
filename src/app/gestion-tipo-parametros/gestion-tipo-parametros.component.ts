import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-gestion-tipo-parametros',
  templateUrl: './gestion-tipo-parametros.component.html',
  styleUrls: ['./gestion-tipo-parametros.component.css'],
})
export class GestionTipoParametrosComponent implements OnInit {
  tipoParametros: any[] = [];
  currentTipoParametro: any = {};
  tipoParametroDelete: number | null = null;
  showModalTipoParametro = false;
  showConfirmationDeleteTipoParametro = false;
  searchText: string = '';
  isEditMode = false;
  pagedTipoParametros: any[] = [];

  private apiUrl = 'https://localhost:7125/api/TipoParametro';

  showErrorModal = false;
  errorMessage: { message: string, isError: boolean } = { message: '', isError: true };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  // Cargar datos
  ngOnInit(): void {
    this.loadTipoParametros();
  }
  // Filtrar tipo parámetros
  filteredTipoParametros() {
    return this.tipoParametros.filter(tipoParametro =>
      tipoParametro.tipO_PARAMETRO.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Listar o cargar especialidades
  loadTipoParametros(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.tipoParametros = response.body.response;
          this.updatePagedTipoParametros();
          // console.log('Tipos de parámetros cargados:', this.tipoParametros);
        } else {
          this.showError(`Error al cargar los tipos de parámetros: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
        this.showError('Error en la solicitud al cargar los datos.', true);
      },
      // complete: () => console.log('Carga de tipos de parámetros completa')
    });
  }

  // Actualizar los tipos de parámetro paginados
  updatePagedTipoParametros(): void {
    const filtered = this.filteredTipoParametros();
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedTipoParametros = filtered.slice(startIndex, endIndex);
    this.paginator.length = filtered.length;
  }

  // Método que se llama cuando cambia el texto de búsqueda
  onSearchChange(): void {
    this.paginator.firstPage();
    this.updatePagedTipoParametros();
  }

  // Abrir el modal de tipo parámetro
  openModalTipoParametro(tipoParametro?: any): void {
    this.isEditMode = !!tipoParametro;
    this.currentTipoParametro = tipoParametro ? { ...tipoParametro } : {
      id: 0,
      tipO_PARAMETRO: '',
      estado: 1,
    };
    this.showModalTipoParametro = true;
    document.body.classList.add('modal-open');
  }

  // Método que maneja el cambio en el toggle de estado de tipo parámetro
  onToggleChange(event: MatSlideToggleChange): void {
    this.currentTipoParametro.estado = event.checked ? 1 : 0;
  }

  // Cerrar el modal de tipo parámetro
  closeModalTipoParametro(): void {
    this.showModalTipoParametro = false;
    document.body.classList.remove('modal-open');
  }

  // Método para guardar tipo parámetro
  saveTipoParametro(): void {
    if (this.isEditMode) {
      this.updateTipoParametro();
    } else {
      this.createTipoParametro();
    }
  }

  // Crear un nuevo tipo parámetro
  createTipoParametro(): void {
    this.http.post(`${this.apiUrl}/add`, this.currentTipoParametro).subscribe({
      next: (response: any) => {
        if (response.estado.ack) {
          // console.log('Tipo de parámetro creado:', response);
          this.showError('Tipo de parámetro creado exitosamente.', false);
          this.loadTipoParametros();
          this.closeModalTipoParametro();
        } else {
          this.showError(`Error al crear tipo de parámetro: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud.', true);
      }
    });
  }

  // Editar un tipo parámetro
  updateTipoParametro(): void {
    const url = `${this.apiUrl}/${this.currentTipoParametro.id}`;
    const updatedData = {
      tipO_PARAMETRO: this.currentTipoParametro.tipO_PARAMETRO,
      estado: this.currentTipoParametro.estado
    };

    this.http.put<any>(url, updatedData).subscribe({
      next: (response: any) => {
        if (response?.estado?.ack) {
          // console.log('Tipo de parámetro actualizado:', response);
          this.showError('Tipo de parámetro actualizado exitosamente.', false);
          this.loadTipoParametros();
          this.closeModalTipoParametro();
        } else {
          this.showError(`Error al actualizar el tipo de parámetro: ${response?.estado?.errDes || 'Error desconocido'}`, true);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud al actualizar el tipo de parámetro.', true);
      }
    });
  }

  // Confirmar eliminación de tipo parámetro
  confirmDelete(id: number): void {
    this.tipoParametroDelete = id;
    this.showModalTipoParametro = false;
    this.showConfirmationDeleteTipoParametro = true;
  }

  // Cerrar el diálogo de confirmación de eliminación
  closeConfirmationDialog(): void {
    this.showConfirmationDeleteTipoParametro = false;
    this.showModalTipoParametro = true;
    this.tipoParametroDelete = null;
  }

  // Eliminar tipo parámetro
  deleteTipoParametro(): void {
    if (this.tipoParametroDelete !== null) {
      this.http.delete<any>(`${this.apiUrl}/${this.tipoParametroDelete}`).subscribe({
        next: response => {
          if (response.estado.ack) {
            // console.log('Tipo de parámetro eliminado:', response);
            this.showError('Tipo de parámetro eliminado exitosamente.', false);
            this.loadTipoParametros();
            this.closeConfirmationDialog();
            this.closeModalTipoParametro();
          } else {
            this.showError(`Error al eliminar el tipo de parámetro: ${response.estado.errDes}`, true);
          }
        },
        error: error => {
          console.error('Error en la solicitud:', error);
          this.showError('Error en la solicitud al eliminar el tipo de parámetro.', true);
        }
      });
    }
  }

  // Mostrar un mensaje de error o éxito
  showError(message: string, isError: boolean): void {
    this.errorMessage = { message, isError };
    this.showErrorModal = true;
  }

  // Cerrar el modal de error
  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = { message: '', isError: true };
  }

  // Método que se llama cuando cambia la página en el paginador
  onPageChange(event: PageEvent) {
    this.updatePagedTipoParametros();
  }
}