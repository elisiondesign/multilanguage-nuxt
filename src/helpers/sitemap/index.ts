import DirectusSitemap from './directus'
import { SITEMAP_SOURCES } from '../../constants';
import { getLocaleCodes } from './../utils';

export const makeSitemapRoutesAsync = async (options) => {
  const appPages = options.pages;
  const config = options.sitemap;
  const defaultLocale = options.defaultLocale;
  const locales = getLocaleCodes(options.locales);

  let sitemapRoutes = [];

  if (config.source === SITEMAP_SOURCES.DIRECTUS_7) {
    sitemapRoutes = await new DirectusSitemap(appPages, locales, defaultLocale, config).getAppRoutes();
  }

  if (typeof(config.source) === 'function') {
    sitemapRoutes = await config.source()
  }

  if (sitemapRoutes.length === 0) {
    console.warn('Could not generate any routes for sitemap. Please consult your configuration with the documentation');
  }
  
  return sitemapRoutes
}
