export default interface Sitemap {
    source: string | Function | undefined,
    url: string | undefined, // <-- is public and read-only, no bearer token required
    project: string | undefined,
    mappings: Array<SitemapMapping>
}

export interface SitemapMapping {
    nuxtPage: string, // app page, relates to first level nuxt page
    dynamicRoute: string, // the dynamic part (as defined in pages.js
    table: string, // table name in directus
    field: string, // Translated field to be included in the sitemap
    outer: boolean | undefined
}