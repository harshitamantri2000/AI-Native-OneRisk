export * from "./types";
export { mkShelters } from "./mk-shelters";
export { arAmboliDevelopers } from "./ar-amboli";
export { manaProperties } from "./mana-properties";
export { empireLivingSpaces } from "./empire-living";
export { ushodayaSuperMarkets } from "./ushodaya-supermarkets";

import { mkShelters } from "./mk-shelters";
import { arAmboliDevelopers } from "./ar-amboli";
import { manaProperties } from "./mana-properties";
import { empireLivingSpaces } from "./empire-living";
import { ushodayaSuperMarkets } from "./ushodaya-supermarkets";
import type { RichCaseEntry } from "./types";

/**
 * All rich mock cases — derived from real IDfy Netscan reports.
 * Each entry includes full financial parameters, network nodes,
 * litigation records, compliance checks, CAM draft, and documents.
 *
 * Use this as the data source for Case Detail pages.
 */
export const RICH_MOCK_CASES: RichCaseEntry[] = [
  arAmboliDevelopers,    // High Risk — 5 criminal cases, show first as primary example
  ushodayaSuperMarkets,  // High Risk — financial stress, ₹100 Cr cross-collateral exposure
  mkShelters,            // Medium Risk — network contagion from A.R. Amboli
  empireLivingSpaces,    // Low Risk — broad network footprint, clean standalone
  manaProperties,        // Low Risk — cleanest entity in the network
];

/**
 * Lookup by case ID.
 */
export const RICH_CASES_BY_ID: Record<string, RichCaseEntry> = Object.fromEntries(
  RICH_MOCK_CASES.map((c) => [c.id, c])
);
