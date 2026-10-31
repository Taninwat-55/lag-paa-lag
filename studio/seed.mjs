// Writes seed.ndjson from the site's local stand-in data, for `sanity dataset import`.
import { writeFileSync } from "node:fs";
const L = [
  ["sponge", "Vanilla sponge", "lagkagebund", "baked the morning you collect", 180],
  ["jam", "Raspberry jam", "hindbærsyltetøj", "our own, sharp, not too sweet", 35],
  ["cream", "Vanilla cream", "vaniljecreme", "custard folded into whipped cream", 60],
  ["sponge2", "Second sponge", "lagkagebund", "pressed down so nothing slides", 80],
  ["marzipan", "Marzipan drape", "marcipanlåg", "rolled and laid on by hand", 95],
  ["berries", "Fresh raspberries", "friske hindbær", "and crushed pistachio", 70],
  ["name", "Name piped on", "navn i glasur", "any name, two paper flags free", 30],
];
const docs = [
  {
    _id: "siteSettings", _type: "siteSettings",
    heroLine: "We only bake celebration cakes: birthdays, christenings, the “we got the flat” cake. Scroll down to watch one being built, layer by layer, with the price adding up as it goes.",
    closedDays: ["0", "1"],
    promo: { on: false, text: "Closed 24 to 26 December. Order Christmas cakes by the 20th." },
    hours: [
      { _key: "h1", days: "Tue to Fri", time: "8 to 17" },
      { _key: "h2", days: "Sat", time: "8 to 15" },
      { _key: "h3", days: "Sun and Mon", time: "Closed" },
    ],
  },
  {
    _id: "buildCake", _type: "buildCake", cake: { _type: "reference", _ref: "cake-1" }, piped: "Tillykke Sofie", serves: 12, noticeDays: 3,
    ...Object.fromEntries(L.map(([id, name, dansk, note, price]) => [id, { name, dansk, note, price }])),
  },
  ...[
    ["Sofie’s layer cake", "Vanilla sponge, raspberry jam, cream, marzipan, fresh raspberries", [[8, 395], [12, 550], [20, 860]]],
    ["Chocolate layer cake", "Dark sponge, salted caramel, chocolate ganache", [[8, 425], [12, 595], [20, 920]]],
    ["Kagemand", "The Danish birthday cake-man in pastry, with sweets and flags", [[12, 495], [20, 780]]],
  ].map(([name, line, sizes], i) => ({
    _id: `cake-${i + 1}`, _type: "cake", name, line, available: true, order: i + 1,
    sizes: sizes.map(([serves, price], j) => ({ _key: `s${j}`, serves, price })),
  })),
];
writeFileSync(new URL("./seed.ndjson", import.meta.url), docs.map(d => JSON.stringify(d)).join("\n") + "\n");
console.log(`wrote ${docs.length} documents`);
