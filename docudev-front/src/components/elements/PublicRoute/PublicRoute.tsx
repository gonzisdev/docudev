import { ADMIN_CUSTOM_PAGE_URL, HOME_URL } from 'constants/routes'
import { UserRoles } from 'models/User'
import { Navigate } from 'react-router-dom'
import { useUserStore } from 'stores/useUserStore'

type PublicRouteProps = {
	component: React.ComponentType
	restricted?: boolean
}

const PublicRoute = ({ component: Component, restricted = false }: PublicRouteProps) => {
	const userStore = useUserStore()
	const currentUser = userStore.currentUser
	const isLogged = Object.keys(currentUser).length > 0
	const roleRoute = currentUser.role === UserRoles.Admin ? ADMIN_CUSTOM_PAGE_URL : HOME_URL
	return isLogged && restricted ? <Navigate to={roleRoute} /> : <Component />
}

export default PublicRoute
