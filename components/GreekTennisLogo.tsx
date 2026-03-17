import React from 'react';
import { Circle } from 'lucide-react';

const logoImg = (() => {
  try {
    return new URL('../img/logo.png', import.meta.url).href;
  } catch {
    return '';
  }
})();

interface GreekTennisLogoProps {
  /** Size: 'sm' | 'md' | 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Show "GREEK TENNIS" text next to logo */
  showText?: boolean;
  /** Optional class for the wrapper */
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const GreekTennisLogo: React.FC<GreekTennisLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {logoImg ? (
        <img
          src={logoImg}
          alt="GREEK TENNIS"
          className={`${sizeClasses[size]} object-contain`}
        />
      ) : (
        <div className={`${sizeClasses[size]} flex items-center justify-center rounded-lg bg-primary/10 text-primary`}>
          <Circle className="w-full h-full fill-primary" aria-hidden />
        </div>
      )}
      {showText && (
        <span className={`font-bold tracking-tight text-[#111318] dark:text-white ${textSizeClasses[size]}`}>
          GREEK TENNIS
        </span>
      )}
    </div>
  );
};
