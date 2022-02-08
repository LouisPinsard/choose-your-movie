/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createRequestHandler } from "@remix-run/architect";
import type { ServerBuild } from "remix";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const build = require("./build") as ServerBuild;

exports.handler = createRequestHandler({
  build,
  getLoadContext(event) {
    // use lambda event to generate a context for loaders
    return {};
  },
});
