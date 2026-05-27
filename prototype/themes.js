// themes.js — Theme tokens for the Firebase To-Do prototype
// Each theme defines a complete token set. Some support light/dark variants;
// some are mode-locked (paper is light-only, synth is dark-only).
//
// Token contract:
//   bg          window background
//   chrome      titlebar / window chrome bg
//   surface     primary card / sidebar surface
//   surface2    secondary surface (hover / nested)
//   surfaceAlt  contrast surface (input wells, etc)
//   border      divider lines
//   borderStrong  stronger borders (active controls)
//   text        primary text
//   textMuted   secondary text (metadata)
//   textDim     tertiary text (placeholders)
//   accent      brand / primary action color
//   accentText  text on top of accent
//   selBg       selected row bg
//   selText     selected row text
//   shadow      ambient drop shadow
//   sansFont    body font stack
//   monoFont    monospace stack
//
// Priority + heat ramps live alongside themes so they tune per mode.

const THEMES = {
  'dev-blue': {
    name: 'Dev / IDE Blue',
    supports: ['light', 'dark'],
    light: {
      bg: '#fafbfc', chrome: '#f1f3f5',
      surface: '#ffffff', surface2: '#f4f6f8', surfaceAlt: '#eef1f5',
      border: '#d4d8df', borderStrong: '#a8b0bb',
      text: '#1a1f2e', textMuted: '#5b6577', textDim: '#8a93a3',
      accent: '#2563eb', accentText: '#ffffff',
      selBg: '#dbe7ff', selText: '#0d3a99',
      shadow: '0 1px 3px rgba(15,23,42,.06), 0 4px 12px rgba(15,23,42,.04)',
    },
    dark: {
      bg: '#0f1216', chrome: '#161a21',
      surface: '#13171e', surface2: '#1a1f28', surfaceAlt: '#0b0e12',
      border: '#252b35', borderStrong: '#3a4250',
      text: '#e8ecf3', textMuted: '#8a93a3', textDim: '#5a6473',
      accent: '#5b9bff', accentText: '#0a0d12',
      selBg: '#1b2c4a', selText: '#a8c6ff',
      shadow: '0 1px 0 rgba(255,255,255,.03) inset, 0 8px 24px rgba(0,0,0,.4)',
    },
  },
  'clean': {
    name: 'Clean Minimal',
    supports: ['light', 'dark'],
    light: {
      bg: '#fafafa', chrome: '#f3f3f3',
      surface: '#ffffff', surface2: '#f5f5f5', surfaceAlt: '#ededed',
      border: '#e5e5e5', borderStrong: '#a3a3a3',
      text: '#0a0a0a', textMuted: '#737373', textDim: '#a3a3a3',
      accent: '#0a0a0a', accentText: '#fafafa',
      selBg: '#eaeaea', selText: '#0a0a0a',
      shadow: '0 1px 2px rgba(0,0,0,.04), 0 4px 10px rgba(0,0,0,.03)',
    },
    dark: {
      bg: '#0a0a0a', chrome: '#141414',
      surface: '#171717', surface2: '#1f1f1f', surfaceAlt: '#0f0f0f',
      border: '#262626', borderStrong: '#525252',
      text: '#fafafa', textMuted: '#a3a3a3', textDim: '#737373',
      accent: '#fafafa', accentText: '#0a0a0a',
      selBg: '#262626', selText: '#fafafa',
      shadow: '0 0 0 1px rgba(255,255,255,.02) inset, 0 8px 24px rgba(0,0,0,.5)',
    },
  },
  'paper': {
    name: 'Warm Paper',
    supports: ['light'],
    light: {
      bg: '#f5f1ea', chrome: '#ebe5d8',
      surface: '#fbf8f2', surface2: '#f0ebde', surfaceAlt: '#e8e1d0',
      border: '#dcd4c2', borderStrong: '#a89e87',
      text: '#1c1a18', textMuted: '#6b6660', textDim: '#9a9388',
      accent: '#c8632d', accentText: '#fbf8f2',
      selBg: '#ead7c2', selText: '#7a3b18',
      shadow: '0 1px 0 rgba(255,255,255,.6) inset, 0 6px 16px rgba(96,70,30,.08)',
    },
  },
  'mono': {
    name: 'Mono Dark',
    supports: ['dark'],
    dark: {
      bg: '#0a0a0a', chrome: '#000000',
      surface: '#141414', surface2: '#1c1c1c', surfaceAlt: '#0f0f0f',
      border: '#2a2a2a', borderStrong: '#4a4a4a',
      text: '#ededed', textMuted: '#8a8a8a', textDim: '#5a5a5a',
      accent: '#ededed', accentText: '#0a0a0a',
      selBg: '#222222', selText: '#ffffff',
      shadow: '0 0 0 1px rgba(255,255,255,.04) inset, 0 8px 24px rgba(0,0,0,.6)',
    },
  },
  'synth': {
    name: 'Purple Synth',
    supports: ['dark'],
    dark: {
      bg: '#1a1625', chrome: '#221d33',
      surface: '#221d33', surface2: '#2c2546', surfaceAlt: '#1a1428',
      border: '#3a3158', borderStrong: '#5b4d8a',
      text: '#f0e9ff', textMuted: '#a89dc7', textDim: '#7a6f9d',
      accent: '#a78bfa', accentText: '#1a1625',
      selBg: '#3b2f5e', selText: '#e0d4ff',
      shadow: '0 0 0 1px rgba(167,139,250,.08) inset, 0 8px 32px rgba(20,8,40,.6)',
    },
  },
};

