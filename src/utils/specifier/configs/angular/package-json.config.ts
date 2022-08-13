import { ApplicationType, IContext } from '@src/main';
import getPort from 'get-port';

export async function getPackageJsonChanges({ title, applications, skipGit = false }: IContext) {
  const port: number = await getPort();

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

  applications.forEach((app: ApplicationType, index: number): void => {
    packageJson.scripts[`build:${app}`] = `ng build ${app}`;
    packageJson.scripts[`watch:${app}`] = `ng build ${app} --watch --configuration development`;
    packageJson.scripts[`start:${app}`] = `ng serve ${app} --port=${port + index}`;
    packageJson.scripts[`start:${app}:ssl`] = `ng serve ${app} --ssl --port=${port + index}`;
  });

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
