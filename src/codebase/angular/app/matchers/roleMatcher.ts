import { Route, UrlMatchResult, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { STORAGE_KEYS } from '@misc/constants';

export function roleMatcher(segments: UrlSegment[], group: UrlSegmentGroup, { data, path }: Route): UrlMatchResult {
  const storedRole = sessionStorage.getItem(STORAGE_KEYS.ROLE) || localStorage.getItem(STORAGE_KEYS.ROLE);
  if (data.roles.includes(storedRole) && !path) {
    console.log(true);
    return { consumed: [] };
  }

  return null;
}
