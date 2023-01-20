import env from '@/config/env'

const isDev = env.NEXT_PUBLIC_APP_ENV === 'development'

export default isDev
