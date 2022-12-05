import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpRequest } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { Token } from '@models/classes/tokens.model';
import { IApiTokens } from '@models/interfaces/api-tokens.interface';
import { APP_CONFIG, IAppConfig } from '@misc/constants/app-config.constant';
import { User } from '@models/classes/user/user.model';
import { UserRole } from '@models/enums/user-role.enum';
import { HttpService, IServicesConfig } from '@services/http/http.service';
import { StorageService } from '@services/storage/storage.service';
import { plainToClass } from 'class-transformer';
import { UserApiService } from '@services/api/user-api/user-api.service';
import { StorageKey } from '@models/enums/storage-key.enum';
import { ILoginParams } from '@models/interfaces/login-params.interface';
import { GrantType } from '@models/enums/grant-type.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  me$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private readonly _TOKENS$: BehaviorSubject<Token> = new BehaviorSubject<Token>(this._storage.get<Token>(StorageKey.tokens));
  private readonly _ROLE$: BehaviorSubject<UserRole> = new BehaviorSubject<UserRole>(this._storage.get<UserRole>(StorageKey.role));

  get isAuthenticated(): boolean {
    return Boolean(this.myRole && this.token?.access && this.token?.refresh);
  }

  get token(): Token {
    return this._TOKENS$.value;
  }

  get myRole(): UserRole {
    return this._ROLE$.value;
  }

  get me(): User {
    return this.me$.value;
  }

  constructor(
    @Inject(APP_CONFIG) private _config: IAppConfig,
    private _http: HttpService,
    private _storage: StorageService,
    private _userApi: UserApiService
  ) {}

  getTemporaryToken(services?: IServicesConfig): Observable<Token> {
    const { apiUrl, client_id: clientId, client_secret: clientSecret }: IAppConfig = this._config;
    const form: FormData = new FormData();

    form.append('grant_type', GrantType.clientCredentials);
    form.append('client_id', clientId);
    form.append('client_secret', clientSecret);

    return this._http.post(`${apiUrl}/oauth/token`, form, {}, services).pipe(map(this._onTokenResponse.bind(this)));
  }

  login(
    { username, password, grantType = GrantType.password, code }: ILoginParams,
    shouldRemember: boolean,
    services?: IServicesConfig
  ): Observable<User> {
    const { apiUrl, client_id: clientId, client_secret: clientSecret }: IAppConfig = this._config;
    this._storage.shouldUseLocalstorage = shouldRemember;
    const form: FormData = new FormData();

    form.append('grant_type', grantType ?? GrantType.password);
    form.append('client_id', clientId);
    form.append('client_secret', clientSecret);
    form.append('username', username);
    form.append('password', password);

    return this._http
      .post(`${apiUrl}/oauth/token`, form, {}, services)
      .pipe(map(this._onTokenResponse.bind(this)), switchMap(this.getMe.bind(this)));
  }

  refreshToken(): Observable<any> {
    const { apiUrl, client_id: clientId, client_secret: clientSecret }: IAppConfig = this._config;
    const form: FormData = new FormData();

    form.append('grant_type', GrantType.refreshToken);
    form.append('client_id', clientId);
    form.append('client_secret', clientSecret);
    form.append('refresh_token', this.token.refresh);

    return this._http
      .post(`${apiUrl}/oauth/token`, form, {}, {})
      .pipe(map(this._onTokenResponse.bind(this)), switchMap(this.getMe.bind(this)));
  }

  logout(): Observable<void> {
    return this._userApi.logout().pipe(tap((): void => this.clearTokens()));
  }

  clearTokens(): void {
    this._storage.clear();
    this._TOKENS$.next(null);
    this._ROLE$.next(null);
    this.me$.next(null);
  }

  addTokenToRequest(req: HttpRequest<any>): HttpRequest<any> {
    return this.token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${this.token.access}`
          }
        })
      : req;
  }

  setRole(role: UserRole): UserRole {
    this._ROLE$.next(role);
    this._storage.set(StorageKey.role, role);
    return role;
  }

  getMe(): Observable<User> {
    return this._userApi.getMe({ skipErrorNotification: true }).pipe(
      map((user: User): User => {
        this.me$.next(user);
        this.setRole(user.role);
        return user;
      })
    );
  }

  private _onTokenResponse(res: IApiTokens): Token {
    let tokens: Token;

    if (res.access_token) {
      tokens = plainToClass(Token, res);
      this._storage.set(StorageKey.tokens, tokens);
      this._TOKENS$.next(tokens);
    }

    return tokens;
  }
}
