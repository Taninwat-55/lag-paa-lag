import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Shop settings",
  type: "document",
  fields: [
    defineField({
      name: "heroLine", title: "Line under the headline", type: "text", rows: 3,
      description: "Shown on the front page, under “See the cake before you order it.”",
      validation: r => r.required().max(220),
    }),
    defineField({
      name: "promo", title: "Promo banner", type: "object",
      description: "A short notice at the top of the site, like a holiday closure or a seasonal cake.",
      fields: [
        defineField({ name: "on", title: "Show the banner", type: "boolean", initialValue: false }),
        defineField({ name: "text", title: "Banner text", type: "string", validation: r => r.max(90) }),
      ],
    }),
    defineField({
      name: "hours", title: "Opening hours", type: "array",
      of: [{
        type: "object", name: "row",
        fields: [
          defineField({ name: "days", title: "Days", type: "string", description: "For example: Tue to Fri", validation: r => r.required() }),
          defineField({ name: "time", title: "Hours", type: "string", description: "For example: 8 to 17, or Closed", validation: r => r.required() }),
        ],
        preview: { select: { title: "days", subtitle: "time" } },
      }],
    }),
  ],
  preview: { prepare: () => ({ title: "Shop settings" }) },
});
