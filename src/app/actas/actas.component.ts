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
interface Obra {
  id: number;
  nombre: string;
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
  fechA_APROBACION: Date | null;
  observacion: string;
  revisoR_ID: number;
}

interface GrupoTarea {
  id?: number;
  actA_ID: number;
  roL_ID: number;
  encargadO_ID: number; // Cambiado para coincidir con la API
  usuariO_CREACION: string;
  fechA_APROBACION: Date | null;
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
  obra: Obra[] = [];

  currentGrupo: GrupoTarea = this.getEmptyGrupoTarea();

  actaDelete: number | null = null;
  showModalActa = false;
  showConfirmationDeleteActa = false;
  searchText: string = '';
  isEditMode = false;
  pagedActas: any[] = [];


  // Arrays para las opciones de selección
  roles: Parametro[] = [];
  encargados = [{ id: 1, nombre: 'Encargado 1' }, { id: 2, nombre: 'Encargado 2' }];
  tareas = [{ id: 1, nombre: 'Tarea 1' }, { id: 2, nombre: 'Tarea 2' }];
  // Array para almacenar los grupos de tareas
  grupos: any[] = [];

  // Método para agregar una nueva card de grupo de tareas
  agregarNuevaCard() {
    // if (this.hayCardSinGuardar()) {
    //   alert("Por favor, guarda los datos de la card actual antes de agregar una nueva.");
    //   return;
    // }
    // Verifica si el último grupo tiene datos antes de agregar una nueva card
    if (this.grupos.length > 0 && !this.hayCardConDatos()) {
      alert("Por favor, llena los datos de la card actual antes de agregar una nueva.");
      return;
    }
    const nuevoGrupo = {
      rol: null,
      encargado: null,
      tareas: [],
      minimizado: false  // Nueva propiedad para el estado
    };
    this.grupos.push(nuevoGrupo);
  }
  // Método para guardar la información de un grupo específico
  guardarGrupo(grupo: any) {
    // Aquí puedes implementar la lógica de guardado, como enviarlo al backend
    grupo.minimizado = true;
    //console.log('Grupo guardado:', grupo);
  }
  // Método para alternar entre expandir y minimizar el grupo
  toggleGrupo(grupo: any) {
    grupo.minimizado = !grupo.minimizado;
  }
  // Función para verificar si existe alguna card sin guardar
  // hayCardSinGuardar(): boolean {
  //   return this.grupos.some(grupo => !grupo.minimizado); // Verifica si hay alguna card expandida
  // }
  // Función para verificar si el último grupo contiene datos
  hayCardConDatos(): boolean {
    const ultimoGrupo = this.grupos[this.grupos.length - 1];
    // Verificamos si tiene datos significativos (rol, encargado o tareas)
    return ultimoGrupo && (ultimoGrupo.rol || ultimoGrupo.encargado || ultimoGrupo.tareas.length > 0);
  }
  // Método para limpiar los datos y eliminar la card si está vacía
  eliminarDatosYCard(grupo: any, index: number) {
    // Limpiar los datos del grupo
    grupo.rol = null;
    grupo.encargado = null;
    grupo.tareas = [];

    // Confirmar si se desea eliminar la card completamente
    const confirmarEliminar = confirm("¿Deseas eliminar esta card y sus datos?");
    if (confirmarEliminar) {
      this.grupos.splice(index, 1);  // Elimina la card del array si se confirma
    }
  }
  


  // URLs de la API
  private apiUrl = 'https://localhost:7125/api/Parametro';
  private apiUrlTipoParametro = 'https://localhost:7125/api/TipoParametro';
  private apiUrlProveedor = 'https://localhost:7125/api/Proveedor';
  private apiUrlEspecialidad = 'https://localhost:7125/api/Especialidad';
  private apiUrlUsuarios = 'https://localhost:7125/api/Usuarios';
  private apiUrlActas = 'https://localhost:7125/api/Acta';
  private apiUrlObras = 'https://localhost:7125/api/Obra';

