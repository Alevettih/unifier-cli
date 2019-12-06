import { Injectable } from '@angular/core';
import { UserService } from '@services/api/modules/user.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    public user: UserService
  ) {}
}
