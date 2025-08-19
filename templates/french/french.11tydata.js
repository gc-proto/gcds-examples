const { hostEn, hostFr } = require('../_data/env');
const fs = require('fs');
const path = require('path');

function hasEnglishCounterpart(inputPath) {
  if (!inputPath) return false;
  const parts = inputPath.replace(/\\/g, '/').split('/french/');
  if (parts.length < 2) return false;
  const rel = parts[1];
  const baseNoExt = rel.replace(/\.[^/.]+$/, '');
  const candidates = ['.njk', '.html', '.liquid', '.md'];
  for (const ext of candidates) {
    const candidate = path.join(process.cwd(), 'templates', 'english', baseNoExt + ext);
    if (fs.existsSync(candidate)) return true;
  }
  return false;
}

module.exports = {
  lang: 'fr',
  layout: 'layouts/base.njk',
  showSearch: true,
  footer: {
    contextualHeading: 'Exemples du système de conception GC',
    contextualLinks: {
      'Voir les modèles': '/fr/',
      'Galerie': '/fr/galerie/',
      'GitHub': 'https://github.com/gc-proto/gcds-examples'
    }
  },
  eleventyComputed: {
    // Generate permalinks by replacing 'french/' with 'fr/' in the path
    permalink: (data) => {
      if (data.permalink) return data.permalink; // respect front matter
      
      // Get the full input path and extract the part after 'templates/french/'
      const inputPath = data.page.inputPath || '';
      const pathParts = inputPath.replace(/\\/g, '/').split('/french/');
      
      if (pathParts.length < 2) {
        // Fallback if path structure is unexpected
        const slug = data.page.fileSlug;
        return slug === 'index' ? '/fr/' : `/fr/${slug}/index.html`;
      }
      
      // Get the relative path after 'french/'
      const relativePath = pathParts[1];
      
      // Remove file extension
      const pathWithoutExt = relativePath.replace(/\.[^/.]+$/, '');
      
      // Special case: if this is the main index.njk in the french folder
      if (pathWithoutExt === 'index') {
        return '/fr/';
      }
      
      // For other index files in subdirectories, create clean directory URLs
      if (pathWithoutExt.endsWith('/index')) {
        const dirPath = pathWithoutExt.replace(/\/index$/, '');
        return `/fr/${dirPath}/`;
      } else {
        // For non-index files, add /index.html
        return `/fr/${pathWithoutExt}/index.html`;
      }
    },
    hreflang: (data) => {
      const slug = data.page.fileSlug;
      const hrefSuffix = slug === 'index' ? '' : `${slug}/`;
      return [
        { lang: 'en', href: `${hostEn}/en/${hrefSuffix}` },
        { lang: 'fr', href: `${hostFr}/fr/${hrefSuffix}` },
      ];
    },
    langAltUrl: (data) => {
      // Get the current page URL and convert from /fr/ to /en/
      const currentUrl = data.page && data.page.url;
      if (typeof currentUrl === 'string' && currentUrl.startsWith('/fr/')) {
        return currentUrl.replace('/fr/', '/en/');
      }
      return '#'; // fallback
    },
    langAltAbsolute: (data) => {
      // Get the current page URL and convert from /fr/ to /en/
      const currentUrl = data.page && data.page.url;
      if (typeof currentUrl === 'string' && currentUrl.startsWith('/fr/')) {
        return `${hostEn}${currentUrl.replace('/fr/', '/en/')}`;
      }
      return '#'; // fallback
    },
    langToggleDisabled: (data) => !hasEnglishCounterpart(data.page && data.page.inputPath)
  }
};
