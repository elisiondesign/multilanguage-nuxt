import appPages from './pages'

const DirectusSDK = require('@directus/sdk-js')

const api = new DirectusSDK({
  url: 'https://api.elisiondesign.cz/',
  project: 'elision'
})

async function getEntrieforEachLanguage(tableName) {
  const output = {}

  await api.getItems(tableName, { fields: '*.*' })
    .then(res => res.data.forEach((entry) => {
      entry.translations.forEach((language) => {
        if (output[language.language_code] === undefined) output[language.language_code] = [language.slug]
        else output[language.language_code].push(language.slug)
      })
    }))

  return output
}

export default async function getAppRoutes() {
  const availableLanguages = await api.getItems('languages').then(res => res.data.map(language => language.id))
  const members = await api.getItems('team_members').then(res => res.data.map(member => member.short_name))
  const projects = await api.getItems('projects').then(res => res.data.map(project => project.url))
  const blogPosts = await getEntrieforEachLanguage('blog')
  const services = await getEntrieforEachLanguage('services')

  const routes = []

  for (let i = 0; i < availableLanguages.length; i += 1) {
    const language = availableLanguages[i]

    Object.entries(appPages).forEach((pageEntry) => {
      const nuxtPath = pageEntry[0]
      const pathTranslations = pageEntry[1]

      const routePath = language + pathTranslations[language]

      // Add only language (without '/' at the end) for index page
      if (nuxtPath === 'index') {
        routes.push(language)
      } else if (nuxtPath.includes('team/_')) {
        for (let index = 0; index < members.length; index += 1) {
          routes.push(routePath.replace(/:name\?/, members[index]))
        }
      } else if (nuxtPath.includes('blog/_')) {
        for (let postIndex = 0; postIndex < blogPosts[language].length; postIndex += 1) {
          routes.push(routePath.replace(/:title\?/, blogPosts[language][postIndex]))
        }
      } else if (nuxtPath.includes('services/_')) {
        for (let serviceIndex = 0; serviceIndex < services[language].length; serviceIndex += 1) {
          routes.push(routePath.replace(/:name\?/, services[language][serviceIndex]))
        }
      } else if (nuxtPath.includes('projects/_')) {
        for (let projectIndex = 0; projectIndex < projects.length; projectIndex += 1) {
          routes.push(routePath.replace(/:name\?/, projects[projectIndex]))
        }
      } else {
        routes.push(routePath)
      }
    })
  }

  return routes
}
