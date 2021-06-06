import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpRequest } from '@angular/common/http';
import { first, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Token } from '@models/classes/tokens.model';
import { IApiTokens } from '@models/interfaces/api-tokens.interface';
import { APP_CONFIG, IAppConfig } from '@misc/constants/app-config.constant';
import { User } from '@models/classes/user.model';
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
  private _tokens$: BehaviorSubject<Token> = new BehaviorSubject<Token>(JSON.parse(this._storage.get(StorageKey.tokens)) as Token);
  private _role$: BehaviorSubject<UserRole> = new BehaviorSubject<UserRole>(this._storage.get(StorageKey.role) as UserRole);
  me$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(
    @Inject(APP_CONFIG) private _config: IAppConfig,
    private _http: HttpService,
    private _router: Router,
    private _storage: StorageService,
    private _userApi: UserApiService
  ) {}

  sendAuthCode({ username, password }: ILoginParams): Observable<object> {
    return this.getTemporaryToken().pipe(
      first(),
      switchMap((): Observable<any> => this._http.post(`${this._config.apiUrl}/api/auth/code`, { username, password }))
    );
  }

  getTemporaryToken(services?: IServicesConfig): Observable<Token> {
    const { apiUrl, client_id: clientId, client_secret: clientSecret }: IAppConfig = this._config;
    return this._http
      .post(
        `${apiUrl}/oauth/v2/token`,
        { client_id: clientId, client_secret: clientSecret, grant_type: GrantType.clientCredentials },
        {},
        services
      )
      .pipe(map(this._onTokenResponse.bind(this)));
  }

  login(
    { username, password, grant_type = GrantType.password, code }: ILoginParams,
    shouldRemember: boolean,
    services?: IServicesConfig
  ): Observable<User> {
    const { apiUrl, client_id: clientId, client_secret: clientSecret }: IAppConfig = this._config;
    this._storage.shouldUseLocalstorage = shouldRemember;
    return this._http
      .post(
        `${apiUrl}/oauth/v2/token`,
        { username, password, client_id: clientId, client_secret: clientSecret, grant_type, code },
        {},
        services
      )
      .pipe(map(this._onTokenResponse.bind(this)), switchMap(this.getMe.bind(this)));
  }

  refreshToken(): Observable<any> {
    const { apiUrl, client_id: clientId, client_secret: clientSecret }: IAppConfig = this._config;

    return this._http
      .post(`${apiUrl}/oauth/v2/token`, {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: GrantType.refreshToken,
        refresh_token: this.token.refresh
      })
      .pipe(map(this._onTokenResponse.bind(this)), switchMap(this.getMe.bind(this)));
  }

  logout(): void {
    this._userApi.logout({ skipLoaderStart: true }).subscribe();
    this.clearTokens();
    this._router.navigate(['']);
  }

  clearTokens(): void {
    this._storage.clear();
    this._tokens$.next(null);
    this._role$.next(null);
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

  get isAuthenticated(): boolean {
    return Boolean(this.myRole && this.token?.access && this.token?.refresh);
  }

  get isAuthenticated$(): Observable<boolean> {
    return this._tokens$.pipe(
      withLatestFrom(this._role$),
      map(([tokens, role]: [Token, UserRole]): boolean => Boolean(role && tokens?.access && tokens?.refresh))
    );
  }

  get token(): Token {
    return this._tokens$.value;
  }

  get myRole(): UserRole {
    return this._role$.value;
  }

  get me(): User {
    return this.me$.value;
  }

  setRole(role: UserRole): UserRole {
    this._role$.next(role);
    this._storage.current.setItem(StorageKey.role, role);
    return role;
  }

  getMe(services?: IServicesConfig): Observable<User> {
    return this._userApi.getMe({ skipErrorNotification: true, ...services }).pipe(
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
      this._storage.current.setItem(StorageKey.tokens, JSON.stringify(tokens));
      this._tokens$.next(tokens);
    }

    return tokens;
  }
}
