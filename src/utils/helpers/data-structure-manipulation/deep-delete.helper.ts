export function deepDelete<T>(target: string, context: T) {
  const targets = target.split('.');

  if (targets.length > 1) {
    deepDelete(targets.slice(1).join('.'), context[targets[0]]);
  } else {
    delete context[target];
  }
}
