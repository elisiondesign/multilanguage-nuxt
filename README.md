# Multilanguage Nuxt

## Introduction
multilanguage-nuxt takes care of internalization of your page (by integrating vue-i18n). It features
- Automatic routes generation prefixed with locale code
- URL translation of static pages
- Redirection based on browser language
- Option to provide dynamically generated links which enables:
  * url translation of dynamic pages on language switch
  * sitemap link generation with regards to mutlilanguage content


This module is heavily inspired by the [nuxt-i18n](https://github.com/nuxt-community/nuxt-i18n) module for internalization, but several additional options that are mainly
aimed at maximizing the SEO and page rank score. While some functions are the same or similar, there are many that are not present in this module (and vice versa).
As a rule of thumb, if you need more options, support of multiple domains, lazyloading or overriding options from inside the components, you should opt for the nuxt-i18n module.
However, if your main focus is the SEO, this module is likely the choice.

## Setup
For now, just fork the repository.

Later to be published as a package. Then

```
yarn add @elision/multilanguage-nuxt
```

or

```
npm install @elision/multilanguage-nuxt
```


## Basic Usage
As this package integrates with [vue-i18n](https://github.com/kazupon/vue-i18n), it's necessary to provide basic configuration for it. 
Besides, there are several options you should customize to unleash the full potential of the __multilanguage-nuxt__ module.

The minimal configuration requires you to provide some translations and define supported locales as well as the default locale.

```
{
  modules: [
    ['multilanguage-nuxt', {
      locales: ['en', 'cs'],
      defaultLocale: 'cs',
      vueI18n: {
        fallbackLocale: 'en',
        messages: {
          en: {
            welcome: 'Welcome'
          },
          cs: {
            welcome: 'Vítejte'
          },
      }
    }]
  ]
}
```

### Linking with nuxt-link
When creating a link, it is necessary to build the proper URL prefixed with current locale.
For convenience, the module registers several global mixins that makes this a breeze:

- `localePath`
Returns the localized URL for a given page. The first parameter can be either the name of the route or an object for more complex routes. 
A locale code can be passed as the second parameter to generate a link for a specific language:

```
<nuxt-link :to="localePath('index')">{{ $t('home') }}</nuxt-link>
<nuxt-link :to="localePath('index', 'en')">Homepage in English</nuxt-link>
<nuxt-link
  :to="localePath({ name: 'category-slug', params: { slug: category.slug } })">
  {{ category.title }}
</nuxt-link>
```

- `changeLanguage` 
Returns a link to the current page in another language. If the url consists of dynamically generated bits,
they will be translated as well given that the translation was provided in the configuration (see advanced usage for more information).
You may suppress this effect by passing __false__ as the second argument.
```
<nuxt-link :to="changeLanguage('en')">English</nuxt-link>
<nuxt-link :to="changeLanguage('cs', false)">Čeština</nuxt-link>
```

For convenience, these methods are also available in the app's context:
```
// ~/plugins/myplugin.js

export default ({ app }) => {
  // Get localized path for homepage
  const localePath = app.i18n.localePath('index')
  // Get path to switch current route to French
  const changeLanguage = app.i18n.changeLanguage('fr')
}
```

## Hooks
As language switch is effectively just an action of routing to another page, we can utilize __vue-router's__ `beforeEach`
 and `afterEach` hooks. The `multilanguage-nuxt` provides two hooks you can use to perform speciffic tasks
 that depend on the app's language.
 
 `beforeLanguageSwitch(oldLocale, newLocale)`
 Called right before setting the app's new locale.
 
 Parameters:
 - oldLocale: the app's locale before the switch
 - newLocale: the app's locale after the switch

`onLanguageSwitched(oldLocale, newLocale)`
Called right after the app's locale has been switched.

Parameters:
- oldLocale: the app's locale before the switch
- newLocale: the app's locale after the switch

### Usage
You may use these hooks anytime you have access to the app's [context](https://nuxtjs.org/api/context/).
Most typically, you'd use the hooks inside of your custom plugins.

```
// ~/plugins/i18n.js

export default function ({ app }) {
  // beforeLanguageSwitch called right before setting a new locale
  app.i18n.beforeLanguageSwitch = (oldLocale, newLocale) => {
    console.log(oldLocale, newLocale)
  }
  // onLanguageSwitched called right after a new locale has been set
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    console.log(oldLocale, newLocale)
  }
}
```

And then in the Nuxt's config:
```
// nuxt.config.js

module.exports = {
  plugins: [
    { src: '~plugins/i18n.js' }
  ]
}
```


## Routing
__multilanguage-nuxt__ overrides Nuxt default routes to add locale prefixes to every URL.
Say your app supports two languages: French and English as the default language, and you have the following pages in your project:

```
pages/
├── index.vue
├── about.vue
```

This would result in the following routes being generate

```
// Generated routes (internally by Nuxt)
[
  {
    path: "/",
    component: __3237362a,
    name: "index______en"
  },
  {
    path: "/fr/",
    component: __3237362a,
    name: "index______fr"
  },
  {
    path: "/about",
    component: __71a6ebb4,
    name: "about______en"
  },
  {
    path: "/fr/about",
    component: __71a6ebb4,
    name: "about______fr"
  }
]
```

### Strategy
There are two supported strategies for generating the app's routes:

#### prefifix__except__default
Using this strategy, all of your routes will have a locale prefix added except for the default language.

#### prefix
With this strategy, all routes will have a locale prefix.

#### prefix__and__default
This strategy combines both previous strategies behaviours, meaning that you will get URLs with prefixes for every language, but URLs for the default language will also have a non-prefixed version.

To configure the strategy, use the strategy option. Make sure you have a defaultLocale defined if using prefix__except__default or prefix__and__default strategy.

```
// nuxt.config.js

['multilanguage-nuxt', {
  strategy: 'prefix__except__default',
  defaultLocale: 'en'
}]
```

### Custom Paths
The above configuration works just fine as long as you neither use dynamic pages and nor need to translate URLs.
However, once you do, the maintenance of the translations as well as of the sitemap module
becomes burdensome and heavily prone to errors. The `multilanguage-nuxt` does not remove
the overhead completely, but promotes a single entry solution. Thanks to it, you need only to maintain
single file/function in order to keep your multilingual site up-to-date.

The easiest way to define custom URL's is to configure __pages__ attribute in nuxt config file.

```
// nuxt.config.js

['multilanguage-nuxt', {
  pages: {
    about: {
      en: '/about-us', // -> accessible at /about-us (no prefix since it's the default locale)
      cs: '/o-nas', // -> accessible at /fr/a-propos
    }
  }
}]
```

To define custom paths for dynamic pages, the configuration looks a bit different.
Say you have some nested page like:

```
pages/
├── __nested/
├──── __route/
├────── index.vue
```

Here's how you would configure this particular page in the configuration:

```
// nuxt.config.js

['multilanguage-nuxt', {
  parsePages: false,
  pages: {
    '__nested/__route/index': {
      en: '/mycustompath/:nested/:route?' // Params need to be put back here as you would with vue-router
    }
  }
}]
```

As you can imagine, defining all the custom paths would be lengthy and unclear should it all be stored in the same config file.
Therefore, the recommended approach is to define __pages__ object in a different file and require it afterwards.

```
// ./lang/pages.js
export default {
  index: {
    en: '/',
    cs: '/',
  },
  'blog/index': {
    en: '/blog',
    cs: '/blog',
  },
  'blog/__title/index': {
    en: '/blog/:title?',
    cs: '/blog/:title?',
  },
  'projects/index': {
    en: '/projects',
    cs: '/projekty',
  },
  'projects/overview/index': {
    en: '/projects/overview',
    cs: '/projekty/prehled',
  },
  'projects/__name/index': {
    en: '/projects/:name?',
    cs: '/projekty/:name?',
  },
  'services/__name/index': {
    en: '/services/:name?',
    cs: '/sluzby/:name?',
  },
  'services/index': {
    en: '/services',
    cs: '/sluzby',
  },
  contact: {
    en: '/contact',
    cs: '/kontakt',
  },
};
```

```
// nuxt.config.js
import pages from './pages';

module.exports = {
...
 modules: [
    ['multilanguage-nuxt', {
      locales: ['en', 'cs'],
      defaultLocale: 'cs',
      vueI18n: {
        fallbackLocale: 'en',
        messages: {
          en: {
            welcome: 'Welcome'
          },
          cs: {
            welcome: 'Vítejte'
          },
      },
      pages // <-- it uses the imported pages object
    }]
  ]
}
```

Additionally, the __pages__ attribute supports async functions, so you can load the pages from your CMS
and the module will take care of the rest

```
// ./lang/pages.js
export default async function {
  import axios from 'axios';
  
  try {
      return await axios.get('https://my-pages.com');
    }
    catch (e) {
      return {};
    }
};
```

## Seo
The __multilanguage-nuxt__ module provides several utilities that aim at improving your SEO performace.

- Add a lang attribute containing current locale's ISO code to the <html> tag.
- Generate <link rel="alternate" hreflang="x"> tags for every language configured in nuxt.config.js. For each language, the ISO code is used as hreflang attribute's value. More on hreflang
- Generate og:locale and og:locale:alternate meta tags as defined in the Open Graph protocol
- When using prefix__and__default strategy, generate rel="canonical" link on the default language routes containing the prefix to avoid duplicate indexation. More on canonical

Relatedly, you are required to configure the `iso` code for each of the supported language by your app.

```angular
// nuxt.config.js

['multilanguage-nuxt', {
  locales: [
    {
      code: 'en',
      iso: 'en-US'
    },
    {
      code: 'es',
      iso: 'es-ES'
    },
    {
      code: 'cs',
      iso: 'cs-CS'
    }
  ]
}]
```

### Configuration
The SEO utilites are optional and you can disable some features all of it altogether.

To disable all features, set `seo` option to `false`.

```
// nuxt.config.js

['multilanguage-nuxt', {
  seo: false
}]
```

Or to disable only some features

```
// nuxt.config.js

['multilanguage-nuxt', {
  seo: {
    htmlLang: false,
    generateAlternate: false,
    generateOg: false,
    generateCanoncial: true,
  }
}]
```

### Multilingual variants in Sitemap
Another important part of your page rank is proper configuration of localized versions of your page.
Google supports several [methods](https://support.google.com/webmasters/answer/189077), one of them utilizing page's sitemap.

Hence, the `multilanguage-nuxt` module integrates the sitemap module and extends the routes option with
the entries of every language/locale variant provided. However, by default this option works only with static pages.
In order to turn on the generation of the dynamic pages, you need to tell the module about all the pages and their translations.

This is no generic task and the implementation will differ from source to source. The `multilanguage-nuxt` module supports
integration with Directus 7 out of the box only so far.

The setup requires you to set `url`, target `project` and `bearer token` and if applicable.
Furthermore, the `pages` attribute must be present in the configuration.
Note that the `translations` in the Directus instance must be configured in accordance with the official manual.
That is, it must contain following fields: id, language_code
Additionally, the `language` table must be present.

The `mappings` attribute uses the `pages` attribute to generate array of translated routes.
In each entry, you

```
// nuxt.config.js
import pages from './lang/pages/;

['multilanguage-nuxt', {
  pages,
  sitemap: {
    source: 'directus-7',
    url: 'https://api.elisiondesign.cz/', // <-- is public and read-only, no bearer token required
    project: 'elision',
    mappings: [
      {
        page: blog, // app page, relates to first level nuxt page
        table: blog, // table name in directus
        dynamicFile: _title // the dynamic part (as defined in pages.js
        sitemapEntry: slug // Translated field to be included in the sitemap
      }
    ]
  }
}]

```

Alternatively, you can create your own asynchronous function that will generate the routes. This option
will override the generation provided by this module. Hence, in order to keep your SEO in a top shape, make sure
that the output array corresponds to the google's recommended structure. See the example and the example in the [recipes](##recipes) section.

```
// nuxt.config.js
import pages from './lang/custom-routes;

['multilanguage-nuxt', {
  pages,
  sitemap: {
    source: custom-routes
  }
}]

```

```
// Output of your custom-routes.js function
[
  {
    url: 'http://test.com/page-1/',
    links: [
      { lang: 'en', url: 'http://test.com/page-1/', },
      { lang: 'ja', url: 'http://test.com/page-1/ja/', },
    ]
  },
  {
      url: 'http://test.com/page-2/',
      links: [
        { lang: 'en', url: 'http://test.com/page-2/', },
        { lang: 'ja', url: 'http://test.com/page-2/ja/', },
      ]
    }
]

```


Refer to the official [documentation](https://github.com/nuxt-community/sitemap-module) for available options. Note that you __may__ use the `routes` option again,
the final array of routes will be merged with the routes generated by the `multilanguage-nuxt` module. If you would like to disable the routes generation,
just set `sitemap` option to `false`.


## Recipes
### Custom sitemap function
```
import appPages from '../lang/pages';

const DirectusSDK = require('@directus/sdk-js');

const api = new DirectusSDK({
  url: 'https://api.elisiondesign.cz/',
  project: 'elision',
});

async function getEntrieforEachLanguage(tableName) {
  const output = {};

  await api.getItems(tableName, { fields: '*.*' })
    .then(res => res.data.forEach((entry) => {
      entry.translations.forEach((language) => {
        if (output[language.language_code] === undefined) output[language.language_code] = [language.slug];
        else output[language.language_code].push(language.slug);
      });
    }));

  return output;
}


export default async function getAppRoutes() {
  const availableLanguages = await api.getItems('languages').then(res => res.data.map(language => language.id));
  const members = await api.getItems('team_members').then(res => res.data.map(member => member.short_name));
  const projects = await api.getItems('projects').then(res => res.data.map(project => project.url));
  const blogPosts = await getEntrieforEachLanguage('blog');
  const services = await getEntrieforEachLanguage('services');

  const routes = [];

  for (let i = 0; i < availableLanguages.length; i += 1) {
    const language = availableLanguages[i];

    Object.entries(appPages).forEach((pageEntry) => {
      const nuxtPath = pageEntry[0];
      const pathTranslations = pageEntry[1];

      const routePath = language + pathTranslations[language];

      // Add only language (without '/' at the end) for index page
      if (nuxtPath === 'index') {
        routes.push(language);
      } else if (nuxtPath.includes('team/_')) {
        for (let index = 0; index < members.length; index += 1) {
          routes.push(routePath.replace(/:name\?/, members[index]));
        }
      } else if (nuxtPath.includes('blog/_')) {
        for (let postIndex = 0; postIndex < blogPosts[language].length; postIndex += 1) {
          routes.push(routePath.replace(/:title\?/, blogPosts[language][postIndex]));
        }
      } else if (nuxtPath.includes('services/_')) {
        for (let serviceIndex = 0; serviceIndex < services[language].length; serviceIndex += 1) {
          routes.push(routePath.replace(/:name\?/, services[language][serviceIndex]));
        }
      } else if (nuxtPath.includes('projects/_')) {
        for (let projectIndex = 0; projectIndex < projects.length; projectIndex += 1) {
          routes.push(routePath.replace(/:name\?/, projects[projectIndex]));
        }
      } else {
        routes.push(routePath);
      }
    });
  }

  return routes;
}

```
