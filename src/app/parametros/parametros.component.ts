import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

// Interfaces actualizadas
interface TipoParametro {
  id: number;
  tipO_PARAMETRO: string;
  estado: number;
}

interface Parametro {
  id?: number;
  parametro: string;
  valor: string;
  iD_TIPO_PARAMETRO: number; // Cambiado para coincidir con la API
  estado: number;
}

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {
  // Variables de clase
  parametros: Parametro[] = [];
  currentParametro: Parametro = this.getEmptyParametro();
  tipoParametros: TipoParametro[] = [];
  parametroDelete: number | null = null;
  showModalParametro = false;
  showConfirmationDeleteParametro = false;
  searchText: string = '';
  isEditMode = false;
  pagedParametros: any[] = [];
  
  // URLs de la API
  private apiUrl = 'https://localhost:7125/api/Parametro';
  private apiUrlTipoParametro = 'https://localhost:7125/api/TipoParametro';

  // Variables para manejo de errores
  showErrorModal = false;
  errorMessage: { message: string, isError: boolean } = { message: '', isError: true };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Carga inicial de parámetros y tipos de parámetros
    this.loadParametros();
    this.loadTipoParametros();
  }

  // Función para obtener un objeto Parametro vacío
  getEmptyParametro(): Parametro {
    return {
      parametro: '',
      valor: '',
      iD_TIPO_PARAMETRO: 0, // valor por defecto
      estado: 1
    };
  }

  // Función para cargar tipos de parámetros desde la API
  loadTipoParametros(): void {
    this.http.get<any>(`${this.apiUrlTipoParametro}/LstTipoParametros`).subscribe({
      next: response => {
        if (response.estado?.ack) {
          this.tipoParametros = response.body.response;
          // console.log('Tipos de parámetros cargados:', this.tipoParametros);
        } else {
          this.showError(`Error al cargar los tipos de parámetros: ${response.estado?.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los tipos de parámetros:', error);
        this.showError('Error en la solicitud al cargar los tipos de parámetros.', true);
      }
    });
  }

  // Función para filtrar parámetros según el texto de búsqueda
  filteredParametros() {
    return this.parametros.filter(parametro =>
      parametro.parametro.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Función para cargar parámetros desde la API
  loadParametros(): void {
    this.http.get<any>(`${this.apiUrl}/Listar`).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.parametros = response.body.response;
          this.updatePageParametro();
        } else {
          this.showError(`Error al cargar los Parámetros: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
        this.showError('Error en la solicitud al cargar los datos.', true);
      }
    });
  }

  // Función para actualizar la página de parámetros según la paginación
  updatePageParametro(): void {
    const filtered = this.filteredParametros();
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedParametros = filtered.slice(startIndex, endIndex);
    this.paginator.length = filtered.length;
  }

  // Función que se llama cuando cambia el texto de búsqueda
  onSearchChange(): void {
    this.paginator.firstPage();
    this.updatePageParametro();
  }

  // Función para abrir el modal para crear o editar un parámetro
  openModalParametro(parametro?: Parametro): void {
    this.isEditMode = !!parametro; // Establecer modo de edición
    this.currentParametro = parametro ? { ...parametro } : this.getEmptyParametro();
    // Verifica el objeto currentParametro
    // console.log('currentParametro:', this.currentParametro); // Verifica la estructura del objeto
    // console.log('ID_TIPO_PARAMETRO:', this.currentParametro.iD_TIPO_PARAMETRO); // Verifica el valor

    // Asegurarse de que los tipos de parámetros estén cargados
    if (this.tipoParametros.length === 0) {
      this.loadTipoParametros();
    }

    this.showModalParametro = true;
    document.body.classList.add('modal-open');
  }

  // Función para manejar el cambio del estado del parámetro
  onToggleChange(event: MatSlideToggleChange): void {
    this.currentParametro.estado = event.checked ? 1 : 0;
  }

  // Función para cerrar el modal de parámetros
  closeModalParametro(): void {
    this.showModalParametro = false;
    document.body.classList.remove('modal-open');
  }

  // Función para guardar el parámetro (crear o actualizar)
  saveParametro(): void {
    if (this.isEditMode) {
      this.updateParametro();
    } else {
      this.createParametro();
    }
  }

  // Función para crear un nuevo parámetro
  createParametro(): void {
    this.http.post(`${this.apiUrl}/add`, this.currentParametro).subscribe({
      next: (response: any) => {
        if (response.estado.ack) {
          this.showError('Parámetro creado exitosamente.', false);
          this.loadParametros();
          this.closeModalParametro();
        } else {
          this.showError(`Error al crear el Parámetro: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud.', true);
      }
    });
  }

  // Función para actualizar un parámetro existente
  updateParametro(): void {
    const url = `${this.apiUrl}/Actualizar/${this.currentParametro.id}`;
    this.http.put<any>(url, this.currentParametro).subscribe({
      next: (response: any) => {
        if (response?.estado?.ack) {
          this.showError('Parámetro actualizado exitosamente.', false);
          this.loadParametros();
          this.closeModalParametro();
        } else {
          this.showError(`Error al actualizar el Parámetro: ${response?.estado?.errDes || 'Error desconocido'}`, true);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud al actualizar el Parámetro.', true);
      }
    });
  }

  // Función para confirmar la eliminación de un parámetro
  confirmDelete(id: number): void {
    this.parametroDelete = id;
    this.showModalParametro = false;
    this.showConfirmationDeleteParametro = true;
  }

  // Función para cerrar el diálogo de confirmación de eliminación
  closeConfirmationDialog(): void {
    this.showConfirmationDeleteParametro = false;
    this.showModalParametro = true;
    this.parametroDelete = null;
  }

  // Función para eliminar un parámetro
  deleteParametro(): void {
    if (this.parametroDelete !== null) {
      this.http.delete<any>(`${this.apiUrl}/Eliminar/${this.parametroDelete}`).subscribe({
        next: response => {
          if (response.estado.ack) {
            this.showError('Parámetro eliminado exitosamente.', false);
            this.loadParametros();
            this.closeConfirmationDialog();
            this.closeModalParametro();
          } else {
            this.showError(`Error al eliminar el Parámetro: ${response.estado.errDes}`, true);
          }
        },
        error: error => {
          console.error('Error en la solicitud:', error);
          this.showError('Error en la solicitud al eliminar el Parámetro.', true);
        }
      });
    }
  }

  // Función para mostrar mensajes de error
  showError(message: string, isError: boolean): void {
    this.errorMessage = { message, isError };
    this.showErrorModal = true;
  }

  // Función para cerrar el modal de error
  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = { message: '', isError: true };
  }

  // Función que se llama cuando cambia la página en la paginación
  onPageChange(event: PageEvent) {
    this.updatePageParametro();
  }

  // Función para obtener el nombre de un tipo de parámetro según su ID
  getTipoParametroNombre(id: number): string {
    // console.log('ID recibido:', id); // Ver qué ID llega
    // console.log('Lista de tipos:', this.tipoParametros); // Ver qué tipos tenemos disponibles
    
    const tipoParametro = this.tipoParametros.find(tipo => {
        // console.log('Comparando:', tipo.id, 'con', id); // Ver las comparaciones
        return tipo.id === id;
    });
    
    if (!tipoParametro) {
        // console.log(`No se encontró tipo parámetro para ID: ${id}`);
        return `Tipo ${id}`;
    }
    
    return tipoParametro.tipO_PARAMETRO; 
  }
}
