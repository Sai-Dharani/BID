import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Config, OccConfig } from '@spartacus/core';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: OccConfig, useExisting: Config }
  ],
})
export class OccModule {}
  