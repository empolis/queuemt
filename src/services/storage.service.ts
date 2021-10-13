export class StorageService {
  private static get (key: string): string | undefined {
    const value = localStorage.getItem(key)

    if (!value) {
      return undefined
    }

    return value
  }

  static getAs<T> (key: string): T | undefined {
    const value = this.get(key)

    if (!value) {
      return undefined
    }

    // try to parse the value as JSON and return
    // an object of type T, if parsing fails,
    // return the value as type T
    try {
      return JSON.parse(value) as T
    } catch (err) {
      return (value as any) as T
    }
  }

  static set (key: string, value: any) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value)
    }

    localStorage.setItem(key, value)
  }
}
