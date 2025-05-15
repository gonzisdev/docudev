import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, useMemo } from 'react'
import { Team } from 'models/Team'
import { Docu, GroupedDocus } from 'models/Docu'
import { useAuthStore } from 'stores/authStore'
import { useDocSidebarStore } from 'stores/docSidebarStore'
import { useUser } from 'hooks/useUser'
import DropdownMyAccount from 'components/elements/DropdownMyAccount/DropdownMyAccount'
import Loading from 'components/elements/Loading/Loading'
import Input from 'components/elements/Input/Input'
import { Logo, CaretDownIcon } from 'assets/svgs'
import './DocumentationLayout.css'

interface Props {
	children: React.ReactNode
	teams: Team[] | undefined
	docus: GroupedDocus
	expandedTeams: Record<string, boolean>
	toggleTeam: (teamId: Team['_id']) => void
	handleDocuClick: (docu: Docu) => void
	activeDocuId: Docu['_id'] | null
	isLoading: boolean
	noTeamExpanded: boolean
	toggleNoTeamExpanded: () => void
}

const DocumentationLayout = ({
	children,
	teams,
	docus,
	expandedTeams,
	toggleTeam,
	handleDocuClick,
	activeDocuId,
	isLoading,
	noTeamExpanded,
	toggleNoTeamExpanded
}: Props) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { user, logout } = useAuthStore()
	const { collapsed, toggleSidebar } = useDocSidebarStore()
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredDocus, setFilteredDocus] = useState<GroupedDocus>(docus)
	const [expandedTeamsFiltered, setExpandedTeamsFiltered] =
		useState<typeof expandedTeams>(expandedTeams)
	const [noTeamExpandedFiltered, setNoTeamExpandedFiltered] = useState(noTeamExpanded)

	useUser()

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
	}

	const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
		if (!highlight.trim()) {
			return <>{text}</>
		}
		const regex = new RegExp(`(${highlight.trim()})`, 'gi')
		const parts = text.split(regex)
		return <>{parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : part))}</>
	}

	const handleToggleTeam = (teamId: Team['_id']) => {
		setExpandedTeamsFiltered((prev) => ({
			...prev,
			[teamId]: !prev[teamId]
		}))
		toggleTeam(teamId)
	}
	const handleToggleNoTeam = () => {
		setNoTeamExpandedFiltered((prev) => !prev)
		toggleNoTeamExpanded()
	}

	const hasSearchResults = useMemo(() => {
		if (!searchTerm.trim()) return true
		const hasTeamResults = Object.values(filteredDocus.withTeam).some((docs) => docs.length > 0)
		const hasNoTeamResults = filteredDocus.withoutTeam.length > 0
		return hasTeamResults || hasNoTeamResults
	}, [filteredDocus, searchTerm])

	const handleLogout = () => {
		logout()
		localStorage.clear()
	}

	useEffect(() => {
		const term = searchTerm.toLowerCase().trim()
		const filtered: GroupedDocus = {
			withTeam: {},
			withoutTeam: docus.withoutTeam.filter((docu) => docu.title.toLowerCase().includes(term))
		}
		Object.entries(docus.withTeam).forEach(([teamId, docs]) => {
			const teamDocs = docs.filter((docu) => docu.title.toLowerCase().includes(term))
			if (teamDocs.length > 0) filtered.withTeam[teamId] = teamDocs
		})
		setFilteredDocus(filtered)
		if (term) {
			const newExpanded: typeof expandedTeamsFiltered = { ...expandedTeamsFiltered }
			Object.keys(filtered.withTeam).forEach((teamId) => {
				newExpanded[teamId] = true
			})
			setExpandedTeamsFiltered(newExpanded)
			setNoTeamExpandedFiltered(filtered.withoutTeam.length > 0)
		}
	}, [searchTerm, docus, expandedTeamsFiltered])

	return (
		<div className='documentation-layout'>
			<aside className={`documentation-sidebar ${collapsed ? 'collapsed' : ''}`}>
				<header className='documentation-sidebar-header'>
					<Logo className='documentation-sidebar-logo' onClick={() => navigate('/')} />
				</header>
				{isLoading ? (
					<Loading />
				) : (
					<div className='sidebar-content'>
						<div className={`sidebar-search ${collapsed ? 'collapsed' : ''}`}>
							<div className='search-input-container'>
								<Input
									onChange={handleSearchChange}
									id='search'
									type='text'
									placeholder={t('documentation.search_placeholder')}
									value={searchTerm}
								/>
								{searchTerm && (
									<div
										className='select__indicator select__clear-indicator'
										onClick={() => setSearchTerm('')}>
										<svg
											height='20'
											width='20'
											viewBox='0 0 20 20'
											aria-hidden='true'
											focusable='false'
											className='css-tj5bde-Svg'>
											<path
												d='M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z'
												fill='currentColor'></path>
										</svg>
									</div>
								)}
							</div>
						</div>
						<nav className='documentation-nav'>
							{!hasSearchResults && searchTerm && (
								<div className='no-search-results'>{t('documentation.no_search_results')}</div>
							)}
							{(Object.keys(filteredDocus.withTeam).length > 0 || !searchTerm) && (
								<div className='nav-section'>
									<h3 className={`nav-section-title ${collapsed ? 'collapsed' : ''}`}>
										{t('documentation.teams')}
									</h3>
									<ul className='team-list'>
										{teams &&
											teams.map((team) => {
												if (searchTerm && !filteredDocus.withTeam[team._id]) return null
												return (
													<li key={team._id} className='team-item'>
														<div
															className={`team-header ${expandedTeamsFiltered[team._id] ? 'expanded' : ''}`}
															onClick={() => handleToggleTeam(team._id)}
															style={{ borderColor: team.color }}>
															<span className='team-expand-icon'>
																<CaretDownIcon
																	className={!expandedTeamsFiltered[team._id] ? 'collapsed' : ''}
																/>
															</span>
															<span
																className={`team-name ${collapsed ? 'collapsed' : ''}`}
																style={{ color: team.color }}>
																{team.name}
															</span>
															<span className='team-docs-count'>
																{(filteredDocus.withTeam[team._id] || []).length}
															</span>
														</div>
														{expandedTeamsFiltered[team._id] && !collapsed && (
															<ul className='docu-list'>
																{filteredDocus.withTeam[team._id]?.map((docu) => (
																	<li
																		key={docu._id}
																		className={`docu-item ${activeDocuId === docu._id ? 'active' : ''}`}
																		onClick={() => handleDocuClick(docu)}>
																		{searchTerm ? (
																			<HighlightText text={docu.title} highlight={searchTerm} />
																		) : (
																			docu.title
																		)}
																	</li>
																))}
																{filteredDocus.withTeam[team._id]?.length === 0 && (
																	<li className='no-docs-message'>
																		{t('documentation.no_documents')}
																	</li>
																)}
															</ul>
														)}
													</li>
												)
											})}
									</ul>
								</div>
							)}
							{(filteredDocus.withoutTeam.length > 0 || !searchTerm) && (
								<div className='nav-section'>
									<div
										className={`team-header no-team-header ${noTeamExpandedFiltered ? 'expanded' : ''}`}
										onClick={handleToggleNoTeam}>
										<span className='team-expand-icon'>
											<CaretDownIcon className={!noTeamExpandedFiltered ? 'collapsed' : ''} />
										</span>
										<span className={`team-name ${collapsed ? 'collapsed' : ''}`}>
											{t('documentation.no_team_docs')}
										</span>
										<span className='team-docs-count'>{filteredDocus.withoutTeam.length}</span>
									</div>
									{noTeamExpandedFiltered && !collapsed && (
										<ul className='docu-list'>
											{filteredDocus.withoutTeam.map((docu) => (
												<li
													key={docu._id}
													className={`docu-item ${activeDocuId === docu._id ? 'active' : ''}`}
													onClick={() => handleDocuClick(docu)}>
													{searchTerm ? (
														<HighlightText text={docu.title} highlight={searchTerm} />
													) : (
														docu.title
													)}
												</li>
											))}
											{filteredDocus.withoutTeam.length === 0 && (
												<li className='no-docs-message'>
													{t('documentation.no_documents_without_team')}
												</li>
											)}
										</ul>
									)}
								</div>
							)}
						</nav>
					</div>
				)}
				<footer className='documentation-sidebar-footer'>
					<DropdownMyAccount user={user!} logout={handleLogout} />
				</footer>
				<div className='sidebar-toggle' onClick={toggleSidebar}></div>
			</aside>
			<main className='documentation-content'>
				<section className='content-children'>{children}</section>
				<footer className='footer'>&copy;{new Date().getFullYear()} DocuDev</footer>
			</main>
		</div>
	)
}

export default DocumentationLayout
