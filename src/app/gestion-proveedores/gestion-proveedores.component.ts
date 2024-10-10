import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-gestion-proveedores',
  templateUrl: './gestion-proveedores.component.html',
  styleUrls: ['./gestion-proveedores.component.css']
})
export class GestionProveedoresComponent implements OnInit {
  proveedores: any[] = [];
  currentProveedores: any = {};
  proveedorDelete: number | null = null;
  showModalProveedores = false;
  showConfirmationDeleteProveedores = false;
  searchText: string = '';
  isEditMode = false;
  pagedProveedores: any[] = [];
  private apiUrl = 'https://localhost:7125/api/Proveedor';
  // URL de Especialidad
  private apiUrl2 = 'https://localhost:7125/api/Especialidad';

  // lista para especilidades
  especialidades = new FormControl();
  //no es string es any para que lleguen los nombres
  especialidadList: any[] = [];//aqui van las especialidades


  showErrorModal = false;
  errorMessage: { message: string, isError: boolean } = { message: '', isError: true };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProveedores();
    this.loadListEspecialidad();
  }

  // Filtrar proveedores
  filteredProveedores() {
    return this.proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Listado de especialidades
  // En este método cargamos las especialidades y almacenamos tanto el nombre como el id.
  loadListEspecialidad(): void {
    this.http.get<any>(`${this.apiUrl2}/ListadoDeespecialidadesSimple`).subscribe({
      next: response => {
        if (response.estado.ack) {
          // Ahora almacenamos tanto el nombre como el id de cada especialidad
          this.especialidadList = response.body.response.map((especialidad: any) => ({
            id: especialidad.id,        // Capturamos el id de la especialidad
            nombre: especialidad.nombre  // Y el nombre para mostrarlo en el formulario
          }));
  
          console.log('Especialidades cargadas:', this.especialidadList);
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
  //....

  // esta es la api que se esta llamando aqui
  // private apiUrl = 'https://localhost:7125/api/Proveedor';
  // Listar datos de proveedores
  loadProveedores(): void {
    this.http.get<any>(`${this.apiUrl}/listado`).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.proveedores = response.body.response.map((proveedor: any) => ({
            id: proveedor.iDproveedor,
            nombre: proveedor.nombreProveedor,
            razonSocial: proveedor.razonSocial,
            rut: proveedor.rut,
            dv: proveedor.dv,
            estado: proveedor.estado,
            iDespecialidad: proveedor.iDespecialidad,
            especialidades: proveedor.nombreEspecialidad.join(', '),
            // Aquí agregamos la fecha de creación
            fechaCreacion: proveedor.fechaCreacion, // Asegúrate de que el campo coincida con el nombre que se devuelve en la respuesta del backend
            usuarioCreacion: proveedor.usuariO_CREACION // También agregamos el usuario de creación si está en la respuesta
          }));
          this.updatePageProveedor();
          console.log('Proveedores cargados:', this.proveedores);
        } else {
          this.showError(`Error al cargar los Proveedores: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los datos:', error);
        this.showError('Error en la solicitud al cargar los datos.', true);
      },
      complete: () => console.log('Carga de proveedores completa')
    });
  }

  //....

   //...
  // Función para cargar las especialidades seleccionadas de un proveedor
  loadEspecialidadesProveedor(proveedorId: number): void {
    this.http.get<any>(`${this.apiUrl}/con-especialidades/${proveedorId}`).subscribe({
      next: response => {
        if (response.estado.ack) {
          const especialidadesSeleccionadas = response.body.response[0].iDespecialidades || [];
          // Establecemos las especialidades seleccionadas en el FormControl
          this.especialidades.setValue(especialidadesSeleccionadas);
          console.log('Especialidades seleccionadas para el proveedor:', especialidadesSeleccionadas);
        } else {
          this.showError(`Error al cargar las especialidades del proveedor: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud al cargar las especialidades.', true);
      }
    });
  }
  //.....


    // Actualizar las especialidades paginadas
    updatePageProveedor(): void {
      const filtered = this.filteredProveedores();
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.pagedProveedores = filtered.slice(startIndex, endIndex);
      this.paginator.length = filtered.length;
    }

    // Método que se llama cuando cambia el texto de búsqueda
  onSearchChange(): void {
    this.paginator.firstPage();
    this.updatePageProveedor();
  }

  // Abre el modal de proveedores
  openModalProveedor(proveedor?: any): void {
    this.isEditMode = !!proveedor;
    this.currentProveedores = proveedor ? { ...proveedor } : {
      nombre: '',
      estado: 1,
      rut:'',
      dv: '',
      listaEspecialidades: []
    };
    // Si estás editando, cargamos las especialidades seleccionadas del proveedor
    if (this.isEditMode && proveedor) {
      this.loadEspecialidadesProveedor(proveedor.id);
    } else {
      this.especialidades.setValue([]); // Si es un nuevo proveedor, dejamos el campo vacío
    }

    this.showModalProveedores = true;
    document.body.classList.add('modal-open');
  }

  //.....
  

    // Método que maneja el cambio en el toggle
    onToggleChange(event: MatSlideToggleChange): void {
      this.currentProveedores.estado = event.checked ? 1 : 0;
    }

  // Cerrar el modal de proveedor y limpiar las especialidades seleccionadas
  closeModalProveedor(): void {
    this.showModalProveedores = false;
    document.body.classList.remove('modal-open');

    // Limpiar las especialidades seleccionadas
    this.especialidades.reset();  // Limpiamos el FormControl de especialidades
  }


  // Método para guardar un Proveedor
  saveProveedor(): void {
    // Aquí obtenemos los IDs de las especialidades seleccionadas en el formulario
    this.currentProveedores.listaEspecialidades = this.especialidades.value || [];

    if (this.isEditMode) {
      this.updateProveedor();
    } else {
      this.createProveedor();
    }
  }
  //......


  //.......
  // Creacion de Provedores
  createProveedor(): void {
    this.http.post(`${this.apiUrl}/add`, this.currentProveedores).subscribe({
      next: (response: any) => {
        if (response.estado.ack) {
          console.log('Proveedor creado:', response);
          this.showError('Proveedor creado exitosamente.', false);
          this.loadProveedores();
          this.closeModalProveedor();
        } else {
          this.showError(`Error al crear el Proveedor: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud.', true);
      }
    });
  }
  //....

  //.....
  // Editar Proveedor
  updateProveedor(): void {
    const url = `${this.apiUrl}/Actualizar/${this.currentProveedores.id}`;
    const updatedData = {
      id: this.currentProveedores.id,
      nombre: this.currentProveedores.nombre,
      razoN_SOCIAL: this.currentProveedores.razoN_SOCIAL,
      rut: this.currentProveedores.rut,
      dv: this.currentProveedores.dv,
      estado: this.currentProveedores.estado,

      listaEspecialidades: this.currentProveedores.listaEspecialidades || []
    };

    this.http.put<any>(url, updatedData).subscribe({
      next: (response: any) => {
        if (response?.estado?.ack) {
          console.log('Proveedor actualizado:', response);
          this.showError('Proveedor actualizado exitosamente.', false);
          this.loadProveedores();
          this.closeModalProveedor();
        } else {
          this.showError(`Error al actualizar el Proveedor: ${response?.estado?.errDes || 'Error desconocido'}`, true);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud al actualizar el Proveedor.', true);
      }
    });
  }
  //..........



  // Confirmar eliminación
  confirmDelete(id: number): void {
    this.proveedorDelete = id;
    this.showModalProveedores = false;
    this.showConfirmationDeleteProveedores = true;
  }


   // Cerrar el diálogo de confirmación de eliminación
   closeConfirmationDialog(): void {
    this.showConfirmationDeleteProveedores = false;
    this.showModalProveedores = true;
    this.proveedorDelete = null;
  }

  // Eliminar proveedor
  deleteProveedor(): void {
    if (this.proveedorDelete !== null) {
      this.http.delete<any>(`${this.apiUrl}/Eliminar/${this.proveedorDelete}`).subscribe({
        next: response => {
          if (response.estado.ack) {
            console.log('Proveedor eliminado:', response);
            this.showError('Proveedor eliminado exitosamente.', false);
            this.loadProveedores();
            this.closeConfirmationDialog();
            this.closeModalProveedor();
          } else {
            this.showError(`Error al eliminar el Proveedor: ${response.estado.errDes}`, true);
          }
        },
        error: error => {
          console.error('Error en la solicitud:', error);
          this.showError('Error en la solicitud al eliminar el Proveedor.', true);
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
    this.updatePageProveedor();   // Actualiza los proveedores paginados para mostrar la nueva página
  }

  //.......
  // Restricciones para Rut y DV
  // Método para permitir solo números (para el campo RUT)
  onlyNumbers(event: KeyboardEvent): void {
    const pattern = /[0-9]/; // Solo números
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Evitar el ingreso de caracteres no válidos
    }
  }

  // Método para permitir solo un carácter (para el campo DV)
  onlyOneCharacter(event: KeyboardEvent): void {
    const pattern = /[0-9A-Za-z]/; // Solo números y letras
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Evitar el ingreso de caracteres no válidos
    }
  }

  formatRut(rut: string): string {
    // Agregar puntos al RUT en el formato XX.XXX.XXX
    if (rut.length !== 8) return rut; // Asegúrate de que tenga el largo esperado
  
    return `${rut.slice(0, 2)}.${rut.slice(2, 5)}.${rut.slice(5, 8)}`; // Formateo
  }
  //.......
  

}
