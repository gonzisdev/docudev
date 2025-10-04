import { Route, Routes, Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import useAuthInit from 'hooks/useAuthInit'
import {
	BASE_URL,
	CREATE_DOCU_URL,
	DOCU_URL,
	DOCUS_URL,
	EDIT_DOCU_URL,
	FORGOT_PASSWORD_URL,
	HOME_URL,
	LOGIN_URL,
	TEAM_MANAGEMENT_URL,
	NOTIFICATIONS_URL,
	RECOVER_PASSWORD_URL,
	REGISTER_URL,
	SETTINGS_URL,
	TEAM_URL,
	TEAMS_URL,
	DOCUMENTATION_URL
} from './constants/routes'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import ForgotPassword from './components/ForgotPassword/ForgotPassword'
import RecoverPassword from './components/RecoverPassword/RecoverPassword'
import Home from './components/Home/Home'
import Documentation from 'components/Documentation/Documentation'
import Docus from './components/Docus/Docus'
import Docu from 'components/Docus/Docu/Docu'
import DocuEditor from 'components/Docus/DocuEditor/DocuEditor'
import Teams from './components/Teams/Teams'
import Team from 'components/Teams/Team/Team'
import TeamManagement from './components/TeamManagement/TeamManagement'
import Notifications from 'components/Notifications/Notifications'
import Settings from 'components/Settings/Settings'
import { Toaster } from 'sonner'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const user = useAuthStore((state) => state.user)
	const location = useLocation()
	if (!user) return <Navigate to='/login' state={{ from: location }} replace />
	return <>{children}</>
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
	const user = useAuthStore((state) => state.user)
	const location = useLocation()
	if (user) return <Navigate to='/home' state={{ from: location }} replace />
	return <>{children}</>
}

export const App = () => {
	useAuthInit()
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
					{/* Documentation */}
					<Route path={DOCUMENTATION_URL} element={<Documentation />} />
					<Route path={`${DOCUMENTATION_URL}/:docuId`} element={<Documentation />} />
					{/* Docus routes */}
					<Route path={`${DOCU_URL}/:docuId`} element={<Docu />} />
					<Route path={DOCUS_URL} element={<Docus />} />
					<Route path={CREATE_DOCU_URL} element={<DocuEditor />} />
					<Route path={`${EDIT_DOCU_URL}/:docuId`} element={<DocuEditor />} />
					{/* Teams routes */}
					<Route path={TEAMS_URL} element={<Teams />} />
					<Route path={`${TEAM_URL}/:teamId`} element={<Team />} />
					{/* Team management routes */}
					<Route path={TEAM_MANAGEMENT_URL} element={<TeamManagement />} />
					{/* Notification routes */}
					<Route path={NOTIFICATIONS_URL} element={<Notifications />} />
					{/* Settings route */}
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
