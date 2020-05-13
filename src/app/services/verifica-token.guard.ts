import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { UsuarioService } from './usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(): Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('Token guard');
    const token = this.usuarioService.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const tokenExpirado = this.tokenExpirado(payload.exp);

    if (tokenExpirado) { return this.router.parseUrl('/login'); }

    return this.verificaRenuevaToken(payload.exp);
  }

  verificaRenuevaToken(fechaExpiracion: number): Promise<boolean | UrlTree> {
    return new Promise((resolve, reject) => {
      const tokenExp = new Date(fechaExpiracion * 1000);
      console.log(tokenExp, 'tokenExp');
      const ahora = new Date();

      ahora.setTime(ahora.getTime() + (1 * 60 * 60 * 1000));

      if (tokenExp.getTime() > ahora.getTime()) {
        resolve(true);
      } else {
        this.usuarioService.renuevaToken().subscribe(
          () => resolve(true),
          () => reject(this.router.parseUrl('/login'))
        );
      }
    });
  }

  tokenExpirado(fechaExpiracion: number): boolean {
    const ahora = new Date().getTime() / 1000;
    console.log(fechaExpiracion);
    console.log(ahora);
    if (fechaExpiracion < ahora) { return true; } else { return false; }
  }
}
