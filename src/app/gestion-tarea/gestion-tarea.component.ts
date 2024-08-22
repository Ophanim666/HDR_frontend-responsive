import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-tareas',
  templateUrl: './gestion-tarea.component.html',
  styleUrls: ['./gestion-tarea.component.css']
})
export class GestionTareaComponent implements OnInit {
  tareas: any[] = [];
  showCreateModal = false;
  showEditModal = false;
  showConfirmationDialog = false;
  currentTarea: any = {};
  newTarea: any = {};
  tareaToDelete: number | null = null;
  searchText: string = ''; // Variable para el texto del buscador

  private apiUrl = 'https://localhost:7125/api/Tarea'; // Actualiza la URL según tu configuración

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTareas();
  }

  // Listar todas las tareas
  loadTareas(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: response => this.tareas = response,
      error: error => console.error('Error al cargar las tareas:', error),
      complete: () => console.log('Carga de tareas completa')
    });
  }

  filteredTareas() {
    return this.tareas.filter(tarea =>
      tarea.nombre.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Abrir el modal de creación
  openCreateModal(): void {
    this.newTarea = {
      id: 0,
      nombre: '',
      codigo: '',
      estado: 1,
      usuario_Creacion: '',
      fecha_Creacion: ''
    };
    this.showCreateModal = true;
  }

  // Cerrar el modal de creación
  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  // Crear una nueva tarea
  createTarea(): void {
    this.http.post(this.apiUrl, this.newTarea, { responseType: 'text' })
      .subscribe({
        next: response => {
          console.log('Tarea creada:', response);
          alert('Tarea creada exitosamente.');
          this.loadTareas(); // Actualizar la lista
          this.closeCreateModal();
        },
        error: error => {
          console.error('Error al crear la tarea:', error);
          alert('Error al crear la tarea.');
        }
      });
  }

  // Abrir el modal de edición
  openEditModal(tarea: any): void {
    this.currentTarea = { ...tarea }; // Copiar los datos para edición
    this.showEditModal = true;
  }

  // Cerrar el modal de edición
  closeEditModal(): void {
    this.showEditModal = false;
  }

  // Actualizar la tarea
updateTarea(): void {
  this.http.put(this.apiUrl, this.currentTarea, { responseType: 'text' }).subscribe({
    next: response => {
      console.log('Tarea actualizada:', response);
      alert('Tarea actualizada exitosamente.');
      this.loadTareas(); // Actualizar la lista
      this.closeEditModal();
    },
    error: error => {
      console.error('Error al actualizar la tarea:', error);
      alert('Error al actualizar la tarea.');
    }
  });
}

  // Abrir el modal de confirmación de eliminación
  confirmDelete(id: number): void {
    this.tareaToDelete = id;
    this.showConfirmationDialog = true;
  }

  // Eliminar la tarea
  deleteTarea(): void {
    if (this.tareaToDelete !== null) {
      this.http.delete(`${this.apiUrl}/${this.tareaToDelete}`, { responseType: 'text' }).subscribe({
        next: response => {
          console.log('Tarea eliminada:', response);
          alert('Tarea eliminada exitosamente.');
          this.loadTareas(); // Actualizar la lista
          this.closeConfirmationDialog();
        },
        error: error => {
          console.error('Error al eliminar la tarea:', error);
          alert('Error al eliminar la tarea.');
        }
      });
    }
  }

  // Cerrar el modal de confirmación
  closeConfirmationDialog(): void {
    this.showConfirmationDialog = false;
    this.tareaToDelete = null;
  }
}


