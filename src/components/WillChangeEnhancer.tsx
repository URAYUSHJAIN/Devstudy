'use client';

import { useEffect } from 'react';

const WillChangeEnhancer = () => {
  useEffect(() => {
    const handleMouseOver = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const card = target?.closest("[data-interactive-card='true']") as HTMLElement | null;
      if (card) {
        card.style.willChange = 'transform';
      }
    };

    const handleMouseOut = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const card = target?.closest("[data-interactive-card='true']") as HTMLElement | null;
      if (card) {
        card.style.willChange = 'auto';
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return null;
};

export default WillChangeEnhancer;
