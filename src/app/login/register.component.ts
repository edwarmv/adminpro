import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins(): any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.scss']
})
export class RegisterComponent implements OnInit {
  forma: FormGroup;
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  sonIguales(campo1: string, campo2: string) {
    return (group: FormGroup) => {
      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;
      if (pass1 === pass2) {
        return null;
      }
      return {
        sonIguales: true,
      };
    };
  }

  ngOnInit(): void {
    init_plugins();
    this.forma = this.fb.group({
      nombre: [null, Validators.required],
      correo: [null, [Validators.required, Validators.email]],
      password: [Validators.required],
      password2: [Validators.required],
      condiciones: [false],
    }, { validators: this.sonIguales('password', 'password2') });
    this.forma.setValue({
      nombre: 'Test ',
      correo: 'test@test.com',
      password: '123456',
      password2: '123456',
      condiciones: true,
    });
  }

  registrarUsuario() {
    if (this.forma.invalid) {
      return;
    }
    if (!this.forma.value.condiciones) {
      Swal.fire({
        title: 'Importante',
        text: 'Debe de aceptar las condiciones',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }
    const usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password,
    );
    this.usuarioService.crearUsuario(usuario)
    .subscribe(() => this.router.navigate(['/login']));
  }
}
