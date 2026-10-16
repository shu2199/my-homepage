export const readStoredValue = (key, fallback, isValid = () => true) => {
  try {
    const storedValue = localStorage.getItem(key)
    if (storedValue === null) return fallback

    const parsedValue = JSON.parse(storedValue)
    if (!isValid(parsedValue)) {
      console.error(`Saved ${key} data is invalid; using the default value.`)
      return fallback
    }
    return parsedValue
  } catch (error) {
    console.error(`Could not read saved ${key} data; using the default value.`, error)
    return fallback
  }
}

export const writeStoredValue = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Could not save ${key} data.`, error)
  }
}
