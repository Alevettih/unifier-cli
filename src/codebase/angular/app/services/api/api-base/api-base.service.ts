import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';
import { HttpService, ServicesConfig } from '@services/http/http.service';
import { Entity, List } from '@models/_base.model';
import { APP_CONFIG, AppConfig } from '@misc/constants';

@Injectable({
  providedIn: 'root'
})
export abstract class ApiBaseService<T> {
  protected abstract URLPath = '/';
  protected URLParams = [];

  protected constructor(@Inject(APP_CONFIG) protected config: AppConfig, protected http: HttpService) {}

  get baseUrl(): string {
    return this.config.apiUrl;
  }

  get url(): string {
    return this.baseUrl + this.composeUrlPath();
  }

  getItems(params?: Params, servicesConfig?: ServicesConfig): Observable<List<T>> {
    return this.http.get(this.url, params, servicesConfig);
  }

  getItem(id?: number, params?: Params, servicesConfig?: ServicesConfig): Observable<T> {
    return this.http.get(id ? `${this.url}/${id}` : this.url, params, servicesConfig);
  }

  createItem(data: T, servicesConfig?: ServicesConfig): Observable<T> {
    const body = { ...data, id: undefined };
    return this.http.post(this.url, body, servicesConfig);
  }

  updateItem(data: T & Entity, servicesConfig?: ServicesConfig): Observable<T> {
    const body = { ...data, id: undefined };
    return this.http.patch(`${this.url}/${data.id}`, body, servicesConfig);
  }

  deleteItem(id: number, servicesConfig?: ServicesConfig): Observable<void> {
    return this.http.delete(`${this.url}/${id}`, servicesConfig);
  }

  private composeUrlPath(): string {
    let URLPath = this.URLPath;

    if (this.URLParams?.length) {
      const params = URLPath.match(/:[a-z]+(?=\/)?/gi);
      params.forEach((param, i) => {
        URLPath = URLPath.replace(param, this.URLParams[i]);
      });
    }

    return URLPath;
  }
}
