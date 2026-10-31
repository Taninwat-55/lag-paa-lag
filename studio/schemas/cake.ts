import { defineField, defineType } from "sanity";

export const cake = defineType({
  name: "cake",
  title: "Cakes",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: r => r.required() }),
    defineField({ name: "line", title: "One line about it", type: "string", validation: r => r.max(90) }),
    defineField({
      name: "sizes", title: "Sizes and prices", type: "array",
      of: [{
        type: "object", name: "size",
        fields: [
          defineField({ name: "serves", title: "Serves", type: "number", validation: r => r.required().min(1).integer() }),
          defineField({ name: "price", title: "Price (kr.)", type: "number", validation: r => r.required().min(0).integer() }),
        ],
        preview: { select: { s: "serves", p: "price" }, prepare: ({ s, p }) => ({ title: `Serves ${s}`, subtitle: `${p} kr.` }) },
      }],
      validation: r => r.min(1),
    }),
    defineField({ name: "available", title: "On sale", type: "boolean", initialValue: true, description: "Switch off to hide it from the site without deleting it." }),
    defineField({ name: "order", title: "Position on the page", type: "number", description: "Lower numbers come first." }),
  ],
  orderings: [{ title: "Position on the page", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "line" } },
});
