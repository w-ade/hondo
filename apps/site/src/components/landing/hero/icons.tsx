/**
 * Inline SVG icons for the workspace shell, traced off the Figma export.
 * 1.4px strokes on a 20px box, matching the product's icon weight.
 * Kept in one file so the shell has no icon-library dependency.
 */

type P = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const IconHome = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3.5 8.5 10 3.5l6.5 5V16a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z" />
  </svg>
);

export const IconStar = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m10 3.5 2 4.2 4.5.6-3.3 3.2.8 4.5L10 13.9 6 16l.8-4.5L3.5 8.3l4.5-.6z" />
  </svg>
);

export const IconDots = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="5" cy="10" r="1.05" fill="currentColor" stroke="none" />
    <circle cx="10" cy="10" r="1.05" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="1.05" fill="currentColor" stroke="none" />
  </svg>
);

export const IconDotsV = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="10" cy="5" r="1.05" fill="currentColor" stroke="none" />
    <circle cx="10" cy="10" r="1.05" fill="currentColor" stroke="none" />
    <circle cx="10" cy="15" r="1.05" fill="currentColor" stroke="none" />
  </svg>
);

export const IconBookmark = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5.5 3.5h9v13l-4.5-3.2-4.5 3.2z" />
  </svg>
);

export const IconLayers = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m10 3 7 3.6-7 3.6-7-3.6z" />
    <path d="m3 10.4 7 3.6 7-3.6" />
  </svg>
);

export const IconClose = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m5.5 5.5 9 9m0-9-9 9" />
  </svg>
);

export const IconPlus = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M10 4.5v11M4.5 10h11" />
  </svg>
);

export const IconChevron = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m7.5 5 5 5-5 5" />
  </svg>
);

export const IconChevronUp = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m5 12.5 5-5 5 5" />
  </svg>
);

export const IconMessage = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M16.5 12a1.5 1.5 0 0 1-1.5 1.5H7l-3.5 3v-3H5A1.5 1.5 0 0 1 3.5 12V5A1.5 1.5 0 0 1 5 3.5h10A1.5 1.5 0 0 1 16.5 5z" />
  </svg>
);

export const IconThumbUp = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M7 17V9l3.5-6a2 2 0 0 1 2 2v3h3.2a1.6 1.6 0 0 1 1.55 2l-1.3 5.2A1.6 1.6 0 0 1 14.4 17z" />
    <path d="M7 9H4.5A1.5 1.5 0 0 0 3 10.5v5A1.5 1.5 0 0 0 4.5 17H7" />
  </svg>
);

export const IconThumbDown = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className} style={{ transform: "rotate(180deg)" }}>
    <path d="M7 17V9l3.5-6a2 2 0 0 1 2 2v3h3.2a1.6 1.6 0 0 1 1.55 2l-1.3 5.2A1.6 1.6 0 0 1 14.4 17z" />
    <path d="M7 9H4.5A1.5 1.5 0 0 0 3 10.5v5A1.5 1.5 0 0 0 4.5 17H7" />
  </svg>
);

export const IconCopy = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="7" y="7" width="9.5" height="9.5" rx="1.6" />
    <path d="M13 7V5a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 4 5v6a1.5 1.5 0 0 0 1.5 1.5h1.5" />
  </svg>
);

export const IconRefresh = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M16.5 8.5a6.5 6.5 0 0 0-11.2-3M3.5 11.5a6.5 6.5 0 0 0 11.2 3" />
    <path d="M16.5 4v4.5H12M3.5 16v-4.5H8" />
  </svg>
);

export const IconTrash = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 6h12M8 6V4.5A1 1 0 0 1 9 3.5h2a1 1 0 0 1 1 1V6M6 6l.7 9.6a1 1 0 0 0 1 .9h4.6a1 1 0 0 0 1-.9L14 6" />
  </svg>
);

export const IconArrowUp = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className} strokeWidth={1.8}>
    <path d="M10 15.5v-11M5.5 9 10 4.5 14.5 9" />
  </svg>
);

/** Editor toolbar glyphs. Text-shaped ones are set, not stroked. */
export const IconBold = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className} strokeWidth={1.7}>
    <path d="M6.5 10h4a3.2 3.2 0 0 0 0-6.5h-4zM6.5 10h4.6a3.2 3.2 0 0 1 0 6.5H6.5z" />
  </svg>
);

export const IconItalic = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12.5 3.5h-4M11.5 16.5h-4M11 3.5 9 16.5" />
  </svg>
);

export const IconStrike = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 10h12M6 6.2a3 3 0 0 1 3-2.7h2a3 3 0 0 1 2.9 2.2M14 13a3 3 0 0 1-3 3.5H9A3 3 0 0 1 6 14" />
  </svg>
);

export const IconUnderline = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 3.5v6a4 4 0 0 0 8 0v-6M5 16.5h10" />
  </svg>
);

export const IconCode = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m7 6.5-3.5 3.5L7 13.5M13 6.5l3.5 3.5-3.5 3.5" />
  </svg>
);

export const IconLink = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M8.5 11.5a2.8 2.8 0 0 0 4 0l2.5-2.5a2.8 2.8 0 0 0-4-4l-1 1" />
    <path d="M11.5 8.5a2.8 2.8 0 0 0-4 0L5 11a2.8 2.8 0 0 0 4 4l1-1" />
  </svg>
);

export const IconImage = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3.5" y="4.5" width="13" height="11" rx="1.6" />
    <circle cx="7.5" cy="8.5" r="1.1" />
    <path d="m4 13.5 3.5-3 3 2.5 2.5-2 3 2.5" />
  </svg>
);

export const IconListBullet = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M8 5.5h8.5M8 10h8.5M8 14.5h8.5" />
    <circle cx="4.5" cy="5.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="4.5" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="4.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconListNumber = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M8.5 5.5h8M8.5 10h8M8.5 14.5h8M4 4.2l1-.7v3.4M3.5 9.2a1 1 0 0 1 2 .3c0 .8-2 1.4-2 2.2h2M3.5 13.6a1 1 0 1 1 1 1.4 1 1 0 1 1-1 1.4" />
  </svg>
);

export const IconIndent = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M8.5 5.5h8M8.5 14.5h8M8.5 10h8M3.5 7.5 6 10l-2.5 2.5" />
  </svg>
);

export const IconOutdent = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M8.5 5.5h8M8.5 14.5h8M8.5 10h8M6 7.5 3.5 10 6 12.5" />
  </svg>
);

export const IconUndo = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 8.5h7.5a4 4 0 0 1 0 8H9" />
    <path d="M6.5 5.5 3.5 8.5l3 3" />
  </svg>
);

export const IconRedo = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M16 8.5H8.5a4 4 0 0 0 0 8H11" />
    <path d="m13.5 5.5 3 3-3 3" />
  </svg>
);

export const IconInsert = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3.5" y="3.5" width="13" height="13" rx="2" strokeDasharray="3 2.4" />
    <path d="M10 7.5v5M7.5 10h5" />
  </svg>
);
