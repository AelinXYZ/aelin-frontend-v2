// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const { constantCase, pascalCase } = require('change-case-all')

const IGNORE = ['poolName']

function IgnoreNames(str) {
  if (IGNORE.includes(str)) {
    return constantCase(str) || str
  }

  const result = pascalCase(str)
  // If result is an empty string, just return the original string
  return result || str
}
module.exports = IgnoreNames
