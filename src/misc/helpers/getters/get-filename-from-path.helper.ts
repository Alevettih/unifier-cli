export function getFilenameFromPath(path: string): string {
  const isWindows: boolean = process.platform === 'win32';
  const pathArray: string[] = path.split(isWindows ? '\\' : '/');
  const [file]: string[] = pathArray.reverse();
  return file;
}
