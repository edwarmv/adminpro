import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [],
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  titulo: string;
  routerSubscription: Subscription;

  constructor(
    private router: Router,
    private title: Title,
    private meta: Meta
  ) {
    this.routerSubscription = this.getDataRoute().subscribe((data) => {
      this.titulo = data.titulo;
      this.title.setTitle(this.titulo);
      const metaTag: MetaDefinition = {
        name: 'description',
        content: data.titulo,
      };
      this.meta.updateTag(metaTag);
    });
  }

  ngOnInit(): void {}

  getDataRoute(): Observable<{ titulo: string }> {
    return this.router.events.pipe(
      filter((evento) => evento instanceof ActivationEnd),
      filter((evento: ActivationEnd) => evento.snapshot.firstChild === null),
      map((evento: ActivationEnd) => evento.snapshot.data as { titulo: string })
    );
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
}
