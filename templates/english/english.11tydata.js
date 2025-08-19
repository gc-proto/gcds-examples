const { hostEn, hostFr } = require('../_data/env');
const fs = require('fs');
const path = require('path');

function hasFrenchCounterpart(inputPath) {
  if (!inputPath) return false;
  const parts = inputPath.replace(/\\/g, '/').split('/english/');
  if (parts.length < 2) return false;
  const rel = parts[1];
  const baseNoExt = rel.replace(/\.[^/.]+$/, '');
  const candidates = ['.njk', '.html', '.liquid', '.md'];
  for (const ext of candidates) {
    const candidate = path.join(process.cwd(), 'templates', 'french', baseNoExt + ext);
    if (fs.existsSync(candidate)) return true;
  }
  return false;
}

module.exports = {
  lang: 'en',
  layout: 'layouts/base.njk',
  showSearch: true,
  footer: {
    contextualHeading: 'GC Design System Examples',
    contextualLinks: {
      'View templates': '/en/',
      'Gallery': '/en/gallery/',
      'GitHub': 'https://github.com/gc-proto/gcds-examples'
    }
  },
  eleventyComputed: {
    // Generate permalinks by replacing 'english/' with 'en/' in the path
    permalink: (data) => {
      if (data.permalink) return data.permalink; // respect front matter
      
      // Get the full input path and extract the part after 'templates/english/'
      const inputPath = data.page.inputPath || '';
      const pathParts = inputPath.replace(/\\/g, '/').split('/english/');
      
      if (pathParts.length < 2) {
        // Fallback if path structure is unexpected
        const slug = data.page.fileSlug;
        return slug === 'index' ? '/en/' : `/en/${slug}/index.html`;
      }
      
      // Get the relative path after 'english/'
      const relativePath = pathParts[1];
      
      // Remove file extension
      const pathWithoutExt = relativePath.replace(/\.[^/.]+$/, '');
      
      // Special case: if this is the main index.njk in the english folder
      if (pathWithoutExt === 'index') {
        return '/en/';
      }
      
      // For other index files in subdirectories, create clean directory URLs
      if (pathWithoutExt.endsWith('/index')) {
        const dirPath = pathWithoutExt.replace(/\/index$/, '');
        return `/en/${dirPath}/`;
      } else {
        // For non-index files, add /index.html
        return `/en/${pathWithoutExt}/index.html`;
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
      // Get the current page URL and convert from /en/ to /fr/
      const currentUrl = data.page && data.page.url;
      if (typeof currentUrl === 'string' && currentUrl.startsWith('/en/')) {
        return currentUrl.replace('/en/', '/fr/');
      }
      return '#'; // fallback
    },
    langAltAbsolute: (data) => {
      // Get the current page URL and convert from /en/ to /fr/
      const currentUrl = data.page && data.page.url;
      if (typeof currentUrl === 'string' && currentUrl.startsWith('/en/')) {
        return `${hostFr}${currentUrl.replace('/en/', '/fr/')}`;
      }
      return '#'; // fallback
    },
    langToggleDisabled: (data) => !hasFrenchCounterpart(data.page && data.page.inputPath)
  }
};
