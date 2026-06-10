export type SectorSlug =
  | 'eng_tech'
  | 'biz_finance'
  | 'healthcare'
  | 'edu_social'
  | 'creative_design'
  | 'science_tech';

export type CountryCode = 'MY' | 'SG' | 'TH' | 'VN' | 'PH' | 'LA';

export type EmployerScope = 'local_intl' | 'all';
export type EmployerType = 'local' | 'intl';

export interface ProgressionStage {
  years: string;
  title: string;
}

export interface RoleProgression {
  title: string;
  stages: ProgressionStage[];
  pivots: string[];
}

export interface RoleMarketRow {
  jobTitle: string;
  roleSlug: string;
  localFreshGrad?: string | null;
  localAvg?: string | null;
  localSenior?: string | null;
  intlFreshGrad?: string | null;
  intlAvg?: string | null;
  intlSenior?: string | null;
  freshGrad?: string | null;
  average?: string | null;
  senior?: string | null;
  demand?: number | null;
  aiRisk?: number | null;
  wlb?: number | null;
  hrsPerWeek?: string | null;
  stability?: number | null;
  workMode?: string | null;
  culture?: string | null;
  travel?: string | null;
  stress?: string | null;
  challenges?: string | null;
}

export interface CountryMarketData {
  code: CountryCode;
  name: string;
  currencyNote: string | null;
  employerScope: EmployerScope;
  context: string | null;
  roles: RoleMarketRow[];
}

export interface SectorData {
  sectorSlug: SectorSlug;
  displayName: string;
  roleCount: number;
  jobsList: string[];
  progression: RoleProgression[];
  countries: Partial<Record<CountryCode, CountryMarketData>>;
  quickReference: Record<string, string[]>;
  responseGuidelines: string[];
  schemaVariant: 'standard_15' | 'education_17' | 'extended_17';
}

export interface CareerOSMetadata {
  version: string;
  sectors: { sectorSlug: SectorSlug; displayName: string; roles: number }[];
  countries: CountryCode[];
  caveats: string[];
}

export interface CareerOSDataset {
  metadata: CareerOSMetadata;
  sectors: SectorData[];
  generatedAt: string;
  sourceFile: string;
}

export const COUNTRY_LABELS: Record<CountryCode, string> = {
  MY: 'Malaysia',
  SG: 'Singapore',
  TH: 'Thailand',
  VN: 'Vietnam',
  PH: 'Philippines',
  LA: 'Laos',
};
