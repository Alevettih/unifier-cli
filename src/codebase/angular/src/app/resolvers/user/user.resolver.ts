import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router';
import { UserApiService } from '@services/api/user-api/user-api.service';
import { User } from '@models/classes/user/user.model';
import { DetailsInfoAbstractResolver } from '@misc/abstracts/details-info.abstract.resolver';

@Injectable({
  providedIn: 'root'
})
export class UserResolver extends DetailsInfoAbstractResolver<User> implements Resolve<User> {
  protected override readonly _PARAM_NAME: string = 'userId';

  constructor(protected override _api: UserApiService, _router: Router) {
    super(_router);
  }
}
