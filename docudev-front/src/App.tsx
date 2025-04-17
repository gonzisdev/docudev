import { ReactNode } from 'react'
import { Route, Routes, Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import {
	BASE_URL,
	DOCUS_URL,
	FORGOT_PASSWORD_URL,
	HOME_URL,
	LOGIN_URL,
	MANAGEMENT_URL,
	RECOVER_PASSWORD_URL,
	REGISTER_URL,
	TEAMS_URL
} from './constants/routes'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import RecoverPassword from './components/RecoverPassword/RecoverPassword'
import Home from './components/Home/Home'
import Events from './components/Events/Events'
import Forms from './components/Forms/Forms'
import CustomPage from './components/Teams/Teams'
import ForgotPassword from './components/ForgotPassword/ForgotPassword'
import { Toaster } from 'sonner'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
	const location = useLocation()
	if (!isAuthenticated) return <Navigate to='/login' state={{ from: location }} replace />
	return children
}

const PublicRoute = ({ children }: { children: ReactNode }) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
	const location = useLocation()
	if (isAuthenticated) return <Navigate to='/home' state={{ from: location }} replace />
	return children
}

export const App = () => {
	return (
		<>
			<Routes>
				{/* Public routes */}
				<Route
					element={
						<PublicRoute>
							<Outlet />
						</PublicRoute>
					}>
					<Route path={BASE_URL} element={<Login />} />
					<Route path={LOGIN_URL} element={<Login />} />
					<Route path={REGISTER_URL} element={<Register />} />
					<Route path={FORGOT_PASSWORD_URL} element={<ForgotPassword />} />
					<Route path={RECOVER_PASSWORD_URL} element={<RecoverPassword />} />
				</Route>

				{/* Protected routes */}
				<Route
					element={
						<ProtectedRoute>
							<Outlet />
						</ProtectedRoute>
					}>
					<Route path={HOME_URL} element={<Home />} />
					<Route path={DOCUS_URL} element={<Forms />} />
					<Route path={TEAMS_URL} element={<CustomPage />} />
					<Route path={MANAGEMENT_URL} element={<Events />} />
				</Route>

				{/* //TODO: */}
				<Route path='*' element={<Navigate to={LOGIN_URL} />} />
			</Routes>

			<Toaster
				toastOptions={{
					classNames: {
						success: 'toast-success',
						error: 'toast-error'
					}
				}}
				icons={{
					success: null,
					error: null
				}}
			/>
		</>
	)
}
