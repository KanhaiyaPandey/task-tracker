const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// PNPM stores packages inside `node_modules/.pnpm/...` and symlinks them into
// `node_modules/<pkg>`. Metro uses the real path by default, which breaks
// relative imports inside some packages (e.g. `expo/AppEntry.js` -> `../../App`).
// Enabling symlink support makes Metro resolve as if the symlink path was used.
config.resolver.unstable_enableSymlinks = true;

// Monorepo niceties (keeps resolution stable across workspace + root deps).
config.watchFolders = [path.resolve(__dirname, "../..")];
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(__dirname, "../../node_modules"),
];

module.exports = config;
