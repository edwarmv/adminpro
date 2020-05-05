import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit, OnDestroy {
  cargando = false;
  totalRegistros: number;
  desde = 0;
  hospitales: Hospital[] = [];
  susbcription: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalUploadService: ModalUploadService,
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this.susbcription = this.modalUploadService.notificacion.subscribe(() => {
      this.cargarHospitales();
    });
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde)
      .pipe(take(1))
      .subscribe(resp => {
      this.hospitales = resp.hospitales;
      this.totalRegistros = resp.total;
      this.cargando = false;
    });
  }

  cambiarDesde(desde: number) {
    const desdeB = this.desde + desde;

    if (desdeB < 0) {
      return;
    }

    if (desdeB >= this.totalRegistros) {
      return;
    }

    this.desde += desde;

    this.hospitalService.cargarHospitales(this.desde)
      .pipe(take(1))
      .subscribe(resp => {
        this.hospitales = resp.hospitales;
        this.totalRegistros = resp.total;
    });
  }

  buscarHospital(termino: string) {
    if (termino.length === 0) {
      this.cargarHospitales();
    } else {
      this.cargando = true;
      this.hospitalService.buscarHospital(termino)
        .pipe(take(1))
        .subscribe(resp => {
          this.hospitales = resp;
          this.cargando = false;
      });
    }
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('hospitales', id);
  }

  guardarHospital(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital)
      .pipe(take(1))
      .subscribe();
  }

  async crearHospital() {
    const { value: nombre } = await Swal.fire({
      title: 'Crear hospital',
      input: 'text',
      inputPlaceholder: 'Ingrese el nombre del hospital',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    });

    if (nombre) {
      this.hospitalService.crearHospital(nombre).pipe(take(1))
        .subscribe(() => this.cargarHospitales());
    }
  }

  borrarHospital(hospital: Hospital) {
    Swal.fire({
      title: 'Borrar hospital',
      text: '¿Esta seguro de borrar al hospital ' + hospital.nombre + '?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
    }).then(result => {
      if (result.value) {
        this.hospitalService.borrarHospital(hospital._id)
          .pipe(take(1))
          .subscribe(() => {
            this.cargarHospitales();
        });
      }
    });
  }

  ngOnDestroy() {
    this.susbcription.unsubscribe();
  }
}
