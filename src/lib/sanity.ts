// Build-time content from Sanity over plain HTTP: no client library, nothing
// shipped to the browser. Publishing in the Studio triggers a Netlify rebuild.
import { projectId, dataset } from "../../studio/env";
import { cake as local, type Layer } from "../data/cake";

const API = "v2025-02-19";
const LAYER_IDS: Layer["id"][] = ["sponge", "jam", "cream", "sponge2", "marzipan", "berries", "name"];

export type Settings = {
  heroLine: string;
  promo: { on: boolean; text?: string } | null;
  hours: { days: string; time: string }[];
};
export type BuildCake = { piped: string; serves: number; noticeDays: number; layers: Layer[] };
export type Cake = { name: string; line?: string; sizes: { serves: number; price: number }[] };

const connected = projectId !== "PENDING";

async function query<T>(groq: string): Promise<T> {
  // the live API, not the CDN: a rebuild right after Publish must see the new version
  const url = `https://${projectId}.api.sanity.io/${API}/data/query/${dataset}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url);
  // fail the build rather than ship old prices quietly
  if (!res.ok) throw new Error(`Sanity ${res.status} for ${groq}`);
  return (await res.json()).result as T;
}

export async function getSettings(): Promise<Settings> {
  if (!connected) return { heroLine: LOCAL_HERO, promo: null, hours: [] };
  const s = await query<Settings | null>(`*[_id == "siteSettings"][0]{heroLine, promo, hours[]{days, time}}`);
  if (!s?.heroLine) throw new Error("Sanity: Shop settings is empty or unpublished");
  return { ...s, hours: s.hours ?? [] };
}

export async function getBuildCake(): Promise<BuildCake> {
  if (!connected) return { piped: local.piped, serves: local.serves, noticeDays: local.noticeDays, layers: local.layers };
  const d = await query<Record<string, any> | null>(`*[_id == "buildCake"][0]`);
  if (!d) throw new Error("Sanity: Byg kagen is empty or unpublished");
  const layers = LAYER_IDS.map(id => {
    const l = d[id];
    if (!l?.name || typeof l.price !== "number") throw new Error(`Sanity: Byg kagen layer "${id}" is incomplete`);
    return { id, name: l.name, dansk: l.dansk ?? "", note: l.note ?? "", price: l.price };
  });
  return { piped: d.piped, serves: d.serves, noticeDays: d.noticeDays, layers };
}

export async function getCakes(): Promise<Cake[]> {
  if (!connected) return [];
  return query<Cake[]>(`*[_type == "cake" && available == true] | order(order asc){name, line, sizes[]{serves, price}}`);
}

export const LOCAL_HERO =
  "We only bake celebration cakes. Birthdays, christenings, the “we got the flat” cake. Scroll down and watch one get built, layer by layer, with the price adding up as it goes.";
