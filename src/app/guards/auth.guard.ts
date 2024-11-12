// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(): boolean {
        // Simplemente verifica si existe el token que ya estás guardando
        const token = localStorage.getItem('token');
    
    if (!token) {
        this.router.navigate(['/login']);
        return false;
    }
    
    return true;
    }
}