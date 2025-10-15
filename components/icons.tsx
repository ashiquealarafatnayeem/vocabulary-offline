import React from 'react';

const IconWrapper: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  />
);

export const EyeOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconWrapper {...props}>
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </IconWrapper>
);

export const BookOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </IconWrapper>
);

export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </IconWrapper>
);

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconWrapper {...props} strokeWidth="0" stroke="none">
        <path fill="#fbbf24" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
        <path fill="#f59e0b" d="M9 22V12h6v10" />
    </IconWrapper>
);

export const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props} strokeWidth="2.5" stroke="#3b82f6">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </IconWrapper>
);

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9Z" />
  </IconWrapper>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </IconWrapper>
);

export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </IconWrapper>
);

export const Volume2Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </IconWrapper>
);

export const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconWrapper {...props}>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
    </IconWrapper>
);

export const ClipboardListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconWrapper {...props}>
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M12 11h4" />
        <path d="M12 16h4" />
        <path d="M8 11h.01" />
        <path d="M8 16h.01" />
    </IconWrapper>
);

export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </IconWrapper>
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <path d="m6 9 6 6 6-6" />
  </IconWrapper>
);

export const ChevronUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <path d="m18 15-6-6-6 6" />
  </IconWrapper>
);

export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </IconWrapper>
);

export const BookmarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </IconWrapper>
);

export const AlertTriangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </IconWrapper>
);

export const AngryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconWrapper {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
      <path d="M7.5 8.5L9 7l1.5 1.5"></path>
      <path d="M16.5 8.5L15 7l-1.5 1.5"></path>
    </IconWrapper>
);
  
export const BlessedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconWrapper {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
      <path d="M7.5 5c2.5-1 6.5-1 9 0" />
    </IconWrapper>
);

export const SmileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" x2="9.01" y1="9" y2="9" />
    <line x1="15" x2="15.01" y1="9" y2="9" />
  </IconWrapper>
);

export const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <IconWrapper {...props}>
    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    <path d="M12 2v2" />
    <path d="M12 22v-2" />
    <path d="m17 20.66-1-1.73" />
    <path d="m6 14.07 1 1.73" />
    <path d="m7 4.64 1 1.73" />
    <path d="m18 9.93-1-1.73" />
  </IconWrapper>
);

export const MedalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <IconWrapper {...props}>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 22 12 17 17 22 15.79 13.88" />
    </IconWrapper>
);