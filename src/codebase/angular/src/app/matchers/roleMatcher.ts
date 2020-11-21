import { Route, UrlMatchResult, UrlSegment, UrlSegmentGroup } from '@angular/router';
import { StorageKey } from '@models/enums/storage-key.enum';

export function roleMatcher(segments: UrlSegment[], group: UrlSegmentGroup, { data, path }: Route): UrlMatchResult {
  const storedRole: string = sessionStorage.getItem(StorageKey.role) || localStorage.getItem(StorageKey.role);
  if (data.roles.includes(storedRole) && !path) {
    return { consumed: [] };
  }

  if (storedRole) {
    console.warn(`Stored role hasn't match with any role in array. Stored role is "${storedRole}", but role(s) to pass is "${data.roles}"`);
  }

  return null;
}
