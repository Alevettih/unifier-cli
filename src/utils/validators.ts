export function title(input?: string): boolean | string {
  if (input && /^([A-Za-z\-\_\d])+$/.test(input)) {
    return true;
  } else {
    return 'Project name may only include letters, numbers, underscores and hashes.';
  }
}
