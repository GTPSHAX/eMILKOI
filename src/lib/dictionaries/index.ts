export const dictionaries = {
  id: () => import('./id.json').then((module) => module.default),
  en: () => import('./en.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.id()
}