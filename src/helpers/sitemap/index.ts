import DirectusSitemap from './directus'
import Sitemap from '@@/@types/multilanguage-nuxt/ISitemap';
import { SITEMAP_SOURCES } from './../../constants/ecma6';

const { getLocaleCodes } = require('../utils')

exports.makeSitemapRoutesAsync = async (options) => {
  const appPages = options.pages;
  const config = options.sitemap;
  const defaultLocale = options.defaultLocale;
  const locales = getLocaleCodes(options.locales);

  let sitemapRoutes = [];

  if (config.source === SITEMAP_SOURCES.DIRECTUS_7) {
    sitemapRoutes = await new DirectusSitemap(appPages, locales, defaultLocale, config).getAppRoutes();
  }

  return sitemapRoutes
}
