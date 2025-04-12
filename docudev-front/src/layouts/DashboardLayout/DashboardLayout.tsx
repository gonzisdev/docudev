import { TEAMS_URL, MANAGEMENT_URL, DOCUS_URL, HOME_URL } from 'constants/routes'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { DocsIcon, Logo, ManagementIcon } from 'assets/svgs'
import DropdownMyAccount from 'components/elements/DropdownMyAccount/DropdownMyAccount'
import { GroupIcon, HomeIcon } from 'assets/svgs'
import { useAuthStore } from 'stores/authStore'
import './DashboardLayout.css'
import { useSidebarStore } from 'stores/sidebarStore'

interface Props {
	children: React.ReactNode
}

const DashboardLayout = ({ children }: Props) => {
	const { t } = useTranslation()
	const location = useLocation()
	const pathname = location.pathname
	const { user, logout } = useAuthStore()
	const { collapsed, toggleSidebar } = useSidebarStore()

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
			routeLink: MANAGEMENT_URL
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
					<Logo className='dashboard-sidebar-logo' />
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
			</main>
		</div>
	)
}

export default DashboardLayout
