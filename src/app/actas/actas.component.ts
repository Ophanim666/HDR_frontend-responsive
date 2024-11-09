import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


interface TipoParametro {
  id: number;
  tipO_PARAMETRO: string;
  estado: number;
}
interface Proveedor {
  iDproveedor: number;
  nombreProveedor: string;
}
interface Especialidad {
  id: number;
  nombre: string;
}
interface Usuario {
  id: number;
  primer_nombre: string;
}
interface Parametro {
  id?: number;
  parametro: string;
  valor: string;
  iD_TIPO_PARAMETRO: number; // Cambiado para coincidir con la API
  estado: number;
}

interface Acta {
  id?: number;
  obrA_ID: number;
  proveedoR_ID: number;
  especialidaD_ID: number; // Cambiado para coincidir con la API
  estadO_ID: number;
  fechA_APROBACION: string;
  observacion: string;
  revisoR_ID: number;
}
@Component({
  selector: 'app-actas',
  templateUrl: './actas.component.html',
  styleUrl: './actas.component.css'
})
export class ActasComponent implements OnInit {
  // Variables de clase
  parametros: Parametro[] = [];
  actas: Acta[] = [];
  currentActa: Acta = this.getEmptyActa();
  tipoParametros: TipoParametro[] = [];
  proveedor: Proveedor[] = [];
  especialidad: Especialidad[] = [];
  usuario: Usuario[] = [];

  parametroDelete: number | null = null;
  showModalActa = false;
  showConfirmationDeleteParametro = false;
  searchText: string = '';
  isEditMode = false;
  pagedActas: any[] = [];
  
  // URLs de la API
  private apiUrl = 'https://localhost:7125/api/Parametro';
  private apiUrlTipoParametro = 'https://localhost:7125/api/TipoParametro';
  private apiUrlProveedor = 'https://localhost:7125/api/Proveedor';
  private apiUrlEspecialidad = 'https://localhost:7125/api/Especialidad';
  private apiUrlUsuarios = 'https://localhost:7125/api/Usuarios';
  private apiUrlActas = 'https://localhost:7125/api/Acta';

