import { IApplicationInfo, IContext } from '@src/main';

export const scriptsToDelete: string[] = ['scripts.build', 'scripts.start', 'scripts.watch', 'scripts.test'];

export function getPackageJsonChanges({ title, applicationsInfo, skipGit = false }: IContext) {
  const packageJson = {
    scripts: {
      'config:to-base64': 'node ./bin/to-base64.js',
      'config:from-base64': 'node ./bin/from-base64.js',
      lint: 'ng lint --fix',
      'lint:scss': 'stylelint "./src/**/*.scss" --fix',
      'lint:all': 'npm run lint && npm run lint:scss',
      prettier: 'prettier --write "src/**/*.*(ts|js|json|html)"',
      'pretty-quick': 'pretty-quick --staged --pattern "src/**/*.*(ts|js|json|html)"',
      'deploy:dev': 'run-s build update-env:dev',
      'update-env:dev': `bash bin/update-env/ssh-deploy.sh .env.dev ${title}/`,
      'hook:pre-commit': 'npm run pretty-quick',
      prepare: 'npm run husky install && npm run husky set .husky/pre-commit "npm run hook:pre-commit"',
      husky: 'node node_modules/husky/lib/bin.js'
    },
    husky: {
      hooks: {
        'pre-commit': 'npm run pretty-quick && npm run lint:all'
      }
    }
  };

  applicationsInfo.forEach(({ name, port }: IApplicationInfo): void => {
    packageJson.scripts[`test:${name}`] = `ng test ${name}`;
    packageJson.scripts[`build:${name}`] = `ng build ${name}`;
    packageJson.scripts[`watch:${name}`] = `ng build ${name} --watch --configuration development`;
    packageJson.scripts[`start:${name}`] = `ng serve ${name} --port=${port}`;
    packageJson.scripts[`start:${name}:ssl`] = `ng serve ${name} --ssl --port=${port}`;
  });

  if (applicationsInfo.length > 1) {
    packageJson.scripts[`build:all`] = `run-p ${applicationsInfo
      .map(({ name }: IApplicationInfo) => `build:${name}`)
      .join(' ')}`;
  }

  packageJson.scripts[`build`] = 'run-p build:*';

  delete packageJson.scripts['build'];
  delete packageJson.scripts['start'];
  delete packageJson.scripts['watch'];

  if (skipGit) {
    delete packageJson.husky;
    delete packageJson.scripts.prepare;
    delete packageJson.scripts['pretty-quick'];
    delete packageJson.scripts['hook:pre-commit'];
  }

  return packageJson;
}
