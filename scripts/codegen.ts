import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the equivalent of __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')
const apiPkgDir = path.join(rootDir, 'packages/api')

// Modify this is if you want to try bigger routers
// Each router will have 5 procedures + a small sub-router with 2 procedures
const NUM_ROUTERS = 1

const PACKAGES_DIR = path.join(apiPkgDir, 'src/routers')
if (!fs.existsSync(PACKAGES_DIR)) {
  fs.mkdirSync(PACKAGES_DIR, { recursive: true })
}

// read template files
const codegenBase = fs.readFileSync(
  path.join(__dirname, '/codegen-base.ts'),
  'utf-8',
)
const packageJson = fs.readFileSync(
  path.join(__dirname, '/codegen-package.json'),
  'utf-8',
)

const routerPackages: Set<string> = new Set(
  Array.from(
    { length: NUM_ROUTERS },
    (_, i) => `router${String(i + 1).padStart(3, '0')}`,
  ),
)
for (const routerName of routerPackages) {
  const routerFile = path.join(PACKAGES_DIR, `${routerName}.ts`)

  // Create router file directly without package structure
  const routerCode = codegenBase.replace('__ROUTER__NAME__', routerName)
  fs.writeFileSync(routerFile, routerCode)
}

// Remove all files in routers that aren't in routerPackages
const generatedRouters = fs.readdirSync(PACKAGES_DIR)
for (const router of generatedRouters) {
  if (
    !router.startsWith('.') &&
    !routerPackages.has(router.replace('.ts', ''))
  ) {
    fs.unlinkSync(path.join(PACKAGES_DIR, router))
  }
}

// Update root index file to import from local router files
const rootIndexFile = `
import { router } from '@org/trpc';

${[...routerPackages]
  .map((name) => `import { ${name} } from './routers/${name}';`)
  .join('\n')}

export const appRouter = router({
  ${[...routerPackages].join(',\n  ')}
});

export type AppRouter = typeof appRouter;
`.trim()

fs.writeFileSync(path.join(apiPkgDir, 'src/index.ts'), rootIndexFile)

// Stalls the process smh
// try {
//   execSync(`pnpm install --ignore-scripts`, {
//     stdio: 'inherit',
//   })
// } catch {
//   // continue
// }
// console.log('Done!')
