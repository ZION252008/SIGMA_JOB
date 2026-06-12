/** Dark-mode galaxy palette */
export const galaxy = {
  bg: 'bg-[#07070F]',
  card: 'bg-[#0D0D1C] border-[#1E1E45] galaxy-card-dark',
  cardPlain: 'bg-[#0D0D1C] border-[#1E1E45]',
  section: 'bg-[#09091A] border-[#16163A]',
  inset: 'bg-[#04040E]',
  panel: 'bg-[#0D0D1C]',
  text: 'text-[#E8E8F5]',
  sub: 'text-[#8B8BA8]',
  muted: 'text-[#6B6B88]',
  faint: 'text-[#55556A]',
  input: 'bg-[#07070F] border-[#1E1E45] text-[#E8E8F5]',
  border: 'border-[#1E1E45]',
  borderSubtle: 'border-[#16163A]',
} as const;

/** Light-mode chart-paper palette */
export const galaxyLight = {
  bg: 'bg-[#ECECF8]',
  card: 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light',
  cardPlain: 'bg-[#F8F8FD] border-[#D0D0E8]',
  section: 'bg-[#F0F0FA] border-[#D0D0E8]',
  inset: 'bg-[#E8E8F5]',
  panel: 'bg-[#E8E8F5]',
  text: 'text-[#0D0D2E]',
  sub: 'text-[#4A4A6A]',
  muted: 'text-[#7070A0]',
  input: 'bg-[#F8F8FD] border-[#D0D0E8] text-[#0D0D2E]',
  border: 'border-[#D0D0E8]',
  borderSubtle: 'border-[#CCCCE4]',
} as const;

export function pageTheme(dark: boolean) {
  const g = dark ? galaxy : galaxyLight;
  return {
    bg: g.bg,
    card: g.card,
    text: g.text,
    sub: g.sub,
    muted: g.muted,
    input: g.input,
    sectionBg: g.section,
    banner: g.card,
    inset: g.inset,
    panel: g.panel,
    galaxyCard: dark ? 'galaxy-card-dark' : 'galaxy-card-light',
  };
}
