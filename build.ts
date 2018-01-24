
import { copySync } from 'fs-extra';
import { build } from 'ng-packagr';
import { join } from 'path';
import * as rimraf from 'rimraf';


async function main() {
  // cleanup dist
  rimraf.sync(join(process.cwd(), '/dist'));

  await build({
    project: join(process.cwd(), '/src/lib/package.json')
  });
  copySync('README.md', join(process.cwd(), 'dist/README.md'));
  copySync('LICENSE', join(process.cwd(), 'dist/LICENSE'));
}

main()
  .then(() => console.log('success'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
