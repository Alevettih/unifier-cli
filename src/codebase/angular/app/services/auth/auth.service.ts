import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpRequest } from '@angular/common/http';
import { first, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Tokens } from '@models/tokens.model';
import { APP_CONFIG, STORAGE_KEYS, AppConfig } from '@misc/constants';
import { Role, User } from '@models/user.model';
import { HttpService, ServicesConfig } from '@services/http/http.service';
import { StorageService } from '@services/storage/storage.service';
import { plainToClass } from 'class-transformer';
import { UserApiService } from '@services/api/user-api/user-api.service';

interface LoginParams {
  username?: string;
  password?: string;
  code?: string;
  grant_type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokens$: BehaviorSubject<Tokens> = new BehaviorSubject<Tokens>(
    JSON.parse(this.storage.get(STORAGE_KEYS.TOKENS)) as Tokens
  );
  private role$: BehaviorSubject<Role> = new BehaviorSubject<Role>(this.storage.get(STORAGE_KEYS.ROLE) as Role);
  me$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(
    @Inject(APP_CONFIG) private config: AppConfig,
    private http: HttpService,
    private router: Router,
    private storage: StorageService,
    private userApi: UserApiService
  ) {}

  sendAuthCode({ username, password }: LoginParams): Observable<object> {
    return this.getTemporaryToken().pipe(
      first(),
      switchMap(() => this.http.post(`${this.config.apiUrl}/api/auth/code`, { username, password }))
    );
  }

  getTemporaryToken(services?: ServicesConfig): Observable<Tokens> {
    const { apiUrl, client_id, client_secret } = this.config;
    return this.http
      .post(`${apiUrl}/oauth/v2/token`, { client_id, client_secret, grant_type: 'client_credentials' }, {}, services)
      .pipe(map(this.onTokenResponse.bind(this)));
  }

  login(
    { username, password, grant_type = 'password', code }: LoginParams,
    shouldRemember: boolean,
    services?: ServicesConfig
  ): Observable<User> {
    const { apiUrl, client_id, client_secret } = this.config;
    this.storage.shouldUseLocalstorage = shouldRemember;
    return this.http
      .post(
        `${apiUrl}/oauth/v2/token`,
        { username, password, client_id, client_secret, grant_type, code },
        {},
        services
      )
      .pipe(map(this.onTokenResponse.bind(this)), switchMap(this.getMe.bind(this)));
  }

  refreshToken(): Observable<any> {
    const { apiUrl, client_id, client_secret } = this.config;

    return this.http
      .post(`${apiUrl}/oauth/v2/token`, {
        client_id,
        client_secret,
        grant_type: 'refresh_token',
        refresh_token: this.token.refresh
      })
      .pipe(map(this.onTokenResponse.bind(this)), switchMap(this.getMe.bind(this)));
  }

  logout(): void {
    this.clearTokens();
    this.router.navigate(['', 'auth', 'log-in']);
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
      map(([tokens, role]: [Tokens, Role]): boolean => Boolean(role && tokens?.access && tokens?.refresh))
    );
  }

  get token(): Tokens {
    return this.tokens$.value;
  }

  get myRole(): Role {
    return this.role$.value;
  }

  get me(): User {
    return this.me$.value;
  }

  getMe(services?: ServicesConfig): Observable<User> {
    return this.userApi.getMe(services).pipe(
      map(
        (user: User): User => {
          this.me$.next(user);
          this.role$.next(user.role);
          this.storage.current.setItem(STORAGE_KEYS.ROLE, user.role);
          return user;
        }
      )
    );
  }

  private onTokenResponse(res): Tokens {
    let tokens: Tokens;

    if (res.access_token) {
      tokens = plainToClass(Tokens, res);
      this.storage.current.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
      this.tokens$.next(tokens);
    }

    return tokens;
  }
}
