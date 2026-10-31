// Stand-in for Sanity (session 3 swaps this file for a build-time fetch).
// Same shape the `cake` document will have, so the components don't change.

export type Layer = {
  id: "sponge" | "jam" | "cream" | "sponge2" | "marzipan" | "berries" | "name";
  name: string;
  dansk: string;
  note: string;
  price: number;
};

export const cake = {
  title: "Sofie's birthday cake",
  piped: "Tillykke Sofie",
  serves: 12,
  noticeDays: 3,
  layers: [
    { id: "sponge", name: "Vanilla sponge", dansk: "lagkagebund", note: "baked the morning you collect", price: 180 },
    { id: "jam", name: "Raspberry jam", dansk: "hindbærsyltetøj", note: "our own, sharp, not too sweet", price: 35 },
    { id: "cream", name: "Vanilla cream", dansk: "vaniljecreme", note: "custard folded into whipped cream", price: 60 },
    { id: "sponge2", name: "Second sponge", dansk: "lagkagebund", note: "pressed down so nothing slides", price: 80 },
    { id: "marzipan", name: "Marzipan drape", dansk: "marcipanlåg", note: "rolled and laid on by hand", price: 95 },
    { id: "berries", name: "Fresh raspberries", dansk: "friske hindbær", note: "and crushed pistachio", price: 70 },
    { id: "name", name: "Name piped on", dansk: "navn i glasur", note: "any name, two paper flags free", price: 30 },
  ] satisfies Layer[],
};

export const total = cake.layers.reduce((sum, l) => sum + l.price, 0);

/** Danish-style kroner: "1.250 kr." */
export const kr = (n: number) => `${n.toLocaleString("da-DK")} kr.`;
