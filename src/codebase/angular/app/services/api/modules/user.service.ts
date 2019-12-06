import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '@misc/constants';
import { HttpService } from '@services/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpService) {}

}
