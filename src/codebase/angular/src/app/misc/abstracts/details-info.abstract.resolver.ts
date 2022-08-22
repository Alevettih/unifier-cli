import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpServiceError } from '@services/http/http-service-error.class';
import { BaseModel } from '@models/classes/_base.model';
import { ApiBaseAbstractService } from '@misc/abstracts/api-base.abstract.service';

@Injectable({
  providedIn: 'root'
})
export abstract class DetailsInfoAbstractResolver<Model extends BaseModel> implements Resolve<Model> {
  protected abstract readonly _PARAM_NAME: string;
  protected abstract _api: ApiBaseAbstractService<Model>;

  protected constructor(private _router: Router) {}

  resolve({ params }: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Model> {
    return this._api.getItem(params[this._PARAM_NAME]).pipe(
      catchError((err: HttpServiceError): Observable<never> => {
        if (err.status === 404) {
          this._router.navigate(['', '404']);
        }

        throw err;
      })
    );
  }
}
