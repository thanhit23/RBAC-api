import * as fs from 'fs';
import * as path from 'path';
import { Router } from 'express';
import { toKebabCase } from '@/utils/helpper';

const router = Router();

const routeFiles = fs.readdirSync(__dirname).filter(file => file !== 'index.ts');

for (const file of routeFiles) {
  import(path.join(__dirname, file)).then((module) => {
    if (module.default) {
      router.use(`/${toKebabCase(file.replace('.ts', ''))}`, module.default);
    }
  });
}

export default router;
