import { Component, OnInit } from '@angular/core';
import { EspecialidadService } from '../services/especialidad.service';

@Component({
  selector: 'app-gestion-especialidad',
  templateUrl: './gestion-especialidad.component.html',
  styleUrls: ['./gestion-especialidad.component.css']
})
export class GestionEspecialidadComponent implements OnInit {
  especialidades: any[] = [];
  nuevaEspecialidad = {
    nombre: '',
    // Agrega más campos según sea necesario
  };

  constructor(private especialidadService: EspecialidadService) {}

  ngOnInit(): void {
    this.especialidadService.getEspecialidad().subscribe(data => {
      this.especialidades = data;
    }, error => {
      console.error('Error al obtener las especialidades:', error);
    });
  }

  abrirModal() {
    const modal = document.getElementById('modalAddEspecialidad');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  cerrarModal() {
    const modal = document.getElementById('modalAddEspecialidad');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  
  addEspecialidad() {
    // Aquí iría la lógica para crear la especialidad, llamando al servicio adecuado
    this.especialidadService.addEspecialidad(this.nuevaEspecialidad).subscribe(() => {
      this.cerrarModal(); // Cierra el modal después de crear la especialidad
      // Actualiza la lista de especialidades
      this.ngOnInit();
    }, error => {
      console.error('Error al crear la especialidad:', error);
    });
  }

  updateEspecialidad(id: number) {
    // Aquí va la lógica para actualizar la especialidad
  }

  deleteEspecialidad(id: number): void {
    this.especialidadService.deleteEspecialidad(id).subscribe(
      () => {
        // Elimina la especialidad de la lista local
        this.especialidades = this.especialidades.filter(e => e.id !== id);
        // Muestra el modal de éxito
        this.abrirModalSuccess();
      },
      error => {
        console.error("Error al eliminar la especialidad:", error);
        // Opcional: Muestra un modal de error o mensaje de error
      }
    );
  }
  
  abrirModalSuccess() {
    const modal = document.getElementById('modalSuccess');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  cerrarModalSuccess() {
    const modal = document.getElementById('modalSuccess');
    if (modal) {
      modal.style.display = 'none';
    }
  }
}


