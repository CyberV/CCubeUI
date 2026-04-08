// Custom Node.js ESM loader that compiles .ts files through the bundled
// `typescript` package (found in node_modules) at import time. Unlike Node's
// `--experimental-strip-types`, this handles class-property decorators (which
// Angular @Injectable / @Component / etc. rely on), and it resolves the
// repo's `baseUrl: ./src/` alias so imports like `app/services/...` and
// `assets/...` resolve to the right files.

import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import ts from 'typescript';

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const srcRoot = path.join(repoRoot, 'src');

const compilerOptions = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
  experimentalDecorators: true,
  emitDecoratorMetadata: false,
  resolveJsonModule: true,
  jsx: ts.JsxEmit.Preserve,
  removeComments: false,
  sourceMap: false,
  inlineSourceMap: false,
  allowJs: true,
  strict: false
};

export async function resolve(specifier, context, nextResolve) {
  // Bare imports that start with "app/" or "assets/" are tsconfig baseUrl
  // aliases in this repo — rewrite them to absolute file URLs under src/.
  if (specifier.startsWith('app/') || specifier.startsWith('assets/')) {
    const absolute = path.join(srcRoot, specifier);
    const candidates = [
      absolute,
      `${absolute}.ts`,
      `${absolute}.tsx`,
      `${absolute}.json`,
      path.join(absolute, 'index.ts')
    ];
    for (const c of candidates) {
      if (await exists(c)) {
        return { url: pathToFileURL(c).href, shortCircuit: true };
      }
    }
  }

  // Relative TS sources without an extension
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.(ts|tsx|js|mjs|json)$/.test(specifier)) {
    if (context.parentURL) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      for (const suffix of ['.ts', '.tsx', '/index.ts', '.json']) {
        const candidate = path.join(parentDir, specifier + suffix);
        if (await exists(candidate)) {
          return { url: pathToFileURL(candidate).href, shortCircuit: true };
        }
      }
    }
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.ts') || url.endsWith('.tsx')) {
    const filePath = fileURLToPath(url);
    const source = await readFile(filePath, 'utf8');
    const out = ts.transpileModule(source, {
      compilerOptions,
      fileName: filePath,
      reportDiagnostics: false
    });
    return {
      format: 'module',
      source: out.outputText,
      shortCircuit: true
    };
  }

  if (url.endsWith('.json')) {
    const filePath = fileURLToPath(url);
    const source = await readFile(filePath, 'utf8');
    return {
      format: 'module',
      source: `export default ${source};`,
      shortCircuit: true
    };
  }

  return nextLoad(url, context);
}
