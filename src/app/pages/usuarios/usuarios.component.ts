import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;
  private subscription: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private modalUploadService: ModalUploadService,
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.subscription = this.modalUploadService.notificacion
      .subscribe(() => this.cargarUsuarios());
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .pipe(take(1))
      .subscribe(resp => {
        this.usuarios = resp.usuarios;
        this.totalRegistros = resp.total;
        this.cargando = false;
      });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;

    console.log(desde);

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;

    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.usuarioService.buscarUsuarios(termino)
      .pipe(take(1))
      .subscribe(usuarios => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this.usuarioService.usuario._id) {
      Swal.fire({
        title: 'No puede borrar usuario',
        text: 'No se puede borrar a si mismo',
        icon: 'error',
      });
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then(res => {
      if (res.value) {
        this.usuarioService.borrarUsuario(usuario._id)
          .pipe(take(1))
          .subscribe(() => this.cargarUsuarios());
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this.usuarioService.actualizarUsuario(usuario)
      .pipe(take(1))
      .subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
