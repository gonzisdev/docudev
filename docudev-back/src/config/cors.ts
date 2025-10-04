import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [process.env.FRONTEND_URL]

    if (process.argv[2] === '--api' || process.env.NODE_ENV === 'development') {
      callback(null, true)
      return
    }

    if (origin && whiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Error de CORS'))
    }
  },
  credentials: true
}

export const publicCorsConfig = {
  origin: true
}
