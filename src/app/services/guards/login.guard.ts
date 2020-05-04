import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}
  canActivate(): boolean {
    if (this.usuarioService.estaLogueado()) {
      return true;
    } else {
      console.log('NO PASO EL GUARD');
      this.router.navigate(['/login']);
      return false;
    }
  }

}
