import { ActivatedRouteSnapshot } from '@angular/router';

export interface IBreadcrumbDataWithId {
  bcData: ActivatedRouteSnapshot[];
  id: string;
}
