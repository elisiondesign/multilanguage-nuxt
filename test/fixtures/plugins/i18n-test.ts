import { Context } from '@@/@types/nuxt-types/index'

export default function ({ app }: Context) {
  // beforeLanguageSwitch called right before setting a new locale
  app.i18n.beforeLanguageSwitch = (oldLocale: string, newLocale: string) => {
    console.log(oldLocale, newLocale)
  }
  // onLanguageSwitched called right after a new locale has been set
  app.i18n.onLanguageSwitched = (oldLocale: string, newLocale: string) => {
    console.log(oldLocale, newLocale)
  }
}