  // Variables para manejo de errores
  showErrorModal = false;
  errorMessage: { message: string, isError: boolean } = { message: '', isError: true };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Carga inicial de parámetros y tipos de parámetros
    this.loadActas()
    this.loadTipoParametros();
    //this.loadParametros();
    this.loadProveedores();
    this.loadEspecialidades();
    this.loadUsuarios();
    this.loadObras();
    this.loadParametrosRoles()
    
  }

  // Función para obtener un objeto Parametro vacío
  getEmptyActa(): Acta {
    return {
      obrA_ID: 0,
      proveedoR_ID: 0,
      especialidaD_ID: 0, // valor por defecto
      estadO_ID: 0,
      fechA_APROBACION: null,
      observacion: '',
      revisoR_ID: 0
    };
  }

  getEmptyGrupoTarea(): GrupoTarea {
    return {
      actA_ID: 0,
      roL_ID: 0,
      encargadO_ID: 0,
      usuariO_CREACION: '',
      fechA_APROBACION: null
    };
  }

  //Función para cargar tipos de parámetros desde la API
  loadTipoParametros(): void {
    this.http.get<any>(`${this.apiUrlTipoParametro}/LstTipoParametros`).subscribe({
      next: response => {
        if (response.estado?.ack) {
          this.tipoParametros = response.body.response;
          ////console.log('Tipos de parámetros cargados:', this.tipoParametros);

          this.loadParametros();
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
          ////console.log('Proveedores cargados:', this.proveedor);
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
  loadObras(): void {
    this.http.get<any>(`${this.apiUrlObras}/ObtenerObras`).subscribe({
      next: response => {
        if (response.estado?.ack) {
          this.obra = response.body.response;
          ////console.log('Obras cargados:', this.obra);
        } else {
          this.showError(`Error al cargar las Obras: ${response.estado?.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar los obras:', error);
        this.showError('Error en la solicitud al cargar los obras.', true);
      }
    });
  }

  loadEspecialidades(): void {
    this.http.get<any>(`${this.apiUrlEspecialidad}/ListadoDeespecialidadesSimple`).subscribe({
      next: response => {
        if (response.estado?.ack) {
          this.especialidad = response.body.response;
          //console.log('Especialidades cargadas:', this.especialidad);
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
          //console.log('Usuarios cargadas:', this.usuario);
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

  

  // // Función para cargar parámetros desde la API
  // loadParametros(): void {
  //   this.http.get<any>(`${this.apiUrl}/Listar`).subscribe({
  //     next: response => {
  //       if (response.estado.ack) {
  //         this.parametros = response.body.response.filter(
  //           (parametro: Parametro) => parametro.iD_TIPO_PARAMETRO === 86
  //         );
  //         this.updatePageParametro();
  //       } else {
  //         this.showError(`Error al cargar los Parámetros: ${response.estado.errDes}`, true);
  //       }
  //     },
  //     error: error => {
  //       console.error('Error al cargar los datos:', error);
  //       this.showError('Error en la solicitud al cargar los datos.', true);
  //     }
  //   });
  // }

  //Función para cargar parámetros desde la API
  loadParametros(): void {
    this.http.get<any>(`${this.apiUrl}/Listar`).subscribe({
      next: response => {
        if (response.estado.ack) {
          // Busca el ID del tipo de parámetro cuyo nombre es "Estado Acta"
          const tipoEstadoActa = this.tipoParametros.find(
            tipo => tipo.tipO_PARAMETRO === "Estado Acta"
          );
  
          // Si encontramos el ID, filtramos los parámetros
          if (tipoEstadoActa) {
            this.parametros = response.body.response.filter(
              (parametro: Parametro) => parametro.iD_TIPO_PARAMETRO === tipoEstadoActa.id
            );
          } else {
            console.warn('No se encontró el tipo de parámetro "Estado Acta".');
            this.parametros = [];
          }
  
          this.updatePageActa();
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

  //Función para cargar parámetros desde la API PARA ROLES
  loadParametrosRoles(): void {
    this.http.get<any>(`${this.apiUrl}/Listar`).subscribe({
      next: response => {
        if (response.estado.ack) {
          // Busca el ID del tipo de parámetro cuyo nombre es "Roles"
          const tipoRoles = this.tipoParametros.find(
            tipo => tipo.tipO_PARAMETRO === "Roles"
          );
          
          // Si encontramos el ID, filtramos los parámetros
          if (tipoRoles) {
            this.roles = response.body.response.filter(
              (parametro: Parametro) => parametro.iD_TIPO_PARAMETRO === tipoRoles.id
            );
          } else {
            console.warn('No se encontró el tipo de parámetro "Roles".');
            this.roles = [];
          }
          this.updatePageActa();
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
          this.updatePageActa();
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
  filteredActas() {
    return this.actas.filter(parametro =>
      parametro.observacion.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Función para actualizar la página de parámetros según la paginación
  updatePageActa(): void {
    const filtered = this.filteredActas();
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.pagedActas = filtered.slice(startIndex, endIndex);
    this.paginator.length = filtered.length;
  }

  // Función que se llama cuando cambia el texto de búsqueda
  onSearchChange(): void {
    this.paginator.firstPage();
    this.updatePageActa();
  }

  // Función para abrir el modal para crear o editar un parámetro
  openModalActa(acta?: Acta): void {
    this.isEditMode = !!acta; // Establecer modo de edición
    this.currentActa = acta ? { ...acta } : this.getEmptyActa();
    // Verifica el objeto currentParametro
    //console.log('currentActa:', this.currentActa); // Verifica la estructura del objeto
    //console.log('ID_TIPO_PARAMETRO:', this.currentActa.proveedoR_ID); // Verifica el valor
    this.loadProveedores();
    this.loadObras();
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

  // Función para guardar el parámetro (crear o actualizar)
  saveActa(): void {
    if (this.isEditMode) {
      this.updateActa();
    } else {
      this.createActa();
    }
  }

  // Función para crear un nuevo parámetro
  createActa(): void {
    // Convertimos la fecha a formato de cadena "YYYY-MM-DD"
    const formattedActa = {
      ...this.currentActa,
      fechA_APROBACION: this.currentActa.fechA_APROBACION ? 
        this.currentActa.fechA_APROBACION.toISOString().split('T')[0] : null
    };

    this.http.post(`${this.apiUrlActas}/add`, formattedActa).subscribe({
      next: (response: any) => {
        if (response.estado.ack) {
          this.showError('Acta creado exitosamente.', false);
          this.loadActas();
          this.closeModalActa();
        } else {
          this.showError(`Error al crear el Acta: ${response.estado.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud.', true);
      }
    });
  }


  // Función para actualizar un parámetro existente
  updateActa(): void {
    // Asegúrate de que 'fecha_aprobacion' sea siempre un objeto Date
    if (this.currentActa.fechA_APROBACION && typeof this.currentActa.fechA_APROBACION === 'string') {
      this.currentActa.fechA_APROBACION = new Date(this.currentActa.fechA_APROBACION);
    }
    const formattedActa = {
      ...this.currentActa,
      fechA_APROBACION: this.currentActa.fechA_APROBACION ?
        this.currentActa.fechA_APROBACION.toISOString().split('T')[0] : null
    };

    const url = `${this.apiUrlActas}/Actualizar/${this.currentActa.id}`;
    this.http.put<any>(url, formattedActa).subscribe({
      next: (response: any) => {
        if (response?.estado?.ack) {
          this.showError('Acta actualizado exitosamente.', false);
          this.loadActas();
          this.closeModalActa();
        } else {
          this.showError(`Error al actualizar el Acta: ${response?.estado?.errDes || 'Error desconocido'}`, true);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud al actualizar el Parámetro.', true);
      }
    });
  }

  // Función para confirmar la eliminación de un parámetro
  confirmDelete(id: number): void {
    this.actaDelete = id;
    this.showModalActa = false;
    this.showConfirmationDeleteActa = true;
  }

  // Función para cerrar el diálogo de confirmación de eliminación
  closeConfirmationDialog(): void {
    this.showConfirmationDeleteActa = false;
    this.showModalActa = true;
    this.actaDelete = null;
  }

  // Función para eliminar un parámetro
  deleteActa(): void {
    if (this.actaDelete !== null) {
      this.http.delete<any>(`${this.apiUrlActas}/Eliminar/${this.actaDelete}`).subscribe({
        next: response => {
          if (response.estado.ack) {
            this.showError('Acta eliminada exitosamente.', false);
            this.loadActas();
            this.closeConfirmationDialog();
            this.closeModalActa();
          } else {
            this.showError(`Error al eliminar el Acta: ${response.estado.errDes}`, true);
          }
        },
        error: error => {
          console.error('Error en la solicitud:', error);
          this.showError('Error en la solicitud al eliminar el Acta.', true);
        }
      });
    }
  }

  // Función para mostrar mensajes de error
  showError(message: string, isError: boolean): void {
    this.errorMessage = { message, isError };
    this.showErrorModal = true;
  }

  // Función para cerrar el modal de error
  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = { message: '', isError: true };
  }

  // Función que se llama cuando cambia la página en la paginación
  onPageChange(event: PageEvent) {
    this.updatePageActa();
  }

  // Función para obtener el nombre de un tipo de parámetro según su ID
  getProveedorNombre(id: number): string {
    //console.log('ID recibido proveed:', id); // Ver qué ID llega
    ////console.log('Lista de tipos:', this.tipoParametros); // Ver qué tipos tenemos disponibles
    
    const proveedor = this.proveedor.find(elemento => {
        ////console.log('Comparando:aaaaa', elemento.id, 'con aaaa', id); // Ver las comparaciones
        return elemento.iDproveedor === id;
    });
    
    if (!proveedor) {
        ////console.log(`No se encontró proveedor para ID: ${id}`);
        return `Tipo ${id}`;
    }
    
    return proveedor.nombreProveedor; 
  }

  getObraNombre(id: number): string {
    //console.log('ID recibido obra:', id); // Ver qué ID llega
    ////console.log('Lista de tipos:', this.tipoParametros); // Ver qué tipos tenemos disponibles
    
    const obra = this.obra.find(elemento => {
        ////console.log('Comparando:aaaaa', elemento.id, 'con aaaa', id); // Ver las comparaciones
        return elemento.id === id;
    });
    
    if (!obra) {
        ////console.log(`No se encontró proveedor para ID: ${id}`);
        return `Tipo ${id}`;
    }
    
    return obra.nombre; 
  }

  getEspecialidadNombre(id: number): string {
    //console.log('ID recibido:', id); // Ver qué ID llega
    ////console.log('Lista de tipos:', this.tipoParametros); // Ver qué tipos tenemos disponibles
    
    const especialidad = this.especialidad.find(elemento => {
       // //console.log('Comparando:', elemento.id, 'con', id); // Ver las comparaciones
        return elemento.id === id;
    });
    
    if (!especialidad) {
        ////console.log(`No se encontró especialidad para ID: ${id}`);
        return `Tipo ${id}`;
    }
    
    return especialidad.nombre; 
  }

  getUsuarioNombre(id: number): string {
    ////console.log('ID recibido:', id); // Ver qué ID llega
    ////console.log('Lista de tipos:', this.tipoParametros); // Ver qué tipos tenemos disponibles
    
    const usuario = this.usuario.find(elemento => {
        ////console.log('Comparando:', elemento.id, 'con', id); // Ver las comparaciones
        return elemento.id === id;
    });
    
    if (!usuario) {
        ////console.log(`No se encontró usuario para ID: ${id}`);
        return `Tipo ${id}`;
    }
    
    return usuario.primer_nombre; 
  }

  getEstadoNombre(id: number): string {
    ////console.log('ID recibido:', id); // Ver qué ID llega
    ////console.log('Lista de tipos:', this.tipoParametros); // Ver qué tipos tenemos disponibles
    
    const estado = this.parametros.find(elemento => {
        ////console.log('Comparando:', elemento.id, 'con', id); // Ver las comparaciones
        return elemento.id === id;
    });
    
    if (!estado) {
        ////console.log(`No se encontró usuario para ID: ${id}`);
        return `Tipo ${id}`;
    }
    
    return estado.parametro; 
  }


}
