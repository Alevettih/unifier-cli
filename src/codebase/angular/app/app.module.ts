import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { CommonComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { PipesModule } from '@pipes/pipes.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonComponentsModule,
    DirectivesModule,
    PipesModule,
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
