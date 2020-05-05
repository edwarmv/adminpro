import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from 'src/app/models/hospital.model';
import { MedicoService } from 'src/app/services/medico.service';
import { HospitalService } from 'src/app/services/hospital/hospital.service';
import { take } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit, OnDestroy {
  hospitales: Hospital[] = [];
  medico: Medico = new Medico('');
  hospital: Hospital = new Hospital('');
  subscription: Subscription = new Subscription();

  constructor(
    private medicoService: MedicoService,
    private hospitalService: HospitalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalUploadService: ModalUploadService,
  ) {
    this.subscription.add(
      this.activatedRoute.params.subscribe(params => {
        const id = params.id;

        if (id !== 'nuevo') {
          this.cargarMedico(id);
        }
      }));
  }

  ngOnInit(): void {
    this.hospitalService.cargarHospitales(0)
      .pipe(take(1))
      .subscribe(resp => this.hospitales = resp.hospitales);

    this.subscription.add(
      this.modalUploadService.notificacion
        .subscribe((resp: any) => this.medico.img = resp.medico.img)
    );
  }

  cargarMedico(id: string) {
    this.medicoService.cargarMedico(id)
      .pipe(take(1))
      .subscribe(medico => {
        this.medico = medico;
        this.medico.hospital = (medico.hospital as Hospital)._id;
        this.cambioHospital(this.medico.hospital);
      });
  }

  guardarMedico(f: NgForm) {
    console.log(f.valid);
    console.log(f.value);
    if (f.invalid) {
      return;
    }

    this.medicoService.guardarMedico(this.medico)
      .subscribe(medico => {
        this.medico._id = medico._id;

        this.router.navigate(['/medico', medico._id]);
      });
  }

  cambioHospital(id: string) {
    this.hospitalService.obtenerHospital(id)
      .pipe(take(1))
      .subscribe(hospital => this.hospital = hospital);
  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal('medicos', this.medico._id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
