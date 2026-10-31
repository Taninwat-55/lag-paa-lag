import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes, SINGLETONS } from "./schemas";

import { projectId, dataset } from "./env";

export default defineConfig({
  name: "lag-paa-lag",
  title: "Lag på Lag",
  projectId,
  dataset,
  plugins: [
    structureTool({
      // the two settings documents open straight away; there is only ever one of each
      structure: S =>
        S.list().title("Lag på Lag").items([
          S.listItem().title("Shop settings").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
          S.listItem().title("Byg kagen").id("buildCake").child(S.document().schemaType("buildCake").documentId("buildCake")),
          S.divider(),
          S.documentTypeListItem("cake").title("Cakes"),
        ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    // no "new Shop settings" button: singletons can't be created twice
    templates: t => t.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      SINGLETONS.includes(schemaType) ? prev.filter(({ action }) => !["unpublish", "delete", "duplicate"].includes(action ?? "")) : prev,
  },
});
