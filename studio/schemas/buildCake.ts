import { defineField, defineType } from "sanity";

// The seven layers are fixed because each one has its own drawing on the site.
// The owner changes the words and the prices, never the number of layers.
export const LAYERS = [
  ["sponge", "Bottom sponge"],
  ["jam", "Jam"],
  ["cream", "Cream"],
  ["sponge2", "Top sponge"],
  ["marzipan", "Marzipan"],
  ["berries", "Berries"],
  ["name", "Piped name"],
] as const;

const layerField = (name: string, title: string) =>
  defineField({
    name, title, type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({ name: "name", title: "Name (English)", type: "string", validation: r => r.required().max(28) }),
      defineField({ name: "dansk", title: "Name (Danish)", type: "string", validation: r => r.required().max(28) }),
      defineField({ name: "note", title: "Short note", type: "string", validation: r => r.max(48) }),
      defineField({ name: "price", title: "Price (kr.)", type: "number", validation: r => r.required().min(0).integer() }),
    ],
  });

export const buildCake = defineType({
  name: "buildCake",
  title: "Byg kagen",
  type: "document",
  fields: [
    defineField({ name: "piped", title: "Name piped on the cake", type: "string", description: "Keep it short so it fits the drawing.", validation: r => r.required().max(16) }),
    defineField({ name: "serves", title: "Serves", type: "number", validation: r => r.required().min(1).integer() }),
    defineField({ name: "noticeDays", title: "Days of notice", type: "number", validation: r => r.required().min(1).integer() }),
    ...LAYERS.map(([n, t]) => layerField(n, t)),
  ],
  preview: { prepare: () => ({ title: "Byg kagen" }) },
});
