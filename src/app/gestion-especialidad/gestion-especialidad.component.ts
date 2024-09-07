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

  showErrorModal = false;
  errorMessage: { message: string, isError: boolean } = { message: '', isError: true };

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
    this.http.get<any>(this.apiUrl).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.especialidades = response.body.response;
          this.updatePagedEspecialidades();
          console.log('Especialidades cargadas:', this.especialidades);
        } else {
          this.showError(`Error al cargar las especialidades: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
        this.showError('Error en la solicitud al cargar los datos.', true);
      },
      complete: () => console.log('Carga de especialidades completa')
    });
  }

  updatePagedEspecialidades(): void {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedEspecialidades = this.filteredEspecialidades().slice(startIndex, endIndex);
  }

  openModalEspecialidad(especialidad?: any): void {
    this.isEditMode = !!especialidad;
    this.currentEspecialidad = especialidad ? { ...especialidad } : {
      id: 0,
      nombre: '',
      estado: 1,
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
    this.http.post(`${this.apiUrl}/add`, this.currentEspecialidad).subscribe({
      next: (response: any) => {
        if (response.estado.ack) {
          console.log('Especialidad creada:', response);
          this.showError('Especialidad creada exitosamente.', false);
          this.loadEspecialidad();
          this.closeModalEspecialidad();
        } else {
          this.showError(`Error al crear la especialidad: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud.', true);
      }
    });
  }

  updateEspecialidad(): void {
    const url = `${this.apiUrl}/${this.currentEspecialidad.id}`;
    const updatedData = {
      nombre: this.currentEspecialidad.nombre,
      estado: this.currentEspecialidad.estado
    };

    this.http.put<any>(url, updatedData).subscribe({
      next: (response: any) => {
        if (response?.estado?.ack) {
          console.log('Especialidad actualizada:', response);
          this.showError('Especialidad actualizada exitosamente.', false);
          this.loadEspecialidad();
          this.closeModalEspecialidad();
        } else {
          this.showError(`Error al actualizar la especialidad: ${response?.estado?.errDes || 'Error desconocido'}`, true);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud al actualizar la especialidad.', true);
      }
    });
  }

  confirmDelete(id: number): void {
    this.especialidadDelete = id;
    this.showModalEspecialidad = false; // Oculta el modal de edición
    this.showConfirmationDeleteEspecialidad = true; // Muestra el modal de confirmación
  }

  closeConfirmationDialog(): void {
    this.showConfirmationDeleteEspecialidad = false;
    this.showModalEspecialidad = true; // Vuelve a mostrar el modal de edición
    this.especialidadDelete = null;
  }

  deleteEspecialidad(): void {
    if (this.especialidadDelete !== null) {
      this.http.delete<any>(`${this.apiUrl}/${this.especialidadDelete}`).subscribe({
        next: response => {
          if (response.estado.ack) {
            console.log('Especialidad eliminada:', response);
            this.showError('Especialidad eliminada exitosamente.', false);
            this.loadEspecialidad();
            this.closeConfirmationDialog();
            this.closeModalEspecialidad();
          } else {
            this.showError(`Error al eliminar la especialidad: ${response.estado.errDes}`, true);
          }
        },
        error: error => {
          console.error('Error en la solicitud:', error);
          this.showError('Error en la solicitud al eliminar la especialidad.', true);
        }
      });
    }
  }

  showError(message: string, isError: boolean): void {
    this.errorMessage = { message, isError };
    this.showErrorModal = true;
    // if (!isError) {
    //   setTimeout(() => this.closeErrorModal(), 3000);
    // }
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = { message: '', isError: true };
  }

  onPageChange(event: PageEvent) {
    this.updatePagedEspecialidades();
  }
}