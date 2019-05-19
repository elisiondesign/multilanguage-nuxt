export default function nuxt$i18nSeo() {
    const COMPONENT_OPTIONS_KEY = '<%= options.COMPONENT_OPTIONS_KEY %>'
    const configIncorrect = configurationIncorrect.call(this, COMPONENT_OPTIONS_KEY);

    if (configIncorrect) {
      return {};
    }

    const LOCALE_CODE_KEY = '<%= options.LOCALE_CODE_KEY %>'
    const LOCALE_ISO_KEY = '<%= options.LOCALE_ISO_KEY %>'
    const BASE_URL = '<%= options.baseUrl %>'
    const STRATEGY = '<%= options.strategy %>'

    const addHtmlLang = '<%= options.seo.htmlLang %>'
    const generateOg = '<%= options.seo.generateOg %>'
    const generateAlternate = '<%= options.seo.generateAlternate %>'
    const generateCanonical = '<%= options.seo.generateCanonical %>'

    // Prepare html lang attribute
    const currentLocaleData = this.$i18n.locales.find(l => l[LOCALE_CODE_KEY] === this.$i18n.locale)
    const htmlAttrs = {}
    if (currentLocaleData && currentLocaleData[LOCALE_ISO_KEY] && addHtmlLang) {
      htmlAttrs.lang = currentLocaleData[LOCALE_ISO_KEY]
    }
  
    let link = []
    
    // hreflang tags
    if (generateAlternate) {
      link = link.concat(generateAlternateAttrs.call(this, LOCALE_CODE_KEY, BASE_URL))
    }

  
    // canonical links
    if (STRATEGY === '<%= options.STRATEGIES.PREFIX_AND_DEFAULT %>' && generateCanonical) {
      link = link.concat(generateCanonicalAttrs.call(this, currentLocaleData, LOCALE_CODE_KEY, BASE_URL))
    }
    // og:locale meta
    let meta = []
    // og:locale - current
    if (currentLocaleData && currentLocaleData[LOCALE_ISO_KEY] && generateOg) {
      meta = meta.concat(generateOgAttrs.call(this, currentLocaleData, LOCALE_ISO_KEY))
    }

    return {
      htmlAttrs,
      link,
      meta
    }
  }

  /**
   * Generate alternate language attributes
   * 
   * @param  localeCodeKey locale key according to ISO
   * @param  baseUrl base url string
   */
  function generateAlternateAttrs(localeCodeKey, baseUrl) {
    return this.$i18n.locales
      .map(locale => {
        if (locale[localeCodeKey]) {
          return {
            hid: 'alternate-hreflang-' + locale[localeCodeKey],
            rel: 'alternate',
            href: baseUrl + this.changeLanguage(locale.code),
            hreflang: locale[localeCodeKey]
          }
        } else {
          console.warn('[<%= options.MODULE_NAME %>] Locale ISO code is required to generate alternate link')
          return null
        }
      })
      .filter(item => !!item)
  }

  /**
   * Generate alternative canonical attributes
   * 
   * @param currentLocaleData Information about current locale in ISO form
   * @param localeCodeKey locale key according to ISO 
   * @param baseUrl base url string 
   */
  function generateCanonicalAttrs(currentLocaleData, localeCodeKey, baseUrl) {
    let links = []

    const canonicalPath = this.changeLanguage(currentLocaleData[localeCodeKey])
      if (canonicalPath && canonicalPath !== this.$route.path) {
        // Current page is not the canonical one -- add a canonical link
        links.push({
          hid: 'canonical-lang-' + currentLocaleData[localeCodeKey],
          rel: 'canonical',
          href: baseUrl + canonicalPath
        })
    }

    return links;
  }

  /**
   * Generate OG meta tags for alternate langauges
   * @param currentLocaleData Information about current locale in ISO form
   * @param localeIsoKey locale iso key according to ISO 
   */
  function generateOgAttrs(currentLocaleData, localeIsoKey) {
    const meta = []

    meta.push({
      hid: 'og:locale',
      property: 'og:locale',
      // Replace dash with underscore as defined in spec: language_TERRITORY
      content: currentLocaleData[localeIsoKey].replace(/-/g, '_')
    })
    // og:locale - alternate
    meta.push(
      ...this.$i18n.locales
        .filter(l => l[localeIsoKey] && l[localeIsoKey] !== currentLocaleData[localeIsoKey])
        .map(locale => ({
          hid: 'og:locale:alternate-' + locale[localeIsoKey],
          property: 'og:locale:alternate',
          content: locale[localeIsoKey].replace(/-/g, '_')
        }))
    );

    return meta;
  }
  

  function configurationIncorrect(ComponentOptionsKey) {
    return !this._hasMetaInfo ||
    !this.$i18n ||
    !this.$i18n.locale ||
    !this.$i18n.locales ||
    this.$options[ComponentOptionsKey] === false
  }