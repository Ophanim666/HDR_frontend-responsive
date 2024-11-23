import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-gestion-tarea',
  templateUrl: './gestion-tarea.component.html',
  styleUrls: ['./gestion-tarea.component.css'],
})
export class GestionTareaComponent implements OnInit {
  tareas: any[] = [];
  currentTarea: any = {};
  tareaDelete: number | null = null;
  showModalTarea = false;
  showConfirmationDeleteTarea = false;
  searchText: string = '';
  isEditMode = false;
  pagedTareas: any[] = [];
  private apiUrl = 'https://localhost:7125/api/Tarea';

  showErrorModal = false;
  errorMessage: { message: string, isError: boolean } = { message: '', isError: true };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  // Cargar datos
  ngOnInit(): void {
    this.loadTarea();
  }

  // Filtrar tareas
  filteredTareas() {
    return this.tareas.filter(tarea =>
      tarea.nombre.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Listar o cargar tareas
  loadTarea(): void {
    this.http.get<any>(`${this.apiUrl}/ListarTareas`).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.tareas = response.body.response;
          this.updatePagedTareas();
          // console.log('Tareas cargadas:', this.tareas);
        } else {
          this.showError(`Error al cargar las tareas: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
        this.showError('Error en la solicitud al cargar los datos.', true);
      },
      // complete: () => console.log('Carga de tareas completa')
    });
  }

  // Actualizar las tareas paginadas
  updatePagedTareas(): void {
    const filtered = this.filteredTareas();
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedTareas = filtered.slice(startIndex, endIndex);
    this.paginator.length = filtered.length;
  }

   // Método que se llama cuando cambia el texto de búsqueda
  onSearchChange(): void {
    this.paginator.firstPage();
    this.updatePagedTareas();
  }

  // Abrir el modal de tarea
  openModalTarea(tarea?: any): void {
    this.isEditMode = !!tarea;
    this.currentTarea = tarea ? { ...tarea } : {
      id: 0,
      nombre: '',
      estado: 1,
    };
    this.showModalTarea = true;
    document.body.classList.add('modal-open');
  }

  // Método que maneja el cambio en el toggle de estado de la tarea
  onToggleChange(event: MatSlideToggleChange): void {
    this.currentTarea.estado = event.checked ? 1 : 0;
  }

  // Cerrar el modal de tarea
  closeModalTarea(): void {
    this.showModalTarea = false;
    document.body.classList.remove('modal-open');
  }

  // Método para guardar una tarea
  saveTarea(): void {
    if (this.isEditMode) {
      this.updateTarea();  // Si está en modo edición, llama a updateTarea
    } else {
      this.createTarea();  // Si no, llama a createTarea
    }
  }

  // Crear una nueva tarea
  createTarea(): void {
    this.http.post(`${this.apiUrl}/add`, this.currentTarea).subscribe({
      next: (response: any) => {
        if (response.estado.ack) {
          // console.log('Tarea creada:', response);
          this.showError('Tarea creada exitosamente.', false);
          this.loadTarea();
          this.closeModalTarea();
        } else {
          this.showError(`Error al crear la tarea: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud.', true);
      }
    });
  }

  // Editar una tarea existente
  updateTarea(): void {
    const url = `${this.apiUrl}/${this.currentTarea.id}`;
    const updatedData = {
      nombre: this.currentTarea.nombre,
      estado: this.currentTarea.estado
    };

    this.http.put<any>(url, updatedData).subscribe({
      next: (response: any) => {
        if (response?.estado?.ack) {
          // console.log('Tarea actualizada:', response);
          this.showError('Tarea actualizada exitosamente.', false);
          this.loadTarea();
          this.closeModalTarea();
        } else {
          this.showError(`Error al actualizar la tarea: ${response?.estado?.errDes || 'Error desconocido'}`, true);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud al actualizar la tarea.', true);
      }
    });
  }

  // Confirmar la eliminación de una tarea
  confirmDelete(id: number): void {
    this.tareaDelete = id;
    this.showModalTarea = false;
    this.showConfirmationDeleteTarea = true;
  }

  // Cerrar el diálogo de confirmación de eliminación
  closeConfirmationDialog(): void {
    this.showConfirmationDeleteTarea = false;
    this.showModalTarea = true;
    this.tareaDelete = null;
  }

  // Eliminar tarea
  deleteTarea(): void {
    if (this.tareaDelete !== null) {
      this.http.delete<any>(`${this.apiUrl}/${this.tareaDelete}`).subscribe({
        next: response => {
          if (response.estado.ack) {
            // console.log('Tarea eliminada:', response);
            this.showError('Tarea eliminada exitosamente.', false);
            this.loadTarea();
            this.closeConfirmationDialog();
            this.closeModalTarea();
          } else {
            this.showError(`Error al eliminar la tarea: ${response.estado.errDes}`, true);
          }
        },
        error: error => {
          console.error('Error en la solicitud:', error);
          this.showError('Error en la solicitud al eliminar la tarea.', true);
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
    this.updatePagedTareas();   // Actualiza las tareas paginadas para mostrar la nueva página
  }
}


