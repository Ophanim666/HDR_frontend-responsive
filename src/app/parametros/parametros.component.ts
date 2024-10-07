import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css'],
})
export class ParametrosComponent implements OnInit {
  parametros: any[] = [];
  currentParametro: any = {};
  parametroDelete: number | null = null;
  showModalParametro = false;
  showConfirmationDeleteParametro = false;
  searchText: string = '';
  isEditMode = false;
  pagedParametros: any[] = [];

  tipoParametros: any[] = [];

  private apiUrl = 'https://localhost:7125/api/Parametro';
  private apiUrl1 = 'https://localhost:7125/api/TipoParametro';

  showErrorModal = false;
  errorMessage: { message: string, isError: boolean } = { message: '', isError: true };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  // Cargar datos
  ngOnInit(): void {
    this.loadParametros();
    this.loadTipoParametros();
  }

  // Filtrar parámetros
  filteredParametros() {
    return this.parametros.filter(parametro =>
      parametro.parametro.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Listar o cargar parámetros
  loadParametros(): void {
    this.http.get<any>(`${this.apiUrl}/Listar`).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.parametros = response.body.response;
          this.updatePagedParametros();
          console.log('Parámetros cargados:', this.parametros);
        }else{
          this.showError(`Error al cargar los parámetros: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
        this.showError('Error en la solicitud al cargar los datos.', true);
      },
      complete: () => console.log('Carga de parámetros completa')
    });
  }

  // Listar o cargar tipo parámetros
  loadTipoParametros(): void {
    this.http.get<any>(`${this.apiUrl1}/TipoParametro/LstTipoParametro`).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.tipoParametros = response.body.response.map((tipo: any) => ({
            value: tipo.id,
            viewValue: tipo.nombre
          }));
        } else {
          this.showError(`Error al cargar los tipos de parámetro: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los tipos de parámetro:', error);
        this.showError('Error en la solicitud al cargar los tipos de parámetro.', true);
      }
    });
  }

  // Actualizar los parámetros paginados
  updatePagedParametros(): void {
    const filtered = this.filteredParametros();
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedParametros = filtered.slice(startIndex, endIndex);
    this.paginator.length = filtered.length;
  }

   // Método que se llama cuando cambia el texto de búsqueda
  onSearchChange(): void {
    this.paginator.firstPage();
    this.updatePagedParametros();
  }

  // Abrir el modal de parámetro
  openModalParametro(parametro?: any): void {
    this.isEditMode = !!parametro;
    this.currentParametro = parametro ? { ...parametro } : {
      id: 0,
      parametro: '',
      valor: '',
      iD_TIPO_PARAMETRO: null,
      estado: 1,
    };
    this.showModalParametro = true;
    document.body.classList.add('modal-open');
  }

  // Método que maneja el cambio en el toggle de estado de parámetro
  onToggleChange(event: MatSlideToggleChange): void {
    this.currentParametro.estado = event.checked ? 1 : 0;
  }

  // Cerrar el modal de parámetro
  closeModalParametro(): void {
    this.showModalParametro = false;
    document.body.classList.remove('modal-open');
  }

  // Método para guardar un parámetro
  saveParametro(): void {
    if (this.isEditMode) {
      this.updateParametro();
    } else {
      this.createParametro();
    }
  }

  // Crear un nuevo parámetro
  createParametro(): void {
    this.http.post(`${this.apiUrl}/add`, this.currentParametro).subscribe({
      next: (response: any) => {
        if (response.estado.ack) {
          console.log('Parámetro creado:', response);
          this.showError('Parámetro creado exitosamente.', false);
          this.loadParametros();
          this.closeModalParametro();
        } else {
          this.showError(`Error al crear el parámetro: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud.', true);
      }
    });
  }

  // Editar un parámetro existente
  updateParametro(): void {
    const url = `${this.apiUrl}/Actualizar/${this.currentParametro.id}`;
    const updatedData = {
      nombre: this.currentParametro.nombre,
      estado: this.currentParametro.estado
    };

    this.http.put<any>(url, this.currentParametro).subscribe({
      next: (response: any) => {
        if (response?.estado?.ack) {
          console.log('Parámetro actualizado:', response);
          this.showError('Parámetro actualizado exitosamente.', false);
          this.loadParametros();
          this.closeModalParametro();
        } else {
          this.showError(`Error al actualizar parámetro: ${response?.estado?.errDes || 'Error desconocido'}`, true);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud al actualizar el parámetro.', true);
      }
    });
  }

  // Confirmar la eliminación de parámetro
  confirmDelete(id: number): void {
    this.parametroDelete = id;
    this.showModalParametro = false;
    this.showConfirmationDeleteParametro = true;
  }

  // Cerrar el diálogo de confirmación de eliminación
  closeConfirmationDialog(): void {
    this.showConfirmationDeleteParametro = false;
    this.showModalParametro = true;
    this.parametroDelete = null;
  }

// Eliminar parámetro
  deleteParametro(): void {
    if (this.parametroDelete !== null) {
      this.http.delete<any>(`${this.apiUrl}/${this.parametroDelete}`).subscribe({
        next: response => {
          if (response.estado.ack) {
            console.log('Parámetro eliminado:', response);
            this.showError('Parámetro eliminado exitosamente.', false);
            this.loadParametros();
            this.closeConfirmationDialog();
            this.closeModalParametro();
          } else {
            this.showError(`Error al eliminar parámetro: ${response.estado.errDes}`, true);
          }
        },
        error: error => {
          console.error('Error en la solicitud:', error);
          this.showError('Error en la solicitud al eliminar el parámetro.', true);
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
    this.updatePagedParametros();
  }
}