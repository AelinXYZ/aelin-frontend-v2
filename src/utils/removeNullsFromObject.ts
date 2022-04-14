export default function removeNullsFromObject(obj: any): any {
  if (obj === null) {
    return undefined
  }
  if (typeof obj === 'object') {
    for (const key in obj) {
      obj[key] = removeNullsFromObject(obj[key])
    }
  }
  return obj
}
