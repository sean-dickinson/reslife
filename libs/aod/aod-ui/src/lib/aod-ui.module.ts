import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckInBasedExcusalFormModule } from './check-in-based-excusal-form/check-in-based-excusal-form.module';
import { TimeBasedExcusalFormModule } from './time-based-excusal-form/time-based-excusal-form.module';
import { CampusedManagementTableModule } from './campused-management-table/campused-management-table.module';
import { EditCampusedModalModule } from './edit-campused-modal/edit-campused-modal.module';

@NgModule({
  imports: [
    CommonModule,
    CheckInBasedExcusalFormModule,
    TimeBasedExcusalFormModule,
    CampusedManagementTableModule,
    EditCampusedModalModule,
  ],
  exports: [
    CheckInBasedExcusalFormModule,
    TimeBasedExcusalFormModule,
    CampusedManagementTableModule,
    EditCampusedModalModule,
  ]
})
export class AodUiModule {}
