// icons.jsx — Small inline SVG icon set. All 16x16, currentColor stroke.

const Icon = ({ name, size = 16, style = {}, ...rest }) => {
  const paths = ICONS[name];
  if (!paths) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" style={{ flexShrink: 0, ...style }} {...rest}>
      {paths}
    </svg>
  );
};

const ICONS = {
  inbox: (<>
    <path d="M2 9.5l1.5-5A1 1 0 0 1 4.5 4h7a1 1 0 0 1 1 .5l1.5 5" />
    <path d="M2 9.5V12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9.5h-3.5l-1 1.5h-3l-1-1.5H2z" fill="currentColor" fillOpacity="0.15" />
  </>),
  phone: (<>
    <rect x="4.5" y="2" width="7" height="12" rx="1.5" />
    <path d="M7 12.5h2" />
  </>),
  globe: (<>
    <circle cx="8" cy="8" r="5.5" />
    <path d="M2.5 8h11M8 2.5c1.5 1.8 2.3 3.7 2.3 5.5 0 1.8-.8 3.7-2.3 5.5-1.5-1.8-2.3-3.7-2.3-5.5 0-1.8.8-3.7 2.3-5.5z" />
  </>),
  leaf: (<>
    <path d="M3 13c0-5 3-9 10-10 0 7-4 10-9 10a1 1 0 0 1-1-1z" />
    <path d="M3 13c2-3 5-5 8-5.5" />
  </>),
  hash: (<>
    <path d="M3 6h10M3 10h10M6.5 3l-1.5 10M11 3l-1.5 10" />
  </>),
  plus: <path d="M8 3v10M3 8h10" />,
  minus: <path d="M3 8h10" />,
  search: (<>
    <circle cx="7" cy="7" r="4" />
    <path d="M10 10l3 3" />
  </>),
  check: <path d="M3.5 8.5l3 3 6-7" />,
  chevronRight: <path d="M6 3l5 5-5 5" />,
  chevronDown: <path d="M3 6l5 5 5-5" />,
  grip: (<>
    <circle cx="6" cy="4" r=".8" fill="currentColor" />
    <circle cx="10" cy="4" r=".8" fill="currentColor" />
    <circle cx="6" cy="8" r=".8" fill="currentColor" />
    <circle cx="10" cy="8" r=".8" fill="currentColor" />
    <circle cx="6" cy="12" r=".8" fill="currentColor" />
    <circle cx="10" cy="12" r=".8" fill="currentColor" />
  </>),
  more: (<>
    <circle cx="4" cy="8" r=".8" fill="currentColor" />
    <circle cx="8" cy="8" r=".8" fill="currentColor" />
    <circle cx="12" cy="8" r=".8" fill="currentColor" />
  </>),
  calendar: (<>
    <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
    <path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" />
  </>),
  flag: (<>
    <path d="M4 2v12" />
    <path d="M4 3h7l-1.5 2.5L11 8H4" />
  </>),
  clock: (<>
    <circle cx="8" cy="8" r="5.5" />
    <path d="M8 5v3l2 1.5" />
  </>),
  flame: (<>
    <path d="M8 14c2.5 0 4.5-2 4.5-4.5 0-3-2.5-4-2-7-1.5 1-3 2.5-3.5 4.5C7 6 5.5 5 5 4c-1 1.5-1.5 3-1.5 5C3.5 11.5 5.5 14 8 14z" />
  </>),
  sun: (<>
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1.5v1.5M8 13v1.5M14.5 8H13M3 8H1.5M12.7 3.3l-1 1M4.3 11.7l-1 1M12.7 12.7l-1-1M4.3 4.3l-1-1" />
  </>),
  moon: <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3a5 5 0 1 0 6.5 6.5z" />,
  trash: (<>
    <path d="M3 4.5h10M6 4.5V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M5 4.5l.5 8a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1l.5-8" />
  </>),
  edit: (<>
    <path d="M3 13l3-1 7-7-2-2-7 7-1 3z" />
  </>),
  filter: <path d="M2.5 4h11l-4 5v3.5l-3 1V9l-4-5z" />,
  star: <path d="M8 2l1.8 3.7L13.8 6.3l-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 6.3l4-.6L8 2z" />,
  cloud: (<>
    <path d="M11.5 11.5a3 3 0 0 0 0-6 4 4 0 0 0-7.7 1 2.5 2.5 0 0 0-.3 5h8z" />
  </>),
  cloudCheck: (<>
    <path d="M11.5 11.5a3 3 0 0 0 0-6 4 4 0 0 0-7.7 1 2.5 2.5 0 0 0-.3 5h8z" />
    <path d="M5.5 8.5l1.5 1.5L10 7" />
  </>),
  link: (<>
    <path d="M6.5 9.5l3-3" />
    <path d="M9 4l1-1a2.5 2.5 0 0 1 3.5 3.5l-1 1" />
    <path d="M7 12l-1 1a2.5 2.5 0 0 1-3.5-3.5l1-1" />
  </>),
};

Object.assign(window, { Icon, ICONS });