  // Variables para manejo de errores
  showErrorModal = false;
  errorMessage: { message: string, isError: boolean } = { message: '', isError: true };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Carga inicial de parámetros y tipos de parámetros
    this.loadActas()
    this.loadParametros();
    this.loadTipoParametros();
    this.loadProveedores();
    this.loadEspecialidades();
    this.loadUsuarios();
    
  }

  // Función para obtener un objeto Parametro vacío
  getEmptyActa(): Acta {
    return {
      obrA_ID: 0,
      proveedoR_ID: 0,
      especialidaD_ID: 0, // valor por defecto
      estadO_ID: 0,
      fechA_APROBACION: '',
      observacion: '',
      revisoR_ID: 0
    };
  }

  //Función para cargar tipos de parámetros desde la API
  loadTipoParametros(): void {
    this.http.get<any>(`${this.apiUrlTipoParametro}/LstTipoParametros`).subscribe({
      next: response => {
        if (response.estado?.ack) {
          this.tipoParametros = response.body.response;
          console.log('Tipos de parámetros cargados:', this.tipoParametros);
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

  loadProveedores(): void {
    this.http.get<any>(`${this.apiUrlProveedor}/Listado`).subscribe({
      next: response => {
        if (response.estado?.ack) {
          this.proveedor = response.body.response;
          console.log('Proveedores cargados:', this.proveedor);
        } else {
          this.showError(`Error al cargar los proveedores: ${response.estado?.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los proveedores:', error);
        this.showError('Error en la solicitud al cargar los proveedores.', true);
      }
    });
  }

  loadEspecialidades(): void {
    this.http.get<any>(`${this.apiUrlEspecialidad}/ListadoDeespecialidadesSimple`).subscribe({
      next: response => {
        if (response.estado?.ack) {
          this.especialidad = response.body.response;
          console.log('Especialidades cargadas:', this.especialidad);
        } else {
          this.showError(`Error al cargar las especialidades: ${response.estado?.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar las especialidades:', error);
        this.showError('Error en la solicitud al cargar las especialidades.', true);
      }
    });
  }

  loadUsuarios(): void {
    this.http.get<any>(`${this.apiUrlUsuarios}/ListarUsuarios`).subscribe({
      next: response => {
        if (response.estado?.ack) {
          this.usuario = response.body.response;
          console.log('Usuarios cargadas:', this.usuario);
        } else {
          this.showError(`Error al cargar los Usuarios: ${response.estado?.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los Usuarios:', error);
        this.showError('Error en la solicitud al cargar los Usuarios.', true);
      }
    });
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

  // Función para cargar parámetros desde la API
  loadActas(): void {
    this.http.get<any>(`${this.apiUrlActas}/Listar`).subscribe({
      next: response => {
        if (response.estado.ack) {
          this.actas = response.body.response;
          //this.updatePageParametro();
        } else {
          this.showError(`Error al cargar las actas: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar las actas:', error);
        this.showError('Error en la solicitud al cargar las actas.', true);
      }
    });
  }

  // Función para filtrar parámetros según el texto de búsqueda
  filteredParametros() {
    return this.actas.filter(parametro =>
      parametro.observacion.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Función para actualizar la página de parámetros según la paginación
  updatePageParametro(): void {
    const filtered = this.filteredParametros();
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedActas = filtered.slice(startIndex, endIndex);
    this.paginator.length = filtered.length;
  }

  // Función que se llama cuando cambia el texto de búsqueda
  onSearchChange(): void {
    this.paginator.firstPage();
    this.updatePageParametro();
  }

  // Función para abrir el modal para crear o editar un parámetro
  openModalActa(acta?: Acta): void {
    this.isEditMode = !!acta; // Establecer modo de edición
    this.currentActa = acta ? { ...acta } : this.getEmptyActa();
    // Verifica el objeto currentParametro
    console.log('currentActa:', this.currentActa); // Verifica la estructura del objeto
    console.log('ID_TIPO_PARAMETRO:', this.currentActa.proveedoR_ID); // Verifica el valor

    // Asegurarse de que los tipos de parámetros estén cargados
    if (this.proveedor.length === 0) {
      this.loadProveedores();
    }

    this.showModalActa = true;
    document.body.classList.add('modal-open');
  }

  // // Función para manejar el cambio del estado del parámetro
  // onToggleChange(event: MatSlideToggleChange): void {
  //   this.currentParametro.estado = event.checked ? 1 : 0;
  // }

  // Función para cerrar el modal de parámetros
  closeModalActa(): void {
    this.showModalActa = false;
    document.body.classList.remove('modal-open');
  }

  // // Función para guardar el parámetro (crear o actualizar)
  // saveParametro(): void {
  //   if (this.isEditMode) {
  //     this.updateParametro();
  //   } else {
  //     this.createParametro();
  //   }
  // }

  // // Función para crear un nuevo parámetro
  // createParametro(): void {
  //   this.http.post(`${this.apiUrl}/add`, this.currentParametro).subscribe({
  //     next: (response: any) => {
  //       if (response.estado.ack) {
  //         this.showError('Parámetro creado exitosamente.', false);
  //         this.loadParametros();
  //         this.closeModalParametro();
  //       } else {
  //         this.showError(`Error al crear el Parámetro: ${response.estado.errDes}`, true);
  //       }
  //     },
  //     error: error => {
  //       console.error('Error en la solicitud:', error);
  //       this.showError('Error en la solicitud.', true);
  //     }
  //   });
  // }

  // // Función para actualizar un parámetro existente
  // updateParametro(): void {
  //   const url = `${this.apiUrl}/Actualizar/${this.currentParametro.id}`;
  //   this.http.put<any>(url, this.currentParametro).subscribe({
  //     next: (response: any) => {
  //       if (response?.estado?.ack) {
  //         this.showError('Parámetro actualizado exitosamente.', false);
  //         this.loadParametros();
  //         this.closeModalParametro();
  //       } else {
  //         this.showError(`Error al actualizar el Parámetro: ${response?.estado?.errDes || 'Error desconocido'}`, true);
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error en la solicitud:', error);
  //       this.showError('Error en la solicitud al actualizar el Parámetro.', true);
  //     }
  //   });
  // }

  // // Función para confirmar la eliminación de un parámetro
  // confirmDelete(id: number): void {
  //   this.parametroDelete = id;
  //   this.showModalParametro = false;
  //   this.showConfirmationDeleteParametro = true;
  // }

  // // Función para cerrar el diálogo de confirmación de eliminación
  // closeConfirmationDialog(): void {
  //   this.showConfirmationDeleteParametro = false;
  //   this.showModalParametro = true;
  //   this.parametroDelete = null;
  // }

  // // Función para eliminar un parámetro
  // deleteParametro(): void {
  //   if (this.parametroDelete !== null) {
  //     this.http.delete<any>(`${this.apiUrl}/Eliminar/${this.parametroDelete}`).subscribe({
  //       next: response => {
  //         if (response.estado.ack) {
  //           this.showError('Parámetro eliminado exitosamente.', false);
  //           this.loadParametros();
  //           this.closeConfirmationDialog();
  //           this.closeModalParametro();
  //         } else {
  //           this.showError(`Error al eliminar el Parámetro: ${response.estado.errDes}`, true);
  //         }
  //       },
  //       error: error => {
  //         console.error('Error en la solicitud:', error);
  //         this.showError('Error en la solicitud al eliminar el Parámetro.', true);
  //       }
  //     });
  //   }
  // }

  // Función para mostrar mensajes de error
  showError(message: string, isError: boolean): void {
    this.errorMessage = { message, isError };
    this.showErrorModal = true;
  }

  // // Función para cerrar el modal de error
  // closeErrorModal(): void {
  //   this.showErrorModal = false;
  //   this.errorMessage = { message: '', isError: true };
  // }

  // Función que se llama cuando cambia la página en la paginación
  onPageChange(event: PageEvent) {
    this.updatePageParametro();
  }

  // Función para obtener el nombre de un tipo de parámetro según su ID
  getProveedorNombre(id: number): string {
    console.log('ID recibido proveed:', id); // Ver qué ID llega
    //console.log('Lista de tipos:', this.tipoParametros); // Ver qué tipos tenemos disponibles
    
    const proveedor = this.proveedor.find(elemento => {
        //console.log('Comparando:aaaaa', elemento.id, 'con aaaa', id); // Ver las comparaciones
        return elemento.iDproveedor === id;
    });
    
    if (!proveedor) {
        //console.log(`No se encontró proveedor para ID: ${id}`);
        return `Tipo ${id}`;
    }
    
    return proveedor.nombreProveedor; 
  }

  getEspecialidadNombre(id: number): string {
    console.log('ID recibido:', id); // Ver qué ID llega
    //console.log('Lista de tipos:', this.tipoParametros); // Ver qué tipos tenemos disponibles
    
    const especialidad = this.especialidad.find(elemento => {
       // console.log('Comparando:', elemento.id, 'con', id); // Ver las comparaciones
        return elemento.id === id;
    });
    
    if (!especialidad) {
        //console.log(`No se encontró especialidad para ID: ${id}`);
        return `Tipo ${id}`;
    }
    
    return especialidad.nombre; 
  }

  getUsuarioNombre(id: number): string {
    //console.log('ID recibido:', id); // Ver qué ID llega
    //console.log('Lista de tipos:', this.tipoParametros); // Ver qué tipos tenemos disponibles
    
    const usuario = this.usuario.find(elemento => {
        //console.log('Comparando:', elemento.id, 'con', id); // Ver las comparaciones
        return elemento.id === id;
    });
    
    if (!usuario) {
        //console.log(`No se encontró usuario para ID: ${id}`);
        return `Tipo ${id}`;
    }
    
    return usuario.primer_nombre; 
  }

  getEstadoNombre(id: number): string {
    //console.log('ID recibido:', id); // Ver qué ID llega
    //console.log('Lista de tipos:', this.tipoParametros); // Ver qué tipos tenemos disponibles
    
    const estado = this.parametros.find(elemento => {
        //console.log('Comparando:', elemento.id, 'con', id); // Ver las comparaciones
        return elemento.id === id;
    });
    
    if (!estado) {
        //console.log(`No se encontró usuario para ID: ${id}`);
        return `Tipo ${id}`;
    }
    
    return estado.parametro; 
  }


}
