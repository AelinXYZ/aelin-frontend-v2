import env from '@/config/env'

const isProd = env.NEXT_PUBLIC_APP_ENV === 'production'

export default isProd
