import { ClassConstructor } from 'class-transformer';
import { convertToModel } from '@misc/helpers/model-conversion/convert-to-model.function';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { List } from '@models/classes/_list.model';
import { getRandomIdentifier } from '@misc/helpers/get-random-identifier.function';
import { Params } from '@angular/router';

export abstract class Responses<T extends { id: string }> {
  protected abstract readonly MODEL: ClassConstructor<T>;
  abstract readonly ENTITIES: T[] = [];

  protected abstract entitiesFn(index: number): Partial<T>;

  init(initialCount: number = 20, withConversion: boolean = true): void {
    for (let i: number = 0; i < initialCount; i++) {
      this.ENTITIES.push(withConversion ? convertToModel(this.entitiesFn.call(this, i), this.MODEL) : this.entitiesFn.call(this, i));
    }
  }

  get list(): (params: string[], body: Params, headers: HttpHeaders) => Observable<HttpResponse<List<Partial<T>>>> {
    return this._list.bind(this);
  }

  get oneById(): (params: string[], body: Params, headers: HttpHeaders) => Observable<HttpResponse<Partial<T>>> {
    return this._oneById.bind(this);
  }

  get create(): (params: string[], body: any, headers: HttpHeaders) => Observable<HttpResponse<Partial<T>>> {
    return this._create.bind(this);
  }

  get update(): (params: string[], body: Partial<T>, headers: HttpHeaders) => Observable<HttpResponse<Partial<T>>> {
    return this._update.bind(this);
  }

  get delete(): (params: string[], body: void, headers: HttpHeaders) => Observable<HttpResponse<void>> {
    return this._delete.bind(this);
  }

  protected _list(
    params: string[],
    body: HttpParams,
    headers: HttpHeaders,
    entities?: Partial<T>[]
  ): Observable<HttpResponse<List<Partial<T>>>> {
    let resEntities: Partial<T>[] = entities ?? this.ENTITIES;

    if (body.has('page')) {
      const page: number = Number(body.get('page'));
      const perPage: number = Number(body.get('per-page')) || 20;
      resEntities = resEntities.slice((page - 1) * perPage, page * perPage);
    }

    return of(
      new HttpResponse({
        status: 200,
        body: { entities: resEntities, total: this.ENTITIES.length }
      })
    );
  }

  protected _oneById([id]: string[], body: Params, headers: HttpHeaders): Observable<HttpResponse<Partial<T>>> {
    return of(
      new HttpResponse({
        status: 200,
        body: this.ENTITIES.find((entity: T): boolean => entity.id === id)
      })
    );
  }

  protected _create(routeParams: string[], body: T): Observable<HttpResponse<Partial<T>>> {
    body.id = getRandomIdentifier();
    this.ENTITIES.push(body);

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }

  protected _update([id]: string[], body: Partial<T>): Observable<HttpResponse<Partial<T>>> {
    const entityIndex: number = this.ENTITIES.findIndex((entity: T): boolean => entity?.id === id);

    this.ENTITIES.splice(entityIndex, 1, { ...this.ENTITIES[entityIndex], ...body });

    return of(
      new HttpResponse({
        status: 200,
        body: this.ENTITIES[entityIndex]
      })
    );
  }

  protected _delete([id]: string[]): Observable<HttpResponse<void>> {
    const entityIndex: number = this.ENTITIES.findIndex((user: T): boolean => user?.id === id);
    if (entityIndex > -1) {
      this.ENTITIES.splice(entityIndex, 1);
    }

    return of(
      new HttpResponse({
        status: 200
      })
    );
  }
}
