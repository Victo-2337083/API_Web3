"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const filesToFix = [
    'src/models/Utilisateur.ts',
    'src/models/Facture.ts',
    'src/repos/UtilisateursRepo.ts',
    'src/repos/FactureRepo.ts',
    'src/routes/FactureRoutes.ts',
    'src/routes/UtilisateursRoute.ts',
    'src/routes/JetonRoutes.ts',
    'src/services/FactureService.ts',
    'src/services/UtilisateursService.ts',
    'src/services/JetonService.ts',
    'src/services/authenticateToken.ts',
    'scripts/build.ts',
];
function fixFile(filePath) {
    try {
        let content = fs_1.default.readFileSync(filePath, 'utf8');
        content = content.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ');
        content = content.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match, p1) => {
            if (match.includes('from ') || match.includes('import ')) {
                return match;
            }
            return `'${p1}'`;
        });
        content = content.replace(/\\\@/g, '@');
        content = content.replace(/\t/g, '  ');
        fs_1.default.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);
    }
    catch (error) {
        console.error(` Error fixing ${filePath}:`, error);
    }
}
// Fonction principale
function main() {
    console.log(' Starting ESLint fixes...\n');
    filesToFix.forEach(file => {
        const fullPath = path_1.default.join(process.cwd(), file);
        if (fs_1.default.existsSync(fullPath)) {
            fixFile(fullPath);
        }
        else {
            console.warn(` File not found: ${file}`);
        }
    });
    console.log('\n Done! Now run: npm run lint -- --fix');
    console.log('This will apply ESLint auto-fixes for remaining issues.');
}
main();
