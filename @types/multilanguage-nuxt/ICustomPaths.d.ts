export default interface CustomPaths {
    [nuxtPath: string]: ICustomPath
}

interface ICustomPath {
    [locale: string]: string
}