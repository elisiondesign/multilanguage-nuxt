import { IVueI18n } from "vue-i18n";
import { Context } from "vue/types/options";

export default function ({ app }: Context) {
    // beforeLanguageSwitch called right before setting a new locale
    app.$i18n.beforeLanguageSwitch = (oldLocale, newLocale) => {
      console.log(oldLocale, newLocale)
    }
    // onLanguageSwitched called right after a new locale has been set
    app.$i18n.onLanguageSwitched = (oldLocale, newLocale) => {
      console.log(oldLocale, newLocale)
    }
  }