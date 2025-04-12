import { LOGIN_URL } from 'constants/routes'
import { UserRoles } from 'models/User'
import { Navigate } from 'react-router-dom'
import { useUserStore } from 'stores/useUserStore'

type PrivateRouteProps = {
	component: React.ComponentType
	roles?: Array<keyof typeof UserRoles>
}

const PrivateRoute = ({ component: Component, roles, ...rest }: PrivateRouteProps) => {
	const userStore = useUserStore()
	const currentUser = userStore.currentUser
	const isLogged = Object.keys(currentUser).length > 0
	const roleMatch = roles ? roles?.includes(currentUser.role) : true

	return isLogged && roleMatch ? <Component {...rest} /> : <Navigate to={LOGIN_URL} />
}

export default PrivateRoute
