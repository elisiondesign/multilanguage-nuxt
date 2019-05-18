import DirectusSitemap from './directus'
import Sitemap from '@@/@types/multilanguage-nuxt/ISitemap';
import { SITEMAP_SOURCES } from './../../constants/ecma6';

const { getLocaleCodes } = require('../utils')

exports.makeSitemapRoutes = async (options) => {
  const appPages = options.pages;
  const config = options.sitemap;
  const locales = getLocaleCodes(options.locales);

  let routes = [];

  if (config.source === SITEMAP_SOURCES.DIRECTUS_7) {
    routes = await new DirectusSitemap(appPages, locales, config).getAppRoutes();
  }

  return routes
}
