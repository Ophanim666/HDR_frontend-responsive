import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-gestion-especialidad',
  templateUrl: './gestion-especialidad.component.html',
  styleUrls: ['./gestion-especialidad.component.css'],
})
export class GestionEspecialidadComponent implements OnInit {
  especialidades: any[] = [];
  currentEspecialidad: any = {};
  especialidadDelete: number | null = null;
  showModalEspecialidad = false;
  showConfirmationDeleteEspecialidad = false;
  searchText: string = '';
  isEditMode = false;
  pagedEspecialidades: any[] = [];
  private apiUrl = 'https://localhost:7125/api/Especialidad';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEspecialidad();
  }

  filteredEspecialidades() {
    return this.especialidades.filter(especialidad =>
      especialidad.nombre.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  loadEspecialidad(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: response => this.especialidades = response,
      error: error => console.error('Error al cargar los datos:', error),
      complete: () => console.log('Carga de especialidades completa')
    });
  }

  openModalEspecialidad(especialidad?: any): void {
    this.isEditMode = !!especialidad;
    this.currentEspecialidad = especialidad ? { ...especialidad } : {
      id: 0,
      nombre: '',
      estado: 1, // Por defecto, el estado es activo (1)
    };
    this.showModalEspecialidad = true;
    document.body.classList.add('modal-open');
  }

  onToggleChange(event: MatSlideToggleChange): void {
    this.currentEspecialidad.estado = event.checked ? 1 : 0;
  }

  closeModalEspecialidad(): void {
    this.showModalEspecialidad = false;
    document.body.classList.remove('modal-open');
  }

  saveEspecialidad(): void {
    if (this.isEditMode) {
      this.updateEspecialidad();
    } else {
      this.createEspecialidad();
    }
  }

  createEspecialidad(): void {
    this.http.post(this.apiUrl, this.currentEspecialidad, { responseType: 'text' })
      .subscribe({
        next: response => {
          console.log('Especialidad creada:', response);
          alert('Especialidad creada exitosamente.');
          this.loadEspecialidad();
          this.closeModalEspecialidad();
        },
        error: error => {
          console.error('Error al crear especialidad', error);
          alert('Error al crear especialidad.');
        }
      });
  }

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
        this.loadEspecialidad();
        this.closeModalEspecialidad();
      },
      error: error => {
        console.error('Error al actualizar la especialidad:', error);
        alert('Error al actualizar la especialidad.');
      }
    });
  }

  confirmDelete(id: number): void {
    this.especialidadDelete = id;
    this.showConfirmationDeleteEspecialidad = true;
    document.body.classList.add('modal-open');
  }

  closeConfirmationDialog(): void {
    this.showConfirmationDeleteEspecialidad = false;
    this.especialidadDelete = null;
    document.body.classList.remove('modal-open');
  }

  deleteEspecialidad(): void {
    if (this.especialidadDelete !== null) {
      this.http.delete(`${this.apiUrl}/${this.especialidadDelete}`, { responseType: 'text' }).subscribe({
        next: response => {
          console.log('Especialidad eliminada:', response);
          alert('Especialidad eliminada exitosamente.');
          this.loadEspecialidad();
          this.closeConfirmationDialog();
          this.closeModalEspecialidad();
        },
        error: error => {
          console.error('Error al eliminar especialidad:', error);
          alert('Error al eliminar especialidad');
        }
      });
    }
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedEspecialidades = this.especialidades.slice(startIndex, endIndex);
  }
}