/**
 * Parses careeros_dataset_v3 markdown into structured JSON.
 * Run: node scripts/parse-careeros-dataset.mjs [path-to-md]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultInput = join(__dirname, '../data/careeros_dataset_v3.md');
const inputPath = process.argv[2] || defaultInput;
const outputPath = join(__dirname, '../src/data/careeros/dataset.json');

const SECTOR_HEADERS = [
  { pattern: /Engineering & Technology Sector/i, slug: 'eng_tech', name: 'Engineering & Technology' },
  { pattern: /Business & Finance Sector/i, slug: 'biz_finance', name: 'Business & Finance' },
  { pattern: /Healthcare & Life Sciences Sector/i, slug: 'healthcare', name: 'Healthcare & Life Sciences' },
  { pattern: /Education & Social Impact Sector/i, slug: 'edu_social', name: 'Education & Social Impact' },
  { pattern: /Group 1 — Creative & Design/i, slug: 'creative_design', name: 'Creative & Design' },
  { pattern: /Group 2 — Science & Technology/i, slug: 'science_tech', name: 'Science & Technology' },
];

const COUNTRY_MAP = {
  MALAYSIA: { code: 'MY', name: 'Malaysia' },
  SINGAPORE: { code: 'SG', name: 'Singapore' },
  THAILAND: { code: 'TH', name: 'Thailand' },
  VIETNAM: { code: 'VN', name: 'Vietnam' },
  PHILIPPINES: { code: 'PH', name: 'Philippines' },
  LAOS: { code: 'LA', name: 'Laos' },
};

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseTableRow(line) {
  return line
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim());
}

function normalizeHeader(h) {
  return h
    .toLowerCase()
    .replace(/stab%/g, 'stability%')
    .replace(/job\b/g, 'job title')
    .replace(/\s+/g, ' ')
    .trim();
}

function headerToField(header) {
  const h = normalizeHeader(header);
  const map = {
    'job title': 'jobTitle',
    'local fresh grad': 'localFreshGrad',
    'local fresh': 'localFreshGrad',
    'local avg': 'localAvg',
    'local senior': 'localSenior',
    'intl fresh grad': 'intlFreshGrad',
    'intl fresh': 'intlFreshGrad',
    'intl avg': 'intlAvg',
    'intl senior': 'intlSenior',
    'fresh grad (usd)': 'freshGrad',
    'average (usd)': 'average',
    'senior (usd)': 'senior',
    'demand (6mo)': 'demand',
    demand: 'demand',
    'ai risk': 'aiRisk',
    'wlb%': 'wlb',
    'hrs/wk': 'hrsPerWeek',
    'stability%': 'stability',
    'work mode': 'workMode',
    culture: 'culture',
    travel: 'travel',
    stress: 'stress',
    challenges: 'challenges',
  };
  return map[h] || h.replace(/[^a-z0-9]+/g, '_');
}

function parseDemand(val) {
  if (!val) return null;
  const m = val.replace(/,/g, '').match(/([\d.]+)/);
  return m ? parseInt(m[1], 10) : null;
}

function parsePercent(val) {
  if (!val || val === '—') return null;
  const m = String(val).match(/([\d.]+)/);
  return m ? parseFloat(m[1]) : null;
}

function parseProgressionClassic(block) {
  const roles = [];
  const sections = block.split(/^### \d+\.\s+/m).filter((s) => s.trim());
  for (const section of sections) {
    const lines = section.trim().split('\n');
    const title = lines[0].trim();
    if (!title) continue;
    const pathLine = lines.find((l) => l.includes('→') && l.includes('yrs:'));
    const pivotLine = lines.find((l) => l.startsWith('**Pivot paths:**'));
    const stages = [];
    if (pathLine) {
      const parts = pathLine.split('→').map((p) => p.trim());
      for (const part of parts) {
        const m = part.match(/^([\d–+\s]+yrs?):\s*(.+)$/i);
        if (m) stages.push({ years: m[1].trim(), title: m[2].trim() });
      }
    }
    const pivots = pivotLine
      ? pivotLine.replace('**Pivot paths:**', '').split('·').map((p) => p.trim()).filter(Boolean)
      : [];
    roles.push({ title, stages, pivots });
  }
  return roles;
}

function parseProgressionBullet(block) {
  const roles = [];
  const parts = block.split(/\n\*\*([^*]+)\*\*\n/).filter(Boolean);
  for (let i = 0; i < parts.length; i += 2) {
    const title = parts[i].trim();
    const body = parts[i + 1] || '';
    const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
    const stages = [];
    const pivots = [];
    for (const line of lines) {
      if (line.startsWith('- Pivots:')) {
        pivots.push(...line.replace('- Pivots:', '').split('·').map((p) => p.trim()).filter(Boolean));
      } else if (line.startsWith('- ')) {
        const m = line.slice(2).match(/^([\d–+\s]+yrs?):\s*(.+)$/i);
        if (m) stages.push({ years: m[1].trim(), title: m[2].trim() });
      }
    }
    if (title) roles.push({ title, stages, pivots });
  }
  return roles;
}

function detectCountry(line) {
  const upper = line.toUpperCase();
  for (const [key, info] of Object.entries(COUNTRY_MAP)) {
    if (upper.includes(key)) return { key, ...info };
  }
  return null;
}

function parseCurrencyFromCountryLine(line) {
  const m = line.match(/Currency:\s*([^)]+)\)/i) || line.match(/\((RM|S\$|SGD|THB|PHP|VND|LAK|USD|MYR)[^)]*\)/i);
  return m ? m[1].trim() : null;
}

function parseCountryTables(section, sectorSlug) {
  const countries = {};
  const lines = section.split('\n');
  let currentCountry = null;
  let headers = null;
  let employerScope = 'local_intl';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('### ') && detectCountry(line)) {
      const country = detectCountry(line);
      currentCountry = country.code;
      const currencyNote = parseCurrencyFromCountryLine(line);
      employerScope =
        sectorSlug === 'eng_tech' && country.code === 'LA' ? 'all' : 'local_intl';
      countries[currentCountry] = {
        code: country.code,
        name: country.name,
        currencyNote: currencyNote || null,
        employerScope,
        context: null,
        roles: [],
      };
      headers = null;
      continue;
    }

    if (currentCountry && line.startsWith('**') && line.endsWith('**')) {
      countries[currentCountry].context = line.replace(/\*\*/g, '');
      continue;
    }

    if (currentCountry && line.startsWith('|') && line.includes('Job Title')) {
      headers = parseTableRow(line).map(headerToField);
      continue;
    }

    if (currentCountry && headers && line.startsWith('|') && !line.includes('---')) {
      const cells = parseTableRow(line);
      if (cells.length < 3) continue;
      const row = { jobTitle: cells[0] };
      for (let c = 1; c < headers.length && c < cells.length; c++) {
        const field = headers[c];
        const val = cells[c];
        if (['demand'].includes(field)) row[field] = parseDemand(val);
        else if (['aiRisk', 'wlb', 'stability'].includes(field)) row[field] = parsePercent(val);
        else row[field] = val === '—' ? null : val;
      }
      row.roleSlug = slugify(row.jobTitle);
      countries[currentCountry].roles.push(row);
    }
  }

  return countries;
}

