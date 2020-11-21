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
  private tokens$: BehaviorSubject<Token> = new BehaviorSubject<Token>(JSON.parse(this.storage.get(StorageKey.tokens)) as Token);
  private role$: BehaviorSubject<UserRole> = new BehaviorSubject<UserRole>(this.storage.get(StorageKey.role) as UserRole);
  me$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(
    @Inject(APP_CONFIG) private config: IAppConfig,
    private http: HttpService,
    private router: Router,
    private storage: StorageService,
    private userApi: UserApiService
  ) {}

  sendAuthCode({ username, password }: ILoginParams): Observable<object> {
    return this.getTemporaryToken().pipe(
      first(),
      switchMap((): Observable<any> => this.http.post(`${this.config.apiUrl}/api/auth/code`, { username, password }))
    );
  }

  getTemporaryToken(services?: IServicesConfig): Observable<Token> {
    const { apiUrl, client_id, client_secret }: IAppConfig = this.config;
    return this.http
      .post(`${apiUrl}/oauth/v2/token`, { client_id, client_secret, grant_type: GrantType.clientCredentials }, {}, services)
      .pipe(map(this.onTokenResponse.bind(this)));
  }

  login(
    { username, password, grant_type = GrantType.password, code }: ILoginParams,
    shouldRemember: boolean,
    services?: IServicesConfig
  ): Observable<User> {
    const { apiUrl, client_id, client_secret }: IAppConfig = this.config;
    this.storage.shouldUseLocalstorage = shouldRemember;
    return this.http
      .post(`${apiUrl}/oauth/v2/token`, { username, password, client_id, client_secret, grant_type, code }, {}, services)
      .pipe(map(this.onTokenResponse.bind(this)), switchMap(this.getMe.bind(this)));
  }

  refreshToken(): Observable<any> {
    const { apiUrl, client_id, client_secret }: IAppConfig = this.config;

    return this.http
      .post(`${apiUrl}/oauth/v2/token`, {
        client_id,
        client_secret,
        grant_type: GrantType.refreshToken,
        refresh_token: this.token.refresh
      })
      .pipe(map(this.onTokenResponse.bind(this)), switchMap(this.getMe.bind(this)));
  }

  logout(): void {
    this.userApi.logout({ skipLoaderStart: true }).subscribe();
    this.clearTokens();
    this.router.navigate(['']);
  }

  clearTokens(): void {
    this.storage.clear();
    this.tokens$.next(null);
    this.role$.next(null);
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
    return this.tokens$.pipe(
      withLatestFrom(this.role$),
      map(([tokens, role]: [Token, UserRole]): boolean => Boolean(role && tokens?.access && tokens?.refresh))
    );
  }

  get token(): Token {
    return this.tokens$.value;
  }

  get myRole(): UserRole {
    return this.role$.value;
  }

  get me(): User {
    return this.me$.value;
  }

  setRole(role: UserRole): UserRole {
    this.role$.next(role);
    this.storage.current.setItem(StorageKey.role, role);
    return role;
  }

  getMe(services?: IServicesConfig): Observable<User> {
    return this.userApi.getMe({ skipErrorNotification: true, ...services }).pipe(
      map(
        (user: User): User => {
          this.me$.next(user);
          this.setRole(user.role);
          return user;
        }
      )
    );
  }

  private onTokenResponse(res: IApiTokens): Token {
    let tokens: Token;

    if (res.access_token) {
      tokens = plainToClass(Token, res);
      this.storage.current.setItem(StorageKey.tokens, JSON.stringify(tokens));
      this.tokens$.next(tokens);
    }

    return tokens;
  }
}
