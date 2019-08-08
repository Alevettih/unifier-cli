import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from '@directives/directives.module';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DirectivesModule,
    PipesModule
  ],
  declarations: [

  ],
  exports: [

  ]
})
export class CommonComponentsModule {}
