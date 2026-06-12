import rawDataset from './dataset.json';
import type {
  CareerOSDataset,
  CountryCode,
  SectorData,
  SectorSlug,
} from './types';

export * from './types';
export * from './normalize';

export const careerOSDataset = rawDataset as CareerOSDataset;

export const careerOSSectors = careerOSDataset.sectors;

export const sectorRegistry = careerOSDataset.metadata.sectors;

export const datasetCaveats = careerOSDataset.metadata.caveats;

export function getSector(slug: SectorSlug): SectorData | undefined {
  return careerOSSectors.find((s) => s.sectorSlug === slug);
}

export function getSectorCountries(slug: SectorSlug): CountryCode[] {
  const sector = getSector(slug);
  if (!sector) return [];
  return Object.keys(sector.countries) as CountryCode[];
}

export function getRoleAcrossCountries(sectorSlug: SectorSlug, roleSlug: string) {
  const sector = getSector(sectorSlug);
  if (!sector) return [];
  return (Object.entries(sector.countries) as [CountryCode, NonNullable<(typeof sector.countries)[CountryCode]>][])
    .map(([code, country]) => ({
      country: code,
      countryName: country.name,
      row: country.roles.find((r) => r.roleSlug === roleSlug),
      employerScope: country.employerScope,
    }))
    .filter((entry) => entry.row);
}

export function getAllResponseGuidelines(): string[] {
  return [...new Set(careerOSSectors.flatMap((s) => s.responseGuidelines))];
}
