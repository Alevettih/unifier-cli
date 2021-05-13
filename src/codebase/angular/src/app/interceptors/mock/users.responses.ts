import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { User } from '@models/classes/user.model';
import { UserRole } from '@models/enums/user-role.enum';
import { Params } from '@angular/router';
import { List } from '@models/classes/_base.model';
import { convertToModel } from '@misc/helpers/model-conversion/convert-to-model.function';
import { getRandomIdentifier } from '@misc/helpers/get-random-identifier.function';

export const entities: Partial<User>[] = [
  convertToModel(
    {
      id: 'vkvggvc9-33g3-vk0p-v90c-g9g9ggp8v453',
      name: 'John Doe',
      role: UserRole.admin
    },
    User
  )
];

for (let i: number = 0; i < 20; i++) {
  entities.push(
    convertToModel(
      {
        id: `vkvggvc9-33g3-vk0p-v90c-g9g9ggp8v9${i.toString().padStart(2, '0')}`,
        name: `John Doe ${i.toString().padStart(3, '0')}`,
        email: `john.doe+${i.toString().padStart(3, '0')}@requestum.com`,
        // role: UserRole.user,
        phone: '+380945468753',
        createdAt: '2020-07-31T15:38:27'
      },
      User
    )
  );
}

export interface IUsersResponses {
  list(params: string[], body: HttpParams, headers: HttpHeaders): Observable<HttpResponse<List<Partial<User>>>>;
  oneById(routeParams: string[], body: Params, headers: HttpHeaders): Observable<HttpResponse<Partial<User>>>;
  create(routeParams: string[], body: Params, headers: HttpHeaders): Observable<HttpResponse<Partial<User>>>;
  update(routeParams: string[], body: Params, headers: HttpHeaders): Observable<HttpResponse<Partial<User>>>;
  logout(): Observable<HttpResponse<void>>;
  confirmAccount(): Observable<HttpResponse<void>>;
  updatePassword(): Observable<HttpResponse<void>>;
  sendToken(): Observable<HttpResponse<void>>;
}

export const usersResponses: IUsersResponses = {
  list(params: string[], body: HttpParams): Observable<HttpResponse<List<Partial<User>>>> {
    let resEntities: Partial<User>[] = entities;

    if (body.has('page')) {
      const page: number = Number(body.get('page'));
      const perPage: number = Number(body.get('per-page')) || 20;
      resEntities = resEntities.slice((page - 1) * perPage, page * perPage);
    }

    return of(
      new HttpResponse({
        status: 200,
        body: { entities: resEntities, total: entities.length }
      })
    );
  },
  oneById([id]: string[], body: Params, headers: HttpHeaders): Observable<HttpResponse<Partial<User>>> {
    const token: string = headers.get('Authorization');
    const role: UserRole = token ? (atob(token.replace('Bearer ', '')) as UserRole) : null;
    if (id && id !== 'me') {
      return of(
        new HttpResponse({
          status: 200,
          body: entities.find((user: User): boolean => user.id === id)
        })
      );
    } else {
      return of(
        new HttpResponse({
          status: 200,
          body: entities.find((user: User): boolean => user.role === role)
        })
      );
    }
  },
  create(routeParams: string[], body: Partial<User>): Observable<HttpResponse<Partial<User>>> {
    body.id = getRandomIdentifier();
    this.entities.push(body);

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  },
  update([id]: string[], body: Partial<User>): Observable<HttpResponse<Partial<User>>> {
    const entityIndex: number = entities.findIndex((user: User): boolean => user?.id === id);

    entities.splice(entityIndex, 1, { ...entities[entityIndex], ...body });

    return of(
      new HttpResponse({
        status: 200,
        body: entities[entityIndex]
      })
    );
  },
  logout(): Observable<HttpResponse<void>> {
    return of(
      new HttpResponse({
        status: 200
      })
    );
  },
  confirmAccount(): Observable<HttpResponse<void>> {
    return of(
      new HttpResponse({
        status: 200
      })
    );
  },
  updatePassword(): Observable<HttpResponse<void>> {
    return of(
      new HttpResponse({
        status: 200
      })
    );
  },
  sendToken(): Observable<HttpResponse<void>> {
    return of(
      new HttpResponse({
        status: 200
      })
    );
  }
};
