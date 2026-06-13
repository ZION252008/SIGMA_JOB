# CareerOS -- Codex System Prompt (Master File)

## Sectors Included
1. [Engineering & Technology](#careeros--codex-system-prompt-engineering--technology-sector) -- 18 roles
2. [Business & Finance](#careeros--codex-system-prompt-business--finance-sector) -- 18 roles
3. [Healthcare & Life Sciences](#careeros--codex-system-prompt-healthcare--life-sciences-sector) -- 18 roles
4. [Education & Social Impact](#careeros--codex-system-prompt-education--social-impact-sector) -- 18 roles
5. [Creative & Design](#group-1--creative--design-18-jobs) -- 18 roles
6. [Science & Technology](#group-2--science--technology-18-jobs) -- 18 roles

## Data Schema & Known Inconsistencies

This file aggregates six sectors collected from different sources. Schemas are not
fully uniform; consumers should normalize at parse time.

### Schema variants

| Sector group | Cols | Extra fields vs Tech baseline |
|---|---|---|
| Engineering & Technology (Sector 1) | 14 | baseline |
| Business & Finance, Healthcare, Education (Sectors 2-4) | 15 | + Travel |
| Education rows 13-18 | 17 | + Culture, + Challenges (now applied to whole sector -- earlier rows padded with `--`) |
| Creative & Design, Science & Technology -- MY / SG | 17 | + Culture, + Travel, + Stress, + Challenges |
| Creative & Design, Science & Technology -- PH / Laos / VN / TH | 8 | salary tiers + Demand only (no AI Risk, WLB, Hrs/Wk, Stability, Work Mode, Stress) |
| Engineering & Technology -- Laos | 13 | LAK millions/month, full Local/Intl split -- aligned with all other countries |

### Currency & unit conventions

| Country | Sectors 1-4 | Creative / Science |
|---|---|---|
| Malaysia | `RM 3,000-4,000` (ranges) | `RM 1,800` (formatted, single value) |
| Singapore | `SGD 3,500-4,500` (ranges) | `S$ 2,500` (formatted, single value) |
| Thailand | `THB 20,000-30,000` (ranges) | `THB 18,000` (formatted) |
| Philippines | `PHP ...` (ranges) | `PHP 18,000` (formatted) |
| Vietnam | VND millions/month, e.g. `8-15M` | `VND 7m` (millions, formatted) |
| Laos -- Tech | **LAK millions/month**, Local/Intl split (aligned with other countries) | n/a |
| Laos -- B&F / Health / Edu | LAK millions/month | n/a |
| Laos -- Creative / Science | n/a | `LAK 4.5m` (millions, formatted) |

### Known caveats (not auto-fixed -- would require re-sourcing data)

- **Local vs International columns are duplicated** in many Sector 1-4 country
  tables (Malaysia/Thailand/Vietnam/Philippines in particular). Treat
  "Intl == Local" as "data not separately sourced," not as a real equality.
- **Demand figures appear reused across countries** for several roles
  (e.g. CTO ~= 12,000 across MY/SG/TH/VN/PH). Treat as global-order-of-magnitude
  estimates, not country-specific counts.
- **Engineering & Technology -- Laos** now uses LAK millions/month with the full Local/Intl split, matching all other countries in this sector.
- **Creative / Science thin tables** (PH, Laos, VN, TH) omit AI Risk, WLB,
  Hrs/Wk, Stability, Work Mode, and Stress. Use MY/SG values from the same
  sector as a regional proxy, or render those fields as `n/a` in UI.

### Fixes applied in this version (v3)

P0 -- structural
- Education sector country tables: header normalised to 17 columns
  (added `Culture` after `Work Mode` and `Challenges` at end). Rows 1-12
  padded with `--` so every row has 17 cells (rows 13-18 already carried
  these fields).
- Education progression header confirmed as "All 18 Education & Social
  Impact Roles" (no longer says "All 12").
- Engineering & Technology -- Laos table replaced with full LAK millions/month
  Local/Intl split schema (13 columns), aligned with all other country tables
  in this sector. Previous USD-only 3-tier schema removed.

P1 -- schema alignment
- Engineering & Technology country tables: added `Travel` column (default
  `Low`) so all Sector 1-4 country tables share a 15-column shape.
- Creative & Design and Science & Technology -- PH / Laos / VN / Thailand
  tables: backfilled 9 missing columns (AI Risk, WLB%, Hrs/Wk, Stability%,
  Work Mode, Culture, Travel, Stress, Challenges) by copying the
  same-role values from the corresponding Malaysia table as a regional
  proxy. Treat these as proxy values, not country-sourced.
- Creative / Science VN and Laos salaries already in millions (`VND 7m`,
  `LAK 4.5m`) -- verified, no changes needed.
- Creative & Design and Science & Technology -- Malaysia and Singapore
  tables: point salary values expanded to +/-15 % ranges (e.g. `RM 1,800`
  -> `RM 1,500-2,100`) so all sectors share a min-max salary shape.

P2 -- data quality
- Malaysia Tech QA Automation Engineer Local Avg already reconciled in
  v2 (RM 6,000-8,000 with Senior RM 11,000-15,000).
- Local vs International salary parity: many Sector 1-4 country tables
  intentionally show `Intl == Local` because the international premium
  was not separately sourced. Treat as "data not separately sourced",
  not as a real equality. Confirmed parity is **not** applied to
  Singapore (true intl premium present) and only partially to Malaysia.
- Demand figures: where several countries share an identical
  global-order-of-magnitude estimate (e.g. CTO ~= 12,000 across MY/SG/
  TH/VN/PH), values are kept but flagged as regional estimates. Country-
  specific re-sourcing required for production use.
- Sector naming overlap resolved via `sector_slug` registry below.

P3 -- prompt / UX
- Creative & Design and Science & Technology: section header renamed
  from "## Career Progressions" -> "## CAREER PROGRESSION PATHS (All 18
  <Sector> Roles)" to match Sectors 1-4.
- Column naming standardised: `Job` -> `Job Title`, `Stab%` -> `Stability%`
  across all tables.
- Added **CROSS-COUNTRY QUICK REFERENCE** blocks for Creative & Design
  and Science & Technology (highest demand role + top senior intl
  salary by country).

### Sector Registry (resolves naming overlap)

| sector_slug | Display name | Roles |
|---|---|---|
| `eng_tech` | Engineering & Technology | 18 |
| `biz_finance` | Business & Finance | 18 |
| `healthcare` | Healthcare & Life Sciences | 18 |
| `edu_social` | Education & Social Impact | 18 |
| `creative_design` | Creative & Design | 18 |
| `science_tech` | Science & Technology | 18 |

Use `sector_slug` (not the display name) as the primary key when
referencing a sector in prompts to avoid confusion between
`eng_tech` and `science_tech`.

### Known data-source caveats kept (not auto-fixable)

- Local vs International salary splits for Engineering & Technology are
  now differentiated for all 6 countries based on market research
  (Randstad MY 2025, aniday SG 2026, secondtalent PH 2026, itviec VN
  2025-2026, nucamp TH 2026, playroll LA 2026). Premiums by country:
  MY 20-30%, SG 10-20%, TH 30-35%, VN 35-45%, PH 40-50%, LA 20-30%.
- Identical Demand figures across countries for the same role are
  global order-of-magnitude estimates. Replace with country-specific
  figures from JobStreet / LinkedIn / local job boards before using
  in country-rank charts.
- Engineering & Technology -- Laos uses USD with 3 tiers (Fresh Grad /
  Average / Senior). It is intentionally not row-for-row comparable
  with the Local/Intl split used elsewhere -- exclude from cross-
  country salary-rank charts (`employer_scope=all`).
- Creative / Science thin-table backfills for PH / LA / VN / TH use
  Malaysia values as regional proxy. Replace with country-sourced
  values before publishing country-specific reports.

---
---

# CareerOS -- Codex System Prompt: Engineering & Technology Sector

---

## CAREER PROGRESSION PATHS (All 18 Tech Roles)

### 1. Junior Frontend Developer
0-2 yrs: Junior Frontend Developer -> 2-4 yrs: Frontend Developer -> 4-7 yrs: Senior Frontend Developer -> 7-10 yrs: Lead Frontend Engineer -> 10+ yrs: Principal Engineer / Frontend Architect
**Pivot paths:** UI/UX Designer * Full Stack Engineer * Mobile Engineer * Product Manager

### 2. Junior Backend Developer
0-2 yrs: Junior Backend Developer -> 2-4 yrs: Backend Developer -> 4-7 yrs: Senior Backend Developer -> 7-10 yrs: Lead Backend Engineer -> 10+ yrs: Principal Engineer / Backend Architect
**Pivot paths:** Full Stack Engineer * DevOps Engineer * Data Engineer * Solutions Architect

### 3. QA Automation Engineer
0-2 yrs: Junior QA / Manual Tester -> 2-4 yrs: QA Automation Engineer -> 4-7 yrs: Senior QA Automation Engineer -> 7-10 yrs: QA Lead / Test Architect -> 10+ yrs: Director of Quality Engineering
**Pivot paths:** DevOps Engineer * Software Developer * Product Manager * Site Reliability Engineer

### 4. Systems Analyst
0-2 yrs: Junior Systems Analyst -> 2-4 yrs: Systems Analyst -> 4-7 yrs: Senior Systems Analyst -> 7-10 yrs: Lead Systems Analyst / IT Manager -> 10+ yrs: Enterprise Architect / IT Director
**Pivot paths:** Business Analyst * Solutions Architect * Project Manager * Data Analyst

### 5. Database Administrator
0-2 yrs: Junior Database Administrator -> 2-4 yrs: Database Administrator -> 4-7 yrs: Senior DBA -> 7-10 yrs: Lead DBA / Data Architect -> 10+ yrs: Principal Data Engineer / Data Director
**Pivot paths:** Data Engineer * Cloud Architect * BI Developer * Data Platform Engineer

### 6. Cloud Support Specialist
0-2 yrs: Cloud Support Specialist -> 2-4 yrs: Cloud Engineer -> 4-7 yrs: Senior Cloud Engineer -> 7-10 yrs: Cloud Architect -> 10+ yrs: Principal Cloud Architect / Head of Cloud
**Pivot paths:** DevOps Engineer * Site Reliability Engineer * Solutions Architect * Infrastructure Lead

### 7. Full Stack Engineer
0-2 yrs: Junior Full Stack Engineer -> 2-4 yrs: Full Stack Engineer -> 4-7 yrs: Senior Full Stack Engineer -> 7-10 yrs: Lead Full Stack Engineer -> 10+ yrs: Principal Engineer / CTO Track
**Pivot paths:** Frontend Developer * Backend Developer * Product Manager * Solutions Architect

### 8. Mobile Applications Engineer
0-2 yrs: Junior Mobile Developer -> 2-4 yrs: Mobile Applications Engineer -> 4-7 yrs: Senior Mobile Engineer -> 7-10 yrs: Lead Mobile Engineer -> 10+ yrs: Mobile Architect / Head of Mobile
**Pivot paths:** Full Stack Engineer * UI/UX Designer * Product Manager * Frontend Developer

### 9. DevOps Build Engineer
0-2 yrs: Junior DevOps Engineer -> 2-4 yrs: DevOps Build Engineer -> 4-7 yrs: Senior DevOps Engineer -> 7-10 yrs: DevOps Lead / Platform Engineer -> 10+ yrs: Head of DevOps / Platform Director
**Pivot paths:** Site Reliability Engineer * Cloud Architect * Infrastructure Lead * Security Engineer

### 10. Information Security Officer
0-2 yrs: Security Analyst -> 2-4 yrs: Information Security Officer -> 4-7 yrs: Senior Security Engineer -> 7-10 yrs: Security Architect / CISO Deputy -> 10+ yrs: Chief Information Security Officer (CISO)
**Pivot paths:** SecOps Director * Risk Manager * Compliance Officer * Penetration Tester

### 11. Solutions Architect
0-2 yrs: Associate Solutions Architect -> 2-4 yrs: Solutions Architect -> 4-7 yrs: Senior Solutions Architect -> 7-10 yrs: Principal Solutions Architect -> 10+ yrs: Chief Architect / VP of Architecture
**Pivot paths:** Cloud Architect * Enterprise Architect * CTO * Product Director

### 12. AI Integration Specialist
0-2 yrs: Junior AI/ML Engineer -> 2-4 yrs: AI Integration Specialist -> 4-7 yrs: Senior AI Engineer -> 7-10 yrs: Lead AI Architect -> 10+ yrs: Head of AI / Chief AI Officer
**Pivot paths:** Data Scientist * ML Ops Engineer * Product Manager (AI) * Research Scientist

### 13. Site Reliability Architect
0-2 yrs: Site Reliability Engineer (SRE) -> 2-4 yrs: Senior SRE -> 4-7 yrs: Staff SRE -> 7-10 yrs: Site Reliability Architect -> 10+ yrs: VP of Engineering / Principal SRE
**Pivot paths:** DevOps Lead * Platform Engineer * Cloud Architect * Infrastructure Director

### 14. Data Platform Engineer
0-2 yrs: Junior Data Engineer -> 2-4 yrs: Data Platform Engineer -> 4-7 yrs: Senior Data Engineer -> 7-10 yrs: Lead Data Platform Engineer -> 10+ yrs: Principal Data Architect / Head of Data
**Pivot paths:** Data Scientist * BI Developer * Cloud Engineer * Database Administrator

### 15. Principal Infrastructure Lead
0-2 yrs: Infrastructure Engineer -> 2-4 yrs: Senior Infrastructure Engineer -> 4-7 yrs: Infrastructure Lead -> 7-10 yrs: Principal Infrastructure Lead -> 10+ yrs: VP of Infrastructure / CTO
**Pivot paths:** Cloud Architect * DevOps Director * Site Reliability Architect * CTO

### 16. SecOps Director
0-2 yrs: Security Operations Analyst -> 2-4 yrs: Senior SecOps Analyst -> 4-7 yrs: SecOps Manager -> 7-10 yrs: SecOps Director -> 10+ yrs: CISO / VP of Security
**Pivot paths:** Information Security Officer * Risk Manager * Compliance Director * CTO

### 17. Core UI Framework Author
0-2 yrs: Frontend Developer -> 2-4 yrs: Senior Frontend Engineer -> 4-7 yrs: Core UI Framework Contributor -> 7-10 yrs: Core UI Framework Author / Lead -> 10+ yrs: Principal Engineer / Open Source Lead
**Pivot paths:** Developer Advocate * Product Engineer * Engineering Manager * CTO

### 18. Chief Technology Officer
0-2 yrs: Software Engineer / Analyst -> 2-4 yrs: Senior Engineer / Tech Lead -> 4-7 yrs: Engineering Manager / Architect -> 7-10 yrs: VP of Engineering / Director -> 10+ yrs: Chief Technology Officer (CTO)
**Pivot paths:** Chief Product Officer * CEO * Solutions Architect * Board Advisor

---

## SALARY & MARKET DATA BY COUNTRY

---

### MALAYSIA (Currency: MYR / RM)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Frontend Developer | RM 3,000-4,000 | RM 6,000-7,000 | RM 9,000-12,000 | RM 3,500-5,000 | RM 7,500-9,000 | RM 12,000-16,000 | ~120,000 | 35% | 70% | 40 | 85% | Hybrid | Low | Medium |
| Junior Backend Developer | RM 3,000-4,000 | RM 4,000-6,000 | RM 8,000-12,000 | RM 3,500-5,000 | RM 5,500-8,000 | RM 11,000-16,000 | ~95,000 | 40% | 68% | 40-45 | 80% | Hybrid | Low | Medium |
| QA Automation Engineer | RM 3,500-5,000 | RM 6,000-8,000 | RM 11,000-15,000 | RM 4,000-6,000 | RM 7,500-10,500 | RM 14,000-20,000 | ~40,000 | 30% | 72% | 40 | 85% | Hybrid | Low | Medium |
| Systems Analyst | RM 2,500-4,400 | RM 6,000-8,000 | RM 8,000-13,000 | RM 3,000-5,000 | RM 7,500-10,000 | RM 11,000-17,000 | ~60,000 | 25% | 70% | 40-45 | 82% | Hybrid | Low | Medium |
| Database Administrator | RM 3,500-4,500 | RM 7,000-9,000 | RM 12,000-18,000 | RM 4,000-5,500 | RM 9,000-12,000 | RM 16,000-24,000 | ~45,000 | 28% | 73% | 40 | 85% | Hybrid | Low | Medium |
| Cloud Support Specialist | RM 3,000-4,000 | RM 6,000-8,000 | RM 12,000-15,000 | RM 3,500-5,000 | RM 7,500-10,500 | RM 15,000-20,000 | ~70,000 | 20% | 75% | 40-45 | 88% | Hybrid/Remote | Low | Medium |
| Full Stack Engineer | RM 3,500-5,000 | RM 8,000-10,000 | RM 15,000-20,000 | RM 4,500-6,500 | RM 10,500-13,500 | RM 20,000-28,000 | ~110,000 | 38% | 68% | 40-45 | 82% | Hybrid | Low | High |
| Mobile Applications Engineer | RM 3,000-4,500 | RM 7,000-9,000 | RM 12,000-18,000 | RM 3,800-5,500 | RM 9,000-12,000 | RM 16,000-24,000 | ~85,000 | 42% | 67% | 40-45 | 80% | Hybrid | Low | High |
| DevOps Build Engineer | RM 3,500-5,000 | RM 9,000-11,000 | RM 15,000-22,000 | RM 4,500-6,500 | RM 12,000-15,000 | RM 20,000-30,000 | ~60,000 | 25% | 70% | 40-45 | 87% | Hybrid | Low | High |
| Information Security Officer | RM 4,000-6,000 | RM 12,000-15,000 | RM 20,000-30,000 | RM 5,000-8,000 | RM 15,000-20,000 | RM 27,000-40,000 | ~75,000 | 15% | 74% | 40-45 | 90% | Hybrid/On-site | Low | High |
| Solutions Architect | RM 5,000-7,000 | RM 15,000-18,000 | RM 25,000-35,000 | RM 6,500-9,000 | RM 19,000-24,000 | RM 33,000-47,000 | ~65,000 | 20% | 72% | 40-45 | 88% | Hybrid | Low | High |
| AI Integration Specialist | RM 4,500-6,000 | RM 12,000-15,000 | RM 20,000-28,000 | RM 6,000-8,000 | RM 16,000-20,000 | RM 28,000-38,000 | ~50,000 | 45% | 70% | 40-45 | 83% | Hybrid/Remote | Low | High |
| Site Reliability Architect | RM 5,000-7,000 | RM 14,000-17,000 | RM 25,000-32,000 | RM 6,500-9,000 | RM 18,000-23,000 | RM 33,000-43,000 | ~40,000 | 22% | 68% | 40-50 | 87% | Hybrid | Low | High |
| Data Platform Engineer | RM 4,000-6,000 | RM 12,000-15,000 | RM 20,000-28,000 | RM 5,000-7,500 | RM 15,000-20,000 | RM 27,000-38,000 | ~55,000 | 30% | 70% | 40-45 | 85% | Hybrid | Low | Medium |
| Principal Infrastructure Lead | RM 6,000-8,000 | RM 18,000-22,000 | RM 30,000-40,000 | RM 7,500-10,000 | RM 23,000-30,000 | RM 40,000-54,000 | ~25,000 | 18% | 72% | 40-45 | 90% | Hybrid/On-site | Low | High |
| SecOps Director | RM 7,000-9,000 | RM 20,000-25,000 | RM 35,000-50,000 | RM 9,000-12,000 | RM 26,000-33,000 | RM 46,000-66,000 | ~20,000 | 12% | 74% | 40-45 | 92% | On-site/Hybrid | Low | High |
| Core UI Framework Author | RM 5,000-7,000 | RM 15,000-18,000 | RM 25,000-35,000 | RM 6,500-9,000 | RM 19,000-24,000 | RM 33,000-46,000 | ~15,000 | 40% | 68% | 40-45 | 80% | Hybrid/Remote | Low | Medium |
| Chief Technology Officer | RM 10,000-15,000 | RM 30,000-40,000 | RM 50,000-70,000 | RM 13,000-19,000 | RM 39,000-53,000 | RM 67,000-95,000 | ~12,000 | 10% | 75% | 45-50 | 95% | Hybrid/On-site | Low | High |

**Malaysia Tech Context:** Culture: collaborative, fast-paced, hybrid-forward. WLB generally strong for the region. Kuala Lumpur-centric talent market. Common challenges: tight deadlines, keeping up with frameworks, infrastructure scaling, regulatory compliance (PDPA). Malaysia has one of the highest Cloud Support Specialist WLB scores (75%) in SEA.

---

### SINGAPORE (Currency: SGD)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Frontend Developer | SGD 3,500-4,500 | SGD 6,000-8,000 | SGD 9,000-13,000 | SGD 4,000-5,500 | SGD 7,000-9,500 | SGD 10,500-15,500 | ~120,000 | 35% | 68% | 42-45 | 85% | Hybrid | Low | Medium |
| Junior Backend Developer | SGD 3,500-5,000 | SGD 6,500-9,000 | SGD 10,000-15,000 | SGD 4,000-6,000 | SGD 7,500-10,500 | SGD 12,000-18,000 | ~95,000 | 40% | 66% | 42-45 | 80% | Hybrid | Low | Medium |
| QA Automation Engineer | SGD 3,500-4,500 | SGD 6,000-8,000 | SGD 9,000-13,000 | SGD 4,000-5,500 | SGD 7,000-9,500 | SGD 10,500-15,500 | ~40,000 | 30% | 70% | 42 | 85% | Hybrid | Low | Medium |
| Systems Analyst | SGD 3,200-4,500 | SGD 6,000-8,500 | SGD 9,500-14,000 | SGD 3,700-5,300 | SGD 7,000-10,000 | SGD 11,000-16,500 | ~60,000 | 25% | 68% | 42-45 | 82% | Hybrid | Low | Medium |
| Database Administrator | SGD 3,500-4,800 | SGD 7,000-9,500 | SGD 11,000-16,000 | SGD 4,000-5,700 | SGD 8,000-11,000 | SGD 13,000-19,000 | ~45,000 | 28% | 70% | 42 | 85% | Hybrid | Low | Medium |
| Cloud Support Specialist | SGD 3,500-4,500 | SGD 6,500-9,000 | SGD 10,000-15,000 | SGD 4,000-5,500 | SGD 7,500-10,500 | SGD 12,000-18,000 | ~70,000 | 20% | 72% | 42-45 | 88% | Hybrid/Remote | Low | Medium |
| Full Stack Engineer | SGD 4,000-5,500 | SGD 7,500-11,000 | SGD 13,000-20,000 | SGD 4,800-6,800 | SGD 9,000-13,000 | SGD 15,500-24,000 | ~110,000 | 38% | 65% | 42-48 | 82% | Hybrid | Low | High |
| Mobile Applications Engineer | SGD 3,800-5,000 | SGD 7,000-10,000 | SGD 12,000-18,000 | SGD 4,500-6,000 | SGD 8,000-12,000 | SGD 14,000-22,000 | ~85,000 | 42% | 65% | 42-47 | 80% | Hybrid | Low | High |
| DevOps Build Engineer | SGD 4,500-6,000 | SGD 9,000-13,000 | SGD 15,000-22,000 | SGD 5,200-7,200 | SGD 10,500-15,500 | SGD 18,000-27,000 | ~60,000 | 25% | 67% | 42-48 | 87% | Hybrid | Low | High |
| Information Security Officer | SGD 5,000-7,000 | SGD 10,000-15,000 | SGD 18,000-28,000 | SGD 5,800-8,500 | SGD 12,000-18,000 | SGD 21,500-34,000 | ~75,000 | 15% | 70% | 42-47 | 90% | Hybrid/On-site | Low | High |
| Solutions Architect | SGD 6,000-8,000 | SGD 12,000-18,000 | SGD 20,000-27,000 | SGD 7,000-9,500 | SGD 14,000-21,500 | SGD 24,000-33,000 | ~65,000 | 20% | 68% | 42-47 | 88% | Hybrid | Low | High |
| AI Integration Specialist | SGD 5,500-7,500 | SGD 11,000-16,000 | SGD 18,000-26,000 | SGD 6,500-9,000 | SGD 13,000-19,000 | SGD 21,500-32,000 | ~50,000 | 45% | 67% | 42-47 | 83% | Hybrid/Remote | Low | High |
| Site Reliability Architect | SGD 6,000-8,000 | SGD 12,000-17,000 | SGD 20,000-28,000 | SGD 7,000-9,500 | SGD 14,000-20,000 | SGD 24,000-34,000 | ~40,000 | 22% | 64% | 43-52 | 87% | Hybrid | Low | High |
| Data Platform Engineer | SGD 5,500-7,500 | SGD 10,000-15,000 | SGD 17,000-25,000 | SGD 6,300-8,800 | SGD 11,500-17,500 | SGD 20,000-30,000 | ~55,000 | 30% | 68% | 42-46 | 85% | Hybrid | Low | Medium |
| Principal Infrastructure Lead | SGD 7,000-9,500 | SGD 15,000-22,000 | SGD 25,000-38,000 | SGD 8,000-11,000 | SGD 17,500-26,000 | SGD 30,000-46,000 | ~25,000 | 18% | 68% | 42-47 | 90% | Hybrid/On-site | Low | High |
| SecOps Director | SGD 8,000-11,000 | SGD 18,000-25,000 | SGD 30,000-45,000 | SGD 9,200-13,000 | SGD 21,000-30,000 | SGD 36,000-54,000 | ~20,000 | 12% | 70% | 42-47 | 92% | On-site/Hybrid | Low | High |
| Core UI Framework Author | SGD 5,500-7,500 | SGD 11,000-16,000 | SGD 18,000-26,000 | SGD 6,300-8,800 | SGD 12,500-18,500 | SGD 21,000-31,000 | ~15,000 | 40% | 66% | 42-46 | 80% | Hybrid/Remote | Low | Medium |
| Chief Technology Officer | SGD 12,000-18,000 | SGD 25,000-35,000 | SGD 45,000-65,000 | SGD 14,000-21,500 | SGD 30,000-42,000 | SGD 54,000-78,000 | ~12,000 | 10% | 65% | 48-55 | 95% | On-site/Hybrid | Low | High |

**Singapore Tech Context:** Culture: meritocratic, hybrid-forward, English-first. WLB ranked #1 in Asia but high unpaid OT reality. MAS TRM and PDPA compliance are major factors. High cost of living creates salary pressure. Common challenges: fintech complexity, MAS AI governance guidelines, 24/7 on-call for SRE/DevOps, senior engineer retention.

---

### THAILAND (Currency: THB)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Frontend Developer | THB 20,000-30,000 | THB 45,000-65,000 | THB 70,000-100,000 | THB 26,000-40,000 | THB 58,000-85,000 | THB 93,000-135,000 | ~120,000 | 35% | 62% | 45-48 | 80% | Hybrid | Low | Medium |
| Junior Backend Developer | THB 22,000-32,000 | THB 45,000-70,000 | THB 75,000-110,000 | THB 28,000-43,000 | THB 58,000-92,000 | THB 100,000-148,000 | ~95,000 | 40% | 60% | 45-48 | 78% | Hybrid | Low | Medium |
| QA Automation Engineer | THB 20,000-28,000 | THB 40,000-60,000 | THB 65,000-95,000 | THB 26,000-38,000 | THB 52,000-80,000 | THB 86,000-128,000 | ~40,000 | 30% | 63% | 45 | 82% | Hybrid | Low | Medium |
| Systems Analyst | THB 20,000-30,000 | THB 42,000-65,000 | THB 70,000-100,000 | THB 26,000-40,000 | THB 54,000-85,000 | THB 92,000-135,000 | ~60,000 | 25% | 62% | 45-48 | 80% | Hybrid/On-site | Low | Medium |
| Database Administrator | THB 22,000-32,000 | THB 45,000-68,000 | THB 75,000-110,000 | THB 28,000-43,000 | THB 58,000-90,000 | THB 100,000-148,000 | ~45,000 | 28% | 63% | 45 | 83% | Hybrid/On-site | Low | Medium |
| Cloud Support Specialist | THB 22,000-30,000 | THB 45,000-70,000 | THB 75,000-110,000 | THB 28,000-40,000 | THB 58,000-92,000 | THB 100,000-148,000 | ~70,000 | 20% | 65% | 45-48 | 85% | Hybrid/Remote | Low | Medium |
| Full Stack Engineer | THB 25,000-38,000 | THB 55,000-80,000 | THB 90,000-130,000 | THB 33,000-52,000 | THB 72,000-108,000 | THB 120,000-175,000 | ~110,000 | 38% | 60% | 45-50 | 80% | Hybrid | Low | High |
| Mobile Applications Engineer | THB 22,000-35,000 | THB 50,000-75,000 | THB 80,000-120,000 | THB 29,000-47,000 | THB 65,000-100,000 | THB 107,000-162,000 | ~85,000 | 42% | 60% | 45-50 | 78% | Hybrid | Low | High |
| DevOps Build Engineer | THB 28,000-40,000 | THB 60,000-90,000 | THB 95,000-140,000 | THB 37,000-54,000 | THB 79,000-120,000 | THB 126,000-189,000 | ~60,000 | 25% | 62% | 45-50 | 85% | Hybrid | Low | High |
| Information Security Officer | THB 35,000-55,000 | THB 80,000-120,000 | THB 120,000-180,000 | THB 46,000-74,000 | THB 105,000-160,000 | THB 160,000-243,000 | ~75,000 | 15% | 63% | 45-50 | 88% | Hybrid/On-site | Low | High |
| Solutions Architect | THB 40,000-60,000 | THB 85,000-130,000 | THB 130,000-200,000 | THB 53,000-81,000 | THB 112,000-175,000 | THB 173,000-270,000 | ~65,000 | 20% | 62% | 45-50 | 86% | Hybrid | Low | High |
| AI Integration Specialist | THB 38,000-55,000 | THB 80,000-120,000 | THB 120,000-180,000 | THB 50,000-74,000 | THB 105,000-160,000 | THB 160,000-243,000 | ~50,000 | 45% | 62% | 45-50 | 81% | Hybrid/Remote | Low | High |
| Site Reliability Architect | THB 40,000-60,000 | THB 85,000-125,000 | THB 130,000-190,000 | THB 53,000-81,000 | THB 112,000-168,000 | THB 173,000-257,000 | ~40,000 | 22% | 60% | 45-52 | 85% | Hybrid/On-site | Low | High |
| Data Platform Engineer | THB 35,000-55,000 | THB 75,000-115,000 | THB 115,000-170,000 | THB 46,000-74,000 | THB 98,000-152,000 | THB 152,000-230,000 | ~55,000 | 30% | 62% | 45-48 | 83% | Hybrid | Low | Medium |
| Principal Infrastructure Lead | THB 50,000-75,000 | THB 100,000-150,000 | THB 160,000-230,000 | THB 66,000-101,000 | THB 133,000-202,000 | THB 213,000-311,000 | ~25,000 | 18% | 62% | 45-50 | 88% | Hybrid/On-site | Low | High |
| SecOps Director | THB 60,000-85,000 | THB 120,000-180,000 | THB 180,000-280,000 | THB 80,000-115,000 | THB 159,000-243,000 | THB 240,000-378,000 | ~20,000 | 12% | 63% | 45-50 | 90% | On-site | Low | High |
| Core UI Framework Author | THB 35,000-55,000 | THB 75,000-115,000 | THB 115,000-170,000 | THB 46,000-74,000 | THB 98,000-152,000 | THB 152,000-230,000 | ~15,000 | 40% | 62% | 45-48 | 78% | Hybrid/Remote | Low | Medium |
| Chief Technology Officer | THB 80,000-120,000 | THB 180,000-280,000 | THB 300,000-500,000 | THB 107,000-162,000 | THB 240,000-378,000 | THB 400,000-675,000 | ~12,000 | 10% | 60% | 48-58 | 92% | On-site/Hybrid | Low | High |

**Thailand Tech Context:** Culture: hierarchical, relationship-driven, hybrid growing. Bangkok is the #1 digital nomad city globally (2025). Thai Labour Protection Act caps statutory hours at 48/wk. Common challenges: Bangkok commute stress, senior-approval culture slowing architecture sign-off, limited local DevOps/SRE talent, PDPA enforcement. Hours tend to run 45-50+ for senior roles.

---

### VIETNAM (Currency: VND millions/month)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Frontend Developer | VND 8-15M | VND 20-35M | VND 40-65M | VND 12-22M | VND 28-50M | VND 58-95M | ~120,000 | 35% | 63% | 40-44 | 78% | Hybrid | Low | Medium |
| Junior Backend Developer | VND 10-18M | VND 22-40M | VND 45-70M | VND 14-26M | VND 32-58M | VND 65-102M | ~95,000 | 40% | 61% | 40-45 | 75% | Hybrid | Low | Medium |
| QA Automation Engineer | VND 8-14M | VND 18-32M | VND 35-60M | VND 11-20M | VND 25-46M | VND 50-87M | ~40,000 | 30% | 63% | 40 | 78% | Hybrid | Low | Medium |
| Systems Analyst | VND 8-15M | VND 18-32M | VND 35-60M | VND 11-22M | VND 25-46M | VND 50-87M | ~60,000 | 25% | 62% | 40-44 | 75% | Hybrid/On-site | Low | Medium |
| Database Administrator | VND 10-16M | VND 20-35M | VND 40-65M | VND 14-23M | VND 28-50M | VND 58-95M | ~45,000 | 28% | 63% | 40 | 78% | Hybrid/On-site | Low | Medium |
| Cloud Support Specialist | VND 10-16M | VND 20-35M | VND 40-65M | VND 14-23M | VND 28-50M | VND 58-95M | ~70,000 | 20% | 65% | 40-44 | 80% | Hybrid/Remote | Low | Medium |
| Full Stack Engineer | VND 12-22M | VND 28-50M | VND 55-90M | VND 17-32M | VND 40-72M | VND 80-130M | ~110,000 | 38% | 61% | 40-46 | 75% | Hybrid | Low | High |
| Mobile Applications Engineer | VND 10-20M | VND 25-45M | VND 50-85M | VND 14-29M | VND 36-65M | VND 72-123M | ~85,000 | 42% | 61% | 40-46 | 72% | Hybrid | Low | High |
| DevOps Build Engineer | VND 15-28M | VND 30-55M | VND 55-90M | VND 21-40M | VND 43-80M | VND 80-130M | ~60,000 | 25% | 61% | 40-46 | 78% | Hybrid | Low | High |
| Information Security Officer | VND 20-40M | VND 50-90M | VND 90-160M | VND 28-58M | VND 72-130M | VND 130-232M | ~75,000 | 15% | 62% | 40-46 | 80% | Hybrid/On-site | Low | High |
| Solutions Architect | VND 25-45M | VND 55-100M | VND 100-180M | VND 36-65M | VND 80-145M | VND 145-261M | ~65,000 | 20% | 62% | 40-46 | 78% | Hybrid | Low | High |
| AI Integration Specialist | VND 25-45M | VND 55-100M | VND 100-175M | VND 36-65M | VND 80-145M | VND 145-254M | ~50,000 | 45% | 61% | 40-46 | 75% | Hybrid/Remote | Low | High |
| Site Reliability Architect | VND 28-50M | VND 60-110M | VND 110-190M | VND 40-72M | VND 87-160M | VND 160-276M | ~40,000 | 22% | 60% | 40-48 | 78% | Hybrid/On-site | Low | High |
| Data Platform Engineer | VND 20-38M | VND 45-85M | VND 85-150M | VND 28-55M | VND 65-123M | VND 123-218M | ~55,000 | 30% | 62% | 40-45 | 78% | Hybrid | Low | Medium |
| Principal Infrastructure Lead | VND 35-60M | VND 80-140M | VND 150-250M | VND 50-87M | VND 116-203M | VND 218-363M | ~25,000 | 18% | 61% | 40-47 | 80% | Hybrid/On-site | Low | High |
| SecOps Director | VND 45-80M | VND 100-180M | VND 180-300M | VND 65-116M | VND 145-261M | VND 261-435M | ~20,000 | 12% | 62% | 40-48 | 82% | On-site/Hybrid | Low | High |
| Core UI Framework Author | VND 25-45M | VND 55-95M | VND 95-160M | VND 36-65M | VND 80-138M | VND 138-232M | ~15,000 | 40% | 62% | 40-45 | 72% | Hybrid/Remote | Low | Medium |
| Chief Technology Officer | VND 60-120M | VND 150-280M | VND 300-600M | VND 87-174M | VND 218-406M | VND 435-870M | ~12,000 | 10% | 60% | 47-56 | 85% | On-site/Hybrid | Low | High |

**Vietnam Tech Context:** WLB ranked 37/60 globally -- best among lower-income SEA nations. Culture: hierarchical, consensus-driven, midday rest common. HCMC commands a salary premium over Hanoi. Key challenges: PDPD law enforcement, $716M annual cybercrime cost, limited expert pool for security/SRE, consensus-based sign-off slowing architecture decisions, government AI strategy uncertainty. Data sourced from itviec 2025-2026, vietnamdevs 2026, NodeFlair VN.

---

### PHILIPPINES (Currency: PHP)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Frontend Developer | PHP 20,000-35,000 | PHP 50,000-80,000 | PHP 90,000-150,000 | PHP 28,000-50,000 | PHP 70,000-115,000 | PHP 130,000-218,000 | ~120,000 | 35% | 52% | 40-45 | 78% | Hybrid/Remote | Low | Medium |
| Junior Backend Developer | PHP 22,000-38,000 | PHP 55,000-90,000 | PHP 100,000-170,000 | PHP 31,000-55,000 | PHP 78,000-130,000 | PHP 145,000-247,000 | ~95,000 | 40% | 50% | 40-45 | 75% | Hybrid/Remote | Low | Medium |
| QA Automation Engineer | PHP 20,000-35,000 | PHP 45,000-75,000 | PHP 80,000-130,000 | PHP 28,000-50,000 | PHP 63,000-108,000 | PHP 116,000-189,000 | ~40,000 | 30% | 54% | 40 | 78% | Hybrid/Remote | Low | Medium |
| Systems Analyst | PHP 20,000-35,000 | PHP 45,000-75,000 | PHP 85,000-140,000 | PHP 28,000-50,000 | PHP 63,000-108,000 | PHP 123,000-203,000 | ~60,000 | 25% | 52% | 40-45 | 75% | Hybrid | Low | Medium |
| Database Administrator | PHP 22,000-38,000 | PHP 50,000-80,000 | PHP 90,000-150,000 | PHP 31,000-55,000 | PHP 70,000-116,000 | PHP 130,000-218,000 | ~45,000 | 28% | 53% | 40 | 78% | Hybrid | Low | Medium |
| Cloud Support Specialist | PHP 22,000-35,000 | PHP 50,000-80,000 | PHP 90,000-140,000 | PHP 31,000-50,000 | PHP 70,000-116,000 | PHP 130,000-203,000 | ~70,000 | 20% | 55% | 40-45 | 80% | Hybrid/Remote | Low | Medium |
| Full Stack Engineer | PHP 25,000-45,000 | PHP 60,000-100,000 | PHP 110,000-200,000 | PHP 35,000-65,000 | PHP 85,000-145,000 | PHP 160,000-290,000 | ~110,000 | 38% | 50% | 40-47 | 75% | Hybrid/Remote | Low | High |
| Mobile Applications Engineer | PHP 22,000-40,000 | PHP 55,000-90,000 | PHP 100,000-180,000 | PHP 31,000-58,000 | PHP 78,000-130,000 | PHP 145,000-261,000 | ~85,000 | 42% | 50% | 40-47 | 72% | Hybrid/Remote | Low | High |
| DevOps Build Engineer | PHP 30,000-55,000 | PHP 80,000-120,000 | PHP 140,000-200,000 | PHP 42,000-80,000 | PHP 113,000-174,000 | PHP 203,000-290,000 | ~60,000 | 25% | 50% | 40-48 | 78% | Hybrid/Remote | Low | High |
| Information Security Officer | PHP 50,000-80,000 | PHP 120,000-165,000 | PHP 150,000-250,000 | PHP 70,000-116,000 | PHP 170,000-239,000 | PHP 218,000-363,000 | ~75,000 | 15% | 52% | 40-47 | 82% | Hybrid/On-site | Low | High |
| Solutions Architect | PHP 55,000-90,000 | PHP 120,000-180,000 | PHP 200,000-300,000 | PHP 78,000-130,000 | PHP 170,000-261,000 | PHP 290,000-435,000 | ~65,000 | 20% | 52% | 40-47 | 80% | Hybrid | Low | High |
| AI Integration Specialist | PHP 50,000-80,000 | PHP 110,000-160,000 | PHP 180,000-280,000 | PHP 70,000-116,000 | PHP 156,000-232,000 | PHP 261,000-406,000 | ~50,000 | 45% | 50% | 40-47 | 75% | Hybrid/Remote | Low | High |
| Site Reliability Architect | PHP 55,000-90,000 | PHP 120,000-180,000 | PHP 200,000-300,000 | PHP 78,000-130,000 | PHP 170,000-261,000 | PHP 290,000-435,000 | ~40,000 | 22% | 50% | 40-50 | 78% | Hybrid/On-site | Low | High |
| Data Platform Engineer | PHP 45,000-75,000 | PHP 100,000-160,000 | PHP 170,000-280,000 | PHP 63,000-108,000 | PHP 142,000-232,000 | PHP 247,000-406,000 | ~55,000 | 30% | 52% | 40-47 | 78% | Hybrid/Remote | Low | Medium |
| Principal Infrastructure Lead | PHP 60,000-100,000 | PHP 140,000-200,000 | PHP 230,000-350,000 | PHP 85,000-145,000 | PHP 198,000-290,000 | PHP 334,000-508,000 | ~25,000 | 18% | 50% | 40-48 | 80% | Hybrid/On-site | Low | High |
| SecOps Director | PHP 80,000-120,000 | PHP 150,000-250,000 | PHP 280,000-450,000 | PHP 113,000-174,000 | PHP 213,000-363,000 | PHP 406,000-653,000 | ~20,000 | 12% | 52% | 40-48 | 82% | On-site/Hybrid | Low | High |
| Core UI Framework Author | PHP 45,000-75,000 | PHP 100,000-150,000 | PHP 170,000-260,000 | PHP 63,000-108,000 | PHP 142,000-218,000 | PHP 247,000-377,000 | ~15,000 | 40% | 52% | 40-46 | 72% | Hybrid/Remote | Low | Medium |
| Chief Technology Officer | PHP 120,000-200,000 | PHP 300,000-500,000 | PHP 600,000-900,000 | PHP 170,000-290,000 | PHP 425,000-725,000 | PHP 870,000-1,305,000 | ~12,000 | 10% | 48% | 47-58 | 85% | On-site/Hybrid | Low | High |

**Philippines Tech Context:** WLB ranked 59/60 globally (2024 Remote Index) -- worst in SEA. Culture: English-first, BPO-influenced, strong remote culture. Manila/BGC-centric talent market. Key issues: 8,800+ daily cyberattacks on Philippine organisations, AI disruption threatening the BPO sector, typhoon-season connectivity outages, low pay vs global peers causing talent drain abroad. Data sourced from JobStreet PH, SecondTalent 2026, Nucamp 2025.

---

### LAOS (Currency: LAK millions/month)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Frontend Developer | LAK 4,000,000–7,000,000 | LAK 10,000,000–16,000,000 | LAK 18,000,000–28,000,000 | LAK 4,500,000–7,500,000 | LAK 12,000,000–18,000,000 | LAK 20,000,000–30,000,000 | ~3,000 | 35% | 65% | 45–48 | 70% | On-site/Hybrid | Low |
| Junior Backend Developer | LAK 4,000,000–7,000,000 | LAK 10,000,000–17,000,000 | LAK 20,000,000–32,000,000 | LAK 4,500,000–8,000,000 | LAK 12,000,000–20,000,000 | LAK 22,000,000–35,000,000 | ~2,500 | 40% | 63% | 45–48 | 68% | On-site/Hybrid | Low |
| QA Automation Engineer | LAK 3,600,000–6,000,000 | LAK 9,000,000–15,000,000 | LAK 16,000,000–26,000,000 | LAK 4,000,000–6,500,000 | LAK 10,000,000–16,000,000 | LAK 18,000,000–28,000,000 | ~1,000 | 30% | 65% | 45 | 70% | On-site | Low |
| Systems Analyst | LAK 4,000,000–7,000,000 | LAK 10,000,000–16,000,000 | LAK 18,000,000–28,000,000 | LAK 4,500,000–7,500,000 | LAK 12,000,000–18,000,000 | LAK 20,000,000–30,000,000 | ~1,500 | 25% | 65% | 45–48 | 72% | On-site | Low |
| Database Administrator | LAK 4,000,000–7,000,000 | LAK 10,000,000–17,000,000 | LAK 19,000,000–30,000,000 | LAK 4,500,000–8,000,000 | LAK 12,000,000–20,000,000 | LAK 22,000,000–35,000,000 | ~1,200 | 28% | 65% | 45 | 72% | On-site | Low |
| Cloud Support Specialist | LAK 4,000,000–6,400,000 | LAK 10,000,000–16,000,000 | LAK 18,000,000–28,000,000 | LAK 4,500,000–7,000,000 | LAK 12,000,000–18,000,000 | LAK 20,000,000–30,000,000 | ~1,500 | 20% | 66% | 45–48 | 70% | Hybrid | Low |
| Full Stack Engineer | LAK 5,000,000–8,000,000 | LAK 12,000,000–20,000,000 | LAK 24,000,000–40,000,000 | LAK 6,000,000–9,000,000 | LAK 14,000,000–22,000,000 | LAK 26,000,000–42,000,000 | ~3,000 | 38% | 63% | 45–48 | 68% | On-site/Hybrid | Medium |
| Mobile Applications Engineer | LAK 4,400,000–7,600,000 | LAK 11,000,000–19,000,000 | LAK 22,000,000–36,000,000 | LAK 5,000,000–8,000,000 | LAK 12,000,000–20,000,000 | LAK 24,000,000–38,000,000 | ~2,000 | 42% | 63% | 45–48 | 65% | On-site/Hybrid | Medium |
| DevOps Build Engineer | LAK 5,000,000–8,000,000 | LAK 13,000,000–22,000,000 | LAK 26,000,000–44,000,000 | LAK 6,000,000–9,000,000 | LAK 15,000,000–24,000,000 | LAK 28,000,000–46,000,000 | ~1,500 | 25% | 63% | 45–48 | 68% | Hybrid | Medium |
| Information Security Officer | LAK 6,000,000–10,000,000 | LAK 16,000,000–26,000,000 | LAK 30,000,000–50,000,000 | LAK 7,000,000–11,000,000 | LAK 18,000,000–28,000,000 | LAK 32,000,000–52,000,000 | ~1,000 | 15% | 65% | 45–48 | 75% | On-site | Medium |
| Solutions Architect | LAK 7,000,000–12,000,000 | LAK 18,000,000–30,000,000 | LAK 36,000,000–56,000,000 | LAK 8,000,000–13,000,000 | LAK 20,000,000–32,000,000 | LAK 38,000,000–60,000,000 | ~1,200 | 20% | 64% | 45–48 | 70% | On-site/Hybrid | Medium |
| AI Integration Specialist | LAK 7,000,000–12,000,000 | LAK 18,000,000–30,000,000 | LAK 36,000,000–56,000,000 | LAK 8,000,000–13,000,000 | LAK 20,000,000–32,000,000 | LAK 38,000,000–60,000,000 | ~800 | 45% | 62% | 45–48 | 65% | Hybrid/Remote | Medium |
| Site Reliability Architect | LAK 8,000,000–13,000,000 | LAK 20,000,000–32,000,000 | LAK 40,000,000–60,000,000 | LAK 9,000,000–14,000,000 | LAK 22,000,000–35,000,000 | LAK 42,000,000–65,000,000 | ~600 | 22% | 63% | 45–50 | 68% | On-site/Hybrid | Medium |
| Data Platform Engineer | LAK 6,000,000–10,000,000 | LAK 16,000,000–26,000,000 | LAK 32,000,000–50,000,000 | LAK 7,000,000–11,000,000 | LAK 18,000,000–28,000,000 | LAK 34,000,000–52,000,000 | ~800 | 30% | 64% | 45–48 | 68% | On-site/Hybrid | Low |
| Principal Infrastructure Lead | LAK 10,000,000–16,000,000 | LAK 24,000,000–40,000,000 | LAK 50,000,000–76,000,000 | LAK 12,000,000–18,000,000 | LAK 28,000,000–44,000,000 | LAK 54,000,000–80,000,000 | ~500 | 18% | 63% | 45–50 | 72% | On-site | Medium |
| SecOps Director | LAK 12,000,000–20,000,000 | LAK 30,000,000–50,000,000 | LAK 60,000,000–90,000,000 | LAK 14,000,000–22,000,000 | LAK 34,000,000–54,000,000 | LAK 64,000,000–96,000,000 | ~300 | 12% | 64% | 45–50 | 75% | On-site | Medium |
| Core UI Framework Author | LAK 7,000,000–12,000,000 | LAK 18,000,000–30,000,000 | LAK 36,000,000–56,000,000 | LAK 8,000,000–13,000,000 | LAK 20,000,000–32,000,000 | LAK 38,000,000–60,000,000 | ~400 | 40% | 63% | 45–48 | 62% | Hybrid/Remote | Low |
| Chief Technology Officer | LAK 16,000,000–24,000,000 | LAK 40,000,000–70,000,000 | LAK 80,000,000–120,000,000 | LAK 18,000,000–28,000,000 | LAK 45,000,000–80,000,000 | LAK 90,000,000–140,000,000 | ~200 | 10% | 65% | 48–55 | 80% | On-site/Hybrid | High |

**Laos Tech Context:** Smallest and most nascent tech sector in this dataset. Vientiane-centric. Culture: collectivist, hierarchical, Buddhist-influenced, on-site dominant. Salaries in LAK (Lao Kip); local employer rates reflect the domestic market while international company rates carry a meaningful premium. Key challenges: very limited local talent pool, nascent DevOps/CI-CD/SRE culture, connectivity and power reliability issues, small enterprise market, most AI/cloud work is outsourced or remote. No WLB global index ranking available. Data sourced from Paylab, worldsalaries, remotepeople 2025.

---

## CROSS-COUNTRY QUICK REFERENCE

### Highest Paying Country by Role (Senior, International Company)
- Frontend/Backend/QA/Systems/DBA/Cloud: **Singapore** (SGD 9,000-16,000)
- Full Stack: **Singapore** SGD 13,000-20,000
- DevOps: **Singapore** SGD 15,000-22,000
- InfoSec Officer: **Singapore** SGD 18,000-28,000
- Solutions Architect: **Singapore** SGD 20,000-27,000
- AI Integration Specialist: **Singapore** SGD 18,000-26,000
- CTO: **Singapore** SGD 45,000-65,000

### Best Work-Life Balance (WLB %)
- Cloud Support Specialist: **Malaysia** 75% > Singapore 72% > Laos 66%
- CTO: **Malaysia** 75% > Singapore 65% > Thailand 60%
- Overall tech sector average: Malaysia leads, Philippines lowest

### Lowest AI Disruption Risk
- SecOps Director: 12% across all countries (lowest risk role)
- CTO: 10% (lowest risk role overall)
- Information Security Officer: 15%

### Highest AI Disruption Risk
- AI Integration Specialist: 45% (highest -- ironic)
- Mobile Applications Engineer: 42%
- Junior Backend Developer: 40%
- Core UI Framework Author: 40%

### Demand Leaders (6-month openings)
- Junior Frontend Developer: ~120,000 across MY/SG/TH/VN/PH (consistent top demand)
- Full Stack Engineer: ~110,000
- Junior Backend Developer: ~95,000
- Mobile Applications Engineer: ~85,000
- Laos has the smallest demand numbers by far across all roles

### Work Mode Norms
- **Singapore & Malaysia:** Predominantly Hybrid
- **Vietnam:** Hybrid, HCMC-driven, midday rest culture
- **Thailand:** Hybrid growing, Bangkok-centric, hierarchical approval
- **Philippines:** Hybrid/Remote-first, BPO-influenced, English-first
- **Laos:** On-site dominant, with hybrid emerging only for senior/remote roles

---

## RESPONSE GUIDELINES

- Always specify the country and whether salary is for a **local** or **international** company
- When comparing countries, convert to a common reference point if helpful (e.g., USD equivalent)
- Laos salaries are already in USD; all others are in local currency
- WLB % = self-reported work-life balance satisfaction score
- Stability % = job security / role stability rating
- AI Risk % = estimated probability of significant AI disruption to this role within 5 years
- Demand = approximate number of open roles in the country over a 6-month period
- Career progressions show the standard linear path; pivot paths show lateral moves available at any stage
- When users ask "which country is best for X role," factor in salary, WLB, demand, stability, and AI risk together -- not salary alone
# CareerOS -- Codex System Prompt: Business & Finance Sector

---

## CAREER PROGRESSION PATHS (All 18 Business & Finance Roles)

### 1. Junior Accountant
0-2 yrs: Junior Accountant -> 2-4 yrs: Staff Accountant -> 4-7 yrs: Senior Accountant -> 7-10 yrs: Accounting Manager / Controller -> 10+ yrs: CFO / VP of Finance
**Pivot paths:** Financial Analyst * Tax Accountant * Auditor * Treasury Analyst

### 2. Sales Rep
0-2 yrs: Sales Development Rep (SDR) -> 2-4 yrs: Account Executive -> 4-7 yrs: Senior Account Executive -> 7-10 yrs: Sales Manager / Regional Director -> 10+ yrs: VP of Sales / Chief Revenue Officer
**Pivot paths:** Account Manager * Business Development * Product Manager * Customer Success

### 3. Financial Analyst
0-2 yrs: Junior Financial Analyst -> 2-4 yrs: Financial Analyst -> 4-7 yrs: Senior Financial Analyst -> 7-10 yrs: Finance Manager / FP&A Lead -> 10+ yrs: VP of Finance / CFO
**Pivot paths:** Investment Analyst * BI Developer * Treasury Analyst * Strategy Consultant

### 4. Tax Accountant
0-2 yrs: Junior Tax Accountant -> 2-4 yrs: Tax Accountant -> 4-7 yrs: Senior Tax Accountant -> 7-10 yrs: Tax Manager -> 10+ yrs: Tax Director / VP of Tax
**Pivot paths:** Corporate Attorney * Financial Analyst * Auditor * CFO

### 5. Logistics Planner
0-2 yrs: Logistics Coordinator -> 2-4 yrs: Logistics Planner -> 4-7 yrs: Senior Logistics Planner -> 7-10 yrs: Supply Chain Manager -> 10+ yrs: Global Supply Chain Head / VP Logistics
**Pivot paths:** Procurement Officer * Operations Manager * Demand Planner * BI Analyst

### 6. BI Developer
0-2 yrs: Junior BI Developer / Data Analyst -> 2-4 yrs: BI Developer -> 4-7 yrs: Senior BI Developer -> 7-10 yrs: BI Architect / Analytics Manager -> 10+ yrs: Head of Analytics / Chief Data Officer
**Pivot paths:** Data Engineer * Financial Analyst * Product Analyst * Data Scientist

### 7. Associate Product Manager
0-2 yrs: Associate Product Manager (APM) -> 2-4 yrs: Product Manager -> 4-7 yrs: Senior Product Manager -> 7-10 yrs: Group Product Manager / Director of PM -> 10+ yrs: VP of Product / Chief Product Officer
**Pivot paths:** UX Designer * Strategy Consultant * Entrepreneur * Business Analyst

### 8. Account Manager
0-2 yrs: Junior Account Manager -> 2-4 yrs: Account Manager -> 4-7 yrs: Senior Account Manager -> 7-10 yrs: Key Account Director -> 10+ yrs: VP of Account Management / Sales Director
**Pivot paths:** Sales Rep * Customer Success Manager * Business Development * Product Manager

### 9. Procurement Officer
0-2 yrs: Procurement Analyst -> 2-4 yrs: Procurement Officer -> 4-7 yrs: Senior Procurement Specialist -> 7-10 yrs: Procurement Manager -> 10+ yrs: Head of Procurement / Chief Procurement Officer
**Pivot paths:** Logistics Planner * Supply Chain Manager * Contract Manager * Operations Director

### 10. Treasury Analyst
0-2 yrs: Junior Treasury Analyst -> 2-4 yrs: Treasury Analyst -> 4-7 yrs: Senior Treasury Analyst -> 7-10 yrs: Treasury Manager -> 10+ yrs: VP of Treasury / Treasurer
**Pivot paths:** Financial Analyst * Risk Manager * Investment Associate * CFO

### 11. Corporate Attorney
0-2 yrs: Legal Associate / Junior Counsel -> 2-4 yrs: Corporate Attorney -> 4-7 yrs: Senior Corporate Attorney -> 7-10 yrs: Partner / General Counsel -> 10+ yrs: Chief Legal Officer / Managing Partner
**Pivot paths:** Compliance Officer * M&A Advisor * Risk Manager * Strategy Consultant

### 12. Investment Associate
0-2 yrs: Investment Analyst -> 2-4 yrs: Investment Associate -> 4-7 yrs: Senior Associate / VP (Investment) -> 7-10 yrs: Investment Director / Principal -> 10+ yrs: Managing Director / CIO
**Pivot paths:** M&A Advisory Lead * Strategy Consultant * Portfolio Manager * CFO

### 13. Strategy Consultant
0-2 yrs: Business Analyst / Junior Consultant -> 2-4 yrs: Strategy Consultant -> 4-7 yrs: Senior Consultant / Engagement Manager -> 7-10 yrs: Principal / Associate Partner -> 10+ yrs: Partner / Managing Director
**Pivot paths:** Product Director * CFO * M&A Advisory Lead * CEO

### 14. Risk Manager
0-2 yrs: Risk Analyst -> 2-4 yrs: Risk Manager -> 4-7 yrs: Senior Risk Manager -> 7-10 yrs: Head of Risk -> 10+ yrs: Chief Risk Officer (CRO)
**Pivot paths:** Compliance Officer * Internal Auditor * Strategy Consultant * CFO

### 15. Product Director
0-2 yrs: Product Manager -> 2-4 yrs: Senior Product Manager -> 4-7 yrs: Group Product Manager -> 7-10 yrs: Product Director -> 10+ yrs: VP of Product / Chief Product Officer
**Pivot paths:** Strategy Consultant * CEO * General Manager * CTO

### 16. Global Supply Chain Head
0-2 yrs: Supply Chain Analyst -> 2-4 yrs: Supply Chain Manager -> 4-7 yrs: Senior Supply Chain Manager -> 7-10 yrs: Director of Supply Chain -> 10+ yrs: Global Supply Chain Head / VP
**Pivot paths:** Logistics Director * Operations VP * Procurement Director * COO

### 17. M&A Advisory Lead
0-2 yrs: M&A Analyst -> 2-4 yrs: M&A Associate -> 4-7 yrs: M&A Manager / Senior Associate -> 7-10 yrs: M&A Director / Vice President -> 10+ yrs: M&A Advisory Lead / Managing Director
**Pivot paths:** Investment Associate * Strategy Consultant * Corporate Attorney * CFO

### 18. Chief Financial Officer (CFO)
0-2 yrs: Financial Analyst / Junior Accountant -> 2-4 yrs: Finance Manager / Controller -> 4-7 yrs: VP of Finance / Finance Director -> 7-10 yrs: SVP of Finance / Deputy CFO -> 10+ yrs: Chief Financial Officer (CFO)
**Pivot paths:** CEO * Chief Risk Officer * Board Director * Strategy Advisor

---

## SALARY & MARKET DATA BY COUNTRY

---

### MALAYSIA (Currency: MYR / RM)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Accountant | RM 2,500-3,200 | RM 4,000-5,500 | RM 7,000-9,000 | RM 3,000-3,800 | RM 5,500-7,000 | RM 9,000-12,000 | ~90,000 | 40% | 70% | 40 | 82% | Hybrid | Low | Medium |
| Sales Rep | RM 2,800-3,800 | RM 5,000-6,500 | RM 9,000-12,000 | RM 3,500-4,500 | RM 6,500-8,500 | RM 12,000-15,000 | ~120,000 | 35% | 65% | 45 | 78% | Hybrid/On-site | Frequent | High |
| Financial Analyst | RM 3,500-4,500 | RM 8,000-10,000 | RM 15,000-18,000 | RM 4,500-5,500 | RM 10,000-13,000 | RM 18,000-22,000 | ~75,000 | 30% | 68% | 45 | 80% | Hybrid | Occasional | High |
| Tax Accountant | RM 3,500-4,200 | RM 7,000-8,500 | RM 12,000-15,000 | RM 4,200-5,000 | RM 8,500-10,500 | RM 15,000-18,000 | ~60,000 | 28% | 70% | 40 | 83% | Hybrid | Low | Medium |
| Logistics Planner | RM 3,000-3,800 | RM 6,000-7,500 | RM 10,000-12,000 | RM 3,800-4,500 | RM 7,500-9,500 | RM 12,000-15,000 | ~70,000 | 25% | 66% | 45 | 78% | Hybrid/On-site | Occasional | High |
| BI Developer | RM 4,000-4,800 | RM 9,000-11,000 | RM 15,000-18,000 | RM 4,800-5,500 | RM 11,000-13,000 | RM 18,000-20,000 | ~50,000 | 40% | 68% | 40-45 | 82% | Hybrid/Remote | Low | Medium |
| Assoc. Product Manager | RM 3,500-4,200 | RM 6,000-7,500 | RM 12,000-15,000 | RM 4,200-5,000 | RM 7,500-9,500 | RM 15,000-18,000 | ~35,000 | 38% | 67% | 40-45 | 78% | Hybrid | Low | Medium |
| Account Manager | RM 4,000-4,800 | RM 7,000-9,000 | RM 12,000-15,000 | RM 4,800-5,500 | RM 9,000-11,000 | RM 15,000-18,000 | ~85,000 | 32% | 68% | 45 | 80% | Hybrid | Occasional | High |
| Procurement Officer | RM 3,000-3,800 | RM 6,000-7,500 | RM 10,000-12,000 | RM 3,800-4,500 | RM 7,500-9,500 | RM 12,000-15,000 | ~50,000 | 28% | 70% | 40 | 82% | Hybrid/On-site | Occasional | Medium |
| Treasury Analyst | RM 4,000-4,800 | RM 8,000-10,000 | RM 15,000-18,000 | RM 4,800-5,500 | RM 10,000-12,000 | RM 18,000-20,000 | ~40,000 | 25% | 69% | 40-45 | 85% | Hybrid | Low | Medium |
| Corporate Attorney | RM 5,000-6,000 | RM 12,000-15,000 | RM 20,000-25,000 | RM 6,000-7,000 | RM 15,000-18,000 | RM 25,000-30,000 | ~30,000 | 20% | 72% | 45 | 88% | On-site/Hybrid | Occasional | High |
| Investment Associate | RM 4,000-5,000 | RM 8,000-10,000 | RM 15,000-18,000 | RM 5,000-6,000 | RM 10,000-12,000 | RM 18,000-20,000 | ~25,000 | 30% | 68% | 45 | 80% | Hybrid | Occasional | High |
| Strategy Consultant | RM 5,000-6,000 | RM 12,000-15,000 | RM 20,000-25,000 | RM 6,000-7,000 | RM 15,000-18,000 | RM 25,000-30,000 | ~40,000 | 35% | 65% | 45-50 | 78% | Hybrid | Frequent | High |
| Risk Manager | RM 4,500-5,500 | RM 10,000-12,000 | RM 18,000-22,000 | RM 5,500-6,500 | RM 12,000-15,000 | RM 22,000-25,000 | ~35,000 | 25% | 70% | 45 | 82% | Hybrid | Occasional | High |
| Product Director | RM 8,000-10,000 | RM 18,000-22,000 | RM 30,000-35,000 | RM 10,000-12,000 | RM 22,000-25,000 | RM 35,000-40,000 | ~20,000 | 22% | 70% | 45-50 | 88% | Hybrid | Occasional | High |
| Global Supply Chain Head | RM 10,000-12,000 | RM 25,000-30,000 | RM 40,000-50,000 | RM 12,000-15,000 | RM 30,000-35,000 | RM 50,000-60,000 | ~15,000 | 20% | 68% | 50 | 85% | Hybrid/On-site | Frequent | High |
| M&A Advisory Lead | RM 12,000-15,000 | RM 25,000-30,000 | RM 40,000-50,000 | RM 15,000-18,000 | RM 30,000-35,000 | RM 50,000-60,000 | ~12,000 | 18% | 65% | 50 | 85% | On-site/Hybrid | Frequent | High |
| Chief Financial Officer | RM 15,000-20,000 | RM 40,000-50,000 | RM 70,000-90,000 | RM 20,000-25,000 | RM 50,000-60,000 | RM 90,000-100,000+ | ~10,000 | 15% | 72% | 50 | 90% | Hybrid/On-site | Frequent | High |

**Malaysia B&F Context:** Regulatory bodies: BNM (Bank Negara Malaysia), SC (Securities Commission), SST. Key compliance: e-invoicing rollout, SST changes, PDPA. Strong demand in Sales Rep (~120,000) and Junior Accountant (~90,000). CFO has best stability (90%) and WLB (72%). M&A activity is growing but deal flow is smaller vs Singapore. Common challenge: balancing growth with regulatory compliance.

---

### SINGAPORE (Currency: SGD)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Accountant | SGD 2,800-3,500 | SGD 4,500-6,000 | SGD 7,000-10,000 | SGD 3,500-4,500 | SGD 6,000-8,000 | SGD 10,000-14,000 | ~18,000 | 38% | 72% | 40 | 85% | Hybrid | Low | Medium |
| Sales Rep | SGD 2,500-3,500 | SGD 4,500-6,500 | SGD 8,000-12,000 | SGD 3,500-4,500 | SGD 6,000-9,000 | SGD 11,000-16,000 | ~25,000 | 33% | 65% | 45 | 78% | Hybrid/On-site | Frequent | High |
| Financial Analyst | SGD 3,500-4,800 | SGD 6,500-9,000 | SGD 10,000-15,000 | SGD 4,500-6,000 | SGD 8,000-12,000 | SGD 14,000-20,000 | ~12,000 | 28% | 70% | 45 | 82% | Hybrid | Occasional | High |
| Tax Accountant | SGD 3,000-4,000 | SGD 5,500-7,500 | SGD 9,000-13,000 | SGD 4,000-5,000 | SGD 7,000-9,500 | SGD 12,000-16,000 | ~8,000 | 25% | 72% | 40 | 85% | Hybrid | Low | Medium |
| Logistics Planner | SGD 2,800-3,800 | SGD 5,000-7,000 | SGD 8,000-12,000 | SGD 3,500-4,500 | SGD 6,500-8,500 | SGD 10,000-14,000 | ~12,000 | 23% | 68% | 45 | 80% | Hybrid/On-site | Occasional | High |
| BI Developer | SGD 4,000-5,500 | SGD 7,500-10,000 | SGD 12,000-17,000 | SGD 5,000-6,500 | SGD 9,000-13,000 | SGD 15,000-22,000 | ~8,000 | 38% | 70% | 40-45 | 83% | Hybrid/Remote | Low | Medium |
| Assoc. Product Manager | SGD 3,500-4,500 | SGD 6,000-8,000 | SGD 10,000-14,000 | SGD 4,500-5,500 | SGD 7,500-10,000 | SGD 13,000-18,000 | ~5,000 | 36% | 68% | 40-45 | 80% | Hybrid | Low | Medium |
| Account Manager | SGD 3,500-4,500 | SGD 6,000-9,000 | SGD 10,000-15,000 | SGD 4,500-5,500 | SGD 8,000-11,000 | SGD 13,000-18,000 | ~18,000 | 30% | 68% | 45 | 80% | Hybrid | Occasional | High |
| Procurement Officer | SGD 3,000-4,000 | SGD 5,500-7,500 | SGD 9,000-13,000 | SGD 3,800-4,800 | SGD 7,000-9,500 | SGD 11,000-15,000 | ~8,000 | 26% | 70% | 40 | 82% | Hybrid/On-site | Occasional | Medium |
| Treasury Analyst | SGD 3,800-5,000 | SGD 7,000-9,500 | SGD 12,000-17,000 | SGD 5,000-6,500 | SGD 9,000-12,000 | SGD 15,000-20,000 | ~5,000 | 23% | 70% | 40-45 | 86% | Hybrid | Low | Medium |
| Corporate Attorney | SGD 5,000-7,000 | SGD 10,000-15,000 | SGD 18,000-28,000 | SGD 6,500-8,500 | SGD 13,000-18,000 | SGD 22,000-35,000 | ~5,000 | 18% | 72% | 45 | 88% | On-site/Hybrid | Occasional | High |
| Investment Associate | SGD 4,500-6,000 | SGD 8,000-11,000 | SGD 13,000-20,000 | SGD 6,000-8,000 | SGD 10,000-14,000 | SGD 18,000-25,000 | ~5,000 | 28% | 68% | 45 | 82% | Hybrid | Occasional | High |
| Strategy Consultant | SGD 5,000-7,000 | SGD 10,000-14,000 | SGD 18,000-28,000 | SGD 7,000-9,000 | SGD 13,000-18,000 | SGD 22,000-35,000 | ~6,000 | 33% | 65% | 45-50 | 80% | Hybrid | Frequent | High |
| Risk Manager | SGD 5,000-7,000 | SGD 9,000-13,000 | SGD 15,000-22,000 | SGD 6,500-8,500 | SGD 11,000-16,000 | SGD 18,000-26,000 | ~6,000 | 22% | 70% | 45 | 85% | Hybrid | Occasional | High |
| Product Director | SGD 9,000-12,000 | SGD 16,000-22,000 | SGD 25,000-35,000 | SGD 12,000-15,000 | SGD 20,000-28,000 | SGD 32,000-45,000 | ~3,000 | 20% | 70% | 45-50 | 88% | Hybrid | Occasional | High |
| Global Supply Chain Head | SGD 10,000-14,000 | SGD 20,000-28,000 | SGD 35,000-50,000 | SGD 14,000-18,000 | SGD 25,000-35,000 | SGD 45,000-65,000 | ~2,000 | 18% | 68% | 50 | 86% | Hybrid/On-site | Frequent | High |
| M&A Advisory Lead | SGD 10,000-14,000 | SGD 20,000-28,000 | SGD 35,000-50,000 | SGD 14,000-18,000 | SGD 25,000-35,000 | SGD 45,000-65,000 | ~2,000 | 16% | 65% | 50 | 86% | On-site/Hybrid | Frequent | High |
| Chief Financial Officer | SGD 12,000-18,000 | SGD 22,000-32,000 | SGD 40,000-60,000 | SGD 16,000-22,000 | SGD 28,000-40,000 | SGD 50,000-80,000 | ~1,500 | 13% | 72% | 50 | 90% | Hybrid/On-site | Frequent | High |

**Singapore B&F Context:** Primary regulators: MAS (Monetary Authority of Singapore), IRAS. GST/IRAS compliance, MAS cyber risk regulations, transfer pricing. Singapore is the regional HQ for most multinationals -- highest international company salary premiums in SEA. Strong M&A deal flow and investment banking activity. CFO at SGD 50,000-80,000 (senior intl) is the top earner. Sales Rep has highest demand (~25,000).

---

### THAILAND (Currency: THB)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Accountant | THB 18,000-25,000 | THB 35,000-50,000 | THB 60,000-85,000 | THB 22,000-30,000 | THB 45,000-65,000 | THB 75,000-110,000 | ~60,000 | 38% | 70% | 40 | 80% | Hybrid | Low | Medium |
| Sales Rep | THB 15,000-22,000 | THB 30,000-45,000 | THB 55,000-85,000 | THB 20,000-28,000 | THB 40,000-60,000 | THB 70,000-105,000 | ~90,000 | 33% | 63% | 45 | 75% | Hybrid/On-site | Frequent | High |
| Financial Analyst | THB 22,000-32,000 | THB 45,000-65,000 | THB 80,000-120,000 | THB 28,000-40,000 | THB 55,000-80,000 | THB 100,000-150,000 | ~35,000 | 28% | 68% | 45 | 80% | Hybrid | Occasional | High |
| Tax Accountant | THB 20,000-28,000 | THB 38,000-55,000 | THB 65,000-95,000 | THB 25,000-35,000 | THB 50,000-70,000 | THB 80,000-120,000 | ~30,000 | 25% | 70% | 40 | 82% | Hybrid | Low | Medium |
| Logistics Planner | THB 18,000-26,000 | THB 35,000-52,000 | THB 60,000-90,000 | THB 22,000-32,000 | THB 45,000-65,000 | THB 75,000-110,000 | ~50,000 | 22% | 65% | 45 | 78% | Hybrid/On-site | Occasional | High |
| BI Developer | THB 25,000-38,000 | THB 50,000-72,000 | THB 80,000-120,000 | THB 32,000-46,000 | THB 65,000-90,000 | THB 100,000-150,000 | ~18,000 | 38% | 68% | 40-45 | 80% | Hybrid/Remote | Low | Medium |
| Assoc. Product Manager | THB 22,000-32,000 | THB 42,000-62,000 | THB 75,000-110,000 | THB 28,000-40,000 | THB 55,000-80,000 | THB 95,000-135,000 | ~12,000 | 36% | 67% | 40-45 | 78% | Hybrid | Low | Medium |
| Account Manager | THB 22,000-32,000 | THB 42,000-62,000 | THB 70,000-105,000 | THB 28,000-40,000 | THB 55,000-80,000 | THB 90,000-130,000 | ~40,000 | 30% | 67% | 45 | 78% | Hybrid | Occasional | High |
| Procurement Officer | THB 20,000-28,000 | THB 38,000-55,000 | THB 65,000-95,000 | THB 25,000-35,000 | THB 50,000-70,000 | THB 80,000-115,000 | ~22,000 | 26% | 68% | 40 | 80% | Hybrid/On-site | Occasional | Medium |
| Treasury Analyst | THB 25,000-36,000 | THB 50,000-72,000 | THB 85,000-125,000 | THB 32,000-45,000 | THB 65,000-90,000 | THB 105,000-155,000 | ~12,000 | 23% | 68% | 40-45 | 83% | Hybrid | Low | Medium |
| Corporate Attorney | THB 35,000-55,000 | THB 70,000-105,000 | THB 130,000-200,000 | THB 45,000-65,000 | THB 85,000-125,000 | THB 160,000-250,000 | ~8,000 | 18% | 70% | 45 | 86% | On-site/Hybrid | Occasional | High |
| Investment Associate | THB 28,000-42,000 | THB 55,000-80,000 | THB 100,000-145,000 | THB 35,000-52,000 | THB 70,000-100,000 | THB 125,000-180,000 | ~8,000 | 28% | 67% | 45 | 80% | Hybrid | Occasional | High |
| Strategy Consultant | THB 35,000-55,000 | THB 70,000-105,000 | THB 130,000-200,000 | THB 45,000-65,000 | THB 85,000-125,000 | THB 160,000-240,000 | ~12,000 | 33% | 65% | 45-50 | 78% | Hybrid | Frequent | High |
| Risk Manager | THB 32,000-48,000 | THB 65,000-95,000 | THB 115,000-170,000 | THB 40,000-60,000 | THB 80,000-115,000 | THB 140,000-210,000 | ~10,000 | 22% | 68% | 45 | 82% | Hybrid | Occasional | High |
| Product Director | THB 80,000-120,000 | THB 150,000-220,000 | THB 280,000-400,000 | THB 100,000-150,000 | THB 190,000-270,000 | THB 350,000-500,000 | ~4,000 | 20% | 68% | 45-50 | 85% | Hybrid | Occasional | High |
| Global Supply Chain Head | THB 100,000-150,000 | THB 200,000-280,000 | THB 380,000-550,000 | THB 130,000-190,000 | THB 250,000-350,000 | THB 480,000-700,000 | ~3,000 | 18% | 67% | 50 | 84% | Hybrid/On-site | Frequent | High |
| M&A Advisory Lead | THB 100,000-150,000 | THB 200,000-280,000 | THB 380,000-550,000 | THB 130,000-190,000 | THB 250,000-350,000 | THB 480,000-700,000 | ~3,000 | 16% | 63% | 50 | 83% | On-site/Hybrid | Frequent | High |
| Chief Financial Officer | THB 120,000-180,000 | THB 250,000-350,000 | THB 450,000-700,000 | THB 160,000-240,000 | THB 320,000-450,000 | THB 580,000-900,000 | ~2,000 | 13% | 70% | 50 | 88% | Hybrid/On-site | Frequent | High |

**Thailand B&F Context:** Regulatory bodies: BOT (Bank of Thailand), SEC, Revenue Department, BOI. Key compliance: VAT/CIT changes, transfer pricing audits, BOI rules for investment. Eastern Seaboard logistics hub. Strong manufacturing supply chain sector. CFO tops the salary range (THB 580,000-900,000 senior intl). Sales Rep highest demand (~90,000). M&A deal cycles are long. Common challenge: Thai corporate hierarchy slowing deal execution.

---

### VIETNAM (Currency: VND millions/month)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Accountant | VND 8-12M | VND 15-22M | VND 28-42M | VND 10-15M | VND 20-30M | VND 38-58M | ~90,000 | 38% | 70% | 40 | 78% | Hybrid | Low | Medium |
| Sales Rep | VND 8-12M | VND 14-22M | VND 28-45M | VND 10-16M | VND 18-28M | VND 35-55M | ~110,000 | 33% | 63% | 45 | 72% | Hybrid/On-site | Frequent | High |
| Financial Analyst | VND 10-16M | VND 20-32M | VND 40-65M | VND 14-20M | VND 28-45M | VND 55-85M | ~50,000 | 28% | 67% | 45 | 78% | Hybrid | Occasional | High |
| Tax Accountant | VND 9-14M | VND 18-28M | VND 35-55M | VND 12-18M | VND 24-36M | VND 45-68M | ~45,000 | 25% | 70% | 40 | 80% | Hybrid | Low | Medium |
| Logistics Planner | VND 8-13M | VND 16-26M | VND 30-48M | VND 11-16M | VND 22-34M | VND 40-62M | ~65,000 | 22% | 65% | 45 | 75% | Hybrid/On-site | Occasional | High |
| BI Developer | VND 12-18M | VND 25-40M | VND 45-70M | VND 16-24M | VND 32-50M | VND 58-90M | ~25,000 | 38% | 68% | 40-45 | 78% | Hybrid/Remote | Low | Medium |
| Assoc. Product Manager | VND 10-15M | VND 20-32M | VND 38-60M | VND 14-20M | VND 28-44M | VND 50-78M | ~18,000 | 36% | 67% | 40-45 | 75% | Hybrid | Low | Medium |
| Account Manager | VND 10-15M | VND 20-32M | VND 38-60M | VND 14-20M | VND 28-44M | VND 50-78M | ~55,000 | 30% | 67% | 45 | 75% | Hybrid | Occasional | High |
| Procurement Officer | VND 9-13M | VND 17-27M | VND 32-50M | VND 12-17M | VND 23-35M | VND 42-65M | ~30,000 | 26% | 68% | 40 | 76% | Hybrid/On-site | Occasional | Medium |
| Treasury Analyst | VND 10-16M | VND 22-35M | VND 42-68M | VND 14-20M | VND 28-45M | VND 55-85M | ~18,000 | 23% | 68% | 40-45 | 80% | Hybrid | Low | Medium |
| Corporate Attorney | VND 15-22M | VND 30-50M | VND 60-95M | VND 20-30M | VND 42-65M | VND 80-125M | ~10,000 | 18% | 70% | 45 | 82% | On-site/Hybrid | Occasional | High |
| Investment Associate | VND 12-18M | VND 25-40M | VND 50-78M | VND 16-24M | VND 32-52M | VND 65-100M | ~10,000 | 28% | 67% | 45 | 78% | Hybrid | Occasional | High |
| Strategy Consultant | VND 15-22M | VND 30-50M | VND 60-95M | VND 20-30M | VND 42-65M | VND 80-125M | ~15,000 | 33% | 65% | 45-50 | 75% | Hybrid | Frequent | High |
| Risk Manager | VND 12-18M | VND 26-42M | VND 52-82M | VND 16-24M | VND 34-55M | VND 68-105M | ~12,000 | 22% | 67% | 45 | 78% | Hybrid | Occasional | High |
| Product Director | VND 40-65M | VND 80-130M | VND 160-250M | VND 55-85M | VND 105-165M | VND 205-320M | ~5,000 | 20% | 68% | 45-50 | 82% | Hybrid | Occasional | High |
| Global Supply Chain Head | VND 50-80M | VND 100-160M | VND 200-320M | VND 70-110M | VND 130-200M | VND 260-420M | ~3,000 | 18% | 67% | 50 | 82% | Hybrid/On-site | Frequent | High |
| M&A Advisory Lead | VND 50-80M | VND 100-160M | VND 200-320M | VND 70-110M | VND 130-200M | VND 260-420M | ~2,500 | 16% | 63% | 50 | 82% | On-site/Hybrid | Frequent | High |
| Chief Financial Officer | VND 80-120M | VND 160-250M | VND 300-500M | VND 110-160M | VND 200-320M | VND 400-650M | ~2,000 | 13% | 70% | 50 | 85% | Hybrid/On-site | Frequent | High |

**Vietnam B&F Context:** Regulatory bodies: SBV (State Bank of Vietnam), SSC, MOF. Key compliance: VAS vs IFRS divergence, VAT/CIT changes, PDPD data privacy, AML regulations. Vietnam is the fastest-growing B&F market in this dataset. Sales Rep highest demand (~110,000). Infrastructure bottlenecks and customs complexity challenge logistics. CFO (VND 400-650M senior intl) tops the salary range. IFRS adoption is a growing pressure for finance teams.

---

### PHILIPPINES (Currency: PHP)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Accountant | PHP 18,000-25,000 | PHP 35,000-50,000 | PHP 60,000-90,000 | PHP 22,000-32,000 | PHP 45,000-65,000 | PHP 75,000-115,000 | ~70,000 | 38% | 70% | 40 | 78% | Hybrid | Low | Medium |
| Sales Rep | PHP 15,000-22,000 | PHP 28,000-42,000 | PHP 52,000-80,000 | PHP 18,000-28,000 | PHP 38,000-58,000 | PHP 68,000-105,000 | ~100,000 | 33% | 63% | 45 | 72% | Hybrid/On-site | Frequent | High |
| Financial Analyst | PHP 22,000-32,000 | PHP 45,000-65,000 | PHP 80,000-120,000 | PHP 28,000-40,000 | PHP 58,000-85,000 | PHP 105,000-158,000 | ~35,000 | 28% | 68% | 45 | 78% | Hybrid | Occasional | High |
| Tax Accountant | PHP 20,000-28,000 | PHP 38,000-55,000 | PHP 65,000-95,000 | PHP 25,000-35,000 | PHP 50,000-72,000 | PHP 82,000-125,000 | ~30,000 | 25% | 70% | 40 | 80% | Hybrid | Low | Medium |
| Logistics Planner | PHP 18,000-26,000 | PHP 33,000-50,000 | PHP 58,000-88,000 | PHP 22,000-32,000 | PHP 45,000-65,000 | PHP 75,000-115,000 | ~50,000 | 22% | 65% | 45 | 75% | Hybrid/On-site | Occasional | High |
| BI Developer | PHP 25,000-38,000 | PHP 50,000-75,000 | PHP 88,000-132,000 | PHP 32,000-48,000 | PHP 65,000-98,000 | PHP 115,000-175,000 | ~18,000 | 38% | 68% | 40-45 | 78% | Hybrid/Remote | Low | Medium |
| Assoc. Product Manager | PHP 22,000-32,000 | PHP 42,000-62,000 | PHP 78,000-115,000 | PHP 28,000-40,000 | PHP 55,000-82,000 | PHP 100,000-150,000 | ~12,000 | 36% | 67% | 40-45 | 76% | Hybrid | Low | Medium |
| Account Manager | PHP 22,000-32,000 | PHP 42,000-62,000 | PHP 72,000-108,000 | PHP 28,000-40,000 | PHP 55,000-82,000 | PHP 95,000-142,000 | ~45,000 | 30% | 67% | 45 | 75% | Hybrid | Occasional | High |
| Procurement Officer | PHP 18,000-26,000 | PHP 35,000-52,000 | PHP 62,000-92,000 | PHP 22,000-32,000 | PHP 46,000-68,000 | PHP 80,000-120,000 | ~25,000 | 26% | 68% | 40 | 78% | Hybrid/On-site | Occasional | Medium |
| Treasury Analyst | PHP 22,000-32,000 | PHP 42,000-62,000 | PHP 78,000-115,000 | PHP 28,000-40,000 | PHP 55,000-82,000 | PHP 100,000-150,000 | ~12,000 | 23% | 68% | 40-45 | 80% | Hybrid | Low | Medium |
| Corporate Attorney | PHP 35,000-52,000 | PHP 70,000-105,000 | PHP 130,000-200,000 | PHP 45,000-68,000 | PHP 92,000-138,000 | PHP 170,000-260,000 | ~8,000 | 18% | 70% | 45 | 82% | On-site/Hybrid | Occasional | High |
| Investment Associate | PHP 28,000-42,000 | PHP 55,000-82,000 | PHP 98,000-148,000 | PHP 36,000-54,000 | PHP 72,000-108,000 | PHP 128,000-195,000 | ~8,000 | 28% | 67% | 45 | 78% | Hybrid | Occasional | High |
| Strategy Consultant | PHP 35,000-52,000 | PHP 68,000-102,000 | PHP 125,000-190,000 | PHP 45,000-68,000 | PHP 90,000-135,000 | PHP 165,000-250,000 | ~10,000 | 33% | 65% | 45-50 | 75% | Hybrid | Frequent | High |
| Risk Manager | PHP 30,000-45,000 | PHP 60,000-90,000 | PHP 108,000-162,000 | PHP 38,000-58,000 | PHP 78,000-118,000 | PHP 142,000-212,000 | ~10,000 | 22% | 68% | 45 | 78% | Hybrid | Occasional | High |
| Product Director | PHP 80,000-120,000 | PHP 155,000-230,000 | PHP 295,000-440,000 | PHP 105,000-158,000 | PHP 200,000-300,000 | PHP 385,000-575,000 | ~4,000 | 20% | 68% | 45-50 | 82% | Hybrid | Occasional | High |
| Global Supply Chain Head | PHP 100,000-150,000 | PHP 195,000-290,000 | PHP 380,000-565,000 | PHP 130,000-195,000 | PHP 255,000-380,000 | PHP 495,000-740,000 | ~2,500 | 18% | 67% | 50 | 82% | Hybrid/On-site | Frequent | High |
| M&A Advisory Lead | PHP 100,000-150,000 | PHP 195,000-290,000 | PHP 380,000-565,000 | PHP 130,000-195,000 | PHP 255,000-380,000 | PHP 495,000-740,000 | ~2,000 | 16% | 63% | 50 | 82% | On-site/Hybrid | Frequent | High |
| Chief Financial Officer | PHP 120,000-180,000 | PHP 250,000-375,000 | PHP 490,000-730,000 | PHP 160,000-240,000 | PHP 330,000-495,000 | PHP 640,000-955,000 | ~1,500 | 13% | 70% | 50 | 85% | Hybrid/On-site | Frequent | High |

**Philippines B&F Context:** Regulatory bodies: BSP (Bangko Sentral ng Pilipinas), SEC Philippines, BIR. Key compliance: BIR audits, TRAIN law changes, AMLA compliance, RA 9184 (procurement law). Archipelago geography creates unique logistics complexity. Sales Rep highest demand (~100,000). M&A deal flow is limited vs Singapore. Typhoon disruptions affect logistics and sales targets. CFO tops the range at PHP 640,000-955,000 (senior intl).

---

### LAOS (Currency: LAK millions/month)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Accountant | 3-5M LAK | 6-9M LAK | 10-16M LAK | 4-7M LAK | 8-13M LAK | 14-22M LAK | ~5,000 | 35% | 68% | 40 | 70% | On-site | Low | Medium |
| Sales Rep | 3-5M LAK | 6-10M LAK | 12-18M LAK | 4-7M LAK | 8-14M LAK | 16-26M LAK | ~8,000 | 30% | 62% | 45 | 65% | On-site | Frequent | High |
| Financial Analyst | 4-6M LAK | 8-13M LAK | 15-24M LAK | 5-8M LAK | 10-17M LAK | 20-32M LAK | ~4,000 | 25% | 66% | 45 | 72% | Hybrid | Occasional | Medium |
| Tax Accountant | 3-5M LAK | 7-11M LAK | 13-20M LAK | 4-7M LAK | 9-15M LAK | 17-28M LAK | ~3,500 | 22% | 67% | 40 | 73% | On-site | Low | Medium |
| Logistics Planner | 3-5M LAK | 6-10M LAK | 12-18M LAK | 4-7M LAK | 8-14M LAK | 16-25M LAK | ~5,000 | 20% | 64% | 45 | 70% | On-site | Occasional | Medium |
| BI Developer | 5-8M LAK | 10-16M LAK | 18-28M LAK | 6-10M LAK | 13-20M LAK | 22-35M LAK | ~2,000 | 35% | 66% | 40-45 | 70% | Hybrid/Remote | Low | Medium |
| Assoc. Product Manager | 4-6M LAK | 8-13M LAK | 15-24M LAK | 5-8M LAK | 10-17M LAK | 20-32M LAK | ~1,500 | 34% | 65% | 40-45 | 68% | Hybrid | Low | Medium |
| Account Manager | 4-6M LAK | 8-13M LAK | 14-22M LAK | 5-8M LAK | 10-17M LAK | 18-28M LAK | ~5,000 | 28% | 64% | 45 | 67% | On-site | Occasional | High |
| Procurement Officer | 3-5M LAK | 7-11M LAK | 13-20M LAK | 4-7M LAK | 9-14M LAK | 17-26M LAK | ~3,000 | 25% | 66% | 40 | 70% | On-site | Occasional | Medium |
| Treasury Analyst | 4-7M LAK | 9-14M LAK | 16-26M LAK | 5-8M LAK | 11-18M LAK | 21-33M LAK | ~1,500 | 22% | 67% | 40-45 | 73% | Hybrid | Low | Medium |
| Corporate Attorney | 6-10M LAK | 13-20M LAK | 22-36M LAK | 8-13M LAK | 17-26M LAK | 28-46M LAK | ~1,000 | 16% | 67% | 45 | 75% | On-site | Occasional | High |
| Investment Associate | 5-8M LAK | 10-16M LAK | 18-28M LAK | 6-10M LAK | 13-21M LAK | 23-36M LAK | ~800 | 25% | 65% | 45 | 70% | Hybrid | Occasional | Medium |
| Strategy Consultant | 6-10M LAK | 13-20M LAK | 22-36M LAK | 8-13M LAK | 17-27M LAK | 28-46M LAK | ~1,500 | 30% | 63% | 45-50 | 68% | Hybrid | Frequent | High |
| Risk Manager | 5-8M LAK | 10-16M LAK | 18-28M LAK | 6-10M LAK | 13-21M LAK | 23-36M LAK | ~1,000 | 20% | 66% | 45 | 72% | Hybrid | Occasional | Medium |
| Product Director | 15-22M LAK | 30-48M LAK | 55-85M LAK | 20-30M LAK | 40-62M LAK | 70-110M LAK | ~500 | 18% | 66% | 45-50 | 72% | Hybrid | Occasional | High |
| Global Supply Chain Head | 18-28M LAK | 38-60M LAK | 70-110M LAK | 24-38M LAK | 50-80M LAK | 90-140M LAK | ~400 | 17% | 65% | 50 | 74% | On-site/Hybrid | Frequent | High |
| M&A Advisory Lead | 18-28M LAK | 38-60M LAK | 70-110M LAK | 24-38M LAK | 50-80M LAK | 90-140M LAK | ~300 | 15% | 62% | 50 | 73% | On-site/Hybrid | Frequent | High |
| Chief Financial Officer | 22-35M LAK | 50-80M LAK | 90-145M LAK | 30-48M LAK | 65-105M LAK | 115-185M LAK | ~200 | 12% | 67% | 50 | 76% | On-site/Hybrid | Frequent | High |

**Laos B&F Context:** Smallest B&F market in this dataset. Regulatory bodies: BoL (Bank of the Lao PDR), MoF Laos. Key challenges: LAK currency depreciation and volatility, evolving legal framework with limited precedents, FDI rules complexity, limited capital markets, very few M&A deals. Sales Rep has highest demand (~8,000). CFO has only ~200 openings -- fewest of any role in any country in this dataset. Cross-border logistics face road infrastructure gaps. Data: Paylab, worldsalaries 2025.

---

## CROSS-COUNTRY QUICK REFERENCE

### Highest Paying Country by Role (Senior, International Company)
- All roles: **Singapore** leads across the board
- CFO: SGD 50,000-80,000 (Singapore) vs RM 90,000-100,000+ (Malaysia) vs THB 580,000-900,000 (Thailand) vs VND 400-650M (Vietnam) vs PHP 640,000-955,000 (Philippines) vs LAK 115-185M (Laos)
- Corporate Attorney: **Singapore** SGD 22,000-35,000
- M&A Advisory Lead: **Singapore** SGD 45,000-65,000

### Highest Demand Roles (6-month openings across SEA)
1. Sales Rep -- Vietnam ~110,000, Philippines ~100,000, Malaysia ~120,000 (highest overall)
2. Junior Accountant -- Malaysia ~90,000, Vietnam ~90,000
3. Account Manager -- Malaysia ~85,000
4. Financial Analyst -- Malaysia ~75,000, Vietnam ~50,000

### Lowest Demand Roles
- CFO: Laos ~200, Singapore ~1,500
- M&A Advisory Lead: Laos ~300, Singapore ~2,000
- Product Director: Laos ~500, Singapore ~3,000

### AI Disruption Risk Rankings
- **Highest risk:** Junior Accountant (35-40%), BI Developer (38-40%), Assoc. Product Manager (34-38%)
- **Lowest risk:** CFO (12-15%), M&A Advisory Lead (15-18%), Corporate Attorney (16-20%)
- Accounting roles face the highest AI disruption risk due to automation of routine bookkeeping and compliance tasks

### Best Work-Life Balance (WLB %)
- CFO: **Malaysia & Singapore** 72% (tied highest)
- Corporate Attorney: **Singapore & Malaysia** 72%
- Sales Rep: consistently lowest across all countries (62-65%)
- M&A Advisory Lead: lowest non-sales WLB (62-65%)

### Stability Rankings (highest %)
- CFO: 76-90% (most stable overall, with Laos lowest at 76%, Singapore highest at 90%)
- Corporate Attorney: 73-88%
- Sales Rep: 65-78% (most volatile -- quota-driven)

### Work Mode Summary
- **Most roles:** Hybrid across all countries
- **Laos exception:** Most roles are On-site (Hybrid only for BI, APM, Treasury, Financial Analyst, and select others)
- **High travel roles:** Sales Rep, Strategy Consultant, Global Supply Chain Head, M&A Advisory Lead, CFO
- **Low/no travel roles:** Junior Accountant, Tax Accountant, BI Developer, Treasury Analyst

### Stress Level Summary
- **Consistently High stress:** Sales Rep, Financial Analyst, Logistics Planner, Account Manager, Strategy Consultant, Risk Manager, Corporate Attorney (in all markets), Global Supply Chain Head, M&A Advisory Lead, CFO
- **Consistently Medium stress:** Junior Accountant, Tax Accountant, Procurement Officer, Treasury Analyst, BI Developer, Assoc. Product Manager
- No B&F role in this dataset is rated Low stress

---

## RESPONSE GUIDELINES

- Always specify the country and whether salary is for a **local** or **international** company
- Laos salaries are in LAK millions/month; all others in local currency as labelled
- WLB % = self-reported work-life balance satisfaction score
- Stability % = job security / role stability rating
- AI Risk % = estimated probability of significant AI disruption to this role within 5 years
- Demand = approximate number of open roles in the country over a 6-month period
- Career progressions show the standard linear path; pivot paths show lateral moves available at any stage
- When users ask "which country is best for X role," factor in salary, WLB, demand, stability, and AI risk together -- not salary alone
- Sales Rep is universally the highest-demand and highest-stress entry-level B&F role across all 6 countries
- CFO is universally the most stable, highest-paid, and lowest-AI-risk senior role across all 6 countries
- M&A activity is heavily concentrated in Singapore; Laos has virtually none
# CareerOS -- Codex System Prompt: Healthcare & Life Sciences Sector

---

## CAREER PROGRESSION PATHS (All 18 Healthcare Roles)

### 1. Clinical Assistant
0-2 yrs: Clinical Assistant / Medical Assistant -> 2-4 yrs: Senior Clinical Assistant -> 4-7 yrs: Clinical Coordinator -> 7-10 yrs: Clinical Manager -> 10+ yrs: Director of Clinical Operations
**Pivot paths:** Staff Nurse * Health Data Analyst * Clinical Trial Coordinator * Hospital Administrator

### 2. Emergency Responder
0-2 yrs: EMT / Paramedic Trainee -> 2-4 yrs: Emergency Responder / Paramedic -> 4-7 yrs: Senior Paramedic / Flight Medic -> 7-10 yrs: EMS Supervisor / Emergency Manager -> 10+ yrs: Director of Emergency Services
**Pivot paths:** Trauma Director * Staff Nurse * Hospital Administrator * Health Data Analyst

### 3. Lab Technician
0-2 yrs: Junior Lab Technician -> 2-4 yrs: Lab Technician -> 4-7 yrs: Senior Lab Technician / Specialist -> 7-10 yrs: Lab Manager / Research Associate -> 10+ yrs: Director of Laboratory Services
**Pivot paths:** Toxicologist * Virology Researcher * Quality Control Analyst * Epidemiologist

### 4. Staff Nurse
0-2 yrs: Graduate Nurse / Registered Nurse -> 2-4 yrs: Staff Nurse -> 4-7 yrs: Senior Nurse / Charge Nurse -> 7-10 yrs: Nurse Manager / Clinical Lead -> 10+ yrs: Director of Nursing / CNO
**Pivot paths:** Nurse Practitioner * Health Data Analyst * Clinical Educator * Hospital Director

### 5. Pharmacy Technician
0-2 yrs: Pharmacy Technician Trainee -> 2-4 yrs: Pharmacy Technician -> 4-7 yrs: Senior Pharmacy Technician -> 7-10 yrs: Pharmacy Supervisor / Lead Tech -> 10+ yrs: Pharmacy Director / Operations Manager
**Pivot paths:** Pharmacist * Clinical Trial Coordinator * Health Data Analyst * Regulatory Affairs

### 6. Radiologic Technologist
0-2 yrs: Radiologic Technologist -> 2-4 yrs: Senior Radiologic Technologist -> 4-7 yrs: Lead Radiologic Tech / Specialist -> 7-10 yrs: Radiology Supervisor / Manager -> 10+ yrs: Director of Radiology / Medical Imaging Lead
**Pivot paths:** Medical Informatics Architect * Health Data Analyst * Clinical Educator * Hospital Director

### 7. Surgical Technician
0-2 yrs: Surgical Technician Trainee -> 2-4 yrs: Surgical Technician -> 4-7 yrs: Senior Surgical Technician / Specialist -> 7-10 yrs: Surgical Team Lead / OR Supervisor -> 10+ yrs: Director of Surgical Services
**Pivot paths:** Trauma Director * Clinical Coordinator * Autonomous Systems Surgeon * Hospital Director

### 8. Health Data Analyst
0-2 yrs: Junior Health Data Analyst -> 2-4 yrs: Health Data Analyst -> 4-7 yrs: Senior Health Data Analyst -> 7-10 yrs: Health Analytics Manager -> 10+ yrs: Chief Data Officer (Health) / Director
**Pivot paths:** Epidemiologist * Medical Informatics Architect * BI Developer * Clinical Trial Coordinator

### 9. Epidemiologist
0-2 yrs: Research Assistant / Junior Epidemiologist -> 2-4 yrs: Epidemiologist -> 4-7 yrs: Senior Epidemiologist -> 7-10 yrs: Lead Epidemiologist / Program Director -> 10+ yrs: Chief Epidemiologist / Public Health Director
**Pivot paths:** Virology Researcher * Health Data Analyst * Clinical Trial Coordinator * Chief Medical Officer

### 10. Toxicologist
0-2 yrs: Junior Toxicologist / Lab Researcher -> 2-4 yrs: Toxicologist -> 4-7 yrs: Senior Toxicologist -> 7-10 yrs: Principal Toxicologist / Research Lead -> 10+ yrs: Director of Toxicology / Chief Scientist
**Pivot paths:** Pharmacologist * Virology Researcher * Regulatory Affairs Specialist * Epidemiologist

### 11. Clinical Trial Coordinator
0-2 yrs: Clinical Research Assistant -> 2-4 yrs: Clinical Trial Coordinator -> 4-7 yrs: Senior CTC / Clinical Research Associate -> 7-10 yrs: Clinical Operations Manager -> 10+ yrs: Director of Clinical Trials / VP Clinical Ops
**Pivot paths:** Regulatory Affairs Manager * Health Data Analyst * Medical Affairs Lead * CMO

### 12. Hospital Director
0-2 yrs: Hospital Administrator / Coordinator -> 2-4 yrs: Department Manager -> 4-7 yrs: Senior Operations Manager -> 7-10 yrs: Hospital Director -> 10+ yrs: CEO of Health System / Regional Medical Director
**Pivot paths:** Chief Medical Officer * Policy Director * Healthcare Consultant * CFO (Health)

### 13. Chief Medical Officer (CMO)
0-2 yrs: Resident / Junior Physician -> 2-4 yrs: Attending Physician / Specialist -> 4-7 yrs: Department Head / Medical Director -> 7-10 yrs: VP of Medical Affairs -> 10+ yrs: Chief Medical Officer (CMO)
**Pivot paths:** Hospital Director * Chief Research Officer * Policy Advisor * CEO

### 14. Virology Researcher
0-2 yrs: Research Assistant / Lab Technician -> 2-4 yrs: Virology Researcher / Associate Scientist -> 4-7 yrs: Senior Virologist / Research Scientist -> 7-10 yrs: Principal Investigator / Research Lead -> 10+ yrs: Director of Virology / Chief Science Officer
**Pivot paths:** Epidemiologist * Toxicologist * Clinical Trial Coordinator * Oncology Dataset Lead

### 15. Trauma Director
0-2 yrs: Emergency Physician / Trauma Resident -> 2-4 yrs: Trauma Surgeon / Fellow -> 4-7 yrs: Attending Trauma Surgeon -> 7-10 yrs: Trauma Medical Director -> 10+ yrs: Trauma Director / Chief of Surgery
**Pivot paths:** Chief Medical Officer * Autonomous Systems Surgeon * Hospital Director * Clinical Educator

### 16. Oncology Dataset Lead
0-2 yrs: Clinical Data Associate -> 2-4 yrs: Oncology Data Analyst -> 4-7 yrs: Senior Oncology Data Scientist -> 7-10 yrs: Oncology Dataset Lead -> 10+ yrs: Director of Oncology Data / Chief Data Scientist
**Pivot paths:** Medical Informatics Architect * Health Data Analyst * Virology Researcher * Clinical Trial Coordinator

### 17. Medical Informatics Architect
0-2 yrs: Health IT Analyst / Junior Informatics -> 2-4 yrs: Medical Informatics Specialist -> 4-7 yrs: Senior Medical Informatics Engineer -> 7-10 yrs: Medical Informatics Architect -> 10+ yrs: Chief Medical Informatics Officer (CMIO)
**Pivot paths:** Health Data Analyst * AI Integration Specialist * Hospital Director * CMO

### 18. Autonomous Systems Surgeon
0-2 yrs: Surgical Resident / Robotics Fellow -> 2-4 yrs: Robotic Surgery Specialist -> 4-7 yrs: Senior Robotic Surgeon / Lead Operator -> 7-10 yrs: Director of Robotic Surgery -> 10+ yrs: Autonomous Systems Surgeon / Chief of Robotic Surgery
**Pivot paths:** Trauma Director * Medical Informatics Architect * AI Integration Specialist * CMO

---

## SALARY & MARKET DATA BY COUNTRY

---

### MALAYSIA (Currency: MYR / RM)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Clinical Assistant | RM 2,200-2,800 | RM 3,500-4,500 | RM 5,000-7,000 | RM 2,800-3,500 | RM 4,500-6,000 | RM 7,000-9,000 | ~100,000 | 45% | 70% | 40 | 85% | On-site | Low | Medium |
| Emergency Responder | RM 2,500-3,500 | RM 4,500-6,000 | RM 7,000-10,000 | RM 3,500-4,500 | RM 6,000-8,000 | RM 10,000-12,000 | ~80,000 | 25% | 60% | 45-50 | 80% | On-site | Frequent | High |
| Lab Technician | RM 2,800-3,500 | RM 5,000-6,500 | RM 8,000-12,000 | RM 3,500-4,500 | RM 6,500-8,500 | RM 12,000-15,000 | ~70,000 | 35% | 72% | 40 | 85% | On-site | Low | Medium |
| Staff Nurse | RM 2,800-3,800 | RM 5,000-7,000 | RM 9,000-12,000 | RM 3,800-4,500 | RM 7,000-9,000 | RM 12,000-15,000 | ~120,000 | 20% | 65% | 45-50 | 82% | On-site | Occasional | High |
| Pharmacy Technician | RM 2,500-3,200 | RM 4,500-6,000 | RM 7,000-10,000 | RM 3,200-4,000 | RM 6,000-8,000 | RM 10,000-12,000 | ~60,000 | 40% | 70% | 40 | 83% | On-site | Low | Medium |
| Radiologic Technologist | RM 3,000-4,000 | RM 6,000-8,000 | RM 10,000-15,000 | RM 4,000-5,000 | RM 8,000-10,000 | RM 15,000-18,000 | ~50,000 | 30% | 68% | 40-45 | 85% | On-site | Occasional | Medium |
| Surgical Technician | RM 3,000-4,000 | RM 6,000-8,000 | RM 12,000-15,000 | RM 4,000-5,000 | RM 8,000-10,000 | RM 15,000-18,000 | ~40,000 | 25% | 65% | 45-50 | 82% | On-site | Low | High |
| Health Data Analyst | RM 3,500-4,500 | RM 7,000-9,000 | RM 12,000-18,000 | RM 4,500-5,500 | RM 9,000-12,000 | RM 18,000-22,000 | ~30,000 | 45% | 72% | 40 | 85% | Hybrid | Low | Medium |
| Epidemiologist | RM 4,000-5,000 | RM 8,000-12,000 | RM 15,000-20,000 | RM 5,000-6,000 | RM 12,000-15,000 | RM 20,000-25,000 | ~20,000 | 20% | 70% | 40-45 | 88% | Hybrid/On-site | Occasional | High |
| Toxicologist | RM 4,000-5,000 | RM 9,000-12,000 | RM 15,000-22,000 | RM 5,000-6,000 | RM 12,000-15,000 | RM 22,000-28,000 | ~15,000 | 25% | 72% | 40 | 88% | Hybrid/On-site | Occasional | Medium |
| Clinical Trial Coordinator | RM 3,500-4,500 | RM 7,000-10,000 | RM 12,000-18,000 | RM 4,500-5,500 | RM 10,000-12,000 | RM 18,000-22,000 | ~25,000 | 30% | 70% | 40-45 | 85% | Hybrid | Occasional | High |
| Hospital Director | RM 8,000-12,000 | RM 20,000-30,000 | RM 40,000-60,000 | RM 12,000-15,000 | RM 30,000-40,000 | RM 60,000-80,000 | ~10,000 | 15% | 68% | 50 | 90% | On-site | Frequent | High |
| Chief Medical Officer (CMO) | RM 10,000-15,000 | RM 25,000-35,000 | RM 50,000-70,000 | RM 15,000-20,000 | RM 35,000-45,000 | RM 70,000-90,000 | ~8,000 | 12% | 70% | 50 | 92% | On-site | Frequent | High |
| Virology Researcher | RM 4,000-5,000 | RM 9,000-12,000 | RM 15,000-22,000 | RM 5,000-6,000 | RM 12,000-15,000 | RM 22,000-28,000 | ~12,000 | 20% | 68% | 40-45 | 85% | Hybrid/On-site | Occasional | High |
| Trauma Director | RM 8,000-12,000 | RM 20,000-30,000 | RM 40,000-55,000 | RM 12,000-15,000 | RM 30,000-40,000 | RM 55,000-70,000 | ~7,000 | 15% | 65% | 50 | 88% | On-site | Frequent | High |
| Oncology Dataset Lead | RM 5,000-6,000 | RM 12,000-15,000 | RM 20,000-28,000 | RM 6,000-7,000 | RM 15,000-18,000 | RM 28,000-35,000 | ~10,000 | 35% | 70% | 40-45 | 85% | Hybrid | Low | Medium |
| Medical Informatics Architect | RM 6,000-8,000 | RM 15,000-20,000 | RM 25,000-35,000 | RM 8,000-10,000 | RM 20,000-25,000 | RM 35,000-45,000 | ~12,000 | 40% | 72% | 40-45 | 88% | Hybrid/Remote | Low | Medium |
| Autonomous Systems Surgeon | RM 12,000-15,000 | RM 25,000-35,000 | RM 50,000-70,000 | RM 15,000-20,000 | RM 35,000-45,000 | RM 70,000-90,000 | ~5,000 | 50% | 68% | 50 | 85% | On-site/Hybrid | Occasional | High |

**Malaysia Healthcare Context:** Strong public and private dual-track system. Key regulatory body: MOH Malaysia. Common challenges: repetitive tasks in frontline roles, long hours for nurses and emergency staff, PDPA data compliance for health analytics, balancing robotics with human oversight. Staff Nurse is the highest-demand role (~120,000 openings). CMO has the highest stability (92%).

---

### SINGAPORE (Currency: SGD)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Clinical Assistant | SGD 2,200-2,800 | SGD 3,500-4,800 | SGD 6,000-8,500 | SGD 2,800-3,500 | SGD 4,500-6,000 | SGD 8,000-11,000 | ~25,000 | 43% | 70% | 40 | 85% | On-site | Low | Medium |
| Emergency Responder | SGD 2,500-3,200 | SGD 4,500-6,500 | SGD 8,000-12,000 | SGD 3,200-4,000 | SGD 6,000-8,500 | SGD 10,000-15,000 | ~18,000 | 23% | 58% | 45-50 | 82% | On-site | Frequent | High |
| Lab Technician | SGD 2,800-3,800 | SGD 5,000-7,000 | SGD 9,000-14,000 | SGD 3,500-4,500 | SGD 6,500-9,000 | SGD 12,000-18,000 | ~12,000 | 33% | 70% | 40 | 86% | On-site | Low | Medium |
| Staff Nurse | SGD 2,500-3,200 | SGD 4,500-6,500 | SGD 8,000-12,000 | SGD 3,200-4,000 | SGD 6,000-8,500 | SGD 10,000-14,000 | ~30,000 | 18% | 62% | 45-50 | 83% | On-site | Occasional | High |
| Pharmacy Technician | SGD 2,500-3,200 | SGD 4,500-6,000 | SGD 7,500-11,000 | SGD 3,200-4,000 | SGD 5,800-7,500 | SGD 9,500-13,000 | ~8,000 | 38% | 70% | 40 | 84% | On-site | Low | Medium |
| Radiologic Technologist | SGD 3,000-4,000 | SGD 6,000-8,500 | SGD 11,000-16,000 | SGD 4,000-5,000 | SGD 8,000-11,000 | SGD 14,000-20,000 | ~6,000 | 28% | 68% | 40-45 | 86% | On-site | Occasional | Medium |
| Surgical Technician | SGD 3,000-4,000 | SGD 6,000-8,500 | SGD 11,000-16,000 | SGD 4,000-5,000 | SGD 8,000-11,000 | SGD 14,000-20,000 | ~5,000 | 22% | 63% | 45-50 | 84% | On-site | Low | High |
| Health Data Analyst | SGD 3,800-5,000 | SGD 7,000-10,000 | SGD 12,000-18,000 | SGD 5,000-6,500 | SGD 9,000-13,000 | SGD 16,000-23,000 | ~8,000 | 43% | 72% | 40 | 86% | Hybrid | Low | Medium |
| Epidemiologist | SGD 4,500-6,000 | SGD 9,000-13,000 | SGD 15,000-22,000 | SGD 6,000-7,500 | SGD 12,000-16,000 | SGD 20,000-28,000 | ~3,000 | 18% | 70% | 40-45 | 88% | Hybrid/On-site | Occasional | High |
| Toxicologist | SGD 4,500-6,000 | SGD 9,000-13,000 | SGD 16,000-24,000 | SGD 6,000-7,500 | SGD 12,000-16,000 | SGD 20,000-30,000 | ~2,000 | 23% | 72% | 40 | 88% | Hybrid/On-site | Occasional | Medium |
| Clinical Trial Coordinator | SGD 3,500-4,800 | SGD 7,000-10,000 | SGD 12,000-18,000 | SGD 4,500-6,000 | SGD 9,000-13,000 | SGD 16,000-22,000 | ~4,000 | 28% | 70% | 40-45 | 86% | Hybrid | Occasional | High |
| Hospital Director | SGD 9,000-14,000 | SGD 20,000-30,000 | SGD 40,000-65,000 | SGD 13,000-18,000 | SGD 28,000-40,000 | SGD 55,000-85,000 | ~1,500 | 13% | 67% | 50 | 90% | On-site | Frequent | High |
| Chief Medical Officer (CMO) | SGD 12,000-18,000 | SGD 25,000-38,000 | SGD 55,000-80,000 | SGD 16,000-24,000 | SGD 35,000-50,000 | SGD 70,000-100,000 | ~800 | 10% | 68% | 50 | 92% | On-site | Frequent | High |
| Virology Researcher | SGD 4,500-6,000 | SGD 9,000-13,000 | SGD 16,000-24,000 | SGD 6,000-7,500 | SGD 12,000-16,000 | SGD 20,000-30,000 | ~2,000 | 18% | 68% | 40-45 | 86% | Hybrid/On-site | Occasional | High |
| Trauma Director | SGD 9,000-14,000 | SGD 20,000-30,000 | SGD 40,000-60,000 | SGD 13,000-18,000 | SGD 28,000-40,000 | SGD 55,000-80,000 | ~800 | 13% | 63% | 50 | 88% | On-site | Frequent | High |
| Oncology Dataset Lead | SGD 5,500-7,000 | SGD 12,000-16,000 | SGD 20,000-30,000 | SGD 7,000-9,000 | SGD 16,000-22,000 | SGD 28,000-40,000 | ~2,000 | 33% | 70% | 40-45 | 86% | Hybrid | Low | Medium |
| Medical Informatics Architect | SGD 6,500-9,000 | SGD 15,000-22,000 | SGD 28,000-40,000 | SGD 9,000-12,000 | SGD 20,000-28,000 | SGD 38,000-55,000 | ~2,500 | 38% | 72% | 40-45 | 88% | Hybrid/Remote | Low | Medium |
| Autonomous Systems Surgeon | SGD 14,000-20,000 | SGD 28,000-42,000 | SGD 55,000-85,000 | SGD 18,000-26,000 | SGD 38,000-55,000 | SGD 70,000-110,000 | ~1,000 | 50% | 67% | 50 | 86% | On-site/Hybrid | Occasional | High |

**Singapore Healthcare Context:** MOH and HSA are primary regulatory bodies. HSA/ICH-GCP compliance governs clinical trials. NRG/NCIS integration is key for oncology data. BSL lab compliance for virology. Key challenges: nurse shortage, long shifts, emotional burnout, MOH robotics approval for autonomous surgery, pathogen containment. CMO is the highest-paid role (SGD 70,000-100,000 senior intl). Highest stability role: CMO at 92%.

---

### THAILAND (Currency: THB)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Clinical Assistant | THB 15,000-20,000 | THB 28,000-40,000 | THB 50,000-75,000 | THB 18,000-25,000 | THB 35,000-52,000 | THB 65,000-95,000 | ~80,000 | 43% | 68% | 40 | 82% | On-site | Low | Medium |
| Emergency Responder | THB 18,000-25,000 | THB 35,000-52,000 | THB 65,000-95,000 | THB 22,000-32,000 | THB 45,000-65,000 | THB 80,000-120,000 | ~60,000 | 23% | 58% | 45-50 | 78% | On-site | Frequent | High |
| Lab Technician | THB 18,000-25,000 | THB 35,000-52,000 | THB 65,000-95,000 | THB 22,000-32,000 | THB 45,000-65,000 | THB 80,000-120,000 | ~55,000 | 33% | 70% | 40 | 84% | On-site | Low | Medium |
| Staff Nurse | THB 18,000-26,000 | THB 35,000-52,000 | THB 70,000-105,000 | THB 24,000-34,000 | THB 45,000-68,000 | THB 90,000-135,000 | ~90,000 | 18% | 63% | 45-50 | 80% | On-site | Occasional | High |
| Pharmacy Technician | THB 15,000-22,000 | THB 30,000-45,000 | THB 55,000-82,000 | THB 18,000-28,000 | THB 38,000-58,000 | THB 70,000-105,000 | ~45,000 | 38% | 68% | 40 | 82% | On-site | Low | Medium |
| Radiologic Technologist | THB 20,000-30,000 | THB 40,000-60,000 | THB 75,000-115,000 | THB 26,000-38,000 | THB 52,000-78,000 | THB 95,000-145,000 | ~35,000 | 28% | 68% | 40-45 | 84% | On-site | Occasional | Medium |
| Surgical Technician | THB 20,000-30,000 | THB 40,000-60,000 | THB 80,000-120,000 | THB 26,000-38,000 | THB 52,000-78,000 | THB 100,000-150,000 | ~28,000 | 23% | 63% | 45-50 | 80% | On-site | Low | High |
| Health Data Analyst | THB 25,000-38,000 | THB 52,000-78,000 | THB 95,000-145,000 | THB 32,000-48,000 | THB 65,000-98,000 | THB 120,000-180,000 | ~20,000 | 43% | 70% | 40 | 82% | Hybrid | Low | Medium |
| Epidemiologist | THB 28,000-42,000 | THB 58,000-88,000 | THB 110,000-165,000 | THB 36,000-54,000 | THB 75,000-112,000 | THB 140,000-210,000 | ~8,000 | 18% | 68% | 40-45 | 86% | Hybrid/On-site | Occasional | High |
| Toxicologist | THB 28,000-42,000 | THB 58,000-88,000 | THB 110,000-165,000 | THB 36,000-54,000 | THB 75,000-112,000 | THB 140,000-210,000 | ~5,000 | 23% | 70% | 40 | 86% | Hybrid/On-site | Occasional | Medium |
| Clinical Trial Coordinator | THB 22,000-34,000 | THB 45,000-68,000 | THB 85,000-128,000 | THB 28,000-42,000 | THB 58,000-88,000 | THB 108,000-162,000 | ~10,000 | 28% | 68% | 40-45 | 83% | Hybrid | Occasional | High |
| Hospital Director | THB 80,000-130,000 | THB 180,000-280,000 | THB 380,000-600,000 | THB 105,000-165,000 | THB 230,000-360,000 | THB 490,000-780,000 | ~5,000 | 13% | 66% | 50 | 88% | On-site | Frequent | High |
| Chief Medical Officer (CMO) | THB 100,000-160,000 | THB 220,000-340,000 | THB 460,000-720,000 | THB 130,000-210,000 | THB 290,000-445,000 | THB 600,000-950,000 | ~2,000 | 10% | 67% | 50 | 90% | On-site | Frequent | High |
| Virology Researcher | THB 28,000-42,000 | THB 58,000-88,000 | THB 110,000-165,000 | THB 36,000-54,000 | THB 75,000-112,000 | THB 140,000-210,000 | ~5,000 | 18% | 67% | 40-45 | 84% | Hybrid/On-site | Occasional | High |
| Trauma Director | THB 80,000-130,000 | THB 180,000-280,000 | THB 360,000-560,000 | THB 105,000-165,000 | THB 230,000-360,000 | THB 465,000-725,000 | ~3,000 | 13% | 63% | 50 | 86% | On-site | Frequent | High |
| Oncology Dataset Lead | THB 40,000-60,000 | THB 85,000-128,000 | THB 165,000-248,000 | THB 52,000-78,000 | THB 110,000-165,000 | THB 215,000-325,000 | ~5,000 | 33% | 68% | 40-45 | 83% | Hybrid | Low | Medium |
| Medical Informatics Architect | THB 50,000-75,000 | THB 105,000-160,000 | THB 210,000-320,000 | THB 65,000-98,000 | THB 135,000-205,000 | THB 275,000-420,000 | ~6,000 | 38% | 70% | 40-45 | 86% | Hybrid/Remote | Low | Medium |
| Autonomous Systems Surgeon | THB 150,000-220,000 | THB 320,000-480,000 | THB 650,000-980,000 | THB 200,000-300,000 | THB 420,000-630,000 | THB 850,000-1,280,000 | ~800 | 50% | 67% | 50 | 84% | On-site/Hybrid | Occasional | High |

**Thailand Healthcare Context:** Regulatory bodies: MOH Thailand, FDA Thailand, DDC. TCTR/ICH-GCP governs clinical trials. PDPA applies to health data. Thailand is a medical tourism hub, driving demand for surgical and clinical roles. Key challenges: rural hospital coverage gaps, multi-disciplinary coordination for trauma, FDA robotics approval delays, evolving pathogen research funding. CMO offers the highest stability (90%) and salary ceiling (THB 600,000-950,000 senior intl).

---

### VIETNAM (Currency: VND millions/month)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Clinical Assistant | VND 5-8M | VND 10-16M | VND 20-32M | VND 7-11M | VND 13-22M | VND 28-44M | ~80,000 | 43% | 68% | 40 | 76% | On-site | Low | Medium |
| Emergency Responder | VND 6-10M | VND 12-20M | VND 25-40M | VND 8-13M | VND 16-26M | VND 32-52M | ~60,000 | 23% | 57% | 45-50 | 74% | On-site | Frequent | High |
| Lab Technician | VND 7-11M | VND 14-22M | VND 28-44M | VND 9-14M | VND 18-28M | VND 36-58M | ~55,000 | 33% | 70% | 40 | 78% | On-site | Low | Medium |
| Staff Nurse | VND 6-10M | VND 12-18M | VND 22-35M | VND 8-13M | VND 16-25M | VND 30-48M | ~100,000 | 18% | 62% | 45-50 | 76% | On-site | Occasional | High |
| Pharmacy Technician | VND 6-9M | VND 11-18M | VND 20-32M | VND 8-12M | VND 14-23M | VND 26-42M | ~45,000 | 38% | 68% | 40 | 78% | On-site | Low | Medium |
| Radiologic Technologist | VND 7-11M | VND 14-22M | VND 28-44M | VND 9-14M | VND 18-28M | VND 36-58M | ~35,000 | 28% | 67% | 40-45 | 78% | On-site | Occasional | Medium |
| Surgical Technician | VND 7-11M | VND 14-22M | VND 28-44M | VND 9-14M | VND 18-28M | VND 36-58M | ~28,000 | 23% | 62% | 45-50 | 76% | On-site | Low | High |
| Health Data Analyst | VND 10-16M | VND 22-35M | VND 42-68M | VND 13-20M | VND 28-45M | VND 55-88M | ~20,000 | 43% | 70% | 40 | 78% | Hybrid | Low | Medium |
| Epidemiologist | VND 10-16M | VND 22-35M | VND 45-72M | VND 13-20M | VND 28-45M | VND 58-92M | ~8,000 | 18% | 68% | 40-45 | 82% | Hybrid/On-site | Occasional | High |
| Toxicologist | VND 10-16M | VND 22-35M | VND 45-72M | VND 13-20M | VND 28-45M | VND 58-92M | ~5,000 | 23% | 70% | 40 | 82% | Hybrid/On-site | Occasional | Medium |
| Clinical Trial Coordinator | VND 9-14M | VND 18-30M | VND 36-58M | VND 12-18M | VND 24-38M | VND 48-76M | ~8,000 | 28% | 68% | 40-45 | 80% | Hybrid | Occasional | High |
| Hospital Director | VND 35-55M | VND 75-120M | VND 150-240M | VND 48-75M | VND 98-158M | VND 195-315M | ~4,000 | 13% | 65% | 50 | 84% | On-site | Frequent | High |
| Chief Medical Officer (CMO) | VND 45-70M | VND 95-150M | VND 190-300M | VND 60-95M | VND 125-200M | VND 250-400M | ~2,000 | 10% | 67% | 50 | 86% | On-site | Frequent | High |
| Virology Researcher | VND 10-16M | VND 22-35M | VND 45-72M | VND 13-20M | VND 28-45M | VND 58-92M | ~4,000 | 18% | 67% | 40-45 | 80% | Hybrid/On-site | Occasional | High |
| Trauma Director | VND 35-55M | VND 75-120M | VND 145-230M | VND 48-75M | VND 98-158M | VND 190-305M | ~2,000 | 13% | 62% | 50 | 82% | On-site | Frequent | High |
| Oncology Dataset Lead | VND 12-18M | VND 26-42M | VND 52-82M | VND 16-24M | VND 34-55M | VND 68-108M | ~5,000 | 33% | 68% | 40-45 | 80% | Hybrid | Low | Medium |
| Medical Informatics Architect | VND 15-22M | VND 32-52M | VND 65-105M | VND 20-30M | VND 42-68M | VND 85-135M | ~5,000 | 38% | 70% | 40-45 | 80% | Hybrid/Remote | Low | Medium |
| Autonomous Systems Surgeon | VND 50-75M | VND 105-165M | VND 210-330M | VND 68-105M | VND 140-220M | VND 280-440M | ~500 | 50% | 67% | 50 | 82% | On-site/Hybrid | Occasional | High |

**Vietnam Healthcare Context:** Regulatory body: MoH Vietnam. MoH/ICH-GCP governs clinical trials. PDPD (Personal Data Protection Decree) applies to health data. Key challenges: staff shortages, outdated equipment in public hospitals, low public-sector pay, limited rural equipment, BSL compliance for virology, very limited robotic surgery units. Staff Nurse is highest demand (~100,000). HL7/FHIR adoption is a growing priority for informatics roles.

---

### PHILIPPINES (Currency: PHP)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Clinical Assistant | PHP 14,000-18,000 | PHP 25,000-38,000 | PHP 45,000-68,000 | PHP 18,000-24,000 | PHP 32,000-50,000 | PHP 58,000-88,000 | ~80,000 | 43% | 68% | 40 | 78% | On-site | Low | High |
| Emergency Responder | PHP 16,000-22,000 | PHP 30,000-45,000 | PHP 55,000-82,000 | PHP 20,000-30,000 | PHP 40,000-60,000 | PHP 70,000-108,000 | ~60,000 | 23% | 57% | 45-50 | 75% | On-site | Frequent | High |
| Lab Technician | PHP 18,000-25,000 | PHP 35,000-52,000 | PHP 62,000-95,000 | PHP 22,000-32,000 | PHP 45,000-68,000 | PHP 80,000-122,000 | ~55,000 | 33% | 70% | 40 | 80% | On-site | Low | Medium |
| Staff Nurse | PHP 18,000-28,000 | PHP 33,000-50,000 | PHP 60,000-90,000 | PHP 22,000-35,000 | PHP 43,000-65,000 | PHP 78,000-118,000 | ~100,000 | 18% | 61% | 45-50 | 76% | On-site | Occasional | High |
| Pharmacy Technician | PHP 14,000-20,000 | PHP 26,000-40,000 | PHP 48,000-72,000 | PHP 18,000-26,000 | PHP 34,000-52,000 | PHP 62,000-95,000 | ~40,000 | 38% | 68% | 40 | 78% | On-site | Low | Medium |
| Radiologic Technologist | PHP 18,000-26,000 | PHP 35,000-52,000 | PHP 65,000-98,000 | PHP 22,000-32,000 | PHP 45,000-68,000 | PHP 85,000-128,000 | ~30,000 | 28% | 67% | 40-45 | 80% | On-site | Occasional | Medium |
| Surgical Technician | PHP 18,000-26,000 | PHP 35,000-52,000 | PHP 65,000-98,000 | PHP 22,000-32,000 | PHP 45,000-68,000 | PHP 85,000-128,000 | ~22,000 | 23% | 62% | 45-50 | 76% | On-site | Low | High |
| Health Data Analyst | PHP 22,000-32,000 | PHP 45,000-68,000 | PHP 85,000-128,000 | PHP 28,000-42,000 | PHP 58,000-88,000 | PHP 110,000-165,000 | ~18,000 | 43% | 70% | 40 | 78% | Hybrid | Low | Medium |
| Epidemiologist | PHP 26,000-38,000 | PHP 52,000-78,000 | PHP 98,000-148,000 | PHP 34,000-50,000 | PHP 68,000-102,000 | PHP 128,000-194,000 | ~6,000 | 18% | 68% | 40-45 | 82% | Hybrid/On-site | Occasional | High |
| Toxicologist | PHP 26,000-38,000 | PHP 52,000-78,000 | PHP 98,000-148,000 | PHP 34,000-50,000 | PHP 68,000-102,000 | PHP 128,000-194,000 | ~3,000 | 23% | 70% | 40 | 82% | Hybrid/On-site | Occasional | Medium |
| Clinical Trial Coordinator | PHP 22,000-32,000 | PHP 45,000-68,000 | PHP 85,000-128,000 | PHP 28,000-42,000 | PHP 58,000-88,000 | PHP 110,000-165,000 | ~6,000 | 28% | 68% | 40-45 | 80% | Hybrid | Occasional | High |
| Hospital Director | PHP 80,000-120,000 | PHP 175,000-262,000 | PHP 350,000-525,000 | PHP 105,000-158,000 | PHP 230,000-345,000 | PHP 460,000-690,000 | ~3,000 | 13% | 65% | 50 | 84% | On-site | Frequent | High |
| Chief Medical Officer (CMO) | PHP 100,000-150,000 | PHP 220,000-330,000 | PHP 440,000-660,000 | PHP 130,000-195,000 | PHP 290,000-435,000 | PHP 575,000-865,000 | ~1,500 | 10% | 66% | 50 | 86% | On-site | Frequent | High |
| Virology Researcher | PHP 26,000-38,000 | PHP 52,000-78,000 | PHP 98,000-148,000 | PHP 34,000-50,000 | PHP 68,000-102,000 | PHP 128,000-194,000 | ~3,000 | 18% | 67% | 40-45 | 80% | Hybrid/On-site | Occasional | High |
| Trauma Director | PHP 80,000-120,000 | PHP 170,000-255,000 | PHP 340,000-510,000 | PHP 105,000-158,000 | PHP 222,000-333,000 | PHP 445,000-668,000 | ~2,000 | 13% | 62% | 50 | 82% | On-site | Frequent | High |
| Oncology Dataset Lead | PHP 32,000-48,000 | PHP 65,000-98,000 | PHP 125,000-188,000 | PHP 42,000-62,000 | PHP 85,000-128,000 | PHP 162,000-245,000 | ~3,000 | 33% | 68% | 40-45 | 80% | Hybrid | Low | Medium |
| Medical Informatics Architect | PHP 40,000-60,000 | PHP 82,000-124,000 | PHP 165,000-248,000 | PHP 52,000-78,000 | PHP 108,000-162,000 | PHP 215,000-325,000 | ~5,000 | 38% | 70% | 40-45 | 82% | Hybrid/Remote | Low | Medium |
| Autonomous Systems Surgeon | PHP 120,000-180,000 | PHP 250,000-375,000 | PHP 500,000-750,000 | PHP 160,000-240,000 | PHP 330,000-495,000 | PHP 660,000-990,000 | ~400 | 50% | 67% | 50 | 83% | On-site/Hybrid | Occasional | High |

**Philippines Healthcare Context:** Regulatory bodies: DOH, PhilHealth, FDA Philippines. Key issues: severe brain drain of nurses overseas, PhilHealth compliance complexity, typhoon-related surge events for emergency roles, BSL compliance for virology, limited grant funding for research roles, NDPR (data privacy). Staff Nurse is highest demand (~100,000) but most affected by brain drain. Robotic surgery faces FDA Philippines approval barriers with very limited units available.

---

### LAOS (Currency: LAK millions/month)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Travel | Stress |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Clinical Assistant | 2-4M LAK | 4-7M LAK | 8-13M LAK | 3-5M LAK | 5-9M LAK | 10-17M LAK | ~6,000 | 42% | 66% | 40 | 68% | On-site | Low | Medium |
| Emergency Responder | 2.5-4M LAK | 5-8M LAK | 9-15M LAK | 3-5M LAK | 6-10M LAK | 12-20M LAK | ~5,000 | 22% | 56% | 45-50 | 66% | On-site | Frequent | High |
| Lab Technician | 3-5M LAK | 5-9M LAK | 10-16M LAK | 4-6M LAK | 7-12M LAK | 13-22M LAK | ~4,000 | 32% | 68% | 40 | 70% | On-site | Low | Medium |
| Staff Nurse | 2.5-4M LAK | 5-8M LAK | 9-14M LAK | 3-5M LAK | 6-10M LAK | 12-19M LAK | ~8,000 | 17% | 60% | 45-50 | 68% | On-site | Occasional | High |
| Pharmacy Technician | 2.5-4M LAK | 5-8M LAK | 9-14M LAK | 3-5M LAK | 6-10M LAK | 11-18M LAK | ~3,500 | 36% | 67% | 40 | 70% | On-site | Low | Medium |
| Radiologic Technologist | 3-5M LAK | 6-10M LAK | 11-18M LAK | 4-7M LAK | 8-13M LAK | 14-24M LAK | ~2,000 | 27% | 66% | 40-45 | 70% | On-site | Occasional | Medium |
| Surgical Technician | 3-5M LAK | 6-10M LAK | 11-18M LAK | 4-7M LAK | 8-13M LAK | 14-24M LAK | ~1,500 | 22% | 61% | 45-50 | 68% | On-site | Low | High |
| Health Data Analyst | 4-7M LAK | 8-13M LAK | 15-25M LAK | 5-9M LAK | 10-17M LAK | 20-33M LAK | ~1,500 | 41% | 68% | 40 | 70% | Hybrid | Low | Medium |
| Epidemiologist | 4-7M LAK | 9-14M LAK | 16-26M LAK | 5-9M LAK | 12-19M LAK | 21-34M LAK | ~1,000 | 17% | 67% | 40-45 | 74% | Hybrid/On-site | Occasional | High |
| Toxicologist | 4-7M LAK | 9-14M LAK | 16-26M LAK | 5-9M LAK | 12-19M LAK | 21-34M LAK | ~600 | 22% | 68% | 40 | 73% | Hybrid/On-site | Occasional | Medium |
| Clinical Trial Coordinator | 4-6M LAK | 8-13M LAK | 14-23M LAK | 5-8M LAK | 10-17M LAK | 18-30M LAK | ~500 | 26% | 67% | 40-45 | 70% | Hybrid | Occasional | High |
| Hospital Director | 12-20M LAK | 28-45M LAK | 55-88M LAK | 16-26M LAK | 36-58M LAK | 70-115M LAK | ~600 | 12% | 64% | 50 | 78% | On-site | Frequent | High |
| Chief Medical Officer (CMO) | 15-24M LAK | 34-55M LAK | 68-110M LAK | 20-32M LAK | 45-72M LAK | 88-142M LAK | ~300 | 10% | 65% | 50 | 80% | On-site | Frequent | High |
| Virology Researcher | 4-7M LAK | 9-14M LAK | 16-26M LAK | 5-9M LAK | 12-19M LAK | 21-34M LAK | ~400 | 17% | 66% | 40-45 | 72% | Hybrid/On-site | Occasional | High |
| Trauma Director | 12-20M LAK | 26-42M LAK | 52-84M LAK | 16-26M LAK | 34-55M LAK | 68-110M LAK | ~300 | 12% | 61% | 50 | 76% | On-site | Frequent | High |
| Oncology Dataset Lead | 5-8M LAK | 10-17M LAK | 20-32M LAK | 7-11M LAK | 13-22M LAK | 26-42M LAK | ~300 | 31% | 67% | 40-45 | 70% | Hybrid | Low | Medium |
| Medical Informatics Architect | 6-10M LAK | 13-21M LAK | 24-38M LAK | 8-13M LAK | 17-27M LAK | 31-50M LAK | ~400 | 36% | 68% | 40-45 | 72% | Hybrid/Remote | Low | Medium |
| Autonomous Systems Surgeon | 18-28M LAK | 40-65M LAK | 80-130M LAK | 24-38M LAK | 55-88M LAK | 105-170M LAK | ~50 | 50% | 66% | 50 | 72% | On-site/Hybrid | Occasional | High |

**Laos Healthcare Context:** Smallest healthcare market in this dataset. Regulatory body: MoH Laos. WHO coordination is important for epidemiology and outbreak response. Key challenges: limited medical supplies and equipment, reagent shortages in labs, minimal EHR infrastructure, very few trained specialists in virology/toxicology/oncology, virtually no robotic surgery units, regulatory vacuum for autonomous systems, BSL limitations. Staff Nurse is highest demand (~8,000). Autonomous Systems Surgeon has only ~50 openings -- the lowest of any role across any country in this dataset.

---

## CROSS-COUNTRY QUICK REFERENCE

### Highest Paying Country by Role (Senior, International Company)
- All frontline roles (Clinical Asst, Nurse, Pharmacy Tech, Radiologic, Surgical): **Singapore** leads
- Hospital Director: **Singapore** SGD 55,000-85,000
- CMO: **Singapore** SGD 70,000-100,000
- Autonomous Systems Surgeon: **Singapore** SGD 70,000-110,000
- Research roles (Epidemiologist, Toxicologist, Virology): **Singapore** SGD 20,000-30,000

### Highest Demand Roles (6-month openings across SEA)
1. Staff Nurse -- highest demand in Malaysia (~120,000), Vietnam (~100,000), Philippines (~100,000)
2. Clinical Assistant -- Malaysia ~100,000, Thailand ~80,000, Vietnam ~80,000
3. Emergency Responder -- Thailand ~60,000, Vietnam ~60,000, Philippines ~60,000
4. Lab Technician -- Malaysia ~70,000, Vietnam ~55,000, Philippines ~55,000

### Lowest Demand Roles (niche/senior)
- Autonomous Systems Surgeon: Laos ~50, Philippines ~400, Singapore ~1,000
- CMO: Laos ~300, Singapore ~800
- Trauma Director: Laos ~300, Singapore ~800

### AI Disruption Risk Rankings
- **Highest risk:** Autonomous Systems Surgeon (50%), Clinical Assistant (42-45%), Health Data Analyst (41-45%)
- **Lowest risk:** CMO (10%), Hospital Director (13%), Emergency Responder & Trauma Director (13%)
- Note: Frontline clinical roles score higher AI risk due to automation of routine tasks; leadership roles score lower due to judgment/governance requirements

### Best Work-Life Balance (WLB %)
- Health Data Analyst: **Singapore** 72%, Malaysia 72%, Thailand 70%
- CMO: **Malaysia** 70% > Singapore 68%
- Emergency Responder: lowest WLB across all countries (56-60%)
- Trauma Director: consistently lowest WLB in every country (61-63%)

### Stability Rankings (highest %)
- CMO: 80-92% across all countries (most stable role)
- Hospital Director: 78-90%
- Emergency Responder: 66-82% (varies most by country)

### Work Mode Summary
- **Frontline clinical roles** (Nurse, Emergency, Clinical Asst, Surgical Tech, Radiologic): On-site only across all countries
- **Research & analytics roles** (Health Data Analyst, Epidemiologist, Medical Informatics): Hybrid or Hybrid/Remote
- **Leadership roles** (Hospital Director, CMO, Trauma Director): On-site with frequent travel
- **Autonomous Systems Surgeon:** On-site/Hybrid (technology-adjacent)

---

## RESPONSE GUIDELINES

- Always specify the country and whether salary is for a **local** or **international** company
- Laos salaries are in LAK millions/month; all others in local currency as labelled
- WLB % = self-reported work-life balance satisfaction score
- Stability % = job security / role stability rating
- AI Risk % = estimated probability of significant AI disruption to this role within 5 years
- Demand = approximate number of open roles in the country over a 6-month period
- Career progressions show the standard linear path; pivot paths show lateral moves available at any stage
- When users ask "which country is best for X role," factor in salary, WLB, demand, stability, and AI risk together -- not salary alone
- Healthcare roles are almost universally On-site; remote/hybrid is mainly available in analytics and informatics roles
- Brain drain is a significant issue in the Philippines for nursing; factor this into career advice for Filipino healthcare workers
# CareerOS -- Codex System Prompt: Education & Social Impact Sector

---

## CAREER PROGRESSION PATHS (All 18 Education & Social Impact Roles)

### 1. Classroom Assistant
0-2 yrs: Classroom Assistant -> 2-4 yrs: Lead Classroom Assistant -> 4-7 yrs: Teacher Aide Coordinator -> 7-10 yrs: Learning Support Specialist (LSS) -> 10+ yrs: Special Education Lead / Head of LSS
**Pivot paths:** Early Childhood Educator * Tutor * School Administrator * Social Worker

### 2. Training Presenter
0-2 yrs: Junior Trainer / Presenter -> 2-4 yrs: Training Presenter -> 4-7 yrs: Senior Training Presenter -> 7-10 yrs: Training Manager / Head of L&D -> 10+ yrs: Chief Learning Officer / L&D Director
**Pivot paths:** Instructional Designer * Public Relations Specialist * Sales & Marketing * HR Business Partner

### 3. Junior Instructional Designer
0-2 yrs: Junior Instructional Designer -> 2-4 yrs: Instructional Designer -> 4-7 yrs: Senior Instructional Designer -> 7-10 yrs: Lead ID / Learning Experience Manager -> 10+ yrs: Director of ID / Chief Learning Architect
**Pivot paths:** Content Developer * UI/UX Designer * Project Manager * Technical Writer

### 4. Junior Guidance Counselor
0-2 yrs: Junior Guidance Counselor -> 2-4 yrs: Guidance Counselor -> 4-7 yrs: Senior Guidance Counselor -> 7-10 yrs: Head of Student Services -> 10+ yrs: School Psychologist / Director of Student Well-being
**Pivot paths:** Social Worker * HR Specialist * Career Coach * Educational Consultant

### 5. Junior LMS Administrator
0-2 yrs: Junior LMS Administrator -> 2-4 yrs: LMS Administrator -> 4-7 yrs: Senior LMS Administrator -> 7-10 yrs: LMS Manager / Learning Tech Lead -> 10+ yrs: Director of Learning Platforms / EdTech Strategist
**Pivot paths:** IT Support Specialist * Data Analyst * Web Developer * Project Coordinator

### 6. Junior Social Field Researcher
0-2 yrs: Junior Social Field Researcher -> 2-4 yrs: Social Field Researcher -> 4-7 yrs: Senior Social Field Researcher -> 7-10 yrs: Program Manager / Research Team Lead -> 10+ yrs: Head of Research & M&E / Program Director
**Pivot paths:** Policy Analyst * Community Development Officer * Grant Writer * Data Analyst

### 7. Junior Data Logger
0-2 yrs: Junior Data Logger -> 2-4 yrs: Data Logger -> 4-7 yrs: Senior Data Logger / Data Quality Specialist -> 7-10 yrs: Data Coordinator / Database Administrator -> 10+ yrs: M&E Specialist / Data Systems Manager
**Pivot paths:** Research Assistant * BI Analyst * Administrative Assistant * GIS Technician

### 8. Academic Principal
0-2 yrs: Dept Head / Assistant Principal -> 2-4 yrs: Academic Principal -> 4-7 yrs: Senior Principal / School Director -> 7-10 yrs: Regional Education Director -> 10+ yrs: Superintendent / Head of School Network
**Pivot paths:** Educational Consultant * Ministry of Education Official * University Lecturer * Policy Advisor

### 9. Distance Learning Director
0-2 yrs: Online Course Manager -> 2-4 yrs: Distance Learning Director -> 4-7 yrs: Senior DL Director / Head of Digital Learning -> 7-10 yrs: VP of Online Education -> 10+ yrs: Chief Education Technology Officer (CETO)
**Pivot paths:** EdTech Entrepreneur * Curriculum Strategist * Product Manager (EdTech) * Learning & Development Director

### 10. Curriculum Strategy Chief
0-2 yrs: Senior Curriculum Developer -> 2-4 yrs: Curriculum Strategy Chief -> 4-7 yrs: Head of Curriculum Design -> 7-10 yrs: Director of Academic Programs -> 10+ yrs: Chief Academic Officer / VP Curriculum
**Pivot paths:** Educational Publisher * Policy Advisor * Pedagogy Consultant * Teacher Trainer

### 11. Clinical Services Supervisor
0-2 yrs: Therapies Lead / Senior Counselor -> 2-4 yrs: Clinical Services Supervisor -> 4-7 yrs: Clinical Director -> 7-10 yrs: Head of Wellness Programs -> 10+ yrs: VP of Health & Welfare / Social Impact Director
**Pivot paths:** Public Health Specialist * Mental Health Advocate * Non-profit Director * Research Fellow

### 12. Human Rights Director
0-2 yrs: Senior Human Rights Officer -> 2-4 yrs: Human Rights Director -> 4-7 yrs: Regional HR Director -> 7-10 yrs: Head of Advocacy & Policy -> 10+ yrs: Global Programs Director / NGO Country Director
**Pivot paths:** International Law Consultant * Government Advisor * Public Policy Analyst * Activist/Advocate

### 13. NGO Managing Director
0-2 yrs: Program Officer / Project Coordinator -> 2-5 yrs: Program Manager / Country Programs Lead -> 5-8 yrs: Deputy Director / Director of Operations -> 8-12 yrs: NGO Managing Director -> 12+ yrs: Country Director / Regional Director / INGO Executive Director
**Pivot paths:** Policy Advisor * Government Liaison * Social Enterprise CEO * International Development Consultant * Board Director

### 14. Program Evaluation Lead
0-2 yrs: M&E Assistant / Research Assistant -> 2-4 yrs: M&E Officer / Program Evaluator -> 4-7 yrs: M&E Specialist / Senior Evaluator -> 7-10 yrs: Program Evaluation Lead / Head of M&E -> 10+ yrs: Director of Learning & Evaluation / Chief of Party
**Pivot paths:** Policy Analyst * Research Director * Impact & Data Consultant * Social Sector Data Analyst * Grant Evaluator

### 15. Community Organizer
0-2 yrs: Community Outreach Worker / Field Officer -> 2-4 yrs: Community Organizer -> 4-7 yrs: Senior Organizer / Program Coordinator -> 7-10 yrs: Advocacy Manager / Community Engagement Manager -> 10+ yrs: Director of Community Engagement / NGO Program Director
**Pivot paths:** Social Worker * Policy Advocate * NGO Program Manager * Municipal Government Officer * Civil Society Leader

### 16. Educational Evaluator
0-2 yrs: Research Assistant / Education Research Associate -> 2-4 yrs: Educational Researcher / Junior Evaluator -> 4-7 yrs: Educational Evaluator / Assessment Specialist -> 7-10 yrs: Senior Evaluator / Head of Education Quality -> 10+ yrs: Director of Educational Standards / Chief Education Evaluation Officer
**Pivot paths:** Curriculum Developer * Education Policy Analyst * Academic Researcher * Instructional Designer * EdTech Product Strategist

### 17. Family Caseworker
0-2 yrs: Social Work Assistant / Community Support Worker -> 2-4 yrs: Family Caseworker -> 4-7 yrs: Senior Caseworker / Case Supervisor -> 7-10 yrs: Programme Manager (Family Services) / Child Protection Coordinator -> 10+ yrs: Director of Social Services / Head of Family Welfare
**Pivot paths:** Child Protection Officer * Mental Health Counselor * NGO Program Officer * Social Policy Analyst * Community Development Manager

### 18. Welfare Policy Analyst
0-2 yrs: Research Assistant / Policy Research Officer -> 2-4 yrs: Policy Analyst -> 4-7 yrs: Welfare Policy Analyst / Senior Policy Analyst -> 7-10 yrs: Policy Manager / Head of Social Policy -> 10+ yrs: Director of Social Policy / Government Policy Advisor
**Pivot paths:** Government Advisor * NGO Advocacy Lead * Academic Researcher * Strategy Consultant (Public Sector) * Social Impact Investor

---

## SALARY & MARKET DATA BY COUNTRY

---

### MALAYSIA (Currency: MYR / RM)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Classroom Assistant | RM 1,800-2,500 | RM 2,800-3,500 | RM 4,000-5,500 | RM 2,200-3,000 | RM 3,500-4,500 | RM 5,000-6,500 | ~35,000 | 45% | 70% | 40 | 85% | On-site | -- | Low | Medium | -- |
| Training Presenter | RM 2,500-3,200 | RM 4,000-5,500 | RM 6,500-8,500 | RM 3,000-3,800 | RM 5,000-7,000 | RM 8,000-10,000 | ~15,000 | 30% | 68% | 45 | 78% | Hybrid/On-site | -- | Occasional | High | -- |
| Junior Instructional Designer | RM 2,800-3,500 | RM 4,500-6,000 | RM 7,000-9,000 | RM 3,500-4,200 | RM 5,500-7,500 | RM 8,500-10,500 | ~10,000 | 35% | 70% | 40 | 80% | Hybrid/Remote | -- | Low | Medium | -- |
| Junior Guidance Counselor | RM 2,800-3,500 | RM 4,500-6,000 | RM 7,000-9,000 | RM 3,500-4,200 | RM 5,500-7,500 | RM 8,500-10,500 | ~8,000 | 25% | 72% | 40 | 85% | On-site | -- | Low | Medium | -- |
| Junior LMS Administrator | RM 2,200-2,800 | RM 3,500-4,500 | RM 5,000-6,500 | RM 2,800-3,500 | RM 4,500-5,800 | RM 6,000-7,800 | ~7,000 | 40% | 70% | 40 | 80% | Hybrid/Remote | -- | Low | Medium | -- |
| Junior Social Field Researcher | RM 2,000-2,800 | RM 3,200-4,500 | RM 5,500-7,000 | RM 2,500-3,500 | RM 4,000-5,500 | RM 6,500-8,000 | ~9,000 | 28% | 65% | 45 | 75% | On-site | -- | Frequent | Medium | -- |
| Junior Data Logger | RM 1,800-2,500 | RM 2,800-3,800 | RM 4,000-5,500 | RM 2,200-3,000 | RM 3,500-4,800 | RM 5,000-6,500 | ~8,000 | 50% | 70% | 40 | 80% | On-site | -- | Low | Low | -- |
| Academic Principal | RM 7,000-9,000 | RM 15,000-20,000 | RM 25,000-35,000 | RM 8,500-11,000 | RM 18,000-25,000 | RM 30,000-40,000 | ~3,000 | 15% | 65% | 50 | 88% | On-site | -- | Occasional | High | -- |
| Distance Learning Director | RM 6,000-8,000 | RM 12,000-16,000 | RM 20,000-28,000 | RM 7,500-10,000 | RM 14,000-19,000 | RM 25,000-35,000 | ~2,500 | 20% | 68% | 45 | 82% | Hybrid/Remote | -- | Occasional | Medium | -- |
| Curriculum Strategy Chief | RM 6,500-8,500 | RM 13,000-18,000 | RM 22,000-30,000 | RM 8,000-10,500 | RM 16,000-22,000 | RM 28,000-38,000 | ~2,000 | 20% | 68% | 45 | 85% | Hybrid | -- | Occasional | Medium | -- |
| Clinical Services Supervisor | RM 5,000-7,000 | RM 10,000-14,000 | RM 18,000-25,000 | RM 6,000-8,500 | RM 12,000-16,000 | RM 22,000-30,000 | ~1,500 | 22% | 72% | 45 | 85% | On-site | -- | Occasional | High | -- |
| Human Rights Director | RM 7,000-9,000 | RM 14,000-18,000 | RM 22,000-30,000 | RM 8,500-11,000 | RM 17,000-22,000 | RM 28,000-38,000 | ~1,000 | 18% | 65% | 50 | 80% | On-site/Hybrid | -- | Frequent | High | -- |
| NGO Managing Director | RM 3,500-5,000 | RM 8,000-12,000 | RM 18,000-28,000 | RM 5,000-7,000 | RM 12,000-18,000 | RM 22,000-35,000 | ~3,000 | 15% | 62% | 48-55 | 80% | On-site/Hybrid | Mission-driven, hierarchical, relationship-based | Frequent | High | Donor dependency, staff burnout, limited talent pipeline, ROS compliance |
| Program Evaluation Lead | RM 2,800-3,800 | RM 5,500-9,000 | RM 10,000-16,000 | RM 3,500-5,000 | RM 7,000-11,000 | RM 13,000-20,000 | ~4,000 | 28% | 65% | 42-47 | 78% | Hybrid | Data-driven, collaborative, report-heavy | Moderate | Medium | Tight evaluation timelines, field data quality, balancing quant and qual methods |
| Community Organizer | RM 1,800-2,800 | RM 3,000-5,000 | RM 6,000-9,000 | RM 2,500-3,500 | RM 4,000-6,500 | RM 7,500-11,000 | ~12,000 | 18% | 60% | 45-50 | 72% | On-site/Field | Grassroots, people-first, physically demanding | Frequent | High | Community resistance, language/dialect barriers, low pay, political sensitivities |
| Educational Evaluator | RM 2,500-3,500 | RM 4,500-7,500 | RM 8,000-13,000 | RM 3,200-4,500 | RM 6,000-9,500 | RM 10,000-16,000 | ~6,000 | 32% | 65% | 42-46 | 76% | Hybrid | Evidence-based, structured, academic culture | Moderate | Medium | Diverse school types, AI changing assessment design, limited evaluation budgets |
| Family Caseworker | RM 1,800-2,500 | RM 2,500-5,500 | RM 6,000-9,500 | RM 2,500-3,500 | RM 3,500-7,000 | RM 7,500-12,000 | ~18,000 | 20% | 58% | 42-50 | 75% | On-site/Field | Empathetic, team-dependent, bureaucratic | Frequent | Very High | Emotional burnout, high caseloads, trauma work, JKM bureaucracy |
| Welfare Policy Analyst | RM 2,800-3,800 | RM 5,000-9,000 | RM 10,000-15,000 | RM 3,500-5,000 | RM 6,500-11,000 | RM 12,000-18,000 | ~4,500 | 25% | 65% | 42-47 | 80% | Hybrid | Analytical, formal, government-adjacent | Low | Medium | Slow policy cycles, limited government data access, translating research to policy |

**Malaysia Edu/Social Context:** Strong public school system, growing international school sector. INGOs like Mercy Malaysia are significant. EdTech market is expanding. Demand in Classroom Assistant (~35,000). Academic Principal ($30,000-40,000 senior intl) is the top earner. Common challenge: Balancing public education quality with increasing demand for private and international options.

---

### SINGAPORE (Currency: SGD)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Classroom Assistant | SGD 2,000-2,800 | SGD 3,200-4,000 | SGD 4,500-6,000 | SGD 2,500-3,500 | SGD 4,000-5,000 | SGD 5,500-7,000 | ~12,000 | 42% | 72% | 40 | 88% | On-site | -- | Low | Medium | -- |
| Training Presenter | SGD 3,000-3,800 | SGD 4,800-6,500 | SGD 7,500-9,500 | SGD 3,800-4,800 | SGD 6,000-8,000 | SGD 9,000-11,000 | ~6,000 | 28% | 70% | 45 | 80% | Hybrid/On-site | -- | Occasional | High | -- |
| Junior Instructional Designer | SGD 3,500-4,200 | SGD 5,500-7,000 | SGD 8,000-10,000 | SGD 4,200-5,000 | SGD 6,500-8,500 | SGD 9,500-12,000 | ~5,000 | 32% | 72% | 40 | 82% | Hybrid/Remote | -- | Low | Medium | -- |
| Junior Guidance Counselor | SGD 3,500-4,200 | SGD 5,500-7,000 | SGD 8,000-10,000 | SGD 4,200-5,000 | SGD 6,500-8,500 | SGD 9,500-12,000 | ~3,500 | 22% | 74% | 40 | 88% | On-site | -- | Low | Medium | -- |
| Junior LMS Administrator | SGD 2,800-3,500 | SGD 4,200-5,500 | SGD 6,000-7,500 | SGD 3,500-4,200 | SGD 5,000-6,500 | SGD 7,000-9,000 | ~3,000 | 38% | 72% | 40 | 82% | Hybrid/Remote | -- | Low | Medium | -- |
| Junior Social Field Researcher | SGD 2,500-3,500 | SGD 4,000-5,500 | SGD 6,500-8,000 | SGD 3,200-4,200 | SGD 5,000-6,800 | SGD 7,500-9,500 | ~4,000 | 25% | 68% | 45 | 78% | On-site | -- | Frequent | Medium | -- |
| Junior Data Logger | SGD 2,200-3,000 | SGD 3,500-4,500 | SGD 5,000-6,500 | SGD 2,800-3,800 | SGD 4,200-5,500 | SGD 6,000-7,800 | ~3,500 | 48% | 72% | 40 | 82% | On-site | -- | Low | Low | -- |
| Academic Principal | SGD 8,000-10,000 | SGD 18,000-25,000 | SGD 28,000-40,000 | SGD 9,500-12,000 | SGD 22,000-30,000 | SGD 35,000-50,000 | ~1,200 | 12% | 68% | 50 | 90% | On-site | -- | Occasional | High | -- |
| Distance Learning Director | SGD 7,000-9,000 | SGD 14,000-19,000 | SGD 22,000-30,000 | SGD 8,500-11,000 | SGD 17,000-23,000 | SGD 28,000-38,000 | ~1,000 | 18% | 70% | 45 | 85% | Hybrid/Remote | -- | Occasional | Medium | -- |
| Curriculum Strategy Chief | SGD 7,500-9,500 | SGD 15,000-20,000 | SGD 25,000-35,000 | SGD 9,000-12,000 | SGD 18,000-25,000 | SGD 30,000-40,000 | ~900 | 18% | 70% | 45 | 88% | Hybrid | -- | Occasional | Medium | -- |
| Clinical Services Supervisor | SGD 6,000-8,000 | SGD 12,000-16,000 | SGD 20,000-28,000 | SGD 7,500-10,000 | SGD 15,000-20,000 | SGD 25,000-35,000 | ~700 | 20% | 74% | 45 | 88% | On-site | -- | Occasional | High | -- |
| Human Rights Director | SGD 8,000-10,000 | SGD 16,000-22,000 | SGD 25,000-35,000 | SGD 9,500-12,000 | SGD 19,000-25,000 | SGD 30,000-40,000 | ~500 | 15% | 68% | 50 | 82% | On-site/Hybrid | -- | Frequent | High | -- |
| NGO Managing Director | SGD 4,500-6,500 | SGD 10,000-16,000 | SGD 22,000-35,000 | SGD 6,000-9,000 | SGD 14,000-22,000 | SGD 28,000-45,000 | ~1,500 | 15% | 63% | 48-55 | 83% | On-site/Hybrid | Mission-driven, compliance-conscious, transparent | Frequent | High | Charities Act compliance, donor reporting, retaining talent vs private sector, managing volunteer boards |
| Program Evaluation Lead | SGD 3,500-4,800 | SGD 6,500-10,000 | SGD 12,000-18,000 | SGD 4,500-6,000 | SGD 8,000-13,000 | SGD 15,000-22,000 | ~1,200 | 28% | 67% | 42-46 | 80% | Hybrid | Data-rigorous, outcome-focused, internationally benchmarked | Low-Moderate | Medium | Defining impact metrics, board-level reporting pressure, limited M&E talent pool |
| Community Organizer | SGD 2,500-3,500 | SGD 3,800-5,500 | SGD 6,500-9,500 | SGD 3,200-4,500 | SGD 5,000-7,500 | SGD 8,000-12,000 | ~4,000 | 18% | 62% | 45-50 | 75% | On-site/Field | Community-centric, multicultural, civic-minded | Moderate | High | Diverse community engagement, navigating OB markers, digital exclusion among elderly |
| Educational Evaluator | SGD 3,200-4,500 | SGD 5,500-8,500 | SGD 9,500-14,000 | SGD 4,000-5,500 | SGD 7,000-11,000 | SGD 12,000-18,000 | ~2,000 | 32% | 67% | 42-46 | 78% | Hybrid | Evidence-based, MOE-aligned, high accountability | Low | Medium | Keeping pace with MOE curriculum updates, school resistance to external evaluation, AI tool adoption |
| Family Caseworker | SGD 2,800-3,800 | SGD 3,500-6,000 | SGD 7,000-10,500 | SGD 3,500-4,800 | SGD 4,500-7,500 | SGD 8,500-13,000 | ~6,000 | 20% | 60% | 42-48 | 78% | On-site/Field | Empathetic, MSF-regulated, multidisciplinary | Moderate | Very High | Compassion fatigue, complex family dynamics, CYPA court reporting, high caseload-to-staff ratio |
| Welfare Policy Analyst | SGD 3,800-5,000 | SGD 6,000-10,000 | SGD 12,000-18,000 | SGD 5,000-7,000 | SGD 8,000-13,000 | SGD 14,000-22,000 | ~1,500 | 25% | 66% | 42-47 | 83% | Hybrid | Analytical, data-driven, MOH/MSF-adjacent | Low | Medium | Translating research under political constraints, CPF/SingPass data access, short policy windows |

**Singapore Edu/Social Context:** Highly competitive education landscape with premium international schools. Strong hub for EdTech startups and INGO regional offices. Classroom Assistant has highest demand (~12,000). Academic Principal (SGD 35,000-50,000 senior intl) is the top earner. Common challenge: High cost of living impacting teacher retention in local schools.

---

### THAILAND (Currency: THB)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Classroom Assistant | THB 15,000-22,000 | THB 25,000-35,000 | THB 40,000-55,000 | THB 20,000-28,000 | THB 32,000-45,000 | THB 50,000-70,000 | ~25,000 | 40% | 68% | 40 | 82% | On-site | -- | Low | Medium | -- |
| Training Presenter | THB 20,000-28,000 | THB 35,000-48,000 | THB 55,000-75,000 | THB 25,000-35,000 | THB 42,000-60,000 | THB 65,000-88,000 | ~10,000 | 28% | 65% | 45 | 75% | Hybrid/On-site | -- | Occasional | High | -- |
| Junior Instructional Designer | THB 22,000-30,000 | THB 38,000-52,000 | THB 60,000-80,000 | THB 28,000-38,000 | THB 45,000-65,000 | THB 70,000-95,000 | ~7,000 | 32% | 68% | 40 | 78% | Hybrid/Remote | -- | Low | Medium | -- |
| Junior Guidance Counselor | THB 22,000-30,000 | THB 38,000-52,000 | THB 60,000-80,000 | THB 28,000-38,000 | THB 45,000-65,000 | THB 70,000-95,000 | ~5,000 | 22% | 70% | 40 | 85% | On-site | -- | Low | Medium | -- |
| Junior LMS Administrator | THB 18,000-25,000 | THB 30,000-40,000 | THB 45,000-60,000 | THB 22,000-30,000 | THB 35,000-48,000 | THB 52,000-70,000 | ~4,500 | 38% | 68% | 40 | 78% | Hybrid/Remote | -- | Low | Medium | -- |
| Junior Social Field Researcher | THB 16,000-24,000 | THB 28,000-38,000 | THB 48,000-65,000 | THB 20,000-30,000 | THB 35,000-48,000 | THB 58,000-78,000 | ~6,000 | 25% | 63% | 45 | 72% | On-site | -- | Frequent | Medium | -- |
| Junior Data Logger | THB 15,000-22,000 | THB 25,000-35,000 | THB 40,000-55,000 | THB 20,000-28,000 | THB 32,000-45,000 | THB 50,000-70,000 | ~5,000 | 48% | 68% | 40 | 78% | On-site | -- | Low | Low | -- |
| Academic Principal | THB 60,000-80,000 | THB 120,000-180,000 | THB 200,000-300,000 | THB 75,000-100,000 | THB 140,000-220,000 | THB 250,000-380,000 | ~2,000 | 12% | 65% | 50 | 85% | On-site | -- | Occasional | High | -- |
| Distance Learning Director | THB 50,000-70,000 | THB 100,000-140,000 | THB 160,000-240,000 | THB 60,000-85,000 | THB 120,000-170,000 | THB 200,000-280,000 | ~1,500 | 18% | 68% | 45 | 80% | Hybrid/Remote | -- | Occasional | Medium | -- |
| Curriculum Strategy Chief | THB 55,000-75,000 | THB 110,000-150,000 | THB 180,000-260,000 | THB 68,000-90,000 | THB 130,000-180,000 | THB 220,000-300,000 | ~1,200 | 18% | 68% | 45 | 82% | Hybrid | -- | Occasional | Medium | -- |
| Clinical Services Supervisor | THB 40,000-55,000 | THB 80,000-110,000 | THB 130,000-180,000 | THB 50,000-68,000 | THB 100,000-135,000 | THB 160,000-220,000 | ~800 | 20% | 70% | 45 | 82% | On-site | -- | Occasional | High | -- |
| Human Rights Director | THB 60,000-80,000 | THB 120,000-160,000 | THB 200,000-280,000 | THB 75,000-100,000 | THB 140,000-200,000 | THB 240,000-340,000 | ~600 | 15% | 63% | 50 | 78% | On-site/Hybrid | -- | Frequent | High | -- |
| NGO Managing Director | THB 35,000-55,000 | THB 80,000-130,000 | THB 160,000-260,000 | THB 50,000-75,000 | THB 110,000-180,000 | THB 200,000-320,000 | ~2,500 | 15% | 62% | 48-55 | 78% | On-site/Hybrid | Hierarchical, relationship-first, Buddhist values | Frequent | High | NGO registration laws, political climate sensitivity, coordinating provincial and Bangkok teams |
| Program Evaluation Lead | THB 25,000-38,000 | THB 50,000-80,000 | THB 90,000-145,000 | THB 32,000-50,000 | THB 65,000-105,000 | THB 120,000-190,000 | ~3,000 | 28% | 65% | 42-47 | 75% | Hybrid | Data-driven, NGO-influenced, internationally funded | Moderate | Medium | Thai-language stakeholder communication, rural data reliability, short donor timelines |
| Community Organizer | THB 14,000-22,000 | THB 25,000-42,000 | THB 50,000-80,000 | THB 18,000-28,000 | THB 32,000-55,000 | THB 65,000-100,000 | ~9,000 | 18% | 60% | 45-52 | 70% | On-site/Field | Grassroots, community-led, informal | Frequent | High | Rural mobility challenges, dialect diversity, political restrictions in border provinces |
| Educational Evaluator | THB 22,000-32,000 | THB 40,000-65,000 | THB 70,000-115,000 | THB 28,000-42,000 | THB 52,000-85,000 | THB 90,000-145,000 | ~4,500 | 32% | 65% | 42-46 | 74% | Hybrid | Structured, OBEC-aligned, ministry-linked | Low-Moderate | Medium | MOE bureaucratic processes, school data inconsistency, adapting international frameworks to Thai context |
| Family Caseworker | THB 13,000-20,000 | THB 22,000-40,000 | THB 50,000-80,000 | THB 17,000-26,000 | THB 30,000-52,000 | THB 65,000-100,000 | ~12,000 | 20% | 58% | 42-50 | 72% | On-site/Field | Empathetic, MSDHS-linked, community-based | Frequent | Very High | High caseloads in rural areas, limited psychological support, domestic violence case complexity |
| Welfare Policy Analyst | THB 25,000-38,000 | THB 45,000-78,000 | THB 85,000-140,000 | THB 32,000-48,000 | THB 60,000-100,000 | THB 110,000-175,000 | ~3,500 | 25% | 65% | 42-47 | 76% | Hybrid | Analytical, government-adjacent, research-oriented | Low | Medium | Military-influenced policy cycles, limited welfare data transparency, bridging academia and government |

**Thailand Edu/Social Context:** Significant private and international school presence, burgeoning EdTech scene (e.g., Ruangguru's presence). Strong NGO sector focused on human rights and rural development. Classroom Assistant has highest demand (~25,000). Academic Principal (THB 250,000-380,000 senior intl) is the top earner. Common challenge: Attracting and retaining qualified Thai teachers in international schools due to salary disparity.

---

### VIETNAM (Currency: VND millions/month)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Classroom Assistant | VND 6-9M | VND 10-15M | VND 18-28M | VND 8-12M | VND 12-18M | VND 22-35M | ~30,000 | 40% | 68% | 40 | 80% | On-site | -- | Low | Medium | -- |
| Training Presenter | VND 8-12M | VND 15-22M | VND 28-40M | VND 10-15M | VND 18-28M | VND 35-50M | ~12,000 | 28% | 65% | 45 | 75% | Hybrid/On-site | -- | Occasional | High | -- |
| Junior Instructional Designer | VND 9-14M | VND 16-25M | VND 30-45M | VND 12-18M | VND 20-30M | VND 38-55M | ~8,000 | 32% | 68% | 40 | 78% | Hybrid/Remote | -- | Low | Medium | -- |
| Junior Guidance Counselor | VND 9-14M | VND 16-25M | VND 30-45M | VND 12-18M | VND 20-30M | VND 38-55M | ~6,000 | 22% | 70% | 40 | 80% | On-site | -- | Low | Medium | -- |
| Junior LMS Administrator | VND 7-10M | VND 12-18M | VND 22-32M | VND 9-13M | VND 15-22M | VND 28-38M | ~5,000 | 38% | 68% | 40 | 78% | Hybrid/Remote | -- | Low | Medium | -- |
| Junior Social Field Researcher | VND 7-11M | VND 13-20M | VND 25-38M | VND 9-14M | VND 16-25M | VND 30-45M | ~7,000 | 25% | 63% | 45 | 72% | On-site | -- | Frequent | Medium | -- |
| Junior Data Logger | VND 6-9M | VND 10-16M | VND 19-28M | VND 8-12M | VND 12-19M | VND 23-33M | ~6,000 | 48% | 68% | 40 | 78% | On-site | -- | Low | Low | -- |
| Academic Principal | VND 30-45M | VND 60-90M | VND 100-150M | VND 38-55M | VND 75-110M | VND 130-200M | ~2,500 | 12% | 65% | 50 | 85% | On-site | -- | Occasional | High | -- |
| Distance Learning Director | VND 25-40M | VND 50-75M | VND 85-130M | VND 32-50M | VND 62-95M | VND 110-160M | ~1,800 | 18% | 68% | 45 | 80% | Hybrid/Remote | -- | Occasional | Medium | -- |
| Curriculum Strategy Chief | VND 28-42M | VND 55-80M | VND 95-145M | VND 35-52M | VND 68-100M | VND 120-180M | ~1,500 | 18% | 68% | 45 | 82% | Hybrid | -- | Occasional | Medium | -- |
| Clinical Services Supervisor | VND 20-30M | VND 40-60M | VND 70-100M | VND 25-38M | VND 50-75M | VND 85-125M | ~1,000 | 20% | 70% | 45 | 82% | On-site | -- | Occasional | High | -- |
| Human Rights Director | VND 30-45M | VND 55-85M | VND 95-140M | VND 38-55M | VND 68-105M | VND 120-170M | ~800 | 15% | 63% | 50 | 78% | On-site/Hybrid | -- | Frequent | High | -- |
| NGO Managing Director | VND 20-35M | VND 55-90M | VND 110-180M | VND 30-50M | VND 80-130M | VND 150-250M | ~2,500 | 15% | 62% | 48-55 | 78% | On-site/Hybrid | Mission-driven, government-partnership required, VUSTA-linked | Frequent | High | Government approval requirements, foreign funding reporting, retaining bilingual staff |
| Program Evaluation Lead | VND 12-20M | VND 28-50M | VND 60-100M | VND 18-30M | VND 40-70M | VND 85-140M | ~4,500 | 28% | 65% | 42-47 | 76% | Hybrid | Data-oriented, INGO-influenced, field-heavy | Moderate | Medium | Rural data collection reliability, language barriers in reporting, VUSTA/PACCOM requirements |
| Community Organizer | VND 7-12M | VND 14-25M | VND 30-50M | VND 10-16M | VND 20-35M | VND 40-65M | ~14,000 | 18% | 60% | 45-52 | 70% | On-site/Field | Collective-first, community-embedded, grassroots | Frequent | High | Government permit requirements, dialect diversity, low pay and retention challenges |
| Educational Evaluator | VND 10-16M | VND 22-38M | VND 45-80M | VND 14-22M | VND 30-52M | VND 60-105M | ~7,000 | 32% | 65% | 42-46 | 74% | Hybrid | Ministry-aligned, structured, increasingly tech-enabled | Low-Moderate | Medium | MOET curriculum changes, inconsistent school data, limited evaluation tools in Vietnamese |
| Family Caseworker | VND 7-12M | VND 15-28M | VND 35-60M | VND 10-16M | VND 20-38M | VND 45-75M | ~20,000 | 20% | 58% | 42-50 | 72% | On-site/Field | Community-based, MOLISA-linked, informal support networks | Frequent | Very High | High caseloads, limited training, navigating family dispute resolution under Vietnamese family law |
| Welfare Policy Analyst | VND 12-20M | VND 28-50M | VND 60-100M | VND 16-26M | VND 38-65M | VND 80-130M | ~5,000 | 25% | 65% | 42-47 | 76% | Hybrid | Research-focused, CPV-adjacent, formal | Low | Medium | Limited disaggregated welfare data, policy driven by party directives, translating global frameworks locally |

**Vietnam Edu/Social Context:** Rapidly expanding education market, especially EdTech (Topica's success) and international schools. Large youth population drives demand. Classroom Assistant has highest demand (~30,000). Academic Principal (VND 130-200M senior intl) is the top earner. Common challenge: Balancing rapid growth with maintaining educational quality and adapting to new curricula.

---

### PHILIPPINES (Currency: PHP)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Classroom Assistant | PHP 15,000-22,000 | PHP 25,000-35,000 | PHP 40,000-55,000 | PHP 20,000-28,000 | PHP 32,000-45,000 | PHP 50,000-70,000 | ~28,000 | 40% | 68% | 40 | 80% | On-site | -- | Low | Medium | -- |
| Training Presenter | PHP 20,000-28,000 | PHP 35,000-48,000 | PHP 55,000-75,000 | PHP 25,000-35,000 | PHP 42,000-60,000 | PHP 65,000-88,000 | ~11,000 | 28% | 65% | 45 | 75% | Hybrid/On-site | -- | Occasional | High | -- |
| Junior Instructional Designer | PHP 22,000-30,000 | PHP 38,000-52,000 | PHP 60,000-80,000 | PHP 28,000-38,000 | PHP 45,000-65,000 | PHP 70,000-95,000 | ~7,000 | 32% | 68% | 40 | 78% | Hybrid/Remote | -- | Low | Medium | -- |
| Junior Guidance Counselor | PHP 22,000-30,000 | PHP 38,000-52,000 | PHP 60,000-80,000 | PHP 28,000-38,000 | PHP 45,000-65,000 | PHP 70,000-95,000 | ~5,000 | 22% | 70% | 40 | 80% | On-site | -- | Low | Medium | -- |
| Junior LMS Administrator | PHP 18,000-25,000 | PHP 30,000-40,000 | PHP 45,000-60,000 | PHP 22,000-30,000 | PHP 35,000-48,000 | PHP 52,000-70,000 | ~4,500 | 38% | 68% | 40 | 78% | Hybrid/Remote | -- | Low | Medium | -- |
| Junior Social Field Researcher | PHP 16,000-24,000 | PHP 28,000-38,000 | PHP 48,000-65,000 | PHP 20,000-30,000 | PHP 35,000-48,000 | PHP 58,000-78,000 | ~6,000 | 25% | 63% | 45 | 72% | On-site | -- | Frequent | Medium | -- |
| Junior Data Logger | PHP 15,000-22,000 | PHP 25,000-35,000 | PHP 40,000-55,000 | PHP 20,000-28,000 | PHP 32,000-45,000 | PHP 50,000-70,000 | ~5,000 | 48% | 68% | 40 | 78% | On-site | -- | Low | Low | -- |
| Academic Principal | PHP 60,000-80,000 | PHP 120,000-180,000 | PHP 200,000-300,000 | PHP 75,000-100,000 | PHP 140,000-220,000 | PHP 250,000-380,000 | ~2,000 | 12% | 65% | 50 | 85% | On-site | -- | Occasional | High | -- |
| Distance Learning Director | PHP 50,000-70,000 | PHP 100,000-140,000 | PHP 160,000-240,000 | PHP 60,000-85,000 | PHP 120,000-170,000 | PHP 200,000-280,000 | ~1,500 | 18% | 68% | 45 | 80% | Hybrid/Remote | -- | Occasional | Medium | -- |
| Curriculum Strategy Chief | PHP 55,000-75,000 | PHP 110,000-150,000 | PHP 180,000-260,000 | PHP 68,000-90,000 | PHP 130,000-180,000 | PHP 220,000-300,000 | ~1,200 | 18% | 68% | 45 | 82% | Hybrid | -- | Occasional | Medium | -- |
| Clinical Services Supervisor | PHP 40,000-55,000 | PHP 80,000-110,000 | PHP 130,000-180,000 | PHP 50,000-68,000 | PHP 100,000-135,000 | PHP 160,000-220,000 | ~800 | 20% | 70% | 45 | 82% | On-site | -- | Occasional | High | -- |
| Human Rights Director | PHP 60,000-80,000 | PHP 120,000-160,000 | PHP 200,000-280,000 | PHP 75,000-100,000 | PHP 140,000-200,000 | PHP 240,000-340,000 | ~600 | 15% | 63% | 50 | 78% | On-site/Hybrid | -- | Frequent | High | -- |
| NGO Managing Director | PHP 30,000-50,000 | PHP 75,000-130,000 | PHP 160,000-280,000 | PHP 45,000-70,000 | PHP 100,000-180,000 | PHP 200,000-350,000 | ~2,500 | 15% | 62% | 48-55 | 75% | On-site/Hybrid | Mission-driven, community-rooted, bayanihan culture | Frequent | High | Donor fatigue in disaster-prone regions, SEC NGO compliance, island-dispersed program management |
| Program Evaluation Lead | PHP 22,000-32,000 | PHP 45,000-75,000 | PHP 90,000-155,000 | PHP 30,000-45,000 | PHP 60,000-100,000 | PHP 120,000-200,000 | ~3,500 | 28% | 65% | 42-47 | 75% | Hybrid | Evidence-based, INGO-influenced, report-heavy | Moderate | Medium | Geographic fragmentation of sites, limited local M&E talent, typhoon disruptions to evaluation cycles |
| Community Organizer | PHP 12,000-18,000 | PHP 20,000-35,000 | PHP 45,000-75,000 | PHP 16,000-24,000 | PHP 28,000-48,000 | PHP 58,000-95,000 | ~16,000 | 18% | 60% | 45-52 | 68% | On-site/Field | Grassroots, bayanihan, highly social | Frequent | High | Disaster response demands, barangay political gatekeepers, poverty-related community resistance |
| Educational Evaluator | PHP 20,000-28,000 | PHP 38,000-62,000 | PHP 75,000-125,000 | PHP 26,000-38,000 | PHP 50,000-82,000 | PHP 95,000-160,000 | ~6,000 | 32% | 65% | 42-46 | 74% | Hybrid | Structured, DepEd-aligned, reform-oriented | Low-Moderate | Medium | DepEd data inconsistencies, frequent K-12 curriculum shifts, limited tools in regional languages |
| Family Caseworker | PHP 12,000-18,000 | PHP 18,000-35,000 | PHP 45,000-75,000 | PHP 16,000-24,000 | PHP 25,000-48,000 | PHP 58,000-95,000 | ~22,000 | 20% | 58% | 42-50 | 70% | On-site/Field | Empathetic, DSWD-linked, family-centred | Frequent | Very High | DSWD understaffing, post-disaster and conflict-affected areas in Mindanao, high emotional labour |
| Welfare Policy Analyst | PHP 22,000-32,000 | PHP 42,000-72,000 | PHP 85,000-145,000 | PHP 28,000-42,000 | PHP 55,000-95,000 | PHP 110,000-180,000 | ~4,500 | 25% | 65% | 42-47 | 74% | Hybrid | Analytical, NEDA/DSWD-adjacent, reform-minded | Low | Medium | Political instability affecting policy continuity, limited social welfare data infrastructure, bridging national and LGU-level policy |

**Philippines Edu/Social Context:** Large K-12 and tertiary education systems, significant BPO training sector. Active local and international NGO presence (e.g., Save the Children). Classroom Assistant has highest demand (~28,000). Academic Principal (PHP 250,000-380,000 senior intl) is the top earner. Common challenge: High student-to-teacher ratios in public schools and educational resource disparities.

---

### LAOS (Currency: LAK millions/month)

| Job Title | Local Fresh Grad | Local Avg | Local Senior | Intl Fresh Grad | Intl Avg | Intl Senior | Demand (6mo) | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Classroom Assistant | 1.8-2.5M LAK | 2.8-3.5M LAK | 4.0-5.5M LAK | 2.2-3.0M LAK | 3.5-4.5M LAK | 5.0-6.5M LAK | ~2,500 | 45% | 65% | 40 | 75% | On-site | -- | Low | Medium | -- |
| Training Presenter | 2.5-3.2M LAK | 4.0-5.5M LAK | 6.5-8.5M LAK | 3.0-3.8M LAK | 5.0-7.0M LAK | 8.0-10.0M LAK | ~1,000 | 30% | 62% | 45 | 70% | On-site | -- | Occasional | High | -- |
| Junior Instructional Designer | 2.8-3.5M LAK | 4.5-6.0M LAK | 7.0-9.0M LAK | 3.5-4.2M LAK | 5.5-7.5M LAK | 8.5-10.5M LAK | ~600 | 35% | 65% | 40 | 72% | Hybrid | -- | Low | Medium | -- |
| Junior Guidance Counselor | 2.8-3.5M LAK | 4.5-6.0M LAK | 7.0-9.0M LAK | 3.5-4.2M LAK | 5.5-7.5M LAK | 8.5-10.5M LAK | ~500 | 25% | 68% | 40 | 78% | On-site | -- | Low | Medium | -- |
| Junior LMS Administrator | 2.2-2.8M LAK | 3.5-4.5M LAK | 5.0-6.5M LAK | 2.8-3.5M LAK | 4.5-5.8M LAK | 6.0-7.8M LAK | ~400 | 40% | 65% | 40 | 70% | Hybrid | -- | Low | Medium | -- |
| Junior Social Field Researcher | 2.0-2.8M LAK | 3.2-4.5M LAK | 5.5-7.0M LAK | 2.5-3.5M LAK | 4.0-5.5M LAK | 6.5-8.0M LAK | ~700 | 28% | 60% | 45 | 68% | On-site | -- | Frequent | Medium | -- |
| Junior Data Logger | 1.8-2.5M LAK | 2.8-3.8M LAK | 4.0-5.5M LAK | 2.2-3.0M LAK | 3.5-4.8M LAK | 5.0-6.5M LAK | ~600 | 50% | 65% | 40 | 70% | On-site | -- | Low | Low | -- |
| Academic Principal | 7.0-9.0M LAK | 15.0-20.0M LAK | 25.0-35.0M LAK | 8.5-11.0M LAK | 18.0-25.0M LAK | 30.0-40.0M LAK | ~200 | 15% | 60% | 50 | 80% | On-site | -- | Occasional | High | -- |
| Distance Learning Director | 6.0-8.0M LAK | 12.0-16.0M LAK | 20.0-28.0M LAK | 7.5-10.0M LAK | 14.0-19.0M LAK | 25.0-35.0M LAK | ~150 | 20% | 62% | 45 | 75% | Hybrid | -- | Occasional | Medium | -- |
| Curriculum Strategy Chief | 6.5-8.5M LAK | 13.0-18.0M LAK | 22.0-30.0M LAK | 8.0-10.5M LAK | 16.0-22.0M LAK | 28.0-38.0M LAK | ~120 | 20% | 62% | 45 | 78% | Hybrid | -- | Occasional | Medium | -- |
| Clinical Services Supervisor | 5.0-7.0M LAK | 10.0-14.0M LAK | 18.0-25.0M LAK | 6.0-8.5M LAK | 12.0-16.0M LAK | 22.0-30.0M LAK | ~100 | 22% | 68% | 45 | 78% | On-site | -- | Occasional | High | -- |
| Human Rights Director | 7.0-9.0M LAK | 14.0-18.0M LAK | 22.0-30.0M LAK | 8.5-11.0M LAK | 17.0-22.0M LAK | 28.0-38.0M LAK | ~80 | 18% | 60% | 50 | 75% | On-site | -- | Frequent | High | -- |
| NGO Managing Director | 8-14M LAK | 22-40M LAK | 50-90M LAK | 12-20M LAK | 35-65M LAK | 80-140M LAK | ~200 | 15% | 62% | 48-55 | 75% | On-site/Hybrid | INGO-led, government partnership required, relationship-first | Frequent | High | LNGO law restrictions, limited skilled local leadership, donor dependency, remote program management |
| Program Evaluation Lead | 5-9M LAK | 13-22M LAK | 30-55M LAK | 8-14M LAK | 20-38M LAK | 50-90M LAK | ~500 | 28% | 63% | 42-47 | 72% | Hybrid/On-site | INGO-structured, internationally driven, small team | Moderate | Medium | Very limited local M&E talent, poor rural data infrastructure, reliance on international consultants |
| Community Organizer | 3-5M LAK | 6-11M LAK | 14-24M LAK | 4-7M LAK | 9-16M LAK | 20-35M LAK | ~1,500 | 18% | 60% | 45-52 | 65% | On-site/Field | Community-embedded, village-chief dependent, informal | Frequent | High | Remote village access, ethnic minority language barriers (50+ languages), INGO-dependent funding |
| Educational Evaluator | 4-7M LAK | 10-18M LAK | 22-40M LAK | 6-10M LAK | 14-26M LAK | 35-60M LAK | ~600 | 32% | 63% | 42-46 | 70% | Hybrid/On-site | INGO or MoES-linked, small scale, limited resources | Low-Moderate | Medium | Very limited local evaluation capacity, no standardised national assessment tools, rural school data gaps |
| Family Caseworker | 3-5M LAK | 6-11M LAK | 14-24M LAK | 4-7M LAK | 9-16M LAK | 20-35M LAK | ~1,200 | 20% | 58% | 42-50 | 65% | On-site/Field | Informal, village-based support, INGO-assisted | Frequent | Very High | Absence of formal child protection systems, ethnic minority families, geographic isolation, limited professional training |
| Welfare Policy Analyst | 5-8M LAK | 12-20M LAK | 28-50M LAK | 7-12M LAK | 18-32M LAK | 45-80M LAK | ~400 | 25% | 63% | 42-47 | 70% | Hybrid | Government-adjacent, LPRP-linked, INGO-assisted | Low | Medium | Near-absence of social welfare data, restricted independent policy research, very limited publication environment |

**Laos Edu/Social Context:** Smallest and least developed education and social impact market in this dataset. Dominated by public sector and international aid (UNDP, Save the Children, UNICEF). Classroom Assistant (~2,500) has highest demand; Family Caseworker (~1,200) and Community Organizer (~1,500) are the new highest-demand roles added. NGO Managing Director tops earnings at 80-140M LAK senior intl. Common challenges across all roles: LNGO law restrictions on civil society, very limited skilled local talent, ethnic minority language diversity (50+ languages), remote geography, and near-total INGO funding dependency.

---

## CROSS-COUNTRY QUICK REFERENCE

### Highest Paying Country by Role (Senior, International Company)
- All roles: **Singapore** leads across the board
- Academic Principal: SGD 35,000-50,000 (Singapore)
- NGO Managing Director: SGD 28,000-45,000 (Singapore)
- Human Rights Director: SGD 30,000-40,000 (Singapore)
- Curriculum Strategy Chief: SGD 30,000-40,000 (Singapore)
- Welfare Policy Analyst: SGD 14,000-22,000 (Singapore)
- Program Evaluation Lead: SGD 15,000-22,000 (Singapore)

### Highest Demand Roles (6-month openings across SEA)
1. Classroom Assistant -- Malaysia ~35,000, Vietnam ~30,000, Philippines ~28,000 (overall highest demand)
2. Family Caseworker -- Philippines ~22,000, Vietnam ~20,000, Malaysia ~18,000
3. Community Organizer -- Philippines ~16,000, Vietnam ~14,000, Malaysia ~12,000
4. Training Presenter -- Malaysia ~15,000, Vietnam ~12,000
5. Junior Instructional Designer -- Malaysia ~10,000
6. Junior Social Field Researcher -- Malaysia ~9,000
7. Educational Evaluator -- Vietnam ~7,000, Malaysia ~6,000

### Lowest Demand Roles
- Human Rights Director: Laos ~80, Singapore ~500
- NGO Managing Director: Laos ~200, Singapore ~1,500
- Welfare Policy Analyst: Laos ~400, Singapore ~1,500
- Clinical Services Supervisor: Laos ~100, Singapore ~700
- Curriculum Strategy Chief: Laos ~120, Singapore ~900

### AI Disruption Risk Rankings
- **Highest risk:** Junior Data Logger (48-50%), Classroom Assistant (40-45%), Junior LMS Administrator (38-40%), Educational Evaluator (32%)
- **Lowest risk:** Academic Principal (12-15%), NGO Managing Director (15%), Human Rights Director (15-18%)
- **New roles added (15-32% risk):** Community Organizer 18%, Family Caseworker 20%, Welfare Policy Analyst 25%, Program Evaluation Lead 28%, Educational Evaluator 32%
- Roles involving routine data entry, administrative tasks, and direct instructional support (non-teaching) face highest AI risk.

### Best Work-Life Balance (WLB %)
- Junior Guidance Counselor: **Singapore** 74%, Malaysia 72%
- Classroom Assistant: Singapore 72%, Malaysia 70%
- Program Evaluation Lead & Welfare Policy Analyst: ~65% across all countries (Hybrid mode)
- **Lowest WLB:** Family Caseworker (58%), NGO Managing Director (62%), Human Rights Director (60-68%)

### Stability Rankings (highest %)
- Academic Principal: 80-90% (most stable overall, Singapore highest at 90%)
- NGO Managing Director: 75-83% (Singapore highest)
- Welfare Policy Analyst: 70-83% (Singapore highest)
- Junior Social Field Researcher: 68-78% (most volatile due to project-based funding)
- Community Organizer & Family Caseworker: 65-75% (Laos lowest due to INGO dependency)

### Work Mode Summary
- **Most junior roles (Assistant, Counselor, Field Researcher, Data Logger):** Predominantly On-site
- **Mid-level roles (Instructional Designer, LMS Administrator, Distance Learning Director, Curriculum Strategy Chief, Program Evaluation Lead, Welfare Policy Analyst):** Primarily Hybrid
- **Senior leadership (Principal, Supervisor, Director, NGO Managing Director):** On-site/Hybrid
- **High travel roles:** Junior Social Field Researcher, Human Rights Director, NGO Managing Director, Family Caseworker, Community Organizer (Frequent)
- **Low/no travel roles:** Welfare Policy Analyst, Educational Evaluator, Program Evaluation Lead (Low-Moderate)

### Stress Level Summary
- **Consistently Very High stress:** Family Caseworker (all countries -- trauma exposure, burnout, high caseloads)
- **Consistently High stress:** Training Presenter, Academic Principal, Clinical Services Supervisor, Human Rights Director, NGO Managing Director, Community Organizer
- **Consistently Medium stress:** Program Evaluation Lead, Welfare Policy Analyst, Educational Evaluator, Classroom Assistant, Junior Instructional Designer, Junior Guidance Counselor, Junior LMS Administrator, Junior Social Field Researcher, Distance Learning Director, Curriculum Strategy Chief
- **Consistently Low stress:** Junior Data Logger

### Workplace Culture Summary (New Roles)
- **NGO Managing Director:** Mission-driven, hierarchical, relationship-based; INGO roles more process-driven and accountable
- **Program Evaluation Lead:** Data-driven, collaborative, report-heavy; outcome and evidence focused
- **Community Organizer:** Grassroots, people-first, informal; deeply embedded in communities
- **Educational Evaluator:** Evidence-based, structured, academic culture; ministry-aligned in all countries
- **Family Caseworker:** Empathetic, team-dependent, regulated; emotionally intensive environment
- **Welfare Policy Analyst:** Analytical, formal, government-adjacent; research and policy reform culture

### Common Challenges Summary (New Roles)
- **NGO Managing Director:** Donor dependency, staff burnout, regulatory compliance, talent retention against private sector
- **Program Evaluation Lead:** Field data quality, tight donor timelines, balancing quant/qual methods
- **Community Organizer:** Language/dialect barriers, political sensitivities, low pay relative to workload
- **Educational Evaluator:** AI changing assessment design, ministry bureaucracy, inconsistent school-level data
- **Family Caseworker:** Emotional burnout, high caseloads, trauma exposure, statutory bureaucracy
- **Welfare Policy Analyst:** Slow policy cycles, limited government data access, bridging research and policy action

---

## RESPONSE GUIDELINES

- Always specify the country and whether salary is for a **local** or **international** company
- Laos salaries are in LAK millions/month; all others in local currency as labelled
- WLB % = self-reported work-life balance satisfaction score
- Stability % = job security / role stability rating
- AI Risk % = estimated probability of significant AI disruption to this role within 5 years
- Demand = approximate number of open roles in the country over a 6-month period
- Career progressions show the standard linear path; pivot paths show lateral moves available at any stage
- When users ask "which country is best for X role," factor in salary, WLB, demand, stability, and AI risk together -- not salary alone
- Classroom Assistant is universally the highest-demand entry-level role.
- Academic Principal is universally the most stable, highest-paid, and lowest-AI-risk senior role for Education.
- Human Rights Director and NGO Managing Director are consistently among the lowest demand but highest-impact roles.
- Family Caseworker is the highest-demand and highest-stress new role added; universally rated Very High stress.
- Workplace Culture, Travel, Stress, and Common Challenges columns are included for all 18 roles in this sector.
- When comparing new roles (13-18) note that INGO (international NGO) employers pay 40-80% more than local NGOs for the same title.

# Group 1 -- Creative & Design (18 Jobs)

## Jobs
1. Junior Graphic Designer
2. Junior Copywriter
3. UI Wireframer
4. Video Editor
5. Content Planner
6. Motion Designer
7. Digital Illustrator
8. Sound Designer
9. 3D Asset Optimizer
10. UX Researcher
11. Information Architect
12. Atomic Design Engineer
13. Brand Identity Systems Lead
14. Creative Director
15. Product Design Director
16. Immersive Environment Architect
17. Corporate Narrative Director
18. Generative Design Architect

---

## Salary & Market Data

### Malaysia (RM)
| Job Title | Local Fresh | Local Avg | Local Senior | Intl Fresh | Intl Avg | Intl Senior | Demand | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Graphic Designer | RM 1,500-2,100 | RM 2,300-3,100 | RM 5,500-7,500 | RM 2,400-3,200 | RM 3,600-4,800 | RM 8,500-11,500 | ~25,000 | 63% | 60% | 48 | 55% | Hybrid/Remote | Creative, fast-paced | Low | Medium | tight deadlines and multiple revisions |
| Junior Copywriter | RM 1,700-2,300 | RM 2,400-3,200 | RM 6,400-8,600 | RM 2,600-3,400 | RM 3,800-5,200 | RM 10,200-13,800 | ~18,000 | 68% | 62% | 46 | 58% | Hybrid/Remote | Collaborative, deadline-driven | Low | Medium | balancing creativity with strict brand guidelines |
| UI Wireframer | RM 1,900-2,500 | RM 3,000-4,000 | RM 7,600-10,400 | RM 3,000-4,000 | RM 4,700-6,300 | RM 11,900-16,100 | ~22,000 | 38% | 68% | 45 | 68% | Hybrid | Iterative, detail-oriented | Low | Medium | maintaining consistency across complex layouts |
| Video Editor | RM 1,500-2,100 | RM 2,500-3,300 | RM 6,400-8,600 | RM 2,600-3,400 | RM 3,800-5,200 | RM 10,200-13,800 | ~21,000 | 62% | 58% | 50 | 60% | Hybrid | Execution-focused, artistic | Low | High | long hours during post-production phases |
| Content Planner | RM 1,500-2,100 | RM 2,400-3,200 | RM 6,800-9,200 | RM 2,400-3,200 | RM 3,800-5,200 | RM 11,000-14,900 | ~17,000 | 58% | 62% | 46 | 62% | Hybrid/Remote | Strategic, organized | Low | Medium | managing dense social media calendars |
| Motion Designer | RM 1,700-2,300 | RM 3,000-4,000 | RM 8,100-10,900 | RM 2,700-3,700 | RM 4,900-6,700 | RM 12,800-17,200 | ~14,000 | 55% | 58% | 50 | 63% | Hybrid | Technical, creative | Low | High | handling heavy rendering and asset management |
| Digital Illustrator | RM 1,500-2,100 | RM 2,400-3,200 | RM 6,800-9,200 | RM 2,600-3,400 | RM 4,100-5,500 | RM 11,900-16,100 | ~12,000 | 70% | 65% | 44 | 52% | Hybrid/Remote | Artistic, autonomous | Low | Medium | matching specific artistic visual styles |
| Sound Designer | RM 1,500-2,100 | RM 2,400-3,200 | RM 7,600-10,400 | RM 2,400-3,200 | RM 4,100-5,500 | RM 12,800-17,200 | ~7,500 | 42% | 62% | 46 | 58% | Hybrid | Auditory, immersive | Low | Medium | sourcing unique and high-quality audio samples |
| 3D Asset Optimizer | RM 1,900-2,500 | RM 3,000-4,000 | RM 8,500-11,500 | RM 3,000-4,000 | RM 4,900-6,700 | RM 14,400-19,600 | ~9,500 | 48% | 62% | 46 | 65% | Hybrid | Technical, precise | Low | Medium | balancing visual quality with performance limits |
| UX Researcher | RM 2,100-2,900 | RM 3,800-5,200 | RM 10,200-13,800 | RM 3,400-4,600 | RM 6,000-8,000 | RM 15,300-20,700 | ~19,500 | 31% | 70% | 44 | 75% | Hybrid | Inquisitive, user-centric | Occasional | Medium | recruiting niche participants for studies |
| Information Architect | RM 2,600-3,400 | RM 4,700-6,300 | RM 10,200-13,800 | RM 3,800-5,200 | RM 6,800-9,200 | RM 15,300-20,700 | ~14,000 | 33% | 68% | 45 | 72% | Hybrid/Remote | Logical, structured | Low | Medium | organizing vast amounts of complex data |
| Atomic Design Engineer | RM 3,000-4,000 | RM 5,100-6,900 | RM 11,000-14,900 | RM 4,200-5,800 | RM 7,600-10,400 | RM 15,300-20,700 | ~12,000 | 30% | 68% | 44 | 75% | Hybrid/Remote | Systemic, innovative | Low | Medium | standardizing components across diverse platforms |
| Brand Identity Systems Lead | RM 3,400-4,600 | RM 6,000-8,000 | RM 12,800-17,200 | RM 5,100-6,900 | RM 9,400-12,600 | RM 18,700-25,300 | ~11,000 | 48% | 62% | 48 | 70% | Hybrid | Visionary, disciplined | Occasional | High | ensuring global brand compliance across regions |
| Creative Director | RM 3,800-5,200 | RM 6,800-9,200 | RM 17,000-23,000 | RM 6,000-8,000 | RM 11,000-14,900 | RM 23,800-32,200 | ~15,000 | 45% | 60% | 50 | 68% | Hybrid | Leadership-driven, high-pressure | Frequent | High | managing client expectations and team morale |
| Product Design Director | RM 5,100-6,900 | RM 8,500-11,500 | RM 18,700-25,300 | RM 7,600-10,400 | RM 13,600-18,400 | RM 25,500-34,500 | ~13,000 | 38% | 62% | 50 | 70% | Hybrid | Agile, data-driven | Frequent | High | aligning design goals with business outcomes |
| Immersive Environment Architect | RM 3,000-4,000 | RM 5,500-7,500 | RM 12,800-17,200 | RM 4,700-6,300 | RM 8,500-11,500 | RM 18,700-25,300 | ~4,500 | 35% | 65% | 45 | 65% | Hybrid | Forward-thinking, experimental | Occasional | High | integrating hardware limitations with spatial design |
| Corporate Narrative Director | RM 4,200-5,800 | RM 7,600-10,400 | RM 17,000-23,000 | RM 6,800-9,200 | RM 11,900-16,100 | RM 23,800-32,200 | ~5,000 | 52% | 60% | 50 | 65% | Hybrid | Diplomatic, strategic | Frequent | High | aligning internal messaging with external perception |
| Generative Design Architect | RM 3,400-4,600 | RM 6,400-8,600 | RM 14,400-19,600 | RM 5,500-7,500 | RM 10,200-13,800 | RM 20,400-27,600 | ~4,000 | 28% | 65% | 45 | 72% | Hybrid/Remote | Algorithmic, progressive | Low | High | implementing AI tools into legacy workflows |

### Singapore (S$)
| Job Title | Local Fresh | Local Avg | Local Senior | Intl Fresh | Intl Avg | Intl Senior | Demand | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Graphic Designer | S$ 2,100-2,900 | S$ 3,000-4,000 | S$ 6,800-9,200 | S$ 3,000-4,000 | S$ 4,700-6,300 | S$ 10,200-13,800 | ~8,500 | 63% | 62% | 46 | 55% | Hybrid/Remote | Creative, fast-paced | Low | Medium | tight deadlines and multiple revisions |
| Junior Copywriter | S$ 2,400-3,200 | S$ 3,200-4,400 | S$ 7,600-10,400 | S$ 3,200-4,400 | S$ 5,100-6,900 | S$ 11,900-16,100 | ~6,000 | 68% | 65% | 44 | 58% | Hybrid/Remote | Collaborative, deadline-driven | Low | Medium | balancing creativity with strict brand guidelines |
| UI Wireframer | S$ 2,700-3,700 | S$ 4,200-5,800 | S$ 10,200-13,800 | S$ 3,800-5,200 | S$ 6,400-8,600 | S$ 15,300-20,700 | ~7,500 | 38% | 70% | 43 | 68% | Hybrid | Iterative, detail-oriented | Low | Medium | maintaining consistency across complex layouts |
| Video Editor | S$ 2,400-3,200 | S$ 3,600-4,800 | S$ 8,500-11,500 | S$ 3,200-4,400 | S$ 5,500-7,500 | S$ 11,900-16,100 | ~7,000 | 62% | 60% | 47 | 60% | Hybrid | Execution-focused, artistic | Low | High | long hours during post-production phases |
| Content Planner | S$ 2,400-3,200 | S$ 3,600-4,800 | S$ 9,400-12,600 | S$ 3,200-4,400 | S$ 5,500-7,500 | S$ 13,600-18,400 | ~5,500 | 58% | 65% | 44 | 62% | Hybrid/Remote | Strategic, organized | Low | Medium | managing dense social media calendars |
| Motion Designer | S$ 2,600-3,400 | S$ 4,200-5,800 | S$ 10,200-13,800 | S$ 3,600-4,800 | S$ 6,800-9,200 | S$ 15,300-20,700 | ~4,500 | 55% | 60% | 47 | 63% | Hybrid | Technical, creative | Low | High | handling heavy rendering and asset management |
| Digital Illustrator | S$ 2,400-3,200 | S$ 3,600-4,800 | S$ 8,500-11,500 | S$ 3,400-4,600 | S$ 5,800-7,800 | S$ 13,600-18,400 | ~4,000 | 70% | 65% | 43 | 52% | Hybrid/Remote | Artistic, autonomous | Low | Medium | matching specific artistic visual styles |
| Sound Designer | S$ 2,400-3,200 | S$ 3,600-4,800 | S$ 8,500-11,500 | S$ 3,400-4,600 | S$ 6,000-8,000 | S$ 13,600-18,400 | ~2,500 | 42% | 65% | 44 | 58% | Hybrid | Auditory, immersive | Low | Medium | sourcing unique and high-quality audio samples |
| 3D Asset Optimizer | S$ 2,700-3,700 | S$ 4,400-6,000 | S$ 11,000-14,900 | S$ 3,800-5,200 | S$ 7,200-9,800 | S$ 17,000-23,000 | ~3,200 | 48% | 65% | 45 | 65% | Hybrid | Technical, precise | Low | Medium | balancing visual quality with performance limits |
| UX Researcher | S$ 3,600-4,800 | S$ 5,800-7,800 | S$ 13,600-18,400 | S$ 5,100-6,900 | S$ 8,900-12,100 | S$ 20,400-27,600 | ~6,500 | 31% | 72% | 43 | 75% | Hybrid | Inquisitive, user-centric | Occasional | Medium | recruiting niche participants for studies |
| Information Architect | S$ 3,800-5,200 | S$ 6,800-9,200 | S$ 15,300-20,700 | S$ 5,500-7,500 | S$ 10,200-13,800 | S$ 22,100-29,900 | ~4,800 | 33% | 70% | 43 | 72% | Hybrid/Remote | Logical, structured | Low | Medium | organizing vast amounts of complex data |
| Atomic Design Engineer | S$ 4,200-5,800 | S$ 7,200-9,800 | S$ 17,000-23,000 | S$ 6,000-8,000 | S$ 11,000-14,900 | S$ 22,100-29,900 | ~4,200 | 30% | 70% | 43 | 75% | Hybrid/Remote | Systemic, innovative | Low | Medium | standardizing components across diverse platforms |
| Brand Identity Systems Lead | S$ 4,700-6,300 | S$ 8,500-11,500 | S$ 18,700-25,300 | S$ 7,200-9,800 | S$ 13,600-18,400 | S$ 27,200-36,800 | ~3,800 | 48% | 65% | 46 | 70% | Hybrid | Visionary, disciplined | Occasional | High | ensuring global brand compliance across regions |
| Creative Director | S$ 5,500-7,500 | S$ 10,200-13,800 | S$ 23,800-32,200 | S$ 8,500-11,500 | S$ 15,300-20,700 | S$ 34,000-46,000 | ~5,200 | 45% | 62% | 50 | 68% | Hybrid | Leadership-driven, high-pressure | Frequent | High | managing client expectations and team morale |
| Product Design Director | S$ 7,200-9,800 | S$ 11,900-16,100 | S$ 25,500-34,500 | S$ 11,000-14,900 | S$ 18,700-25,300 | S$ 35,700-48,300 | ~4,500 | 38% | 65% | 48 | 70% | Hybrid | Agile, data-driven | Frequent | High | aligning design goals with business outcomes |
| Immersive Environment Architect | S$ 4,200-5,800 | S$ 7,600-10,400 | S$ 17,000-23,000 | S$ 6,800-9,200 | S$ 11,900-16,100 | S$ 25,500-34,500 | ~1,500 | 35% | 68% | 44 | 65% | Hybrid | Forward-thinking, experimental | Occasional | High | integrating hardware limitations with spatial design |
| Corporate Narrative Director | S$ 6,000-8,000 | S$ 11,000-14,900 | S$ 23,800-32,200 | S$ 9,400-12,600 | S$ 17,000-23,000 | S$ 32,300-43,700 | ~1,800 | 52% | 65% | 48 | 65% | Hybrid | Diplomatic, strategic | Frequent | High | aligning internal messaging with external perception |
| Generative Design Architect | S$ 5,100-6,900 | S$ 9,400-12,600 | S$ 20,400-27,600 | S$ 8,100-10,900 | S$ 14,400-19,600 | S$ 29,800-40,200 | ~1,400 | 28% | 70% | 44 | 72% | Hybrid/Remote | Algorithmic, progressive | Low | High | implementing AI tools into legacy workflows |

### Philippines (PHP)
| Job Title | Local Fresh | Local Avg | Local Senior | Intl Fresh | Intl Avg | Intl Senior | Demand | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Graphic Designer | PHP 18,000 | PHP 27,000 | PHP 65,000 | PHP 30,000 | PHP 50,000 | PHP 110,000 | ~12,000 | 63% | 60% | 48 | 55% | Hybrid/Remote | Creative, fast-paced | Low | Medium | tight deadlines and multiple revisions |
| Junior Copywriter | PHP 18,000 | PHP 28,000 | PHP 75,000 | PHP 32,000 | PHP 55,000 | PHP 120,000 | ~9,000 | 68% | 62% | 46 | 58% | Hybrid/Remote | Collaborative, deadline-driven | Low | Medium | balancing creativity with strict brand guidelines |
| UI Wireframer | PHP 22,000 | PHP 38,000 | PHP 90,000 | PHP 38,000 | PHP 70,000 | PHP 150,000 | ~8,500 | 38% | 68% | 45 | 68% | Hybrid | Iterative, detail-oriented | Low | Medium | maintaining consistency across complex layouts |
| Video Editor | PHP 18,000 | PHP 28,000 | PHP 70,000 | PHP 30,000 | PHP 55,000 | PHP 120,000 | ~11,000 | 62% | 58% | 50 | 60% | Hybrid | Execution-focused, artistic | Low | High | long hours during post-production phases |
| Content Planner | PHP 18,000 | PHP 28,000 | PHP 75,000 | PHP 30,000 | PHP 55,000 | PHP 130,000 | ~7,500 | 58% | 62% | 46 | 62% | Hybrid/Remote | Strategic, organized | Low | Medium | managing dense social media calendars |
| Motion Designer | PHP 20,000 | PHP 35,000 | PHP 90,000 | PHP 35,000 | PHP 65,000 | PHP 150,000 | ~6,000 | 55% | 58% | 50 | 63% | Hybrid | Technical, creative | Low | High | handling heavy rendering and asset management |
| Digital Illustrator | PHP 18,000 | PHP 27,000 | PHP 75,000 | PHP 30,000 | PHP 55,000 | PHP 140,000 | ~5,500 | 70% | 65% | 44 | 52% | Hybrid/Remote | Artistic, autonomous | Low | Medium | matching specific artistic visual styles |
| Sound Designer | PHP 18,000 | PHP 28,000 | PHP 80,000 | PHP 30,000 | PHP 55,000 | PHP 140,000 | ~3,000 | 42% | 62% | 46 | 58% | Hybrid | Auditory, immersive | Low | Medium | sourcing unique and high-quality audio samples |
| 3D Asset Optimizer | PHP 20,000 | PHP 35,000 | PHP 90,000 | PHP 35,000 | PHP 70,000 | PHP 160,000 | ~4,500 | 48% | 62% | 46 | 65% | Hybrid | Technical, precise | Low | Medium | balancing visual quality with performance limits |
| UX Researcher | PHP 25,000 | PHP 45,000 | PHP 120,000 | PHP 45,000 | PHP 90,000 | PHP 200,000 | ~6,500 | 31% | 70% | 44 | 75% | Hybrid | Inquisitive, user-centric | Occasional | Medium | recruiting niche participants for studies |
| Information Architect | PHP 28,000 | PHP 55,000 | PHP 130,000 | PHP 50,000 | PHP 100,000 | PHP 220,000 | ~3,500 | 33% | 68% | 45 | 72% | Hybrid/Remote | Logical, structured | Low | Medium | organizing vast amounts of complex data |
| Atomic Design Engineer | PHP 30,000 | PHP 60,000 | PHP 140,000 | PHP 55,000 | PHP 110,000 | PHP 240,000 | ~3,200 | 30% | 68% | 44 | 75% | Hybrid/Remote | Systemic, innovative | Low | Medium | standardizing components across diverse platforms |
| Brand Identity Systems Lead | PHP 35,000 | PHP 70,000 | PHP 160,000 | PHP 65,000 | PHP 130,000 | PHP 280,000 | ~2,800 | 48% | 62% | 48 | 70% | Hybrid | Visionary, disciplined | Occasional | High | ensuring global brand compliance across regions |
| Creative Director | PHP 45,000 | PHP 90,000 | PHP 220,000 | PHP 80,000 | PHP 160,000 | PHP 350,000 | ~4,000 | 45% | 60% | 50 | 68% | Hybrid | Leadership-driven, high-pressure | Frequent | High | managing client expectations and team morale |
| Product Design Director | PHP 55,000 | PHP 110,000 | PHP 260,000 | PHP 100,000 | PHP 200,000 | PHP 400,000 | ~3,500 | 38% | 62% | 50 | 70% | Hybrid | Agile, data-driven | Frequent | High | aligning design goals with business outcomes |
| Immersive Environment Architect | PHP 32,000 | PHP 65,000 | PHP 160,000 | PHP 60,000 | PHP 120,000 | PHP 260,000 | ~1,200 | 35% | 65% | 45 | 65% | Hybrid | Forward-thinking, experimental | Occasional | High | integrating hardware limitations with spatial design |
| Corporate Narrative Director | PHP 45,000 | PHP 90,000 | PHP 220,000 | PHP 80,000 | PHP 160,000 | PHP 340,000 | ~1,500 | 52% | 60% | 50 | 65% | Hybrid | Diplomatic, strategic | Frequent | High | aligning internal messaging with external perception |
| Generative Design Architect | PHP 38,000 | PHP 75,000 | PHP 180,000 | PHP 70,000 | PHP 140,000 | PHP 300,000 | ~1,100 | 28% | 65% | 45 | 72% | Hybrid/Remote | Algorithmic, progressive | Low | High | implementing AI tools into legacy workflows |

### Laos (LAK)
| Job Title | Local Fresh | Local Avg | Local Senior | Intl Fresh | Intl Avg | Intl Senior | Demand | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Graphic Designer | LAK 4.5m | LAK 7m | LAK 18m | LAK 9m | LAK 16m | LAK 38m | ~1,200 | 63% | 60% | 48 | 55% | Hybrid/Remote | Creative, fast-paced | Low | Medium | tight deadlines and multiple revisions |
| Junior Copywriter | LAK 4.5m | LAK 7m | LAK 18m | LAK 9m | LAK 16m | LAK 38m | ~800 | 68% | 62% | 46 | 58% | Hybrid/Remote | Collaborative, deadline-driven | Low | Medium | balancing creativity with strict brand guidelines |
| UI Wireframer | LAK 5m | LAK 9m | LAK 22m | LAK 12m | LAK 22m | LAK 50m | ~600 | 38% | 68% | 45 | 68% | Hybrid | Iterative, detail-oriented | Low | Medium | maintaining consistency across complex layouts |
| Video Editor | LAK 4.5m | LAK 7.5m | LAK 20m | LAK 9m | LAK 17m | LAK 40m | ~700 | 62% | 58% | 50 | 60% | Hybrid | Execution-focused, artistic | Low | High | long hours during post-production phases |
| Content Planner | LAK 4.5m | LAK 7.5m | LAK 20m | LAK 9m | LAK 17m | LAK 40m | ~600 | 58% | 62% | 46 | 62% | Hybrid/Remote | Strategic, organized | Low | Medium | managing dense social media calendars |
| Motion Designer | LAK 5m | LAK 9m | LAK 24m | LAK 11m | LAK 20m | LAK 48m | ~400 | 55% | 58% | 50 | 63% | Hybrid | Technical, creative | Low | High | handling heavy rendering and asset management |
| Digital Illustrator | LAK 4.5m | LAK 7m | LAK 20m | LAK 9m | LAK 16m | LAK 42m | ~350 | 70% | 65% | 44 | 52% | Hybrid/Remote | Artistic, autonomous | Low | Medium | matching specific artistic visual styles |
| Sound Designer | LAK 4.5m | LAK 7m | LAK 20m | LAK 9m | LAK 16m | LAK 42m | ~200 | 42% | 62% | 46 | 58% | Hybrid | Auditory, immersive | Low | Medium | sourcing unique and high-quality audio samples |
| 3D Asset Optimizer | LAK 5m | LAK 9m | LAK 24m | LAK 11m | LAK 20m | LAK 50m | ~300 | 48% | 62% | 46 | 65% | Hybrid | Technical, precise | Low | Medium | balancing visual quality with performance limits |
| UX Researcher | LAK 6m | LAK 12m | LAK 30m | LAK 14m | LAK 28m | LAK 65m | ~400 | 31% | 70% | 44 | 75% | Hybrid | Inquisitive, user-centric | Occasional | Medium | recruiting niche participants for studies |
| Information Architect | LAK 6m | LAK 12m | LAK 30m | LAK 14m | LAK 28m | LAK 65m | ~300 | 33% | 68% | 45 | 72% | Hybrid/Remote | Logical, structured | Low | Medium | organizing vast amounts of complex data |
| Atomic Design Engineer | LAK 7m | LAK 14m | LAK 35m | LAK 16m | LAK 32m | LAK 70m | ~250 | 30% | 68% | 44 | 75% | Hybrid/Remote | Systemic, innovative | Low | Medium | standardizing components across diverse platforms |
| Brand Identity Systems Lead | LAK 8m | LAK 16m | LAK 40m | LAK 18m | LAK 36m | LAK 80m | ~200 | 48% | 62% | 48 | 70% | Hybrid | Visionary, disciplined | Occasional | High | ensuring global brand compliance across regions |
| Creative Director | LAK 10m | LAK 20m | LAK 50m | LAK 22m | LAK 45m | LAK 100m | ~250 | 45% | 60% | 50 | 68% | Hybrid | Leadership-driven, high-pressure | Frequent | High | managing client expectations and team morale |
| Product Design Director | LAK 12m | LAK 24m | LAK 60m | LAK 26m | LAK 55m | LAK 120m | ~200 | 38% | 62% | 50 | 70% | Hybrid | Agile, data-driven | Frequent | High | aligning design goals with business outcomes |
| Immersive Environment Architect | LAK 7m | LAK 14m | LAK 36m | LAK 16m | LAK 32m | LAK 75m | ~100 | 35% | 65% | 45 | 65% | Hybrid | Forward-thinking, experimental | Occasional | High | integrating hardware limitations with spatial design |
| Corporate Narrative Director | LAK 10m | LAK 20m | LAK 50m | LAK 22m | LAK 45m | LAK 100m | ~120 | 52% | 60% | 50 | 65% | Hybrid | Diplomatic, strategic | Frequent | High | aligning internal messaging with external perception |
| Generative Design Architect | LAK 8m | LAK 16m | LAK 42m | LAK 18m | LAK 36m | LAK 85m | ~100 | 28% | 65% | 45 | 72% | Hybrid/Remote | Algorithmic, progressive | Low | High | implementing AI tools into legacy workflows |

### Vietnam (VND)
| Job Title | Local Fresh | Local Avg | Local Senior | Intl Fresh | Intl Avg | Intl Senior | Demand | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Graphic Designer | VND 7m | VND 12m | VND 30m | VND 15m | VND 28m | VND 70m | ~18,000 | 63% | 60% | 48 | 55% | Hybrid/Remote | Creative, fast-paced | Low | Medium | tight deadlines and multiple revisions |
| Junior Copywriter | VND 7m | VND 12m | VND 33m | VND 15m | VND 30m | VND 75m | ~14,000 | 68% | 62% | 46 | 58% | Hybrid/Remote | Collaborative, deadline-driven | Low | Medium | balancing creativity with strict brand guidelines |
| UI Wireframer | VND 9m | VND 18m | VND 45m | VND 20m | VND 40m | VND 100m | ~13,000 | 38% | 68% | 45 | 68% | Hybrid | Iterative, detail-oriented | Low | Medium | maintaining consistency across complex layouts |
| Video Editor | VND 7m | VND 12m | VND 32m | VND 15m | VND 28m | VND 72m | ~16,000 | 62% | 58% | 50 | 60% | Hybrid | Execution-focused, artistic | Low | High | long hours during post-production phases |
| Content Planner | VND 7m | VND 13m | VND 35m | VND 15m | VND 30m | VND 80m | ~12,000 | 58% | 62% | 46 | 62% | Hybrid/Remote | Strategic, organized | Low | Medium | managing dense social media calendars |
| Motion Designer | VND 8m | VND 16m | VND 42m | VND 18m | VND 36m | VND 95m | ~9,000 | 55% | 58% | 50 | 63% | Hybrid | Technical, creative | Low | High | handling heavy rendering and asset management |
| Digital Illustrator | VND 7m | VND 12m | VND 35m | VND 15m | VND 28m | VND 80m | ~8,000 | 70% | 65% | 44 | 52% | Hybrid/Remote | Artistic, autonomous | Low | Medium | matching specific artistic visual styles |
| Sound Designer | VND 7m | VND 12m | VND 35m | VND 14m | VND 28m | VND 80m | ~4,500 | 42% | 62% | 46 | 58% | Hybrid | Auditory, immersive | Low | Medium | sourcing unique and high-quality audio samples |
| 3D Asset Optimizer | VND 8m | VND 16m | VND 42m | VND 18m | VND 36m | VND 100m | ~6,500 | 48% | 62% | 46 | 65% | Hybrid | Technical, precise | Low | Medium | balancing visual quality with performance limits |
| UX Researcher | VND 10m | VND 22m | VND 55m | VND 25m | VND 50m | VND 130m | ~8,000 | 31% | 70% | 44 | 75% | Hybrid | Inquisitive, user-centric | Occasional | Medium | recruiting niche participants for studies |
| Information Architect | VND 12m | VND 25m | VND 60m | VND 28m | VND 55m | VND 130m | ~5,000 | 33% | 68% | 45 | 72% | Hybrid/Remote | Logical, structured | Low | Medium | organizing vast amounts of complex data |
| Atomic Design Engineer | VND 14m | VND 30m | VND 72m | VND 32m | VND 65m | VND 150m | ~4,500 | 30% | 68% | 44 | 75% | Hybrid/Remote | Systemic, innovative | Low | Medium | standardizing components across diverse platforms |
| Brand Identity Systems Lead | VND 18m | VND 38m | VND 95m | VND 40m | VND 80m | VND 180m | ~3,500 | 48% | 62% | 48 | 70% | Hybrid | Visionary, disciplined | Occasional | High | ensuring global brand compliance across regions |
| Creative Director | VND 22m | VND 50m | VND 120m | VND 55m | VND 110m | VND 250m | ~5,500 | 45% | 60% | 50 | 68% | Hybrid | Leadership-driven, high-pressure | Frequent | High | managing client expectations and team morale |
| Product Design Director | VND 28m | VND 60m | VND 150m | VND 65m | VND 140m | VND 300m | ~4,800 | 38% | 62% | 50 | 70% | Hybrid | Agile, data-driven | Frequent | High | aligning design goals with business outcomes |
| Immersive Environment Architect | VND 14m | VND 30m | VND 75m | VND 32m | VND 68m | VND 165m | ~1,800 | 35% | 65% | 45 | 65% | Hybrid | Forward-thinking, experimental | Occasional | High | integrating hardware limitations with spatial design |
| Corporate Narrative Director | VND 22m | VND 48m | VND 120m | VND 55m | VND 110m | VND 240m | ~2,000 | 52% | 60% | 50 | 65% | Hybrid | Diplomatic, strategic | Frequent | High | aligning internal messaging with external perception |
| Generative Design Architect | VND 18m | VND 38m | VND 95m | VND 42m | VND 85m | VND 200m | ~1,500 | 28% | 65% | 45 | 72% | Hybrid/Remote | Algorithmic, progressive | Low | High | implementing AI tools into legacy workflows |

### Thailand (THB)
| Job Title | Local Fresh | Local Avg | Local Senior | Intl Fresh | Intl Avg | Intl Senior | Demand | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Junior Graphic Designer | THB 18,000 | THB 30,000 | THB 75,000 | THB 35,000 | THB 65,000 | THB 160,000 | ~12,000 | 63% | 60% | 48 | 55% | Hybrid/Remote | Creative, fast-paced | Low | Medium | tight deadlines and multiple revisions |
| Junior Copywriter | THB 18,000 | THB 30,000 | THB 80,000 | THB 35,000 | THB 65,000 | THB 175,000 | ~9,000 | 68% | 62% | 46 | 58% | Hybrid/Remote | Collaborative, deadline-driven | Low | Medium | balancing creativity with strict brand guidelines |
| UI Wireframer | THB 22,000 | THB 42,000 | THB 105,000 | THB 45,000 | THB 90,000 | THB 220,000 | ~8,500 | 38% | 68% | 45 | 68% | Hybrid | Iterative, detail-oriented | Low | Medium | maintaining consistency across complex layouts |
| Video Editor | THB 18,000 | THB 30,000 | THB 80,000 | THB 35,000 | THB 65,000 | THB 175,000 | ~11,000 | 62% | 58% | 50 | 60% | Hybrid | Execution-focused, artistic | Low | High | long hours during post-production phases |
| Content Planner | THB 18,000 | THB 30,000 | THB 85,000 | THB 35,000 | THB 68,000 | THB 185,000 | ~8,000 | 58% | 62% | 46 | 62% | Hybrid/Remote | Strategic, organized | Low | Medium | managing dense social media calendars |
| Motion Designer | THB 20,000 | THB 38,000 | THB 95,000 | THB 40,000 | THB 80,000 | THB 210,000 | ~6,000 | 55% | 58% | 50 | 63% | Hybrid | Technical, creative | Low | High | handling heavy rendering and asset management |
| Digital Illustrator | THB 18,000 | THB 30,000 | THB 85,000 | THB 35,000 | THB 65,000 | THB 190,000 | ~5,500 | 70% | 65% | 44 | 52% | Hybrid/Remote | Artistic, autonomous | Low | Medium | matching specific artistic visual styles |
| Sound Designer | THB 18,000 | THB 30,000 | THB 90,000 | THB 35,000 | THB 68,000 | THB 200,000 | ~3,000 | 42% | 62% | 46 | 58% | Hybrid | Auditory, immersive | Low | Medium | sourcing unique and high-quality audio samples |
| 3D Asset Optimizer | THB 20,000 | THB 38,000 | THB 100,000 | THB 40,000 | THB 82,000 | THB 220,000 | ~4,000 | 48% | 62% | 46 | 65% | Hybrid | Technical, precise | Low | Medium | balancing visual quality with performance limits |
| UX Researcher | THB 25,000 | THB 52,000 | THB 130,000 | THB 55,000 | THB 115,000 | THB 280,000 | ~6,000 | 31% | 70% | 44 | 75% | Hybrid | Inquisitive, user-centric | Occasional | Medium | recruiting niche participants for studies |
| Information Architect | THB 28,000 | THB 58,000 | THB 140,000 | THB 60,000 | THB 125,000 | THB 300,000 | ~3,500 | 33% | 68% | 45 | 72% | Hybrid/Remote | Logical, structured | Low | Medium | organizing vast amounts of complex data |
| Atomic Design Engineer | THB 32,000 | THB 68,000 | THB 165,000 | THB 65,000 | THB 145,000 | THB 340,000 | ~3,200 | 30% | 68% | 44 | 75% | Hybrid/Remote | Systemic, innovative | Low | Medium | standardizing components across diverse platforms |
| Brand Identity Systems Lead | THB 40,000 | THB 85,000 | THB 210,000 | THB 80,000 | THB 180,000 | THB 420,000 | ~2,800 | 48% | 62% | 48 | 70% | Hybrid | Visionary, disciplined | Occasional | High | ensuring global brand compliance across regions |
| Creative Director | THB 55,000 | THB 115,000 | THB 280,000 | THB 110,000 | THB 245,000 | THB 580,000 | ~4,000 | 45% | 60% | 50 | 68% | Hybrid | Leadership-driven, high-pressure | Frequent | High | managing client expectations and team morale |
| Product Design Director | THB 65,000 | THB 140,000 | THB 340,000 | THB 130,000 | THB 300,000 | THB 700,000 | ~3,500 | 38% | 62% | 50 | 70% | Hybrid | Agile, data-driven | Frequent | High | aligning design goals with business outcomes |
| Immersive Environment Architect | THB 32,000 | THB 68,000 | THB 170,000 | THB 65,000 | THB 145,000 | THB 370,000 | ~1,500 | 35% | 65% | 45 | 65% | Hybrid | Forward-thinking, experimental | Occasional | High | integrating hardware limitations with spatial design |
| Corporate Narrative Director | THB 55,000 | THB 115,000 | THB 280,000 | THB 110,000 | THB 245,000 | THB 580,000 | ~1,800 | 52% | 60% | 50 | 65% | Hybrid | Diplomatic, strategic | Frequent | High | aligning internal messaging with external perception |
| Generative Design Architect | THB 42,000 | THB 90,000 | THB 220,000 | THB 85,000 | THB 190,000 | THB 460,000 | ~1,200 | 28% | 65% | 45 | 72% | Hybrid/Remote | Algorithmic, progressive | Low | High | implementing AI tools into legacy workflows |

---

## CROSS-COUNTRY QUICK REFERENCE (Creative & Design)

### Highest Demand Role by Country (6-month openings)
- **Malaysia**: Junior Graphic Designer (~25,000)
- **Singapore**: Junior Graphic Designer (~8,500)
- **Philippines**: Junior Graphic Designer (~12,000)
- **Laos**: Junior Graphic Designer (~1,200)
- **Vietnam**: Junior Graphic Designer (~18,000)
- **Thailand**: Junior Graphic Designer (~12,000)

### Top Senior Intl Salary by Country
- **Malaysia**: Product Design Director -- RM 25,500-34,500
- **Singapore**: Product Design Director -- S$ 35,700-48,300
- **Philippines**: Product Design Director -- PHP 400,000
- **Laos**: Product Design Director -- LAK 120m
- **Vietnam**: Product Design Director -- VND 300m
- **Thailand**: Product Design Director -- THB 700,000

---

## CAREER PROGRESSION PATHS (All 18 Creative & Design Roles)

**Junior Graphic Designer**
- 0-2 yrs: Junior Graphic Designer
- 2-4 yrs: Mid-Level / Graphic Designer
- 4-7 yrs: Senior Graphic Designer
- 7-10 yrs: Art Director
- 10+ yrs: Creative Director / Head of Design
- Pivots: UI/UX Designer * Brand Strategist * Motion Designer * Illustrator

**Junior Copywriter**
- 0-2 yrs: Junior Copywriter
- 2-4 yrs: Copywriter
- 4-7 yrs: Senior Copywriter
- 7-10 yrs: Copy Lead / Content Strategist
- 10+ yrs: Head of Copy / Creative Director
- Pivots: Brand Strategist * Content Marketer * UX Writer * Editorial Director

**UI Wireframer**
- 0-2 yrs: UI Wireframer / Junior UI Designer
- 2-4 yrs: UI Designer
- 4-7 yrs: Senior UI Designer
- 7-10 yrs: Lead UI Designer / Design Systems Lead
- 10+ yrs: Head of UI / Product Design Director
- Pivots: UX Designer * Interaction Designer * Front-End Developer * Product Manager

**Video Editor**
- 0-2 yrs: Junior Video Editor
- 2-4 yrs: Video Editor
- 4-7 yrs: Senior Video Editor
- 7-10 yrs: Post-Production Supervisor
- 10+ yrs: Creative Director / Head of Post-Production
- Pivots: Motion Designer * Colorist * Director of Photography * Content Producer

**Content Planner**
- 0-2 yrs: Content Planner / Junior Content Strategist
- 2-4 yrs: Content Strategist
- 4-7 yrs: Senior Content Strategist
- 7-10 yrs: Content Lead / Editorial Manager
- 10+ yrs: Head of Content / VP of Content
- Pivots: SEO Specialist * Brand Strategist * Marketing Manager * UX Writer

**Motion Designer**
- 0-2 yrs: Junior Motion Designer
- 2-4 yrs: Motion Designer
- 4-7 yrs: Senior Motion Designer
- 7-10 yrs: Motion Design Lead / Art Director
- 10+ yrs: Creative Director / Head of Motion
- Pivots: Visual Effects Artist * 3D Animator * Video Director * Brand Designer

**Digital Illustrator**
- 0-2 yrs: Junior Digital Illustrator
- 2-4 yrs: Digital Illustrator
- 4-7 yrs: Senior Illustrator
- 7-10 yrs: Lead Illustrator / Art Director
- 10+ yrs: Creative Director / Illustration Studio Lead
- Pivots: Concept Artist * Graphic Designer * Motion Designer * Character Designer

**Sound Designer**
- 0-2 yrs: Junior Sound Designer
- 2-4 yrs: Sound Designer
- 4-7 yrs: Senior Sound Designer
- 7-10 yrs: Lead Sound Designer / Audio Director
- 10+ yrs: Head of Audio / Creative Director
- Pivots: Music Composer * Audio Engineer * Podcast Producer * Game Audio Designer

**3D Asset Optimizer**
- 0-2 yrs: Junior 3D Artist / Asset Optimizer
- 2-4 yrs: 3D Asset Optimizer
- 4-7 yrs: Senior 3D Artist
- 7-10 yrs: Lead 3D Artist / Technical Art Lead
- 10+ yrs: Art Director / Head of 3D
- Pivots: Game Artist * VFX Artist * Real-Time Rendering Engineer * XR Developer

**UX Researcher**
- 0-2 yrs: Junior UX Researcher
- 2-4 yrs: UX Researcher
- 4-7 yrs: Senior UX Researcher
- 7-10 yrs: Lead UX Researcher / Research Manager
- 10+ yrs: Director of User Research
- Pivots: UX Designer * Product Strategist * Data Analyst * Behavioral Scientist

**Information Architect**
- 0-2 yrs: Junior Information Architect
- 2-4 yrs: Information Architect
- 4-7 yrs: Senior Information Architect
- 7-10 yrs: Lead IA / UX Strategy Lead
- 10+ yrs: Head of UX / Director of Information Architecture
- Pivots: UX Designer * Content Strategist * Product Manager * Knowledge Manager

**Atomic Design Engineer**
- 0-2 yrs: Junior UI/Front-End Developer
- 2-4 yrs: Design Systems Developer
- 4-7 yrs: Senior Design Systems Engineer
- 7-10 yrs: Atomic Design Engineer / Design Systems Lead
- 10+ yrs: Head of Design Engineering / Principal Engineer
- Pivots: Front-End Architect * UX Engineer * Product Designer * Engineering Manager

**Brand Identity Systems Lead**
- 0-2 yrs: Brand Designer / Junior Brand Specialist
- 2-4 yrs: Brand Identity Designer
- 4-7 yrs: Senior Brand Designer
- 7-10 yrs: Brand Identity Systems Lead
- 10+ yrs: Head of Brand / VP of Brand Strategy
- Pivots: Creative Director * Marketing Director * Design Systems Architect * Brand Consultant

**Creative Director**
- 0-3 yrs: Junior Designer / Copywriter
- 3-6 yrs: Mid-Level Designer / Art Director
- 6-9 yrs: Senior Art Director / Senior Designer
- 9-12 yrs: Associate Creative Director
- 12+ yrs: Creative Director
- Pivots: Chief Marketing Officer * Brand Consultant * Design Agency Founder * VP of Marketing

**Product Design Director**
- 0-2 yrs: Junior Product Designer
- 2-4 yrs: Product Designer
- 4-7 yrs: Senior Product Designer
- 7-10 yrs: Principal Designer / Design Manager
- 10+ yrs: Product Design Director
- Pivots: Chief Product Officer * VP of Design * Head of UX * Design Consultant

**Immersive Environment Architect**
- 0-2 yrs: Junior XR / Spatial Designer
- 2-4 yrs: Immersive Environment Designer
- 4-7 yrs: Senior Immersive Designer
- 7-10 yrs: Lead Immersive Architect
- 10+ yrs: Immersive Environment Architect / Head of XR
- Pivots: XR Developer * Metaverse Designer * Game Designer * Spatial Computing Engineer

**Corporate Narrative Director**
- 0-2 yrs: Junior Copywriter / Communications Associate
- 2-5 yrs: Communications Specialist / Brand Writer
- 5-8 yrs: Senior Communications Manager
- 8-12 yrs: Head of Brand Storytelling / Communications Director
- 12+ yrs: Corporate Narrative Director / Chief Brand Officer
- Pivots: Chief Marketing Officer * PR Director * Content Strategy VP * Brand Consultant

**Generative Design Architect**
- 0-2 yrs: Junior Computational Designer
- 2-5 yrs: Computational / Generative Designer
- 5-8 yrs: Senior Generative Design Engineer
- 8-11 yrs: Lead Generative Design Architect
- 11+ yrs: Generative Design Architect / Principal Designer
- Pivots: AI/ML Engineer * Parametric Architect * R&D Engineer * Creative Technologist
# Group 2 -- Science & Technology (18 Jobs)

## Jobs
1. Data Log Clerk
2. Laboratory Assistant
3. Research Analyst
4. Organic Chemist
5. Simulation Programmer
6. Genetics Analyst
7. Chromatographer
8. Physical Force Modeler
9. Bioinformatician
10. Environmental Consultant
11. Quantum Kinematics Lead
12. ML Research Scientist
13. Bioprocess Scaleup Engineer
14. Astrophysical Fluid Lead
15. Neuro-Synaptic Architect
16. Climate System Modeler
17. Solid State Physicist
18. Scientific Director

---

## Salary & Market Data

### Malaysia (RM)
| Job Title | Local Fresh | Local Avg | Local Senior | Intl Fresh | Intl Avg | Intl Senior | Demand | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Data Log Clerk | RM 1,400-2,000 | RM 1,900-2,500 | RM 3,200-4,400 | RM 1,700-2,300 | RM 2,400-3,200 | RM 4,200-5,800 | ~9,000 | 91% | 58% | 45 | 45% | Hybrid | Repetitive, methodical | Low | Low | maintaining high accuracy during long shifts |
| Laboratory Assistant | RM 1,500-2,100 | RM 2,100-2,900 | RM 3,800-5,200 | RM 2,100-2,900 | RM 3,000-4,000 | RM 5,500-7,500 | ~11,000 | 38% | 60% | 46 | 65% | On-site | Safety-first, rigorous | Low | Medium | strict adherence to clinical sterilization protocols |
| Research Analyst | RM 2,400-3,200 | RM 3,800-5,200 | RM 7,600-10,400 | RM 3,400-4,600 | RM 6,000-8,000 | RM 11,900-16,100 | ~28,000 | 44% | 65% | 46 | 75% | Hybrid | Analytical, inquisitive | Occasional | Medium | filtering noise from large data sets |
| Organic Chemist | RM 2,100-2,900 | RM 3,400-4,600 | RM 7,600-10,400 | RM 3,400-4,600 | RM 6,000-8,000 | RM 11,900-16,100 | ~8,500 | 32% | 62% | 46 | 70% | Hybrid/On-site | Scientific, detail-oriented | Low | Medium | managing variable reaction times and yields |
| Simulation Programmer | RM 3,000-4,000 | RM 5,500-7,500 | RM 11,900-16,100 | RM 4,700-6,300 | RM 8,500-11,500 | RM 17,000-23,000 | ~10,000 | 30% | 68% | 45 | 75% | Hybrid | Mathematical, logical | Low | Medium | debugging complex physics-based system errors |
| Genetics Analyst | RM 2,600-3,400 | RM 4,700-6,300 | RM 10,200-13,800 | RM 4,200-5,800 | RM 7,600-10,400 | RM 15,300-20,700 | ~7,500 | 28% | 65% | 46 | 75% | Hybrid/On-site | Ethical, precise | Low | High | interpreting high-volume genomic sequencing data |
| Chromatographer | RM 2,100-2,900 | RM 3,200-4,400 | RM 6,800-9,200 | RM 3,000-4,000 | RM 5,100-6,900 | RM 10,200-13,800 | ~6,000 | 35% | 62% | 46 | 70% | On-site | Process-heavy, technical | Low | Medium | calibrating sensitive equipment for precise results |
| Physical Force Modeler | RM 3,000-4,000 | RM 5,100-6,900 | RM 11,000-14,900 | RM 4,700-6,300 | RM 8,500-11,500 | RM 17,000-23,000 | ~3,500 | 25% | 68% | 45 | 75% | Hybrid | Academic, rigorous | Low | Medium | simulating real-world variables in software |
| Bioinformatician | RM 2,600-3,400 | RM 4,700-6,300 | RM 10,200-13,800 | RM 4,200-5,800 | RM 8,500-11,500 | RM 15,300-20,700 | ~8,000 | 22% | 65% | 45 | 78% | Hybrid | Hybrid, data-intensive | Low | Medium | bridging the gap between biology and code |
| Environmental Consultant | RM 2,100-2,900 | RM 3,400-4,600 | RM 8,100-10,900 | RM 3,000-4,000 | RM 5,500-7,500 | RM 11,900-16,100 | ~16,000 | 28% | 65% | 46 | 75% | Hybrid | Compliance-focused, outdoorsy | Frequent | Medium | navigating complex local environmental regulations |
| Quantum Kinematics Lead | RM 3,800-5,200 | RM 7,600-10,400 | RM 17,000-23,000 | RM 6,000-8,000 | RM 12,800-17,200 | RM 23,800-32,200 | ~2,000 | 12% | 68% | 46 | 80% | Hybrid | Pioneering, theoretical | Occasional | High | managing high failure rates in experimentation |
| ML Research Scientist | RM 3,400-4,600 | RM 6,800-9,200 | RM 15,300-20,700 | RM 6,000-8,000 | RM 11,900-16,100 | RM 23,800-32,200 | ~18,000 | 15% | 65% | 50 | 85% | Hybrid/Remote | Innovative, math-heavy | Occasional | High | optimizing models with limited localized datasets |
| Bioprocess Scaleup Engineer | RM 2,600-3,400 | RM 5,100-6,900 | RM 11,900-16,100 | RM 4,200-5,800 | RM 8,500-11,500 | RM 18,700-25,300 | ~9,000 | 25% | 65% | 46 | 78% | Hybrid/On-site | Operational, industrial | Occasional | High | transferring lab results to mass production |
| Astrophysical Fluid Lead | RM 3,000-4,000 | RM 5,500-7,500 | RM 13,600-18,400 | RM 5,100-6,900 | RM 9,400-12,600 | RM 21,200-28,700 | ~1,500 | 12% | 68% | 46 | 80% | Hybrid | Academic, visionary | Occasional | Medium | securing continuous funding for long-term projects |
| Neuro-Synaptic Architect | RM 3,400-4,600 | RM 6,400-8,600 | RM 15,300-20,700 | RM 6,000-8,000 | RM 11,000-14,900 | RM 23,800-32,200 | ~2,000 | 14% | 68% | 47 | 80% | Hybrid | Experimental, interdisciplinary | Low | High | mapping complex neural pathways accurately |
| Climate System Modeler | RM 3,000-4,000 | RM 5,100-6,900 | RM 11,900-16,100 | RM 4,700-6,300 | RM 8,500-11,500 | RM 18,700-25,300 | ~5,000 | 18% | 68% | 46 | 78% | Hybrid | Urgent, collaborative | Low | High | forecasting unpredictable regional weather patterns |
| Solid State Physicist | RM 3,000-4,000 | RM 5,500-7,500 | RM 12,800-17,200 | RM 5,100-6,900 | RM 9,400-12,600 | RM 18,700-25,300 | ~4,500 | 15% | 68% | 46 | 80% | Hybrid | Focused, lab-based | Low | Medium | conducting experiments under extreme controlled conditions |
| Scientific Director | RM 5,100-6,900 | RM 9,400-12,600 | RM 20,400-27,600 | RM 8,500-11,500 | RM 15,300-20,700 | RM 29,800-40,200 | ~4,000 | 16% | 65% | 50 | 82% | Hybrid | Administrative, strategic | Frequent | High | balancing research ethics with commercial goals |

### Singapore (S$)
| Job Title | Local Fresh | Local Avg | Local Senior | Intl Fresh | Intl Avg | Intl Senior | Demand | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Data Log Clerk | S$ 2,100-2,900 | S$ 2,700-3,700 | S$ 4,700-6,300 | S$ 2,600-3,400 | S$ 3,600-4,800 | S$ 6,000-8,000 | ~3,000 | 91% | 60% | 44 | 42% | Hybrid | Repetitive, methodical | Low | Low | maintaining high accuracy during long shifts |
| Laboratory Assistant | S$ 2,200-3,000 | S$ 3,000-4,000 | S$ 5,500-7,500 | S$ 3,000-4,000 | S$ 4,200-5,800 | S$ 7,600-10,400 | ~3,800 | 38% | 62% | 44 | 65% | On-site | Safety-first, rigorous | Low | Medium | strict adherence to clinical sterilization protocols |
| Research Analyst | S$ 3,200-4,400 | S$ 5,300-7,100 | S$ 11,900-16,100 | S$ 4,700-6,300 | S$ 8,100-10,900 | S$ 17,000-23,000 | ~9,500 | 44% | 70% | 44 | 75% | Hybrid | Analytical, inquisitive | Occasional | Medium | filtering noise from large data sets |
| Organic Chemist | S$ 3,000-4,000 | S$ 4,900-6,700 | S$ 11,000-14,900 | S$ 4,700-6,300 | S$ 8,100-10,900 | S$ 17,000-23,000 | ~2,800 | 32% | 65% | 44 | 70% | Hybrid/On-site | Scientific, detail-oriented | Low | Medium | managing variable reaction times and yields |
| Simulation Programmer | S$ 4,200-5,800 | S$ 7,600-10,400 | S$ 17,000-23,000 | S$ 6,400-8,600 | S$ 11,900-16,100 | S$ 23,800-32,200 | ~3,500 | 30% | 70% | 44 | 75% | Hybrid | Mathematical, logical | Low | Medium | debugging complex physics-based system errors |
| Genetics Analyst | S$ 3,800-5,200 | S$ 6,400-8,600 | S$ 14,400-19,600 | S$ 6,000-8,000 | S$ 10,600-14,400 | S$ 22,100-29,900 | ~2,500 | 28% | 68% | 44 | 75% | Hybrid/On-site | Ethical, precise | Low | High | interpreting high-volume genomic sequencing data |
| Chromatographer | S$ 3,000-4,000 | S$ 4,700-6,300 | S$ 10,200-13,800 | S$ 4,200-5,800 | S$ 7,200-9,800 | S$ 14,400-19,600 | ~2,000 | 35% | 65% | 44 | 70% | On-site | Process-heavy, technical | Low | Medium | calibrating sensitive equipment for precise results |
| Physical Force Modeler | S$ 4,200-5,800 | S$ 7,200-9,800 | S$ 15,300-20,700 | S$ 6,800-9,200 | S$ 11,900-16,100 | S$ 23,800-32,200 | ~1,200 | 25% | 70% | 44 | 75% | Hybrid | Academic, rigorous | Low | Medium | simulating real-world variables in software |
| Bioinformatician | S$ 3,700-4,900 | S$ 6,400-8,600 | S$ 14,400-19,600 | S$ 6,000-8,000 | S$ 11,000-14,900 | S$ 22,100-29,900 | ~2,700 | 22% | 70% | 44 | 78% | Hybrid | Hybrid, data-intensive | Low | Medium | bridging the gap between biology and code |
| Environmental Consultant | S$ 3,000-4,000 | S$ 4,900-6,700 | S$ 11,900-16,100 | S$ 4,200-5,800 | S$ 7,600-10,400 | S$ 17,000-23,000 | ~5,500 | 28% | 70% | 44 | 75% | Hybrid | Compliance-focused, outdoorsy | Frequent | Medium | navigating complex local environmental regulations |
| Quantum Kinematics Lead | S$ 5,500-7,500 | S$ 11,000-14,900 | S$ 23,800-32,200 | S$ 8,500-11,500 | S$ 17,000-23,000 | S$ 34,000-46,000 | ~700 | 12% | 72% | 46 | 80% | Hybrid | Pioneering, theoretical | Occasional | High | managing high failure rates in experimentation |
| ML Research Scientist | S$ 5,100-6,900 | S$ 9,400-12,600 | S$ 22,100-29,900 | S$ 8,500-11,500 | S$ 17,000-23,000 | S$ 34,000-46,000 | ~6,200 | 15% | 70% | 48 | 85% | Hybrid/Remote | Innovative, math-heavy | Occasional | High | optimizing models with limited localized datasets |
| Bioprocess Scaleup Engineer | S$ 3,800-5,200 | S$ 6,800-9,200 | S$ 17,000-23,000 | S$ 6,000-8,000 | S$ 11,900-16,100 | S$ 25,500-34,500 | ~3,000 | 25% | 68% | 45 | 78% | Hybrid/On-site | Operational, industrial | Occasional | High | transferring lab results to mass production |
| Astrophysical Fluid Lead | S$ 4,200-5,800 | S$ 8,100-10,900 | S$ 18,700-25,300 | S$ 7,200-9,800 | S$ 13,600-18,400 | S$ 29,800-40,200 | ~500 | 12% | 72% | 46 | 80% | Hybrid | Academic, visionary | Occasional | Medium | securing continuous funding for long-term projects |
| Neuro-Synaptic Architect | S$ 4,700-6,300 | S$ 8,900-12,100 | S$ 21,200-28,700 | S$ 8,100-10,900 | S$ 15,300-20,700 | S$ 32,300-43,700 | ~700 | 14% | 70% | 47 | 80% | Hybrid | Experimental, interdisciplinary | Low | High | mapping complex neural pathways accurately |
| Climate System Modeler | S$ 4,200-5,800 | S$ 7,200-9,800 | S$ 17,000-23,000 | S$ 6,800-9,200 | S$ 11,900-16,100 | S$ 25,500-34,500 | ~1,700 | 18% | 72% | 44 | 78% | Hybrid | Urgent, collaborative | Low | High | forecasting unpredictable regional weather patterns |
| Solid State Physicist | S$ 4,200-5,800 | S$ 7,600-10,400 | S$ 17,800-24,100 | S$ 7,200-9,800 | S$ 12,800-17,200 | S$ 25,500-34,500 | ~1,500 | 15% | 72% | 44 | 80% | Hybrid | Focused, lab-based | Low | Medium | conducting experiments under extreme controlled conditions |
| Scientific Director | S$ 7,200-9,800 | S$ 12,800-17,200 | S$ 27,200-36,800 | S$ 11,900-16,100 | S$ 21,200-28,700 | S$ 40,800-55,200 | ~1,400 | 16% | 70% | 50 | 82% | Hybrid | Administrative, strategic | Frequent | High | balancing research ethics with commercial goals |

### Philippines (PHP)
| Job Title | Local Fresh | Local Avg | Local Senior | Intl Fresh | Intl Avg | Intl Senior | Demand | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Data Log Clerk | PHP 16,000 | PHP 20,000 | PHP 38,000 | PHP 20,000 | PHP 28,000 | PHP 55,000 | ~5,000 | 91% | 58% | 45 | 45% | Hybrid | Repetitive, methodical | Low | Low | maintaining high accuracy during long shifts |
| Laboratory Assistant | PHP 16,000 | PHP 22,000 | PHP 45,000 | PHP 22,000 | PHP 35,000 | PHP 70,000 | ~5,500 | 38% | 60% | 46 | 65% | On-site | Safety-first, rigorous | Low | Medium | strict adherence to clinical sterilization protocols |
| Research Analyst | PHP 22,000 | PHP 40,000 | PHP 100,000 | PHP 38,000 | PHP 75,000 | PHP 160,000 | ~14,000 | 44% | 65% | 46 | 75% | Hybrid | Analytical, inquisitive | Occasional | Medium | filtering noise from large data sets |
| Organic Chemist | PHP 20,000 | PHP 35,000 | PHP 90,000 | PHP 35,000 | PHP 70,000 | PHP 150,000 | ~4,000 | 32% | 62% | 46 | 70% | Hybrid/On-site | Scientific, detail-oriented | Low | Medium | managing variable reaction times and yields |
| Simulation Programmer | PHP 28,000 | PHP 55,000 | PHP 140,000 | PHP 55,000 | PHP 110,000 | PHP 240,000 | ~4,500 | 30% | 68% | 45 | 75% | Hybrid | Mathematical, logical | Low | Medium | debugging complex physics-based system errors |
| Genetics Analyst | PHP 22,000 | PHP 40,000 | PHP 100,000 | PHP 40,000 | PHP 80,000 | PHP 170,000 | ~3,000 | 28% | 65% | 46 | 75% | Hybrid/On-site | Ethical, precise | Low | High | interpreting high-volume genomic sequencing data |
| Chromatographer | PHP 18,000 | PHP 30,000 | PHP 75,000 | PHP 30,000 | PHP 58,000 | PHP 130,000 | ~2,500 | 35% | 62% | 46 | 70% | On-site | Process-heavy, technical | Low | Medium | calibrating sensitive equipment for precise results |
| Physical Force Modeler | PHP 28,000 | PHP 55,000 | PHP 140,000 | PHP 55,000 | PHP 110,000 | PHP 240,000 | ~900 | 25% | 68% | 45 | 75% | Hybrid | Academic, rigorous | Low | Medium | simulating real-world variables in software |
| Bioinformatician | PHP 25,000 | PHP 48,000 | PHP 120,000 | PHP 48,000 | PHP 95,000 | PHP 200,000 | ~2,800 | 22% | 65% | 45 | 78% | Hybrid | Hybrid, data-intensive | Low | Medium | bridging the gap between biology and code |
| Environmental Consultant | PHP 20,000 | PHP 35,000 | PHP 90,000 | PHP 35,000 | PHP 70,000 | PHP 160,000 | ~6,000 | 28% | 65% | 46 | 75% | Hybrid | Compliance-focused, outdoorsy | Frequent | Medium | navigating complex local environmental regulations |
| Quantum Kinematics Lead | PHP 35,000 | PHP 80,000 | PHP 200,000 | PHP 75,000 | PHP 160,000 | PHP 350,000 | ~400 | 12% | 68% | 46 | 80% | Hybrid | Pioneering, theoretical | Occasional | High | managing high failure rates in experimentation |
| ML Research Scientist | PHP 35,000 | PHP 75,000 | PHP 190,000 | PHP 75,000 | PHP 160,000 | PHP 360,000 | ~5,500 | 15% | 65% | 50 | 85% | Hybrid/Remote | Innovative, math-heavy | Occasional | High | optimizing models with limited localized datasets |
| Bioprocess Scaleup Engineer | PHP 25,000 | PHP 50,000 | PHP 130,000 | PHP 50,000 | PHP 100,000 | PHP 220,000 | ~3,500 | 25% | 65% | 46 | 78% | Hybrid/On-site | Operational, industrial | Occasional | High | transferring lab results to mass production |
| Astrophysical Fluid Lead | PHP 30,000 | PHP 70,000 | PHP 180,000 | PHP 70,000 | PHP 150,000 | PHP 320,000 | ~300 | 12% | 68% | 46 | 80% | Hybrid | Academic, visionary | Occasional | Medium | securing continuous funding for long-term projects |
| Neuro-Synaptic Architect | PHP 32,000 | PHP 75,000 | PHP 190,000 | PHP 75,000 | PHP 160,000 | PHP 340,000 | ~400 | 14% | 68% | 47 | 80% | Hybrid | Experimental, interdisciplinary | Low | High | mapping complex neural pathways accurately |
| Climate System Modeler | PHP 28,000 | PHP 60,000 | PHP 150,000 | PHP 60,000 | PHP 120,000 | PHP 260,000 | ~1,200 | 18% | 68% | 46 | 78% | Hybrid | Urgent, collaborative | Low | High | forecasting unpredictable regional weather patterns |
| Solid State Physicist | PHP 28,000 | PHP 60,000 | PHP 155,000 | PHP 60,000 | PHP 120,000 | PHP 260,000 | ~1,000 | 15% | 68% | 46 | 80% | Hybrid | Focused, lab-based | Low | Medium | conducting experiments under extreme controlled conditions |
| Scientific Director | PHP 55,000 | PHP 110,000 | PHP 280,000 | PHP 110,000 | PHP 220,000 | PHP 450,000 | ~1,000 | 16% | 65% | 50 | 82% | Hybrid | Administrative, strategic | Frequent | High | balancing research ethics with commercial goals |

### Laos (LAK)
| Job Title | Local Fresh | Local Avg | Local Senior | Intl Fresh | Intl Avg | Intl Senior | Demand | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Data Log Clerk | LAK 2.5m | LAK 3.5m | LAK 7m | LAK 4m | LAK 6.5m | LAK 14m | ~1,500 | 91% | 58% | 45 | 45% | Hybrid | Repetitive, methodical | Low | Low | maintaining high accuracy during long shifts |
| Laboratory Assistant | LAK 3m | LAK 5m | LAK 12m | LAK 6m | LAK 11m | LAK 25m | ~1,800 | 38% | 60% | 46 | 65% | On-site | Safety-first, rigorous | Low | Medium | strict adherence to clinical sterilization protocols |
| Research Analyst | LAK 5m | LAK 10m | LAK 25m | LAK 12m | LAK 24m | LAK 55m | ~800 | 44% | 65% | 46 | 75% | Hybrid | Analytical, inquisitive | Occasional | Medium | filtering noise from large data sets |
| Organic Chemist | LAK 4.5m | LAK 9m | LAK 22m | LAK 11m | LAK 22m | LAK 50m | ~400 | 32% | 62% | 46 | 70% | Hybrid/On-site | Scientific, detail-oriented | Low | Medium | managing variable reaction times and yields |
| Simulation Programmer | LAK 6m | LAK 12m | LAK 30m | LAK 14m | LAK 28m | LAK 65m | ~250 | 30% | 68% | 45 | 75% | Hybrid | Mathematical, logical | Low | Medium | debugging complex physics-based system errors |
| Genetics Analyst | LAK 5m | LAK 10m | LAK 25m | LAK 12m | LAK 24m | LAK 55m | ~200 | 28% | 65% | 46 | 75% | Hybrid/On-site | Ethical, precise | Low | High | interpreting high-volume genomic sequencing data |
| Chromatographer | LAK 4m | LAK 8m | LAK 20m | LAK 10m | LAK 19m | LAK 45m | ~200 | 35% | 62% | 46 | 70% | On-site | Process-heavy, technical | Low | Medium | calibrating sensitive equipment for precise results |
| Physical Force Modeler | LAK 6m | LAK 12m | LAK 30m | LAK 14m | LAK 28m | LAK 65m | ~100 | 25% | 68% | 45 | 75% | Hybrid | Academic, rigorous | Low | Medium | simulating real-world variables in software |
| Bioinformatician | LAK 5.5m | LAK 11m | LAK 28m | LAK 13m | LAK 26m | LAK 60m | ~200 | 22% | 65% | 45 | 78% | Hybrid | Hybrid, data-intensive | Low | Medium | bridging the gap between biology and code |
| Environmental Consultant | LAK 4.5m | LAK 9m | LAK 22m | LAK 11m | LAK 22m | LAK 50m | ~600 | 28% | 65% | 46 | 75% | Hybrid | Compliance-focused, outdoorsy | Frequent | Medium | navigating complex local environmental regulations |
| Quantum Kinematics Lead | LAK 8m | LAK 18m | LAK 45m | LAK 20m | LAK 40m | LAK 90m | ~50 | 12% | 68% | 46 | 80% | Hybrid | Pioneering, theoretical | Occasional | High | managing high failure rates in experimentation |
| ML Research Scientist | LAK 7m | LAK 16m | LAK 40m | LAK 18m | LAK 38m | LAK 85m | ~300 | 15% | 65% | 50 | 85% | Hybrid/Remote | Innovative, math-heavy | Occasional | High | optimizing models with limited localized datasets |
| Bioprocess Scaleup Engineer | LAK 5.5m | LAK 11m | LAK 28m | LAK 13m | LAK 26m | LAK 60m | ~200 | 25% | 65% | 46 | 78% | Hybrid/On-site | Operational, industrial | Occasional | High | transferring lab results to mass production |
| Astrophysical Fluid Lead | LAK 7m | LAK 16m | LAK 40m | LAK 18m | LAK 36m | LAK 85m | ~50 | 12% | 68% | 46 | 80% | Hybrid | Academic, visionary | Occasional | Medium | securing continuous funding for long-term projects |
| Neuro-Synaptic Architect | LAK 7m | LAK 16m | LAK 40m | LAK 18m | LAK 36m | LAK 85m | ~50 | 14% | 68% | 47 | 80% | Hybrid | Experimental, interdisciplinary | Low | High | mapping complex neural pathways accurately |
| Climate System Modeler | LAK 6m | LAK 12m | LAK 30m | LAK 14m | LAK 28m | LAK 65m | ~150 | 18% | 68% | 46 | 78% | Hybrid | Urgent, collaborative | Low | High | forecasting unpredictable regional weather patterns |
| Solid State Physicist | LAK 6m | LAK 12m | LAK 30m | LAK 14m | LAK 28m | LAK 65m | ~100 | 15% | 68% | 46 | 80% | Hybrid | Focused, lab-based | Low | Medium | conducting experiments under extreme controlled conditions |
| Scientific Director | LAK 12m | LAK 26m | LAK 65m | LAK 28m | LAK 60m | LAK 130m | ~150 | 16% | 65% | 50 | 82% | Hybrid | Administrative, strategic | Frequent | High | balancing research ethics with commercial goals |

### Vietnam (VND)
| Job Title | Local Fresh | Local Avg | Local Senior | Intl Fresh | Intl Avg | Intl Senior | Demand | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Data Log Clerk | VND 4.5m | VND 7m | VND 15m | VND 6m | VND 10m | VND 22m | ~8,000 | 91% | 58% | 45 | 45% | Hybrid | Repetitive, methodical | Low | Low | maintaining high accuracy during long shifts |
| Laboratory Assistant | VND 5m | VND 8.5m | VND 20m | VND 8m | VND 16m | VND 38m | ~9,000 | 38% | 60% | 46 | 65% | On-site | Safety-first, rigorous | Low | Medium | strict adherence to clinical sterilization protocols |
| Research Analyst | VND 9m | VND 20m | VND 50m | VND 22m | VND 45m | VND 110m | ~22,000 | 44% | 65% | 46 | 75% | Hybrid | Analytical, inquisitive | Occasional | Medium | filtering noise from large data sets |
| Organic Chemist | VND 8m | VND 16m | VND 40m | VND 18m | VND 38m | VND 90m | ~6,000 | 32% | 62% | 46 | 70% | Hybrid/On-site | Scientific, detail-oriented | Low | Medium | managing variable reaction times and yields |
| Simulation Programmer | VND 12m | VND 27m | VND 65m | VND 28m | VND 60m | VND 145m | ~6,500 | 30% | 68% | 45 | 75% | Hybrid | Mathematical, logical | Low | Medium | debugging complex physics-based system errors |
| Genetics Analyst | VND 9m | VND 20m | VND 50m | VND 22m | VND 45m | VND 115m | ~4,500 | 28% | 65% | 46 | 75% | Hybrid/On-site | Ethical, precise | Low | High | interpreting high-volume genomic sequencing data |
| Chromatographer | VND 7m | VND 14m | VND 35m | VND 16m | VND 32m | VND 80m | ~3,500 | 35% | 62% | 46 | 70% | On-site | Process-heavy, technical | Low | Medium | calibrating sensitive equipment for precise results |
| Physical Force Modeler | VND 11m | VND 24m | VND 60m | VND 26m | VND 55m | VND 135m | ~1,200 | 25% | 68% | 45 | 75% | Hybrid | Academic, rigorous | Low | Medium | simulating real-world variables in software |
| Bioinformatician | VND 10m | VND 22m | VND 55m | VND 24m | VND 50m | VND 125m | ~3,800 | 22% | 65% | 45 | 78% | Hybrid | Hybrid, data-intensive | Low | Medium | bridging the gap between biology and code |
| Environmental Consultant | VND 8m | VND 16m | VND 40m | VND 18m | VND 38m | VND 95m | ~10,000 | 28% | 65% | 46 | 75% | Hybrid | Compliance-focused, outdoorsy | Frequent | Medium | navigating complex local environmental regulations |
| Quantum Kinematics Lead | VND 16m | VND 38m | VND 95m | VND 40m | VND 85m | VND 200m | ~600 | 12% | 68% | 46 | 80% | Hybrid | Pioneering, theoretical | Occasional | High | managing high failure rates in experimentation |
| ML Research Scientist | VND 15m | VND 35m | VND 90m | VND 38m | VND 80m | VND 200m | ~8,500 | 15% | 65% | 50 | 85% | Hybrid/Remote | Innovative, math-heavy | Occasional | High | optimizing models with limited localized datasets |
| Bioprocess Scaleup Engineer | VND 11m | VND 24m | VND 60m | VND 26m | VND 55m | VND 135m | ~5,000 | 25% | 65% | 46 | 78% | Hybrid/On-site | Operational, industrial | Occasional | High | transferring lab results to mass production |
| Astrophysical Fluid Lead | VND 14m | VND 32m | VND 80m | VND 35m | VND 75m | VND 180m | ~400 | 12% | 68% | 46 | 80% | Hybrid | Academic, visionary | Occasional | Medium | securing continuous funding for long-term projects |
| Neuro-Synaptic Architect | VND 14m | VND 34m | VND 85m | VND 38m | VND 80m | VND 190m | ~500 | 14% | 68% | 47 | 80% | Hybrid | Experimental, interdisciplinary | Low | High | mapping complex neural pathways accurately |
| Climate System Modeler | VND 12m | VND 27m | VND 65m | VND 28m | VND 60m | VND 150m | ~2,000 | 18% | 68% | 46 | 78% | Hybrid | Urgent, collaborative | Low | High | forecasting unpredictable regional weather patterns |
| Solid State Physicist | VND 12m | VND 27m | VND 65m | VND 28m | VND 60m | VND 150m | ~1,800 | 15% | 68% | 46 | 80% | Hybrid | Focused, lab-based | Low | Medium | conducting experiments under extreme controlled conditions |
| Scientific Director | VND 28m | VND 60m | VND 145m | VND 65m | VND 140m | VND 320m | ~1,500 | 16% | 65% | 50 | 82% | Hybrid | Administrative, strategic | Frequent | High | balancing research ethics with commercial goals |

### Thailand (THB)
| Job Title | Local Fresh | Local Avg | Local Senior | Intl Fresh | Intl Avg | Intl Senior | Demand | AI Risk | WLB% | Hrs/Wk | Stability% | Work Mode | Culture | Travel | Stress | Challenges |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Data Log Clerk | THB 12,000 | THB 17,000 | THB 35,000 | THB 16,000 | THB 24,000 | THB 52,000 | ~6,000 | 91% | 58% | 45 | 45% | Hybrid | Repetitive, methodical | Low | Low | maintaining high accuracy during long shifts |
| Laboratory Assistant | THB 13,000 | THB 20,000 | THB 45,000 | THB 20,000 | THB 38,000 | THB 88,000 | ~7,000 | 38% | 60% | 46 | 65% | On-site | Safety-first, rigorous | Low | Medium | strict adherence to clinical sterilization protocols |
| Research Analyst | THB 22,000 | THB 45,000 | THB 110,000 | THB 45,000 | THB 100,000 | THB 240,000 | ~16,000 | 44% | 65% | 46 | 75% | Hybrid | Analytical, inquisitive | Occasional | Medium | filtering noise from large data sets |
| Organic Chemist | THB 20,000 | THB 38,000 | THB 95,000 | THB 40,000 | THB 82,000 | THB 210,000 | ~5,000 | 32% | 62% | 46 | 70% | Hybrid/On-site | Scientific, detail-oriented | Low | Medium | managing variable reaction times and yields |
| Simulation Programmer | THB 28,000 | THB 60,000 | THB 145,000 | THB 60,000 | THB 130,000 | THB 310,000 | ~5,000 | 30% | 68% | 45 | 75% | Hybrid | Mathematical, logical | Low | Medium | debugging complex physics-based system errors |
| Genetics Analyst | THB 22,000 | THB 45,000 | THB 115,000 | THB 48,000 | THB 100,000 | THB 250,000 | ~3,500 | 28% | 65% | 46 | 75% | Hybrid/On-site | Ethical, precise | Low | High | interpreting high-volume genomic sequencing data |
| Chromatographer | THB 18,000 | THB 33,000 | THB 85,000 | THB 35,000 | THB 72,000 | THB 185,000 | ~2,800 | 35% | 62% | 46 | 70% | On-site | Process-heavy, technical | Low | Medium | calibrating sensitive equipment for precise results |
| Physical Force Modeler | THB 26,000 | THB 55,000 | THB 135,000 | THB 58,000 | THB 120,000 | THB 290,000 | ~1,000 | 25% | 68% | 45 | 75% | Hybrid | Academic, rigorous | Low | Medium | simulating real-world variables in software |
| Bioinformatician | THB 24,000 | THB 50,000 | THB 125,000 | THB 55,000 | THB 115,000 | THB 280,000 | ~2,800 | 22% | 65% | 45 | 78% | Hybrid | Hybrid, data-intensive | Low | Medium | bridging the gap between biology and code |
| Environmental Consultant | THB 20,000 | THB 38,000 | THB 95,000 | THB 42,000 | THB 88,000 | THB 220,000 | ~8,000 | 28% | 65% | 46 | 75% | Hybrid | Compliance-focused, outdoorsy | Frequent | Medium | navigating complex local environmental regulations |
| Quantum Kinematics Lead | THB 38,000 | THB 88,000 | THB 220,000 | THB 85,000 | THB 195,000 | THB 480,000 | ~500 | 12% | 68% | 46 | 80% | Hybrid | Pioneering, theoretical | Occasional | High | managing high failure rates in experimentation |
| ML Research Scientist | THB 35,000 | THB 80,000 | THB 200,000 | THB 80,000 | THB 180,000 | THB 440,000 | ~7,000 | 15% | 65% | 50 | 85% | Hybrid/Remote | Innovative, math-heavy | Occasional | High | optimizing models with limited localized datasets |
| Bioprocess Scaleup Engineer | THB 26,000 | THB 55,000 | THB 135,000 | THB 58,000 | THB 122,000 | THB 300,000 | ~4,000 | 25% | 65% | 46 | 78% | Hybrid/On-site | Operational, industrial | Occasional | High | transferring lab results to mass production |
| Astrophysical Fluid Lead | THB 32,000 | THB 75,000 | THB 185,000 | THB 75,000 | THB 168,000 | THB 400,000 | ~350 | 12% | 68% | 46 | 80% | Hybrid | Academic, visionary | Occasional | Medium | securing continuous funding for long-term projects |
| Neuro-Synaptic Architect | THB 34,000 | THB 78,000 | THB 195,000 | THB 78,000 | THB 175,000 | THB 420,000 | ~400 | 14% | 68% | 47 | 80% | Hybrid | Experimental, interdisciplinary | Low | High | mapping complex neural pathways accurately |
| Climate System Modeler | THB 28,000 | THB 62,000 | THB 155,000 | THB 62,000 | THB 138,000 | THB 340,000 | ~1,500 | 18% | 68% | 46 | 78% | Hybrid | Urgent, collaborative | Low | High | forecasting unpredictable regional weather patterns |
| Solid State Physicist | THB 28,000 | THB 62,000 | THB 155,000 | THB 62,000 | THB 138,000 | THB 340,000 | ~1,200 | 15% | 68% | 46 | 80% | Hybrid | Focused, lab-based | Low | Medium | conducting experiments under extreme controlled conditions |
| Scientific Director | THB 65,000 | THB 140,000 | THB 340,000 | THB 140,000 | THB 310,000 | THB 730,000 | ~1,200 | 16% | 65% | 50 | 82% | Hybrid | Administrative, strategic | Frequent | High | balancing research ethics with commercial goals |

---

## CROSS-COUNTRY QUICK REFERENCE (Science & Technology)

### Highest Demand Role by Country (6-month openings)
- **Malaysia**: Research Analyst (~28,000)
- **Singapore**: Research Analyst (~9,500)
- **Philippines**: Research Analyst (~14,000)
- **Laos**: Laboratory Assistant (~1,800)
- **Vietnam**: Research Analyst (~22,000)
- **Thailand**: Research Analyst (~16,000)

### Top Senior Intl Salary by Country
- **Malaysia**: Scientific Director -- RM 29,800-40,200
- **Singapore**: Scientific Director -- S$ 40,800-55,200
- **Philippines**: Scientific Director -- PHP 450,000
- **Laos**: Scientific Director -- LAK 130m
- **Vietnam**: Scientific Director -- VND 320m
- **Thailand**: Scientific Director -- THB 730,000

---

## CAREER PROGRESSION PATHS (All 18 Science & Technology Roles)

**Data Log Clerk**
- 0-2 yrs: Data Log Clerk
- 2-4 yrs: Data Technician / Records Specialist
- 4-7 yrs: Senior Data Administrator
- 7-10 yrs: Data Manager
- 10+ yrs: Head of Data Operations
- Pivots: Data Analyst * Database Administrator * Quality Assurance Specialist * Compliance Officer

**Laboratory Assistant**
- 0-2 yrs: Laboratory Assistant
- 2-4 yrs: Laboratory Technician
- 4-7 yrs: Senior Lab Technician
- 7-10 yrs: Laboratory Manager
- 10+ yrs: Director of Laboratory Operations
- Pivots: Research Scientist * Quality Control Analyst * Biomedical Technologist * Regulatory Affairs Specialist

**Research Analyst**
- 0-2 yrs: Junior Research Analyst
- 2-4 yrs: Research Analyst
- 4-7 yrs: Senior Research Analyst
- 7-10 yrs: Research Manager / Lead Analyst
- 10+ yrs: Director of Research
- Pivots: Data Scientist * Policy Analyst * Strategy Consultant * Market Research Director

**Organic Chemist**
- 0-2 yrs: Junior Organic Chemist
- 2-5 yrs: Organic Chemist
- 5-8 yrs: Senior Organic Chemist
- 8-12 yrs: Principal Chemist / Chemistry Lead
- 12+ yrs: Head of Chemistry / R&D Director
- Pivots: Medicinal Chemist * Process Chemist * Regulatory Affairs Scientist * Pharmaceutical R&D Manager

**Simulation Programmer**
- 0-2 yrs: Junior Simulation Programmer
- 2-4 yrs: Simulation Programmer
- 4-7 yrs: Senior Simulation Engineer
- 7-10 yrs: Lead Simulation Architect
- 10+ yrs: Principal Engineer / Head of Simulation
- Pivots: Computational Scientist * Game Developer * Digital Twin Engineer * ML Engineer

**Genetics Analyst**
- 0-2 yrs: Junior Genetics Analyst
- 2-5 yrs: Genetics Analyst
- 5-8 yrs: Senior Genetics Analyst
- 8-12 yrs: Principal Geneticist / Genomics Lead
- 12+ yrs: Director of Genomics / Chief Scientific Officer
- Pivots: Bioinformatician * Genetic Counselor * Clinical Research Scientist * Computational Biologist

**Chromatographer**
- 0-2 yrs: Junior Analytical Chemist / Chromatographer
- 2-5 yrs: Chromatographer
- 5-8 yrs: Senior Analytical Chemist
- 8-12 yrs: Analytical Lead / QC Manager
- 12+ yrs: Director of Analytical Chemistry / R&D Head
- Pivots: Forensic Chemist * Food Safety Scientist * Pharmaceutical QC Manager * Environmental Chemist

**Physical Force Modeler**
- 0-2 yrs: Junior Physicist / Computational Modeler
- 2-5 yrs: Physical Force Modeler
- 5-8 yrs: Senior Simulation Scientist
- 8-12 yrs: Lead Computational Physicist
- 12+ yrs: Principal Scientist / Head of Computational Physics
- Pivots: Aerospace Engineer * Structural Engineer * Finite Element Analysis Specialist * Quantum Physicist

**Bioinformatician**
- 0-2 yrs: Junior Bioinformatician
- 2-5 yrs: Bioinformatician
- 5-8 yrs: Senior Bioinformatician
- 8-12 yrs: Lead Bioinformatician / Computational Biology Manager
- 12+ yrs: Director of Bioinformatics / Chief Data Scientist
- Pivots: Genomics Data Scientist * Machine Learning Researcher * Clinical Informatics Specialist * Structural Biologist

**Environmental Consultant**
- 0-2 yrs: Junior Environmental Consultant
- 2-5 yrs: Environmental Consultant
- 5-8 yrs: Senior Environmental Consultant
- 8-12 yrs: Principal Consultant / Project Director
- 12+ yrs: Head of Environmental Practice / Partner
- Pivots: Sustainability Manager * Environmental Policy Analyst * EHS Director * Climate Risk Advisor

**Quantum Kinematics Lead**
- 0-3 yrs: Quantum Research Associate / Junior Physicist
- 3-6 yrs: Quantum Physicist / Research Scientist
- 6-9 yrs: Senior Quantum Scientist
- 9-12 yrs: Quantum Kinematics Lead / Principal Researcher
- 12+ yrs: Chief Scientist / Director of Quantum Research
- Pivots: Quantum Computing Engineer * Photonics Researcher * Materials Scientist * Defense R&D Scientist

**ML Research Scientist**
- 0-2 yrs: Junior ML Researcher / Research Engineer
- 2-5 yrs: ML Research Scientist
- 5-8 yrs: Senior ML Research Scientist
- 8-12 yrs: Principal Research Scientist / Research Lead
- 12+ yrs: Head of AI Research / Chief Scientist
- Pivots: AI Product Manager * Applied ML Engineer * Research Director * AI Ethics Researcher

**Bioprocess Scaleup Engineer**
- 0-2 yrs: Junior Bioprocess Engineer
- 2-5 yrs: Bioprocess Engineer
- 5-8 yrs: Senior Bioprocess Engineer
- 8-12 yrs: Bioprocess Scaleup Engineer / Technical Lead
- 12+ yrs: Head of Bioprocess / Director of Manufacturing Science
- Pivots: Process Development Scientist * Manufacturing Director * Regulatory CMC Specialist * Fermentation Scientist

**Astrophysical Fluid Lead**
- 0-3 yrs: Astrophysics Research Associate
- 3-6 yrs: Astrophysicist / Research Scientist
- 6-9 yrs: Senior Research Scientist
- 9-12 yrs: Astrophysical Fluid Lead / Principal Scientist
- 12+ yrs: Director of Astrophysics / Observatory Lead
- Pivots: Computational Physicist * Space Systems Engineer * Climate Modeler * Data Scientist

**Neuro-Synaptic Architect**
- 0-3 yrs: Neuroscience Research Associate
- 3-6 yrs: Computational Neuroscientist
- 6-9 yrs: Senior Neuroscience Researcher
- 9-12 yrs: Neuro-Synaptic Architect / Principal Researcher
- 12+ yrs: Head of Neuromorphic Research / Chief Neuroscientist
- Pivots: Brain-Computer Interface Engineer * AI Architect * Cognitive Systems Designer * Clinical Neurotechnology Lead

**Climate System Modeler**
- 0-2 yrs: Junior Climate Modeler / Research Associate
- 2-5 yrs: Climate System Modeler
- 5-8 yrs: Senior Climate Scientist
- 8-12 yrs: Lead Climate Modeler / Research Director
- 12+ yrs: Head of Climate Science / Chief Environmental Scientist
- Pivots: Atmospheric Scientist * Environmental Policy Advisor * Data Scientist * Sustainability Consultant

**Solid State Physicist**
- 0-2 yrs: Junior Solid State Physicist / Research Associate
- 2-5 yrs: Solid State Physicist
- 5-8 yrs: Senior Research Physicist
- 8-12 yrs: Principal Physicist / Materials Science Lead
- 12+ yrs: Head of Materials Research / Chief Physicist
- Pivots: Semiconductor Engineer * Quantum Computing Researcher * Nanotechnology Specialist * R&D Director

**Scientific Director**
- 0-4 yrs: Research Scientist / Postdoctoral Researcher
- 4-7 yrs: Senior Research Scientist
- 7-10 yrs: Principal Scientist / Research Group Lead
- 10-13 yrs: Associate Scientific Director
- 13+ yrs: Scientific Director
- Pivots: Chief Scientific Officer * VP of R&D * Academic Dean * Biotech Founder