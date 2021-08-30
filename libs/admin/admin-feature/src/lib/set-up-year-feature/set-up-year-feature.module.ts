import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetUpYearPageComponent } from './set-up-year-page/set-up-year-page.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminUiModule } from '@reslife/admin-ui';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
  { path: '', component: SetUpYearPageComponent },
];

@NgModule({
  declarations: [
    SetUpYearPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AdminUiModule,
    FlexLayoutModule
  ]
})
export class SetUpYearFeatureModule { }
