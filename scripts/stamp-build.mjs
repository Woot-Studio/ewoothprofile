import { writeFileSync } from "node:fs";

const stamp = [
  process.env.WORKERS_CI_COMMIT_SHA,
  process.env.GITHUB_SHA,
  Date.now().toString(),
]
  .filter(Boolean)
  .join("-");

writeFileSync("dist/BUILD_ID", `${stamp}\n`);
