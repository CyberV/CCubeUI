
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
register("file:///mnt/c/da/06-04-2026/2/b/ui/ui/tests/baseline/ts-loader.mjs", pathToFileURL('./'));
// The harness is not a loader — it installs globals, so import it eagerly.
await import("file:///mnt/c/da/06-04-2026/2/b/ui/ui/tests/baseline/harness.mjs");
