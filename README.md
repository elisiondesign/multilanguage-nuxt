# Multilanguage Nuxt

## Introduction
multilanguage-nuxt takes care of internalization of your page (by integrating vue-i18n). It features
- Automatic routes generation prefixed with locale code
- URL translation of static pages
- Redirection based on browser language
- Option to provide dynamically generated links which enables:
  * url translation of dynamic pages on language switch
  * itemap link generation with regards to mutlilanguage content


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
As this package integrates with vue-i18n, it's necessary to provide basic configuration for it. 
Besides it, there are several options you should customize to integrate the full potential of _multilanguage-nuxt_.

The minimal configuration requires you to provide some translations and define supported locales as well as the default locase.

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

- `switchLocalePath` 
Returns a link to the current page in another language. If the url consists of dynamically generated bits,
they will be translated as well given that the translation was provided in the configuration (see advanced usage for more information).
You may suppress this effect by passing _false_ as the second argument.
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
  const switchLocalePath = app.i18n.switchLocalePath('fr')
}
```
