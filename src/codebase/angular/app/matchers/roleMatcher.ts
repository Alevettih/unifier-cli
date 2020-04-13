import { Route, UrlMatchResult, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { STORAGE_KEYS } from '@misc/constants';

export function roleMatcher(segments: UrlSegment[], group: UrlSegmentGroup, { data, path }: Route): UrlMatchResult {
  const storedRole: string = sessionStorage.getItem(STORAGE_KEYS.ROLE) || localStorage.getItem(STORAGE_KEYS.ROLE);
  if (data.roles.includes(storedRole) && !path) {
    return { consumed: [] };
  }

  if (storedRole) {
    console.error(
      `Stored role hasn't match with any role in array. Stored role is "${storedRole}", but role(s) to pass is "${data.roles}"`
    );
  }

  return null;
}
