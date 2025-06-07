import cron from 'node-cron'
import User from '../models/User'
import colors from 'colors'

export const startUserInactivityJob = () => {
  cron.schedule('0 3 * * *', async () => {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - +process.env.INACTIVITY_DAYS)

      const result = await User.updateMany(
        {
          lastActivity: { $lt: cutoffDate },
          status: 'active'
        },
        {
          status: 'inactive'
        }
      )

      if (result.modifiedCount > 0) {
        console.log(
          colors.bold.green(
            `Marked ${result.modifiedCount} users as inactive after ${process.env.INACTIVITY_DAYS} days of inactivity`
          )
        )
      } else {
        console.log(colors.bold.red('No users marked as inactive'))
      }
    } catch (error) {
      console.log(colors.bold.red('Error in user inactivity job:'), error)
    }
  })

  console.log(
    colors.bold.yellow(
      `User inactivity job scheduled (daily at 3:00 AM, ${process.env.INACTIVITY_DAYS} days threshold)`
    )
  )
}
