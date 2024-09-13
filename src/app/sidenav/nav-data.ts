import { RouterLink } from "@angular/router";

export const navbarData = [
  {
    RouterLink: 'dashboard',
    icon: 'fa-solid fa-house',
    label: 'Dashboard'
  },

  {
    RouterLink: 'actas',
    icon: 'fa-solid fa-file',
    label: 'Actas'
  },
  {
    RouterLink: 'perfiles',
    icon: 'fa-solid fa-user',
    label: 'Usuarios'
  },
  {
    RouterLink: 'obras',
    icon: 'fa-solid fa-person-digging',
    label: 'Obras'
  },

  {
    RouterLink: 'gestion-especialidad',
    icon: 'fa-solid fa-briefcase',
    label: 'Especialidades'
  },
  {
    RouterLink: 'gestion-tarea',
    icon: 'fa-solid fa-tasks',
    label: 'Tareas'
  },
  {
    // Proveedores
    RouterLink: 'gestion-proveedores',
    icon: 'fa-solid fa-building',
    label: 'Proveedores'
  },

  //Gestion de tipo de parametos
  // los iconos se ven aqui : https://fontawesome.com/search?q=para&o=r&m=free&s=solid
  {
    RouterLink: 'gestion-tipo-parametros',
    icon: 'fa-solid fa-hat-cowboy',
    label: 'Gestion tipo parametros'
  },

  //Gestión parametos
  {
    RouterLink: 'parametros',
    icon: 'fa-solid fa-gear',
    label: 'Parámetros'
  },

];

