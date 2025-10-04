import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
	TEAMS_URL,
	TEAM_MANAGEMENT_URL,
	DOCUS_URL,
	HOME_URL,
	NOTIFICATIONS_URL
} from 'constants/routes'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from 'stores/authStore'
import { useSidebarStore } from 'stores/sidebarStore'
import useNotifications from 'hooks/useNotifications'
import DropdownMyAccount from 'components/elements/DropdownMyAccount/DropdownMyAccount'
import { GroupIcon, HomeIcon, BellIcon, DocsIcon, Logo, ManagementIcon } from 'assets/svgs'
import './DashboardLayout.css'

interface Props {
	children: React.ReactNode
}

const DashboardLayout = ({ children }: Props) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const location = useLocation()
	const pathname = location.pathname
	const { user, logout } = useAuthStore()
	const { collapsed, toggleSidebar } = useSidebarStore()

	const { notifications } = useNotifications({})
	const pendingCount = notifications?.filter((n) => n.status === 'pending').length || 0

	const routes = [
		{
			icon: <HomeIcon />,
			label: t('common.home'),
			routeLink: HOME_URL
		},
		{
			icon: <DocsIcon />,
			label: t('common.docus'),
			routeLink: DOCUS_URL
		},
		{
			icon: <GroupIcon />,
			label: t('common.teams'),
			routeLink: TEAMS_URL
		},
		{
			icon: <ManagementIcon />,
			label: t('common.management'),
			routeLink: TEAM_MANAGEMENT_URL
		},
		{
			icon: (
				<>
					<BellIcon />
					{pendingCount > 0 && <span className='notification-badge'></span>}
				</>
			),
			label: t('common.notifications'),
			routeLink: NOTIFICATIONS_URL
		}
	]

	const currentPath = pathname

	const handleLogout = () => {
		logout()
		localStorage.clear()
	}

	return (
		<div className='dashboard-layout'>
			<aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
				<header className='dashboard-sidebar-header'>
					<Logo className='dashboard-sidebar-logo' onClick={() => navigate(HOME_URL)} />
				</header>
				<nav className='dashboard-nav'>
					{routes.map((route, i) => (
						<Link
							to={route.routeLink}
							key={i}
							className={`nav-item ${route.routeLink.includes(currentPath) ? 'active' : ''}`}>
							<div className='nav-icon'>{route.icon}</div>
							<div className='nav-label'>{route.label}</div>
						</Link>
					))}
				</nav>
				<footer className='dashboard-sidebar-footer'>
					<DropdownMyAccount user={user!} logout={handleLogout} />
				</footer>
				<div className='sidebar-toggle' onClick={toggleSidebar}></div>
			</aside>
			<main className='dashboard-content'>
				<section className='content-children'>{children}</section>
				<footer className='footer'>&copy;{new Date().getFullYear()} DocuDev</footer>
			</main>
		</div>
	)
}

export default DashboardLayout
