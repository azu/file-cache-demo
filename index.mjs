import { createCache } from "@file-cache/core";
import { createNpmPackageKey } from "@file-cache/npm";
import path from "node:path";
import url from "node:url";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prettierConfig = {/* ... */};
const cache = await createCache({
  // Use hash value of the content for detecting changes
  mode: "content", // or "metadata"
  // create key for cache
  keys: [
    // use dependency(version) as cache key
    () => createNpmPackageKey(["@file-cache/core", "@file-cache/npm"]),
    // use custom key
    () => {
      return JSON.stringify(prettierConfig);
    },
  ],
});

const targetFiles = [
  path.join(__dirname, "package.json"),
  path.join(__dirname, "package-lock.json"),
];
const doHeavyTask = (filePath) => {
  console.log("PRINT", filePath);
};
for (const targetFile of targetFiles) {
  const result = await cache.getAndUpdateCache(targetFile);
  console.log(result);
  if (!result.changed) {
    continue; // no need to update
  }
  doHeavyTask(targetFile);
}
// write cache state to file for persistence
await cache.reconcile();
