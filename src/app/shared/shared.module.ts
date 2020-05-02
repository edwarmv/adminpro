import { NgModule } from '@angular/core';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Pipes Module
import { PipesModule } from '../pipes/pipes/pipes.module';

@NgModule({
  declarations: [BreadcrumbsComponent, HeaderComponent, SidebarComponent],
  exports: [BreadcrumbsComponent, HeaderComponent, SidebarComponent],
  imports: [
    RouterModule,
    CommonModule,
    PipesModule,
  ],
})
export class SharedModule {}
