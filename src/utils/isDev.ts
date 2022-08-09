const isDev =
  process.env.NEXT_PUBLIC_APP_ENV === 'development' &&
  process.env.NEXT_PUBLIC_APP_ENV_PROD_TEST !== 'true'

export default isDev
