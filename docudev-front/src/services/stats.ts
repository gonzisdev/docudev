import { Stats } from 'models/Stats'
import customFetch from './customFetch'
import { endpoints } from './endpoints'

export const getUserStats = async () => {
	return await customFetch<Stats>(endpoints.stats)
}
