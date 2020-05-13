import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  renuevaToken() {
    const url = `${environment.apiUrl}/login/renuevaToken?token=${this.token}`;
    return this.http.get<{ ok: boolean; token: string }>(url).pipe(
      map((resp) => {
        this.token = resp.token;
        localStorage.setItem('token', this.token);
        console.log('Token renovado');
      }),
      catchError((err) => {
        this.router.navigate(['/login']);
        Swal.fire(
          'No se pudo renovar token',
          'No fue posible renovar token',
          'error'
        );
        return throwError(err);
      })
    );
  }

  estaLogueado(): boolean {
    return this.token.length > 5 ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  logout(): void {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    const url = environment.apiUrl + '/login/google';

    return this.http
      .post<{
        ok: boolean;
        usuario: Usuario;
        token: string;
        id: string;
        menu: any;
      }>(url, { token })
      .pipe(
        map((resp) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
          return true;
        })
      );
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  login(usuario: Usuario, recuerdame: boolean = false): Observable<boolean> {
    const url = environment.apiUrl + '/login';
    if (recuerdame) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    return this.http
      .post<{
        ok: boolean;
        usuario: Usuario;
        token: string;
        id: string;
        menu: any;
      }>(url, usuario)
      .pipe(
        map((resp) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
          return true;
        }),
        catchError((err) => {
          Swal.fire('Error en el login', err.error.mensaje, 'error');
          return throwError(err);
        })
      );
  }
  crearUsuario(usuario: Usuario) {
    const url = environment.apiUrl + '/usuario';
    return this.http
      .post<{
        ok: boolean;
        usuario: Usuario;
      }>(url, usuario)
      .pipe(
        map((resp) => {
          Swal.fire({
            title: 'Usuario creado',
            text: usuario.email,
            icon: 'success',
          });
          return resp.usuario;
        }),
        catchError((err) => {
          Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        })
      );
  }

  actualizarUsuario(usuario: Usuario) {
    const url = `${environment.apiUrl}/usuario/${usuario._id}\
?token=${this.token}`;
    return this.http.put<{ ok: boolean; usuario: Usuario }>(url, usuario).pipe(
      map((resp) => {
        if (usuario._id === this.usuario._id) {
          this.guardarStorage(resp.usuario._id, this.token, usuario, this.menu);
        }
        Swal.fire({
          title: 'Usuario actualizado',
          text: resp.usuario.nombre,
          icon: 'success',
        });
        return true;
      }),
      catchError((err) => {
        Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
        return throwError(err);
      })
    );
  }

  cambiarImagen(archivo: File, id: string) {
    this.subirArchivoService
      .subirArchivo(archivo, 'usuarios', id)
      .then((resp) => {
        this.usuario.img = resp.usuario.img;
        Swal.fire({
          title: 'Imagen actualizada',
          text: this.usuario.nombre,
          icon: 'success',
        });
        this.guardarStorage(id, this.token, this.usuario, this.menu);
      })
      .catch((resp) => {
        console.log(resp);
      });
  }

  cargarUsuarios(desde: number) {
    const url = environment.apiUrl + '/usuario?desde=' + desde;

    return this.http.get<{
      ok: boolean;
      usuarios: Usuario[];
      total: number;
    }>(url);
  }

  buscarUsuarios(termino: string) {
    const url = `${environment.apiUrl}/busqueda/coleccion\
/usuarios/${termino}`;
    return this.http
      .get<{ ok: boolean; usuarios: Usuario[] }>(url)
      .pipe(map((resp) => resp.usuarios));
  }

  borrarUsuario(id: string) {
    const url = `${environment.apiUrl}/usuario/${id}\
?token=${this.token}`;
    return this.http.delete<{ ok: boolean; usuario: Usuario }>(url).pipe(
      map(() => {
        Swal.fire({
          title: 'Usuario borrado',
          text: 'El usuario ha sido eliminado correctamente',
          icon: 'success',
        });
        return true;
      })
    );
  }
}
