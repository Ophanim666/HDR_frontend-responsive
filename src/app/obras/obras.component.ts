import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-gestion-obras',
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.css'],
})
export class ObrasComponent implements OnInit {
  obras: any[] = [];
  currentObra: any = {};
  obraDelete: number | null = null;
  showModalObra = false;
  showConfirmationDeleteObra = false;
  searchText: string = '';
  isEditMode = false;
  pagedObras: any[] = [];
  private apiUrl = 'https://localhost:7125/api/Obra';

  showErrorModal = false;
  errorMessage: { message: string, isError: boolean } = { message: '', isError: true };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  // Cargar datos
  ngOnInit(): void {
    this.loadObra();
  }

  // Filtrar obras
  filteredObras() {
    return this.obras.filter(obra =>
      obra.nombre.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Listar o cargar obras
  loadObra(): void {
    this.http.get<any>(`${this.apiUrl}/ObtenerObras`).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.obras = response.body.response;
          this.updatePagedObras();
          // console.log('Obras cargadas:', this.obras);
        } else {
          this.showError(`Error al cargar las obras: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
        this.showError('Error en la solicitud al cargar los datos.', true);
      },
      // complete: () => console.log('Carga de obras completa')
    });
  }

  // Actualizar las obras paginadas
  updatePagedObras(): void {
    const filtered = this.filteredObras();
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedObras = filtered.slice(startIndex, endIndex);
    this.paginator.length = filtered.length;
  }

   // Método que se llama cuando cambia el texto de búsqueda
  onSearchChange(): void {
    this.paginator.firstPage();
    this.updatePagedObras();
  }

  // Abrir el modal de obra
  openModalObra(obra?: any): void {
    this.isEditMode = !!obra;
    this.currentObra = obra ? { ...obra } : {
      id: 0,
      nombre: '',
      estado: 1,
    };
    this.showModalObra = true;
    document.body.classList.add('modal-open');
  }

  // Método que maneja el cambio en el toggle de estado de la obra
  onToggleChange(event: MatSlideToggleChange): void {
    this.currentObra.estado = event.checked ? 1 : 0;
  }

  // Cerrar el modal de obra
  closeModalObra(): void {
    this.showModalObra = false;
    document.body.classList.remove('modal-open');
  }

  // Método para guardar una obra
  saveObra(): void {
    if (this.isEditMode) {
      this.updateObra();  // Si está en modo edición, llama a updateObra
    } else {
      this.createObra();  // Si no, llama a createObra
    }
  }

  // Crear una nueva obra
  createObra(): void {
    this.http.post(`${this.apiUrl}/add`, this.currentObra).subscribe({
      next: (response: any) => {
        if (response.estado.ack) {
          // console.log('Obra creada:', response);
          this.showError('Obra creada exitosamente.', false);
          this.loadObra();
          this.closeModalObra();
        } else {
          this.showError(`Error al crear la obra: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud.', true);
      }
    });
  }

  // Editar una obra existente
  updateObra(): void {
    const url = `${this.apiUrl}/Actualizar/${this.currentObra.id}`;
    const updatedData = {
      nombre: this.currentObra.nombre,
      estado: this.currentObra.estado,
    };

    this.http.put<any>(url, updatedData).subscribe({
      next: (response: any) => {
        if (response?.estado?.ack) {
          // console.log('Obra actualizada:', response);
          this.showError('Obra actualizada exitosamente.', false);
          this.loadObra();
          this.closeModalObra();
        } else {
          this.showError(`Error al actualizar la obra: ${response?.estado?.errDes || 'Error desconocido'}`, true);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud al actualizar la obra.', true);
      }
    });
  }

  // Confirmar la eliminación de una obra
  confirmDelete(id: number): void {
    this.obraDelete = id;
    this.showModalObra = false;
    this.showConfirmationDeleteObra = true;
  }

  // Cerrar el diálogo de confirmación de eliminación
  closeConfirmationDialog(): void {
    this.showConfirmationDeleteObra = false;
    this.showModalObra = true;
    this.obraDelete = null;
  }

  // Eliminar obra
  deleteObra(): void {
    if (this.obraDelete !== null) {
      this.http.delete<any>(`${this.apiUrl}/Eliminar/${this.obraDelete}`).subscribe({
        next: response => {
          if (response.estado.ack) {
            // console.log('Obra eliminada:', response);
            this.showError('Obra eliminada exitosamente.', false);
            this.loadObra();
            this.closeConfirmationDialog();
            this.closeModalObra();
          } else {
            this.showError(`Error al eliminar la obra: ${response.estado.errDes}`, true);
          }
        },
        error: error => {
          console.error('Error en la solicitud:', error);
          this.showError('Error en la solicitud al eliminar la obra.', true);
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
    this.updatePagedObras();   // Actualiza las obras paginadas para mostrar la nueva página
  }
}
