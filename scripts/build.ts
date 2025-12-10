import { exec } from 'child_process';
import { promisify } from 'util';
import logger from 'jet-logger';
import fs from 'fs-extra';
import path from 'path';

const execAsync = promisify(exec);

(async () => {
  try {

    // Build with tsc
    logger.info('Building TypeScript...');
    await execAsync('tsc --build tsconfig.prod.json');

    logger.info('Resolving path aliases...');
    await execAsync('tsc-alias -p tsconfig.prod.json');

    logger.info('Copying assets...');
    await copyAssets();

    logger.info('Build completed successfully! ✨');
  } catch (err) {
    logger.err(err);
    process.exit(1);
  }
})();

/**
 * Copy non-TypeScript assets to dist folder
 */
async function copyAssets(): Promise<void> {
  const assets = [
    { src: 'src/swagger.yaml', dest: 'dist/swagger.yaml' },

  ];

  for (const asset of assets) {
    const srcPath = path.resolve(asset.src);
    const destPath = path.resolve(asset.dest);

    if (await fs.pathExists(srcPath)) {
      await fs.copy(srcPath, destPath);
      logger.info(`✓ Copied ${asset.src} → ${asset.dest}`);
    } else {
      logger.warn(` Asset not found: ${asset.src}`);
    }
  }

}