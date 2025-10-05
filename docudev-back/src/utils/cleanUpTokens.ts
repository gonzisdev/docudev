import cron from 'node-cron'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import colors from 'colors'

export function startTokenCleanupJob() {
  cron.schedule('0 3 * * *', async () => {
    try {
      const startTime = Date.now()

      const users = await User.find({
        refreshTokens: { $exists: true, $ne: [] }
      })

      let totalUsersProcessed = 0
      let totalTokensCleaned = 0

      for (const user of users) {
        const initialTokenCount = user.refreshTokens.length

        const validTokens = user.refreshTokens.filter((token) => {
          try {
            jwt.verify(token, process.env.JWT_REFRESH_SECRET!)
            return true
          } catch (error) {
            return false
          }
        })

        if (validTokens.length !== initialTokenCount) {
          user.refreshTokens = validTokens
          await user.save()

          const cleaned = initialTokenCount - validTokens.length
          totalTokensCleaned += cleaned
          totalUsersProcessed++
        }
      }

      const duration = Date.now() - startTime

      console.log(
        colors.bold(`Token Cleanup Completed in ${duration}ms: `) +
          colors.bold.green(
            `${totalTokensCleaned} tokens removed from ${totalUsersProcessed} users`
          )
      )
    } catch (error) {
      console.log(colors.bold.red(`Error during token cleanup: ${error}`))
    }
  })

  console.log(
    colors.bold.yellow('Token cleanup job scheduled (daily at 3:00 AM)')
  )
}
