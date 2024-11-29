import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

/*se importa el pkg de JSPDF */
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  rol_id: number;
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

interface Tarea{
  id: number;
  nombre: string;
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
  tarea: Tarea[] = [];

  grupoTareas: GrupoTarea[] = [];
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
  tareas: any[] = []; // Lista de tareas cargadas desde la API
  selectedTareas: number[] = []; // IDs de tareas seleccionadas
  // Array para almacenar los grupos de tareas
  grupos: any[] = [];

  // Identificador del grupo de tarea que se va a eliminar
  grupoIdToDelete: number | null = null;
  showConfirmationDeleteGrupoTarea = false;

  showConfirmationDeleteCard = false;
  currentCardToDelete: any = null;
  currentCardIndex: number | null = null;

// .....................................................................................................
  // Método para agregar una nueva card de grupo de tareas
  agregarNuevaCard() {
    // // if (this.hayCardSinGuardar()) {
    // //   alert("Por favor, guarda los datos de la card actual antes de agregar una nueva.");
    // //   return;
    // // }
    // // Verifica si el último grupo tiene datos antes de agregar una nueva card
    // // if (this.grupos.length > 0 && !this.hayCardConDatos()) {
    // //   alert("Por favor, llena los datos de la card actual antes de agregar una nueva.");
    // //   return;
    // // }

    // // Verifica si alguna de las cards actuales tiene datos incompletos
    // if (this.grupos.some(grupo => 
    //   // Verificar si el rol es nulo o vacío
    //   (grupo.idRol === null || grupo.idRol === undefined) || 
      
    //   // Verificar si el encargado es nulo o vacío
    //   (grupo.idEncargado === null || grupo.idEncargado === undefined) || 
      
    //   // Verificar si tareas no es un array o es un array vacío
      
    // )) {
    //   console.log('Grupos actuales:', this.grupos);
    //   alert("Por favor, llena los datos de las cards actuales antes de agregar una nueva.");
    //   return;
    // }
  
    // const nuevoGrupo = {
    //   rol: null,
    //   encargado: null,
    //   tareas: [],
    //   minimizado: false  // Nueva propiedad para el estado
    // };
    // this.grupos.push(nuevoGrupo);
    // Verifica si el último grupo tiene datos antes de agregar una nueva card
  const ultimoGrupo = this.grupos[this.grupos.length - 1];

  // Validación para asegurarse de que la última card esté completa
  if (ultimoGrupo && 
      (ultimoGrupo.idRol === null || ultimoGrupo.idRol === undefined || 
       ultimoGrupo.idEncargado === null || ultimoGrupo.idEncargado === undefined || 
       !Array.isArray(ultimoGrupo.idTarea) || ultimoGrupo.idTarea.length === 0)) {
    alert("Por favor, llena los datos de la card actual antes de agregar una nueva.");
    return;
  }

  // Si la última card está completa, agrega una nueva card vacía
  const nuevoGrupo = {
    idRol: null,
    idEncargado: null,
    idTarea: [], // Asegurando que idTarea es siempre un array
    minimizado: false  // Nueva propiedad para el estado
  };

  // Añadir el nuevo grupo a la lista
  this.grupos.push(nuevoGrupo);
  }


  loadGruposTareas(actaId?: number): void {
    this.http.get(`${this.apiUrlGrupoTareas}/Listado`).subscribe({
      next: (response: any) => {
        // Filtra los grupos de tareas por idActa si se pasa el actaId
          if (actaId) {
            this.grupos = response.body.response.filter((grupo: any) => grupo.idActa === actaId);
          } else {
            this.grupos = response.body.response || [];
          }
        
          // console.log('currentGrupo:', this.grupos);
      },
      error: error => {
        console.error('Error al cargar grupos de tareas:', error);
        this.showError('Error al cargar los grupos de tareas.', true);
      }
    });
  }

  // loadGruposTareasPorActa(actaId: number): void {
  //   this.http.get<any>(`${this.apiUrlGrupoTareas}/PorActa/${actaId}`).subscribe({
  //     next: response => {
  //       if (response.estado?.ack) {
  //         this.grupoTareas = response.body.response; // Asigna los grupos de tareas a una variable
  //       } else {
  //         this.showError(`Error al cargar los grupos de tareas: ${response.estado?.errDes}`, true);
  //       }
  //     },
  //     error: error => {
  //       console.error('Error al cargar los grupos de tareas:', error);
  //       this.showError('Error al cargar los grupos de tareas.', true);
  //     }
  //   });
  // }
  

