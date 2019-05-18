import makeDirectusRoutes from './directus'
import Sitemap from '@@/@types/multilanguage-nuxt/ISitemap';
import { SITEMAP_SOURCES } from './../../constants/ecma6';

exports.makeSitemapRoutes = async (appPages, config: Sitemap) => {
  let routes = [];

  if (config.source === SITEMAP_SOURCES.DIRECTUS_7) {
    routes = await makeDirectusRoutes(appPages)
  }
  debugger

  return routes
}
