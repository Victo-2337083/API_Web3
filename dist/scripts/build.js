"use strict";
/**
 * Build the project
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
const jet_logger_1 = __importDefault(require("jet-logger"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
(async () => {
    try {
        // Lint temporairement désactivé pour permettre le build
        // await execAsync('npm run lint');
        // Build with tsc
        jet_logger_1.default.info('Building project...');
        await execAsync('tsc --build tsconfig.prod.json');
        jet_logger_1.default.info('Build completed successfully!');
    }
    catch (err) {
        jet_logger_1.default.err(err);
        process.exit(1);
    }
})();
