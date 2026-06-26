"use client";

import { forwardRef } from "react";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

export const Ic = forwardRef<SVGSVGElement, IconProps>(({ name, size = 16, color = "currentColor", strokeWidth = 1.5, className }, ref) => {
  const s = {
    fill: "none" as const,
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const v = "0 0 24 24";
  const w = size, h = size;

  const paths: Record<string, React.ReactNode> = {
    search: <><circle cx="11" cy="11" r="7" {...s} /><path d="M16 16 L21 21" {...s} /></>,
    "arrow-r": <><path d="M5 12 H19 M13 6 L19 12 L13 18" {...s} /></>,
    "arrow-l": <><path d="M19 12 H5 M11 6 L5 12 L11 18" {...s} /></>,
    "arrow-up-right": <><path d="M7 17 L17 7 M9 7 H17 V15" {...s} /></>,
    check: <><path d="M5 12 L10 17 L19 7" {...s} /></>,
    "check-circle": <><circle cx="12" cy="12" r="9" {...s} /><path d="M8 12 L11 15 L16 9" {...s} /></>,
    plus: <><path d="M12 5 V19 M5 12 H19" {...s} /></>,
    x: <><path d="M6 6 L18 18 M18 6 L6 18" {...s} /></>,
    pin: <><path d="M12 21 C 12 21 5 14 5 9 a7 7 0 0 1 14 0 c0 5 -7 12 -7 12 z" {...s} /><circle cx="12" cy="9" r="2.5" {...s} /></>,
    star: <><path d="M12 3 L14.5 9 L21 9.7 L16 14 L17.3 20.5 L12 17.3 L6.7 20.5 L8 14 L3 9.7 L9.5 9 Z" {...s} /></>,
    "star-fill": <path d="M12 3 L14.5 9 L21 9.7 L16 14 L17.3 20.5 L12 17.3 L6.7 20.5 L8 14 L3 9.7 L9.5 9 Z" fill={color} stroke={color} strokeWidth="0.5" strokeLinejoin="round" />,
    sparkle: <><path d="M12 3 L13.5 10 L21 12 L13.5 14 L12 21 L10.5 14 L3 12 L10.5 10 Z" {...s} /></>,
    "sparkle-fill": <path d="M12 3 L13.5 10 L21 12 L13.5 14 L12 21 L10.5 14 L3 12 L10.5 10 Z" fill={color} stroke={color} strokeWidth="0.5" strokeLinejoin="round" />,
    cog: <><circle cx="12" cy="12" r="3" {...s} /><path d="M12 2 V4 M12 20 V22 M22 12 H20 M4 12 H2 M19 5 L17.5 6.5 M6.5 17.5 L5 19 M19 19 L17.5 17.5 M6.5 6.5 L5 5" {...s} /></>,
    globe: <><circle cx="12" cy="12" r="9" {...s} /><path d="M3 12 H21 M12 3 C 8 7 8 17 12 21 M12 3 C 16 7 16 17 12 21" {...s} /></>,
    menu: <><path d="M4 6 H20 M4 12 H20 M4 18 H20" {...s} /></>,
    phone: <><path d="M5 4 H9 L11 9 L8.5 11 C 10 14 11 15 14 16.5 L16 14 L21 16 V20 C 21 20.5 20.5 21 20 21 C 11 21 3 13 3 5 C 3 4.5 3.5 4 4 4 Z" {...s} /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="1" {...s} /><path d="M3 7 L12 13 L21 7" {...s} /></>,
    edit: <><path d="M16 3 L21 8 L9 20 L4 21 L5 16 Z" {...s} /></>,
    eye: <><path d="M2 12 C 5 6 19 6 22 12 C 19 18 5 18 2 12 Z" {...s} /><circle cx="12" cy="12" r="3" {...s} /></>,
    trash: <><path d="M4 7 H20 M9 7 V4 H15 V7 M6 7 L7 20 H17 L18 7" {...s} /></>,
    clock: <><circle cx="12" cy="12" r="9" {...s} /><path d="M12 7 V12 L15 14" {...s} /></>,
    home: <><path d="M4 11 L12 4 L20 11 V20 H14 V14 H10 V20 H4 Z" {...s} /></>,
    sites: <><rect x="3" y="4" width="18" height="16" rx="1" {...s} /><path d="M3 8 H21 M7 6 H7.01" {...s} /></>,
    bolt: <><path d="M13 2 L4 14 H11 L10 22 L20 10 H13 Z" {...s} /></>,
    logout: <><path d="M9 21 H4 V3 H9 M16 17 L21 12 L16 7 M21 12 H9" {...s} /></>,
    user: <><circle cx="12" cy="8" r="4" {...s} /><path d="M4 21 C 4 16 8 14 12 14 C 16 14 20 16 20 21" {...s} /></>,
    users: <><circle cx="9" cy="8" r="3.5" {...s} /><path d="M2 21 C2 16.5 5.5 14 9 14 C12.5 14 16 16.5 16 21" {...s} /><circle cx="17" cy="8" r="3" {...s} /><path d="M17 14 C19 14 22 15.5 22 19" {...s} /></>,
    card: <><rect x="3" y="6" width="18" height="13" rx="1" {...s} /><path d="M3 10 H21" {...s} /></>,
    lock: <><rect x="5" y="11" width="14" height="10" rx="1" {...s} /><path d="M8 11 V8 a4 4 0 0 1 8 0 V11" {...s} /></>,
    copy: <><rect x="8" y="8" width="13" height="13" rx="1" {...s} /><path d="M16 8 V4 H3 V17 H8" {...s} /></>,
    download: <><path d="M12 4 V16 M6 11 L12 17 L18 11 M4 20 H20" {...s} /></>,
    refresh: <><path d="M4 9 a8 8 0 0 1 14 -3 L21 9 M21 4 V9 H16 M20 15 a8 8 0 0 1 -14 3 L3 15 M3 20 V15 H8" {...s} /></>,
    paint: <><path d="M5 21 L9 17 M9 17 a3 3 0 1 1 3 -5 L20 4 L21 6 L13 14 a3 3 0 0 1 -4 3 Z" {...s} /></>,
    layout: <><rect x="3" y="3" width="18" height="18" rx="1" {...s} /><path d="M3 9 H21 M9 9 V21" {...s} /></>,
    send: <><path d="M22 2 L11 13 M22 2 L15 22 L11 13 L2 9 Z" {...s} /></>,
    circle: <><circle cx="12" cy="12" r="9" {...s} /></>,
    "circle-fill": <circle cx="12" cy="12" r="9" fill={color} />,
    pause: <><rect x="6" y="5" width="4" height="14" {...s} /><rect x="14" y="5" width="4" height="14" {...s} /></>,
    play: <><path d="M6 4 L20 12 L6 20 Z" {...s} /></>,
    tag: <><path d="M3 12 V3 H12 L21 12 L12 21 Z" {...s} /><circle cx="7" cy="7" r="1.5" {...s} /></>,
    shield: <><path d="M12 2 L20 5 V12 C 20 17 16 21 12 22 C 8 21 4 17 4 12 V5 Z" {...s} /></>,
    zap: <><path d="M13 2 L4 14 H11 L10 22 L20 10 H13 Z" {...s} /></>,
    history: <><path d="M3 12 a9 9 0 1 0 3 -7 L3 8 V3" {...s} /><path d="M12 7 V12 L15 14" {...s} /></>,
    external: <><path d="M14 4 H20 V10 M20 4 L11 13 M18 14 V19 H5 V6 H10" {...s} /></>,
    info: <><circle cx="12" cy="12" r="9" {...s} /><path d="M12 11 V17 M12 7.5 V8" {...s} /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="1" {...s} /><circle cx="9" cy="10" r="1.5" {...s} /><path d="M3 17 L9 12 L13 16 L17 12 L21 16" {...s} /></>,
    bell: <><path d="M18 10 a6 6 0 0 0 -12 0 c0 5 -2 7 -2 7 H20 s-2-2-2-7 M9 17 a3 3 0 0 0 6 0" {...s} /></>,
    inbox: <><path d="M4 4 H20 L21 16 H3 Z M3 16 H21 V20 H3 Z M9 18 H15" {...s} /></>,
    book: <><path d="M4 4 V21 H20 V4 H4 Z M4 4 C4 4 8 2 12 4 C16 2 20 4 20 4" {...s} /><path d="M12 4 V21" {...s} /></>,
    close: <><path d="M6 6 L18 18 M18 6 L6 18" {...s} /></>,
    arrow_up: <><path d="M12 19 V5 M7 10 L12 5 L17 10" {...s} /></>,
    arrow_down: <><path d="M12 5 V19 M7 14 L12 19 L17 14" {...s} /></>,
    filter: <><path d="M3 4 H21 M5 8 H19 M7 12 H17 M9 16 H15" {...s} /></>,
    settings: <><circle cx="12" cy="12" r="3" {...s} /><path d="M19.4 15 a4.5 4.5 0 0 1 -4.9 4.7 L14 17.4 M14.6 4.6 a4.5 4.5 0 0 1 0 6.3 L10.4 12 M17 21.3 a4.5 4.5 0 0 1 -4.7 -4.9 L12 10.6 M4.6 10.4 a4.5 4.5 0 0 1 0 -6.3 L6.6 5 M6.3 2.7 a4.5 4.5 0 0 1 4.9 4.9 L9 8.6 M9 15.4 a4.5 4.5 0 0 1 4.9 -4.9 L15 13.4" {...s} /></>,
    rocket: <><path d="M12 2 L15 12 L21 14 L12 22 L3 14 L9 12 Z" {...s} /><path d="M9 12 L15 12" {...s} /><path d="M12 14 L12 20" {...s} /></>,
    target: <><circle cx="12" cy="12" r="10" {...s} /><circle cx="12" cy="12" r="6" {...s} /><circle cx="12" cy="12" r="2" {...s} /></>,
    "alert-triangle": <><path d="M10.29 3.86 L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...s} /><path d="M12 9 v4 M12 17 h.01" {...s} /></>,
    "clipboard-check": <><rect x="3" y="6" width="18" height="13" rx="1" {...s} /><path d="M3 10 H21" {...s} /><path d="M8 14 L11 17 L16 10" {...s} /></>,
    chevron_right: <><path d="M9 18 L15 12 L9 6" {...s} /></>,
    chevron_left: <><path d="M15 18 L9 12 L15 6" {...s} /></>,
    chevron_down: <><path d="M6 9 L12 15 L18 9" {...s} /></>,
    chevron_up: <><path d="M18 15 L12 9 L6 15" {...s} /></>,
    more_horizontal: <><circle cx="12" cy="12" r="1" {...s} /><circle cx="19" cy="12" r="1" {...s} /><circle cx="5" cy="12" r="1" {...s} /></>,
    more_vertical: <><circle cx="12" cy="12" r="1" {...s} /><circle cx="12" cy="19" r="1" {...s} /><circle cx="12" cy="5" r="1" {...s} /></>,
    upload: <><path d="M21 15 v4 a2 2 0 0 1 -2 2 H5 a2 2 0 0 1 -2 -2 v-4 M17 8 l-5 -5 -5 5 M12 3 v12" {...s} /></>,
    file: <><path d="M14 2 H6 a2 2 0 0 0 -2 2 v16 a2 2 0 0 0 2 2 h12 a2 2 0 0 0 2 -2 V8" {...s} /><path d="M14 2 v6 h6" {...s} /></>,
    folder: <><path d="M22 19 a2 2 0 0 1 -2 2 H4 a2 2 0 0 1 -2 -2 V5 a2 2 0 0 1 2 -2 h5 l2 3 h9 a2 2 0 0 1 2 2 z" {...s} /></>,
    database: <><ellipse cx="12" cy="5" rx="9" ry="3" {...s} /><path d="M3 5 V19 A9 3 0 0 0 21 19 V5" {...s} /><path d="M21 12 H3" {...s} /></>,
    cpu: <><rect x="4" y="4" width="16" height="16" rx="2" {...s} /><path d="M4 8 h16 M4 12 h16 M4 16 h16" {...s} /><path d="M9 4 V2 M15 4 V2 M9 22 V20 M15 22 V20 M4 9 V4 M4 15 V20 M20 9 V4 M20 15 V20" {...s} /></>,
    code: <><path d="M16 18 l-4 -4 4 -4 M8 6 l4 4 -4 4" {...s} /></>,
    terminal: <><path d="M4 17 l5 -5 -5 -5 M12 19 h8" {...s} /></>,
    chart: <><path d="M3 3 v18 h18 M7 14 l4 -4 l4 4 l5 -6" {...s} /></>,
    "bar-chart": <><path d="M3 3 v18 h18 M7 16 v-6 M12 16 v-9 M17 16 v-3" {...s} /></>,
    "pie-chart": <><path d="M21 12 a9 9 0 1 1 -9 -9 v9 h9 z" {...s} /><path d="M12 3 a9 9 0 0 0 -9 9 h9 v-9 z" {...s} /></>,
    "trending-up": <><path d="M3 17 l6 -6 l4 4 l8 -8" {...s} /><path d="M14 7 h7 v7" {...s} /></>,
    "trending-down": <><path d="M3 7 l6 6 l4 -4 l8 8" {...s} /><path d="M14 17 h7 v-7" {...s} /></>,
    dollar: <><path d="M12 3 v18 M8 7 h8 M8 17 h8" {...s} /><path d="M12 7 a4 4 0 0 0 -4 4 a4 4 0 0 0 4 4 a4 4 0 0 0 4 -4" {...s} /></>,
    credit-card: <><rect x="3" y="5" width="18" height="14" rx="2" {...s} /><path d="M3 10 h18" {...s} /></>,
    crown: <><path d="M12 6 l4 4 l6 -4 v12 h-20 v-12 l6 4 z" {...s} /></>,
    gift: <><path d="M12 3 v18 M3 8 h18 M7 8 v13 M17 8 v13" {...s} /><path d="M12 8 a3 3 0 0 0 3 -3 a3 3 0 0 0 -3 3 z" {...s} /></>,
    message: <><path d="M21 15 a2 2 0 0 1 -2 2 H7 l-4 4 V5 a2 2 0 0 1 2 -2 h14 a2 2 0 0 1 2 2 z" {...s} /></>,
    "message-circle": <><path d="M21 12 a9 9 0 1 1 -9 -9 a9 9 0 0 1 9 9 z" {...s} /><path d="M15 15 l3 3" {...s} /></>,
    help: <><circle cx="12" cy="12" r="9" {...s} /><path d="M9.09 9 a3 3 0 0 1 5.83 1 c0 2 -3 3 -3 3 M12 17 h.01" {...s} /></>,
    "life-buoy": <><circle cx="12" cy="12" r="9" {...s} /><path d="M12 3 v9 M12 21 v-9 M3 12 h9 M21 12 h-9" {...s} /><circle cx="12" cy="12" r="3" {...s} /></>,
    "log-out": <><path d="M9 21 H4 V3 H9 M16 17 L21 12 L16 7 M21 12 H9" {...s} /></>,
    search: <><circle cx="11" cy="11" r="7" {...s} /><path d="M16 16 L21 21" {...s} /></>,
  };

  return (
    <svg
      ref={ref}
      width={w}
      height={h}
      viewBox={v}
      className={className}
      aria-hidden="true"
    >
      {paths[name] || <circle cx="12" cy="12" r="3" {...s} />}
    </svg>
  );
});

Ic.displayName = "Ic";

export default Ic;