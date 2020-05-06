import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  canActivate() {
    if (this.usuarioService.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else {
      // this.usuarioService.logout();
      this.router.navigate(['/']);

      Swal.fire(
        'Acceso denegado!',
        'No cuenta con los permisos necesarios',
        'error'
      );
      console.log('Bloqueado por el ADMIN GUARD');
      return false;
    }
  }

}
