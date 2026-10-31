import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./env";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: "lag-paa-lag",
  deployment: { appId: "ahk7voplgnlfsg1sjkwvjky5" },
});
