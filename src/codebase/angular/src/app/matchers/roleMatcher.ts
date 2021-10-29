import { Route, UrlMatcher, UrlMatchResult, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { UserRole } from '@models/enums/user-role.enum';
import { AuthService } from '@services/auth/auth.service';

export function roleMatcher(authService: AuthService): UrlMatcher {
  return (segments: UrlSegment[], group: UrlSegmentGroup, { data, path }: Route): UrlMatchResult => {
    const storedRole: UserRole = authService?.myRole;

    if (data.roles.find((role: UserRole): boolean => storedRole === role) && !path) {
      return { consumed: [] };
    }

    if (storedRole) {
      console.warn(
        `Stored role hasn't match with any role in array. Stored role is "${storedRole}", but role(s) to pass is "${data.roles}"`
      );
    }

    return null;
  };
}
