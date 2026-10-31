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
      name: "closedDays", title: "Closed days", type: "array", of: [{ type: "string" }],
      description: "The order form won’t let anyone collect a cake on these days.",
      options: {
        layout: "grid",
        list: [
          { title: "Monday", value: "1" }, { title: "Tuesday", value: "2" }, { title: "Wednesday", value: "3" },
          { title: "Thursday", value: "4" }, { title: "Friday", value: "5" }, { title: "Saturday", value: "6" },
          { title: "Sunday", value: "0" },
        ],
      },
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
