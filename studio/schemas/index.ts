import { siteSettings } from "./siteSettings";
import { buildCake } from "./buildCake";
import { cake } from "./cake";

export const schemaTypes = [siteSettings, buildCake, cake];
export const SINGLETONS = ["siteSettings", "buildCake"];