function parseJobsList(section) {
  const jobs = [];
  const m = section.match(/## Jobs\n([\s\S]*?)(?=\n---|\n## )/);
  if (!m) return jobs;
  for (const line of m[1].split('\n')) {
    const match = line.match(/^\d+\.\s+(.+)$/);
    if (match) jobs.push(match[1].trim());
  }
  return jobs;
}

function parseQuickReference(section) {
  const ref = {};
  const blocks = section.split(/^### /m).slice(1);
  for (const block of blocks) {
    const lines = block.split('\n');
    const title = lines[0].trim();
    const items = lines
      .slice(1)
      .filter((l) => l.startsWith('- '))
      .map((l) => l.replace(/^-\s*/, '').trim());
    ref[title] = items;
  }
  return ref;
}

function parseResponseGuidelines(section) {
  return section
    .split('\n')
    .filter((l) => l.startsWith('- '))
    .map((l) => l.replace(/^-\s*/, '').trim());
}

function splitSectors(content) {
  const sectorStarts = [];
  for (const { pattern, slug, name } of SECTOR_HEADERS) {
    const match = content.match(new RegExp(`^# .*(?:${pattern.source}).*$`, 'im'));
    if (match) sectorStarts.push({ index: match.index, slug, name, header: match[0] });
  }
  sectorStarts.sort((a, b) => a.index - b.index);

  const sectors = [];
  for (let i = 0; i < sectorStarts.length; i++) {
    const start = sectorStarts[i];
    const end = sectorStarts[i + 1]?.index ?? content.length;
    sectors.push({ ...start, content: content.slice(start.index, end) });
  }
  return sectors;
}

function parseSector({ slug, name, content }) {
  const isCreativeScience = slug === 'creative_design' || slug === 'science_tech';

  let progression = [];
  const progClassic = content.match(/## CAREER PROGRESSION PATHS[^\n]*\n([\s\S]*?)(?=\n---\n\n## |\n## SALARY|\n## CROSS-COUNTRY|$)/);
  if (progClassic) {
    progression =
      progClassic[1].includes('### 1.') || progClassic[1].includes('### 2.')
        ? parseProgressionClassic(progClassic[1])
        : parseProgressionBullet(progClassic[1]);
  }

  const salarySection = content.match(
    /## SALARY(?:\s*&\s*MARKET DATA)?(?:\s*BY COUNTRY)?\n([\s\S]*?)(?=\n## CROSS-COUNTRY|\n## CAREER PROGRESSION|\n## RESPONSE|$)/i
  );
  const countries = salarySection ? parseCountryTables(salarySection[1], slug) : {};

  // Creative/science may have progression after salary
  if (isCreativeScience && progression.length === 0) {
    const progLate = content.match(/## CAREER PROGRESSION PATHS[^\n]*\n([\s\S]*?)$/);
    if (progLate) progression = parseProgressionBullet(progLate[1]);
  }

  const quickRefMatch = content.match(/## CROSS-COUNTRY QUICK REFERENCE[^\n]*\n([\s\S]*?)(?=\n## CAREER PROGRESSION|\n## RESPONSE|$)/);
  const quickReference = quickRefMatch ? parseQuickReference(quickRefMatch[1]) : {};

  const guidelinesMatch = content.match(/## RESPONSE GUIDELINES\n([\s\S]*?)(?=\n# |$)/);
  const responseGuidelines = guidelinesMatch ? parseResponseGuidelines(guidelinesMatch[1]) : [];

  const jobsList = (isCreativeScience ? parseJobsList(content) : progression.map((p) => p.title)).filter(Boolean);

  return {
    sectorSlug: slug,
    displayName: name,
    roleCount: jobsList.length,
    jobsList,
    progression,
    countries,
    quickReference,
    responseGuidelines,
    schemaVariant: isCreativeScience ? 'extended_17' : slug === 'edu_social' ? 'education_17' : 'standard_15',
  };
}

function parseMetadata(content) {
  const registry = SECTOR_HEADERS.map(({ slug, name }) => ({
    sectorSlug: slug,
    displayName: name,
    roles: 18,
  }));

  return {
    version: 'v3',
    sectors: registry,
    countries: Object.values(COUNTRY_MAP).map((c) => c.code),
    caveats: [
      'Local == Intl salary cells indicate international premium was not separately sourced.',
      'Identical demand figures across countries are global order-of-magnitude estimates.',
      'eng_tech LA uses USD 3-tier schema with employer_scope=all — exclude from cross-country salary-rank charts.',
      'Creative/Science PH/LA/VN/TH proxy fields backfilled from Malaysia where noted in v3.',
    ],
  };
}

// --- main ---
const raw = readFileSync(inputPath, 'utf8');
const sectorChunks = splitSectors(raw);
const sectors = sectorChunks.map(parseSector);
const metadata = parseMetadata(raw);

const dataset = {
  metadata,
  sectors,
  generatedAt: new Date().toISOString(),
  sourceFile: inputPath,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(dataset, null, 2));

const roleCount = sectors.reduce((n, s) => n + s.jobsList.length, 0);
const countryTables = sectors.reduce((n, s) => n + Object.keys(s.countries).length, 0);
console.log(`Wrote ${outputPath}`);
console.log(`  Sectors: ${sectors.length}, Roles: ${roleCount}, Country tables: ${countryTables}`);
