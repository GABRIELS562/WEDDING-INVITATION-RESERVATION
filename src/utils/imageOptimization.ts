/**
 * Image Optimization Utilities for Wedding RSVP App
 * Optimize images for Core Web Vitals and performance
 */

interface ImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  sizes?: string;
}

interface OptimizedImageProps extends ImageConfig {
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Generate responsive image sources with WebP support
 */
export function generateImageSources(src: string, width?: number): string[] {
  const basePath = src.replace(/\.[^/.]+$/, ''); // Remove extension
  const ext = src.split('.').pop()?.toLowerCase() || 'jpg';
  
  const sources: string[] = [];
  
  // Generate WebP variants for modern browsers
  if (ext !== 'webp') {
    sources.push(`${basePath}.webp`);
    if (width) {
      sources.push(`${basePath}-${width}w.webp`);
      sources.push(`${basePath}-${Math.floor(width * 1.5)}w.webp 1.5x`);
      sources.push(`${basePath}-${width * 2}w.webp 2x`);
    }
  }
  
  // Fallback to original format
  sources.push(src);
  if (width) {
    sources.push(`${basePath}-${width}w.${ext}`);
    sources.push(`${basePath}-${Math.floor(width * 1.5)}w.${ext} 1.5x`);
    sources.push(`${basePath}-${width * 2}w.${ext} 2x`);
  }
  
  return sources;
}

/**
 * Generate srcset string for responsive images
 */
export function generateSrcSet(src: string, widths: number[] = [320, 640, 960, 1280]): string {
  const basePath = src.replace(/\.[^/.]+$/, '');
  const ext = src.split('.').pop()?.toLowerCase() || 'jpg';
  
  const srcSetEntries = widths.map(width => 
    `${basePath}-${width}w.${ext} ${width}w`
  );
  
  return srcSetEntries.join(', ');
}

/**
 * Generate sizes attribute based on breakpoints
 */
export function generateSizes(config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  default: string;
}): string {
  const sizes = [];
  
  if (config.mobile) {
    sizes.push(`(max-width: 640px) ${config.mobile}`);
  }
  
  if (config.tablet) {
    sizes.push(`(max-width: 1024px) ${config.tablet}`);
  }
  
  if (config.desktop) {
    sizes.push(`(max-width: 1280px) ${config.desktop}`);
  }
  
  sizes.push(config.default);
  
  return sizes.join(', ');
}

/**
 * Lazy loading with Intersection Observer
 */
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  private images: Map<Element, ImageConfig> = new Map();
  
  constructor() {
    this.initializeObserver();
  }
  
  private initializeObserver() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }
    
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const config = this.images.get(img);
            
            if (config) {
              this.loadImage(img, config);
              this.observer?.unobserve(img);
              this.images.delete(img);
            }
          }
        });
      },
      {
        rootMargin: '50px 0px', // Load images 50px before they enter viewport
        threshold: 0.01,
      }
    );
  }
  
  observe(element: HTMLImageElement, config: ImageConfig) {
    if (!this.observer) {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(element, config);
      return;
    }
    
    this.images.set(element, config);
    this.observer.observe(element);
  }
  
  private loadImage(img: HTMLImageElement, config: ImageConfig) {
    if (config.width && config.height) {
      img.srcset = generateSrcSet(config.src);
      img.sizes = config.sizes || generateSizes({
        mobile: '100vw',
        tablet: '50vw',
        default: '33vw'
      });
    }
    
    img.src = config.src;
    img.alt = config.alt;
    
    if (config.width) img.width = config.width;
    if (config.height) img.height = config.height;
    
    // Add loading class for CSS transitions
    img.classList.add('loading');
    
    img.onload = () => {
      img.classList.remove('loading');
      img.classList.add('loaded');
    };
    
    img.onerror = () => {
      img.classList.remove('loading');
      img.classList.add('error');
      console.warn(`Failed to load image: ${config.src}`);
    };
  }
  
  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.images.clear();
    }
  }
}

/**
 * Preload critical images
 */
