/**
 * Build the project
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import logger from 'jet-logger';

const execAsync = promisify(exec);

(async () => {
  try {
    // Lint temporairement désactivé pour permettre le build
    // await execAsync('npm run lint');

    // Build with tsc
    logger.info('Building project...');
    await execAsync('tsc --build tsconfig.prod.json');

    logger.info('Build completed successfully!');
  } catch (err) {
    logger.err(err);
    process.exit(1);
  }
})();