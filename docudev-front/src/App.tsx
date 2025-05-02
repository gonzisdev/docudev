import { ReactNode } from 'react'
import { Route, Routes, Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import {
	BASE_URL,
	CREATE_DOCU_URL,
	DOCU_URL,
	DOCUS_URL,
	EDIT_DOCU_URL,
	FORGOT_PASSWORD_URL,
	HOME_URL,
	LOGIN_URL,
	MANAGEMENT_URL,
	NOTIFICATIONS_URL,
	RECOVER_PASSWORD_URL,
	REGISTER_URL,
	SETTINGS_URL,
	TEAM_URL,
	TEAMS_URL
} from './constants/routes'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import ForgotPassword from './components/ForgotPassword/ForgotPassword'
import RecoverPassword from './components/RecoverPassword/RecoverPassword'
import Home from './components/Home/Home'
import Docus from './components/Docus/Docus'
import Docu from 'components/Docus/Docu/Docu'
import DocuEditor from 'components/Docus/DocuEditor/DocuEditor'
import Teams from './components/Teams/Teams'
import Team from 'components/Teams/Team/Team'
import Events from './components/Events/Events'
import Notifications from 'components/Notifications/Notifications'
import { Settings } from 'components/Settings/Settings'
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
					<Route path={BASE_URL} element={<Login />} /> {/* //TODO: LANDING PAGE */}
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
					{/* Docus routes */}
					<Route path={`${DOCU_URL}/:docuId`} element={<Docu />} />
					<Route path={DOCUS_URL} element={<Docus />} />
					<Route path={CREATE_DOCU_URL} element={<DocuEditor />} />
					<Route path={`${EDIT_DOCU_URL}/:docuId`} element={<DocuEditor />} />
					{/* Teams routes */}
					<Route path={TEAMS_URL} element={<Teams />} />
					<Route path={`${TEAM_URL}/:teamId`} element={<Team />} />
					{/* Team management routes */}
					<Route path={MANAGEMENT_URL} element={<Events />} />
					{/* Notification routes */}
					<Route path={NOTIFICATIONS_URL} element={<Notifications />} />

					<Route path={SETTINGS_URL} element={<Settings />} />
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
