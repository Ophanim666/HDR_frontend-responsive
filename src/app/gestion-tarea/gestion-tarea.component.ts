import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tarea',
  templateUrl: './gestion-tarea.component.html',
  styleUrls: ['./gestion-tarea.component.css']
})
export class GestionTareaComponent implements OnInit {
  tareas: any[] = [];
  searchTerm: string = '';
  isModalOpen: boolean = false;
  isEditMode: boolean = false; // Para determinar si está en modo de edición
  selectedTarea: any = {}; // Objeto para la tarea seleccionada

  private apiUrl = 'https://localhost:7125/api/Tarea';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTareas();
  }

  // Cargar todas las tareas
  loadTareas(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: response => this.tareas = response,
      error: error => console.error('Error al cargar tareas:', error),
      complete: () => console.log('Carga de tareas completa')
    });
  }

  // Agregar una nueva tarea
  addTarea(): void {
    if (!this.selectedTarea.nombre || !this.selectedTarea.codigo) {
      console.warn('Nombre y código son obligatorios');
      return;
    }

    this.http.post(this.apiUrl, this.selectedTarea).subscribe({
      next: () => {
        this.loadTareas(); // Recargar la lista de tareas
        this.closeModal(); // Cerrar el modal
      },
      error: error => console.error('Error al agregar tarea:', error),
    });
  }

  // Actualizar una tarea existente
  updateTarea(): void {
    if (!this.selectedTarea.nombre || !this.selectedTarea.codigo) {
      console.warn('Nombre y código son obligatorios');
      return;
    }

    this.http.put(`${this.apiUrl}`, this.selectedTarea).subscribe({
      next: () => {
        this.loadTareas(); // Recargar la lista de tareas
        this.closeModal(); // Cerrar el modal
      },
      error: error => console.error('Error al actualizar tarea:', error),
    });
  }

  // Eliminar una tarea por ID
  deleteTarea(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.loadTareas(), // Recargar la lista de tareas
      error: error => console.error('Error al eliminar tarea:', error),
    });
  }

  // Preparar para la edición de una tarea
  editTarea(tarea: any): void {
    this.selectedTarea = { ...tarea }; // Clonar la tarea para edición
    this.isEditMode = true; // Cambiar a modo de edición
    this.openModal(); // Mostrar el modal
  }

  // Filtros de búsqueda
  get filteredTareas() {
    return this.tareas.filter(tarea =>
      tarea.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Mostrar el modal para agregar/editar tarea
  openModal(): void {
    this.isModalOpen = true;
  }

  // Cerrar el modal
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedTarea = {}; // Limpia los campos al cerrar el modal
    this.isEditMode = false; // Restablecer el modo de edición
  }
}

