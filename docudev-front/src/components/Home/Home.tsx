import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from 'stores/authStore'
import { DOCUMENTATION_URL } from 'constants/routes'
import { useStats } from 'hooks/useStats'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Card from 'components/elements/Card/Card'
import Header from 'components/elements/Header/Header'
import Container from 'components/elements/Container/Container'
import Loading from 'components/elements/Loading/Loading'
import TeamMembersChart from './Charts/TeamMembersChart'
import TeamDocusChart from './Charts/TeamDocusChart'
import ActiveUsersChart from './Charts/ActiveUsersChart'
import ListCard from './ListCard/ListCard'
import './Home.css'
import Button from 'components/elements/Button/Button'

const Home = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { user } = useAuthStore()
	const { stats, isLoadingStats } = useStats()

	return (
		<DashboardLayout>
			{isLoadingStats ? (
				<Loading />
			) : (
				<>
					<Header title={`${t('home.welcome')}, ${user?.name}`}>
						<Button variant='link' onClick={() => navigate(DOCUMENTATION_URL)}>
							→ {t('home.documentation')}
						</Button>
					</Header>
					<Container>
						<div className='home-stats'>
							<div className='stats-row'>
								<Card className='stats-card'>
									<h3 className='stats-title'>{t('home.general_stats')}</h3>
									<div className='general-stats'>
										<div className='stat-item'>
											<span className='stat-value'>{stats?.generalStats?.totalTeams || 0}</span>
											<span className='stat-label'>{t('home.teams')}</span>
										</div>
										<div className='stat-item'>
											<span className='stat-value'>{stats?.generalStats?.totalDocus || 0}</span>
											<span className='stat-label'>{t('home.documents')}</span>
										</div>
										<div className='stat-item'>
											<span className='stat-value'>{stats?.generalStats?.ownedDocus || 0} </span>
											<span className='stat-label'>{t('home.owned_documents')}</span>
										</div>
										<div className='stat-item'>
											<span className='stat-value'>{stats?.generalStats?.teamDocus || 0}</span>
											<span className='stat-label'>{t('home.team_documents')}</span>
										</div>
									</div>
								</Card>
							</div>
							<div className='stats-row stats-row-charts'>
								<TeamMembersChart teams={stats?.teamsWithMostMembers || []} />
								<TeamDocusChart teams={stats?.teamsWithMostDocus || []} />
								<ActiveUsersChart users={stats?.mostActiveUsers || []} />
							</div>
							<div className='stats-row'>
								<ListCard
									title={t('home.last_created_docus')}
									docus={stats?.lastCreatedDocus}
									dateField='createdAt'
								/>
								<ListCard
									title={t('home.last_updated_docus')}
									docus={stats?.lastUpdatedDocus}
									dateField='updatedAt'
								/>
								<ListCard
									title={t('home.most_viewed_docus')}
									docus={stats?.mostViewedDocus}
									dateField='views'
									showViews
								/>
							</div>
						</div>
					</Container>
				</>
			)}
		</DashboardLayout>
	)
}

export default Home