// Priority colors — semantic, themed per mode so contrast works.
const PRIORITY = {
  light: {
    P1: { fg: '#dc2626', bg: '#fee2e2', label: 'P1' },
    P2: { fg: '#ea580c', bg: '#ffedd5', label: 'P2' },
    P3: { fg: '#2563eb', bg: '#dbeafe', label: 'P3' },
    P4: { fg: '#737373', bg: '#f5f5f5', label: 'P4' },
  },
  dark: {
    P1: { fg: '#f87171', bg: 'rgba(248,113,113,.15)', label: 'P1' },
    P2: { fg: '#fb923c', bg: 'rgba(251,146,60,.15)', label: 'P2' },
    P3: { fg: '#60a5fa', bg: 'rgba(96,165,250,.15)', label: 'P3' },
    P4: { fg: '#a3a3a3', bg: 'rgba(163,163,163,.12)', label: 'P4' },
  },
};

// Heat ramp — colors the left edge stripe + countdown pill.
// Stops chosen so red→orange→amber→neutral feels temperature-like.
const HEAT = {
  light: {
    overdue:  { fg: '#b91c1c', bg: '#fecaca', stripe: '#dc2626' },
    today:    { fg: '#c2410c', bg: '#fed7aa', stripe: '#f97316' },
    soon:     { fg: '#a16207', bg: '#fef3c7', stripe: '#eab308' },
    upcoming: { fg: '#4d7c0f', bg: '#ecfccb', stripe: '#84cc16' },
    far:      { fg: '#525252', bg: 'transparent', stripe: '#d4d4d4' },
    none:     { fg: '#a3a3a3', bg: 'transparent', stripe: 'transparent' },
  },
  dark: {
    overdue:  { fg: '#fca5a5', bg: 'rgba(239,68,68,.18)',  stripe: '#ef4444' },
    today:    { fg: '#fdba74', bg: 'rgba(249,115,22,.18)', stripe: '#f97316' },
    soon:     { fg: '#fcd34d', bg: 'rgba(234,179,8,.15)',  stripe: '#eab308' },
    upcoming: { fg: '#bef264', bg: 'rgba(132,204,22,.13)', stripe: '#84cc16' },
    far:      { fg: '#a3a3a3', bg: 'transparent',           stripe: '#404040' },
    none:     { fg: '#737373', bg: 'transparent',           stripe: 'transparent' },
  },
};

// Compute mode-adjusted tokens. Returns { tokens, mode, priority, heat }.
function resolveTheme(themeKey, prefersDark) {
  const t = THEMES[themeKey] || THEMES['dev-blue'];
  let mode;
  if (t.supports.length === 1) mode = t.supports[0];
  else mode = prefersDark ? 'dark' : 'light';
  const tokens = t[mode];
  return {
    tokens,
    mode,
    name: t.name,
    supports: t.supports,
    priority: PRIORITY[mode],
    heat: HEAT[mode],
  };
}

// Heat bucket from due date (ms epoch). nowMs is overrideable for testing.
function heatBucket(dueMs, nowMs = Date.now()) {
  if (!dueMs) return 'none';
  const dayMs = 86400000;
  // Compare on calendar-day boundaries so "today" is the literal date.
  const today = new Date(nowMs); today.setHours(0,0,0,0);
  const due = new Date(dueMs); due.setHours(0,0,0,0);
  const days = Math.round((due - today) / dayMs);
  if (days < 0) return 'overdue';
  if (days === 0) return 'today';
  if (days <= 2) return 'soon';
  if (days <= 7) return 'upcoming';
  return 'far';
}

Object.assign(window, { THEMES, PRIORITY, HEAT, resolveTheme, heatBucket });
