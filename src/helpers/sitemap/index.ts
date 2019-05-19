import DirectusSitemap from './directus'
import { SITEMAP_SOURCES, MODULE_NAME } from '../../constants';
import getLocaleCodes from '../utils';
import CustomPaths from '@@/@types/multilanguage-nuxt/ICustomPaths.d';
import ModuleOptions from '@@/@types/multilanguage-nuxt/IModuleOptions.d';
import Sitemap from '@@/@types/multilanguage-nuxt/ISitemap.d';

/**
 * Handles sitemap routes preparation based on module's configuration
 * 
 * @param options module's configuration options
 */
export const makeSitemapRoutesAsync = async (options: ModuleOptions) => {
  const appPages: Array<CustomPaths> = options.pages;
  const config: Sitemap = options.sitemap;
  const defaultLocale: string = options.defaultLocale;
  const locales: Array<string> = getLocaleCodes(options.locales);

  let sitemapRoutes = [];

  switch(config.source) {
    case SITEMAP_SOURCES.DIRECTUS_7:
        sitemapRoutes = await new DirectusSitemap(appPages, locales, defaultLocale, config)
          .getAppRoutesAsync();
        break;
  }

  // In case the source is a custom function
  if (typeof(config.source) === 'function') {
    sitemapRoutes = await config.source()
  }

  if (sitemapRoutes.length === 0) {
    console.warn(`[${MODULE_NAME}] Could not generate any routes for sitemap. Please consult your configuration with the documentation`);
  }
  
  return sitemapRoutes
}
