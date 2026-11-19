import slidesManifest from './slides.json';

export interface SlideItem {
  id: number;
  slideNumber: string;
  src: string;
  rawSrc: string;
  originalFilename: string;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'portrait' | 'landscape' | 'square';
  isTransparent: boolean;
}

export const HERO_SLIDES: SlideItem[] = slidesManifest.slides as SlideItem[];
export const TOTAL_HERO_SLIDES: number = slidesManifest.totalSlides;
