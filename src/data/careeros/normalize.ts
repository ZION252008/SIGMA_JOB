import type {
  CountryCode,
  CountryMarketData,
  EmployerType,
  RoleMarketRow,
  SectorData,
  SectorSlug,
} from './types';

/** Local and intl salary cells are identical — premium was not separately sourced. */
export function isSalaryParity(row: RoleMarketRow): boolean {
  return (
    !!row.localFreshGrad &&
    !!row.intlFreshGrad &&
    row.localFreshGrad === row.intlFreshGrad &&
    !!row.localAvg &&
    !!row.intlAvg &&
    row.localAvg === row.intlAvg &&
    !!row.localSenior &&
    !!row.intlSenior &&
    row.localSenior === row.intlSenior
  );
}

/** eng_tech Laos uses USD 3-tier schema — not comparable for cross-country salary-rank charts. */
export function excludeFromSalaryRank(sectorSlug: SectorSlug, country: CountryCode): boolean {
  return sectorSlug === 'eng_tech' && country === 'LA';
}

export function getEmployerSalaries(
  row: RoleMarketRow,
  employer: EmployerType,
  country: CountryMarketData
): { fresh: string | null; avg: string | null; senior: string | null } {
  if (country.employerScope === 'all') {
    return {
      fresh: row.freshGrad ?? null,
      avg: row.average ?? null,
      senior: row.senior ?? null,
    };
  }
  const prefix = employer === 'local' ? 'local' : 'intl';
  return {
    fresh: (row[`${prefix}FreshGrad` as keyof RoleMarketRow] as string | null) ?? null,
    avg: (row[`${prefix}Avg` as keyof RoleMarketRow] as string | null) ?? null,
    senior: (row[`${prefix}Senior` as keyof RoleMarketRow] as string | null) ?? null,
  };
}

/** Apply 10–40% multinational premium when modelling intl scenarios from parity data. */
export function applyIntlPremium(salary: string, premiumPct = 25): string {
  const rangeMatch = salary.match(/([\d,]+)(?:\s*[–-]\s*([\d,]+))?/);
  if (!rangeMatch) return salary;
  const low = parseInt(rangeMatch[1].replace(/,/g, ''), 10);
  const high = rangeMatch[2] ? parseInt(rangeMatch[2].replace(/,/g, ''), 10) : low;
  const factor = 1 + premiumPct / 100;
  const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
  const prefix = salary.match(/^[^\d]+/)?.[0]?.trim() ?? '';
  if (high > low) return `${prefix} ${fmt(low * factor)}–${fmt(high * factor)}`.trim();
  return `${prefix} ${fmt(low * factor)}`.trim();
}

export function getProgressionForRole(sector: SectorData, jobTitle: string) {
  return sector.progression.find(
    (p) => p.title.toLowerCase() === jobTitle.toLowerCase()
  );
}

export function getTopDemandRole(country: CountryMarketData): RoleMarketRow | null {
  if (!country.roles.length) return null;
  return [...country.roles].sort((a, b) => (b.demand ?? 0) - (a.demand ?? 0))[0];
}

export function getRolesByDemand(country: CountryMarketData): RoleMarketRow[] {
  return [...country.roles].sort((a, b) => (b.demand ?? 0) - (a.demand ?? 0));
}

export function buildCoachContext(sectors: SectorData[]): string {
  const guidelines = sectors.flatMap((s) => s.responseGuidelines);
  const unique = [...new Set(guidelines)];
  return [
    'CareerOS v3 dataset guidelines:',
    ...unique.map((g) => `- ${g}`),
    'Always specify country and whether salary is local or international employer.',
    'Use sector_slug as primary sector key (eng_tech vs science_tech).',
    'Factor salary, WLB, demand, stability, and AI risk together — not salary alone.',
  ].join('\n');
}
