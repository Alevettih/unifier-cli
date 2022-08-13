import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';
import { HttpService, IServicesConfig } from '@services/http/http.service';
import { IEntity } from '@models/interfaces/entity.interface';
import { ClassConstructor } from 'class-transformer';
import { toModelsList } from '@misc/rxjs-operators/to-models-list.operator';
import { toModel } from '@misc/rxjs-operators/to-model.operator';
import { CustomHTTPParamsEncoder } from '@misc/custom-http-params-encoder';
import { HttpParams } from '@angular/common/http';
import { List } from '@models/classes/_list.model';
import { APP_CONFIG, IAppConfig } from '@misc/constants/app-config.constant';

export type transition = 'cancel' | 'reject' | 'accept';

export interface ITransitData {
  transition: transition;
  context?: {
    [key: string]: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export abstract class ApiBaseAbstractService<T> {
  protected abstract readonly MODEL: ClassConstructor<T>;
  protected abstract readonly URLPath: string;
  protected URLParams: string[] = [];

  protected constructor(@Inject(APP_CONFIG) protected config: IAppConfig, protected http: HttpService) {}

  get baseUrl(): string {
    return this.config.apiUrl;
  }

  get url(): string {
    return this.baseUrl + this._composeUrlPath();
  }

  getItems(params?: Params, servicesConfig?: IServicesConfig): Observable<List<T>> {
    const httpParams: HttpParams = new HttpParams({ fromObject: params, encoder: new CustomHTTPParamsEncoder() });
    return this.http.get(this.url, { params: httpParams }, servicesConfig).pipe(toModelsList(this.MODEL));
  }

  getItem(id?: string, params?: Params, servicesConfig?: IServicesConfig): Observable<T> {
    return this.http.get(id ? `${this.url}/${id}` : this.url, { params }, servicesConfig).pipe(toModel(this.MODEL));
  }

  createItem(data: Partial<T>, servicesConfig?: IServicesConfig): Observable<T> {
    const body: Partial<T> & IEntity = { ...data };
    delete body.id;
    return this.http.post(this.url, body, {}, servicesConfig);
  }

  updateItem(data: Partial<T> & IEntity, servicesConfig?: IServicesConfig): Observable<T> {
    const body: Partial<T> & IEntity = { ...data };
    delete body.id;
    return this.http.patch(`${this.url}/${data.id}`, body, {}, servicesConfig);
  }

  cascadeUpdateItem(data: Partial<T> & IEntity, servicesConfig?: IServicesConfig): Observable<T> {
    const body: Partial<T> & IEntity = { ...data };
    delete body.id;
    return this.http.put(`${this.url}/${data.id}`, body, {}, servicesConfig);
  }

  deleteItem(id: string, servicesConfig?: IServicesConfig): Observable<void> {
    return this.http.delete(`${this.url}/${id}`, {}, servicesConfig);
  }

  transit(id: string, data: ITransitData, servicesConfig?: IServicesConfig): Observable<T> {
    return this.http.patch(`${this.url}/${id}/transit`, data, {}, servicesConfig);
  }

  getTransition(id?: string, params?: Params, servicesConfig?: IServicesConfig): Observable<string[]> {
    return this.http.get(`${this.url}/${id}/transit`, { params }, servicesConfig);
  }

  private _composeUrlPath(): string {
    let URLPath: string = this.URLPath;

    if (this.URLParams?.length) {
      const params: string[] = URLPath.match(/:[a-z]+(?=\/)?/gi);
      params.forEach((param: string, i: number): void => {
        URLPath = URLPath.replace(param, this.URLParams[i]);
      });
    }

    return URLPath;
  }
}
