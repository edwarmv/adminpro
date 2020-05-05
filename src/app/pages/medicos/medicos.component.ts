import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from 'src/app/services/medico.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {
  medicos: Medico[] = [];

  constructor(
    public medicoService: MedicoService,
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.medicoService.cargarMedicos()
      .pipe(take(1))
      .subscribe(resp => this.medicos = resp);
  }

  buscarMedico(termino: string) {
    if (termino === '') {
      this.cargarMedicos();
    } else {
      this.medicoService.buscarMedico(termino)
        .pipe(take(1))
        .subscribe(resp => this.medicos = resp);
    }
  }

  borrarMedico(medico: Medico) {
    this.medicoService.borrarMedico(medico._id).pipe(take(1))
      .subscribe(() => this.cargarMedicos());
  }
}
