import { Component, OnInit,} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-gestion-especialidad',
  templateUrl: './gestion-especialidad.component.html',
  styleUrls: ['./gestion-especialidad.component.css']
})

export class GestionEspecialidadComponent implements OnInit {
  especialidades: any[] = [];
  nuevaEspecialidad: any = {};
  especialidadDelete: number | null = null;
  // nuevaEspecialidad = {
  //   ID: 0, // Cambiado a 0, ya que el backend espera un int
  //   NOMBRE: '',
  //   ESTADO: 0, // Cambiado a 0, ya que el backend espera un int
  //   USUARIO_CREACION: '',
  //   FECHA_CREACION: new Date().toISOString()// Asegúrate de que este formato es aceptable
  showCreateModalEspecialidad= false;
  showEditModalEspecialidad = false;
  showConfirmationDeleteEspecialidad = false;
  currentEspecialidad: any = {};

  private apiUrl = 'https://localhost:7125/api/Especialidad';

  constructor(private http: HttpClient) {}

  // C(R)UD Read

  // Recargar datos para visualizar cambios...
  ngOnInit(): void {
    this.loadEspecialidad();
  }

  // Función de listar
  loadEspecialidad(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: response => this.especialidades = response,
      error: error => console.error('Error al cargar los datos:', error),
      complete: () => console.log('Carga de especialidades completa')
    });
  }

  // (C)RUD Create
  
  // Abrir el modal de creación
  openCreateModalEspecialidad(): void {
    this.nuevaEspecialidad = {
    id: 0,
    nombre: '',
    estado: 1,
    // SE ARREGLARÁ EN EL PROCEDIMIENTO ALMACENADO PARA QUE DEJE INGRESAR NULOS
    // DESPUÉS REVISAR SI ASÍ ESTÁ BIEN.
    // usuariO_CREACION: null,
    // fechA_CREACION: null
    };
    this.showCreateModalEspecialidad = true;
  }

  // Cerrar el modal de creación
  closeCreateModalEspecialidad(): void {
    this.showCreateModalEspecialidad = false;
  }

  // Crear tipo de parámetro
  createEspecialidad(): void {
    this.http.post(this.apiUrl, this.nuevaEspecialidad, { responseType: 'text' })
      .subscribe({
        next: response => {
          console.log('Especialidad creada:', response);
          alert('Especialidad creada exitosamente.');
          this.loadEspecialidad(); // Actualizar la lista
          this.closeCreateModalEspecialidad();
        },
        error: error => {
          console.error('Error al crear especialidad', error);
          alert('Error al crear especialidad.');
        }
      });
  }

// CR(U)D Update

// Abrir el modal de edición
openEditModalEspecialidad(especialidad: any): void {
  this.currentEspecialidad = { ...especialidad };
  this.showEditModalEspecialidad = true;
}

// Cerrar el modal de edición
closeEditModalEspecialidad(): void {
  this.showEditModalEspecialidad = false;
}

// Actualizar el tipo de parámetro
updateEspecialidad(): void {
  const url = `${this.apiUrl}/${this.currentEspecialidad.id}`;
  const updatedData = {
    nombre: this.currentEspecialidad.nombre,
    estado: this.currentEspecialidad.estado,
    usuariO_CREACION: this.currentEspecialidad.usuariO_CREACION,
    fechA_creacion: this.currentEspecialidad.fechA_CREACION
  };

  this.http.put(url, updatedData, { responseType: 'text' }).subscribe({
    next: response => {
      console.log('Especialidad actualizada:', response);
      alert('Especialidad actualizada exitosamente.');
      this.loadEspecialidad(); // Actualizar la lista
      this.closeEditModalEspecialidad();
    },
    error: error => {
      console.error('Error al actualizar la especialidad:', error);
      alert('Error al actualizar la especialidad.');
    }
  });
}

// CRU(D) Delete

  // Abrir el modal de confirmación de eliminación
  confirmDelete(id: number): void {
    this.especialidadDelete = id;
    this.showConfirmationDeleteEspecialidad = true;
  }

    // Cerrar el modal de confirmación
  closeConfirmationDialog(): void {
    this.showConfirmationDeleteEspecialidad = false;
    this.especialidadDelete = null;
  }

  // Eliminar especialidad
  deleteEspecialidad(): void {
    if (this.especialidadDelete !== null) {
      this.http.delete(`${this.apiUrl}/${this.especialidadDelete}`, { responseType: 'text' }).subscribe({
        next: response => {
          console.log('Especialidad eliminada:', response);
          alert('Especialidad eliminada exitosamente.');
          this.loadEspecialidad();
          this.closeConfirmationDialog();
        },
        error: error => {
          console.error('Error al eliminar especialidad:', error);
          alert('Error al eliminar especialidad');
        }
      });
    }
  }
};