  // // Método para guardar la información de un grupo específico
  // guardarGrupo(grupo: any) {
  //   // Aquí puedes implementar la lógica de guardado, como enviarlo al backend
  //   grupo.minimizado = true;
  //   //console.log('Grupo guardado:', grupo);
  // }


  createGrupoTarea(grupo: any): void {
    // Marcar el grupo como minimizado antes de realizar la solicitud
    grupo.minimizado = true;
  
    // Construimos el objeto a enviar con los datos actuales del grupo
    const nuevoGrupoTarea = {
      actA_ID: this.currentActa.id,         // ID del acta asociada
      roL_ID: grupo.idRol,              // ID del rol seleccionado
      encargadO_ID: grupo.idEncargado,    // ID del encargado seleccionado
      listaTareas: grupo.idTarea     // Lista de IDs de tareas seleccionadas
    };
  
    // console.log('Payload enviado:', nuevoGrupoTarea); // Verificar los datos enviados
    console.log('Payload enviado:', nuevoGrupoTarea);
    // Realizamos la solicitud POST
    this.http.post(`${this.apiUrlGrupoTareas}/add`, nuevoGrupoTarea).subscribe({
      next: (response: any) => {
        if (response.estado?.ack) {
          // Mensaje de éxito y recargar grupos
          this.showError('Grupo de tareas creado exitosamente.', false);
          this.loadGruposTareas(this.currentActa.id);
        } else {
          // Mensaje de error si el servidor no responde como se espera
          this.showError(`Error al crear el Grupo de Tareas: ${response.estado?.errDes || 'Respuesta no válida.'}`, true);
        }
      },
      error: error => {
        console.error('Detalles del error:', error);
        console.error('Código de estado:', error.status); // Código HTTP
        console.error('Mensaje:', error.message);         // Mensaje del error
        this.showError('Error al comunicarse con el servidor.', true);
      }
    });
  }
  
  guardarGrupoTarea(grupo: any): void {
    // Verificar si el grupo tiene un id. Si tiene, estamos actualizando; si no, estamos creando.
    if (grupo.idGrupoTarea) {
      // Si existe un id, actualizar el grupo de tarea
      this.actualizarGrupoTarea(grupo);
    } else {
      // Si no existe id, crear un nuevo grupo de tarea
      this.createGrupoTarea(grupo);
    }
  }
  