export function preloadCriticalImages(images: ImageConfig[]) {
  if (typeof window === 'undefined') return;
  
  images.forEach((config) => {
    if (config.priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = config.src;
      
      // Add responsive preloading for WebP
      if (supportsWebP()) {
        const webpSrc = config.src.replace(/\.[^/.]+$/, '.webp');
        link.href = webpSrc;
      }
      
      if (config.width && config.height) {
        link.setAttribute('imagesrcset', generateSrcSet(config.src));
        link.setAttribute('imagesizes', config.sizes || '100vw');
      }
      
      document.head.appendChild(link);
    }
  });
}

/**
 * Check WebP support
 */
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if we've already determined WebP support
  if ('webpSupport' in window) {
    return (window as any).webpSupport;
  }
  
  // Use canvas to test WebP support
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  const supported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  (window as any).webpSupport = supported;
  
  return supported;
}

/**
 * Blur placeholder data URL generator
 */
export function generateBlurPlaceholder(width: number, height: number, color: string = '#f3f4f6'): string {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <defs>
        <filter id="blur">
          <feGaussianBlur stdDeviation="8"/>
        </filter>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#gradient)" filter="url(#blur)"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${adjustBrightness(color, -10)};stop-opacity:0.6" />
        </linearGradient>
      </defs>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Adjust color brightness
 */
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

/**
 * Image loading performance tracker
 */
export class ImagePerformanceTracker {
  private static instance: ImagePerformanceTracker | null = null;
  private loadTimes: Map<string, number> = new Map();
  private errors: Set<string> = new Set();
  
  static getInstance(): ImagePerformanceTracker {
    if (!ImagePerformanceTracker.instance) {
      ImagePerformanceTracker.instance = new ImagePerformanceTracker();
    }
    return ImagePerformanceTracker.instance;
  }
  
  trackImageLoad(src: string, startTime: number) {
    const loadTime = Date.now() - startTime;
    this.loadTimes.set(src, loadTime);
    
    // Track slow loading images
    if (loadTime > 2000) {
      console.warn(`Slow image load: ${src} took ${loadTime}ms`);
      
      // Report to analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'slow_image_load', {
          image_src: src,
          load_time: loadTime,
        });
      }
    }
  }
  
  trackImageError(src: string) {
    this.errors.add(src);
    console.error(`Failed to load image: ${src}`);
    
    // Report to analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'image_load_error', {
        image_src: src,
      });
    }
  }
  
  getReport() {
    const avgLoadTime = Array.from(this.loadTimes.values()).reduce((a, b) => a + b, 0) / this.loadTimes.size;
    
    return {
      totalImages: this.loadTimes.size + this.errors.size,
      successfulLoads: this.loadTimes.size,
      failedLoads: this.errors.size,
      averageLoadTime: Math.round(avgLoadTime),
      slowImages: Array.from(this.loadTimes.entries())
        .filter(([_, time]) => time > 2000)
        .map(([src, time]) => ({ src, time })),
      errorImages: Array.from(this.errors),
    };
  }
}

/**
 * Wedding-specific image configurations
 */
export const WEDDING_IMAGE_CONFIGS = {
  hero: {
    width: 1920,
    height: 1080,
    priority: true,
    quality: 85,
    sizes: generateSizes({
      mobile: '100vw',
      tablet: '100vw',
      default: '100vw'
    })
  },
  
  ceremony: {
    width: 800,
    height: 600,
    priority: false,
    quality: 80,
    sizes: generateSizes({
      mobile: '100vw',
      tablet: '50vw',
      default: '33vw'
    })
  },
  
  venue: {
    width: 600,
    height: 400,
    priority: false,
    quality: 75,
    sizes: generateSizes({
      mobile: '100vw',
      tablet: '50vw',
      default: '25vw'
    })
  },
  
  gallery: {
    width: 400,
    height: 400,
    priority: false,
    quality: 70,
    sizes: generateSizes({
      mobile: '50vw',
      tablet: '25vw',
      default: '20vw'
    })
  }
};

// Initialize global lazy loader
export const globalImageLoader = new LazyImageLoader();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    globalImageLoader.disconnect();
  });
}