import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { SITE_LOGO_SRC } from '@/lib/brand';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

type SiteLogoVariant = 'light' | 'dark' | 'hero';
type SiteLogoSize = 'nav' | 'full';

type SiteLogoProps = {
  /** light/hero = logo as-is (dark on white); dark = inverted for army footer */
  variant?: SiteLogoVariant;
  /** nav = crisp header assets; full = large master PNG */
  size?: SiteLogoSize;
  className?: string;
  /** Play the one-time reveal animation (header logo only). */
  animateIntro?: boolean;
};

/** The header logo intro plays once per full page load, not on every in-app navigation. */
let introPlayed = false;

const SiteLogo = ({ variant = 'light', size = 'nav', className, animateIntro = false }: SiteLogoProps) => {
  const { logoSrc, logoSrcSet, logoAlt, logoWidth, logoHeight } = useSiteSettings();
  const isNav = size === 'nav';
  const [playIntro] = useState(() => animateIntro && !introPlayed);

  useEffect(() => {
    if (playIntro) introPlayed = true;
  }, [playIntro]);

  return (
    <img
      src={isNav ? logoSrc : logoSrc || SITE_LOGO_SRC}
      srcSet={isNav ? logoSrcSet : undefined}
      width={isNav ? logoWidth : 1016}
      height={isNav ? logoHeight : 598}
      alt={logoAlt}
      className={cn(
        'w-auto object-contain [image-rendering:auto]',
        variant === 'dark' && 'invert',
        className,
        playIntro && 'logo-intro'
      )}
      decoding="async"
      fetchpriority="high"
    />
  );
};

export default SiteLogo;