  // Función para actualizar un grupo de tarea
actualizarGrupoTarea(grupo: any): void {
  const grupoActualizado = {
    idGrupoTarea: grupo.idGrupoTarea,      // ID del grupo de tarea
    actA_ID: this.currentActa.id,          // ID del acta asociada
    roL_ID: grupo.idRol,                   // ID del rol seleccionado
    encargadO_ID: grupo.idEncargado,       // ID del encargado seleccionado
    listaTareas: grupo.idTarea             // Lista de IDs de tareas seleccionadas
  };

  this.http.put(`${this.apiUrlGrupoTareas}/Actualizar/${grupo.idGrupoTarea}`, grupoActualizado).subscribe({
    next: (response: any) => {
      if (response.estado?.ack) {
        // Mensaje de éxito y recargar grupos
        this.showError('Grupo de tareas actualizado exitosamente.', false);
        this.loadGruposTareas(this.currentActa.id);
      } else {
        // Mensaje de error si el servidor no responde como se espera
        this.showError(`Error al actualizar el Grupo de Tareas: ${response.estado?.errDes || 'Respuesta no válida.'}`, true);
      }
    },
    error: error => {
      console.error('Detalles del error:', error);
      console.error('Código de estado:', error.status); // Código HTTP
      console.error('Mensaje:', error.message);         // Mensaje del error
      this.showError('Error al comunicarse con el servidor.', true);
    }
  });
}

// Función para mostrar el modal de confirmación
confirmDeleteGrupoTarea(grupoId: number): void {
  this.grupoIdToDelete = grupoId;
  this.showConfirmationDeleteGrupoTarea = true; // Nueva propiedad booleana
}

// Función para eliminar después de confirmar
deleteGrupoTarea(): void {
  if (this.grupoIdToDelete) {
    this.http.delete(`${this.apiUrlGrupoTareas}/Eliminar/${this.grupoIdToDelete}`).subscribe({
      next: (response: any) => {
        if (response.estado?.ack) {
          this.showError('Grupo de tarea eliminado exitosamente.', false);
          this.loadGruposTareas(this.currentActa.id);  // Recargar los grupos de tareas para reflejar los cambios
        } else {
          this.showError(`Error al eliminar el grupo de tarea: ${response.estado.errDes}`, true);
        }
        
        this.closeConfirmationDialog();
      },
      error: error => {
        console.error('Error en la solicitud:', error);
        this.showError('Error en la solicitud al eliminar la especialidad.', true);
        
        this.closeConfirmationDialog();
      }
    });
  }
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




  // Método para mostrar el modal de confirmación
  confirmDeleteCard(grupo: any, index: number): void {
    this.currentCardToDelete = grupo;
    this.currentCardIndex = index;
    this.showConfirmationDeleteCard = true;
  }

  // Método para cerrar el modal de confirmación
  closeCardConfirmationDialog(): void {
    this.showConfirmationDeleteCard = false;
    this.currentCardToDelete = null;
    this.currentCardIndex = null;
  }

  // Método para eliminar la card después de confirmar
  deleteCard(): void {
    if (this.currentCardToDelete && this.currentCardIndex !== null) {
      // Limpiar los datos del grupo
      this.currentCardToDelete.rol = null;
      this.currentCardToDelete.encargado = null;
      this.currentCardToDelete.tareas = [];

      // Eliminar la card del array
      this.grupos.splice(this.currentCardIndex, 1);

      // Cerrar el modal
      this.closeCardConfirmationDialog();
    }
  }

  // ..................................................................................................
  

  // URLs de la API
  private apiUrl = 'https://localhost:7125/api/Parametro';
  private apiUrlTipoParametro = 'https://localhost:7125/api/TipoParametro';
  private apiUrlProveedor = 'https://localhost:7125/api/Proveedor';
  private apiUrlEspecialidad = 'https://localhost:7125/api/Especialidad';
  private apiUrlUsuarios = 'https://localhost:7125/api/Usuarios';
  private apiUrlActas = 'https://localhost:7125/api/Acta';
  private apiUrlObras = 'https://localhost:7125/api/Obra';
  private apiUrlTareas = 'https://localhost:7125/api/Tarea';
  private apiUrlGrupoTareas = 'https://localhost:7125/api/GrupoTarea';

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
    this.loadTareas();
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

  loadTareas(): void {
    this.http.get<any>(`${this.apiUrlTareas}/ListarTareas`).subscribe({
      next: response => {
        if (response.estado?.ack) {
          this.tareas = response.body.response; 
        } else {
          this.showError(`Error al cargar las Tareas: ${response.estado?.errDes}`, true);
        }
      },
      error: error => {
        console.error('Error al cargar las Tareas:', error);
        this.showError('Error en la solicitud al cargar las Tareas.', true);
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


  // Función para cargar las actas desde la API
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

  // Funcion que actualiza la pagina de acta segun la paginación
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
    // this.currentGrupo = gruptarea ? { ...gruptarea} : this.getEmptyGrupoTarea;
    // Verifica el objeto currentParametro
    //console.log('currentActa:', this.currentActa); // Verifica la estructura del objeto
    //console.log('currentGrupo:', this.currentGrupo); // Verifica la estructura del objeto
    //console.log('ID_TIPO_PARAMETRO:', this.currentActa.proveedoR_ID); // Verifica el valor
    this.loadProveedores();
    this.loadObras();
    //console.log('currentGrupo:', this.grupos);
    if (this.isEditMode && acta?.id) {
      this.loadGruposTareas(acta.id); // Carga los grupos de tareas del acta
      //console.log('currentGrupo:', this.grupos);
    } else {
      this.grupos = []; // Limpia los grupos de tareas si es un nuevo acta
    }
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

  // Función para cerrar el modal de actas
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

  // Función para crear un Acta
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


  // Función para actualizar un acta
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
    this.showConfirmationDeleteGrupoTarea = false;
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
          this.showError('Error en la solicitud al eliminar el acta.', true);
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


  // ........................................................................................................................

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

  getRolNombre(id: number): string {
    // Confirmar que los datos están cargados
    if (!this.roles || this.roles.length === 0) {
      console.warn('La lista de roles está vacía.');
      return `Rol desconocido (ID: ${id})`;
    }
  
    // Buscar el rol
    const rol = this.roles.find((rol) => rol.id === id);
  
    // Validar el resultado
    if (!rol) {
      console.warn(`No se encontró un rol con el ID: ${id}`);
      return `Rol desconocido (ID: ${id})`;
    }
  
    return rol.parametro;
  }
  
  getUsuarioNombre(id: number): string {
    // Confirmar que los datos están cargados
    if (!this.usuario || this.usuario.length === 0) {
      return `Encargado desconocido (ID: ${id})`;
    }
  
    // Buscar el usuario
    const usuario = this.usuario.find((usuario) => usuario.id === id);
  
    // Validar el resultado
    if (!usuario) {
      console.warn(`No se encontró un usuario con el ID: ${id}`);
      return `Encargado desconocido (ID: ${id})`;
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

  getTareaNombre(id: number): string {
    //console.log('ID recibido proveed:', id); // Ver qué ID llega
    ////console.log('Lista de tipos:', this.tipoParametros); // Ver qué tipos tenemos disponibles
    
    const tarea = this.tarea.find(elemento => {
        ////console.log('Comparando:aaaaa', elemento.id, 'con aaaa', id); // Ver las comparaciones
        return elemento.id === id;
    });
    
    if (!tarea) {
        ////console.log(`No se encontró proveedor para ID: ${id}`);
        return `Tipo ${id}`;
    }
    
    return tarea.nombre; 
  }



  /*se implementa la funcion para la descarga de actas en PDF*/
  downloadPDF(actaId: number): void {
    // Cargar grupos de tareas para el acta seleccionada
    this.loadGruposTareas(actaId);
  
    // Esperar a que los datos se carguen antes de generar el PDF
    setTimeout(() => {
      const acta = this.actas.find((a) => a.id === actaId);
      if (!acta) {
        alert('No se encontró el acta especificada.');
        return;
      }
  
      // Verificar si los grupos de tareas están cargados
      if (!this.grupos || this.grupos.length === 0) {
        alert('No hay grupos de tareas asociados al acta.');
        return;
      }
  
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(`Reporte de Acta N° ${actaId}`, 14, 20);
  
      // Información del Acta
      const actaInfo = [
        ['Campo', 'Detalle'],
        ['ID', acta.id || 'Sin ID'],
        ['Obra', this.getObraNombre(acta.obrA_ID || 0)],
        ['Proveedor', this.getProveedorNombre(acta.proveedoR_ID || 0)],
        ['Especialidad', this.getEspecialidadNombre(acta.especialidaD_ID || 0)],
        ['Administrador', this.getUsuarioNombre(acta.revisoR_ID || 0)],
        ['Fecha de Creación', acta.fechA_APROBACION ? new Date(acta.fechA_APROBACION).toLocaleDateString() : 'Sin fecha'],
        ['Observaciones', acta.observacion || 'Sin observaciones'],
        ['Estado', this.getEstadoNombre(acta.estadO_ID || 0)],
      ];
  
      (doc as any).autoTable({
        head: [actaInfo[0]],
        body: actaInfo.slice(1),
        startY: 30,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255 },
        bodyStyles: { valign: 'top', halign: 'left' },
        columnStyles: {
          1: { cellWidth: 100 }, // Ajusta el ancho de la columna "Detalle"
        },
        didParseCell: (data: any) => {
          if (data.row.raw && data.row.raw[0] === 'Observaciones') {
            data.cell.styles.cellWidth = 'wrap'; // Envuelve texto largo en Observaciones
          }
        },
      });
  
      // Grupos de Tareas
      doc.text('Tareas Asociadas:', 14, (doc as any).lastAutoTable.finalY + 10);
  
      this.grupos.forEach((grupo, index) => {
        // console.log('Procesando grupo:', grupo); // Depuración
  
        const rolNombre = this.getRolNombre(grupo.idRol);
        const encargadoNombre = this.getUsuarioNombre(grupo.idEncargado);
  
        // console.log(`Rol obtenido: ${rolNombre}, Encargado obtenido: ${encargadoNombre}`); // Depuración
  
        const tareas = (grupo.idTarea || [])
          .map((tareaId: number) => {
            const tarea = this.tareas.find((t) => t.id === tareaId);
            return tarea ? tarea.nombre : `Tarea desconocida (ID: ${tareaId})`;
          })
          .join(', ');
  
        // console.log(`Tareas obtenidas: ${tareas}`); // Depuración
  
        doc.setFontSize(12);
        doc.text(`Grupo ${index + 1}:`, 14, (doc as any).lastAutoTable.finalY + 15);
  
        const grupoInfo = [
          ['Rol', rolNombre],
          ['Encargado', encargadoNombre],
          ['Tareas', tareas || 'Sin tareas asignadas'],
        ];
  
        (doc as any).autoTable({
          head: [['Campo', 'Detalle']],
          body: grupoInfo,
          startY: (doc as any).lastAutoTable.finalY + 20,
          theme: 'striped',
          styles: { fontSize: 10 },
          headStyles: { fillColor: [22, 160, 133], textColor: 255 },
        });
      });
  
      // Guardar el PDF
      doc.save(`Acta_${actaId}.pdf`);
    }, 1000); // Asegúrate de que sea suficiente para cargar los datos
  }
  
  
}
