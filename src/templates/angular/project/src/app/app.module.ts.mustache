import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DirectivesModule } from '@directives/directives.module';
import { PipesModule } from '@pipes/pipes.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from '@interceptors/jwt/jwt.interceptor';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { LayoutsModule } from '@layouts/layouts.module';
import { MockInterceptor } from '@interceptors/mock/mock.interceptor';
import { AppInitializerFactory, HttpLoaderFactory } from '@misc/app.initializer';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    DirectivesModule,
    PipesModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    LayoutsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-GB' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializerFactory,
      multi: true,
      deps: [TranslateService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
