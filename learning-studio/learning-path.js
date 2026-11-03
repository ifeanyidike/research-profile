// Optional refreshers remain addressable without counting as required progress.
export const mainTopics = (modules) => modules.filter((module) => !module.optional);
export const refresherTopics = (modules) => modules.filter((module) => module.optional);
