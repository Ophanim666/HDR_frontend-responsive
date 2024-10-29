import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  email: string = '';  // Captura el email del usuario
  password: string = '';  // Captura la contraseña del usuario
  errorMessage: string = '';  // Mensaje de error si ocurre uno

  private apiUrl = 'https://localhost:7125/api/LogInConreoller/login';  // URL de tu API

  constructor(private http: HttpClient, private router: Router) { }

  // Método para iniciar sesión
  login() {
    const loginData = { email: this.email, password: this.password };

    this.http.post<any>(this.apiUrl, loginData).subscribe({
      next: (response) => {
        // Capturar el token JWT desde la respuesta
        const token = response.token;

        // Guardar el token en localStorage
        localStorage.setItem('token', token);

        // Redirigir a la página principal
        this.router.navigate(['/gestion-especialidad']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.'; // Muestra el mensaje de error
      }
    });
  }
}
