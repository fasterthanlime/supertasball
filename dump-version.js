const { spawnSync } = require("child_process");

const code = `export default {
  commit: ${JSON.stringify(
    String(spawnSync("git", ["rev-parse", "HEAD"]).stdout).trim(),
  )},
  deployedAt: new Date(${JSON.stringify(new Date().toISOString())}),
}`;
console.log(code);
