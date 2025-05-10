import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from 'stores/authStore'
import { useStats } from 'hooks/useStats'
import { DOCU_URL } from 'constants/routes'
import { collaborationColors } from 'constants/colors'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Card from 'components/elements/Card/Card'
import Header from 'components/elements/Header/Header'
import Container from 'components/elements/Container/Container'
import Loading from 'components/elements/Loading/Loading'
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend
} from 'recharts'
import { formatDateWithTime } from 'utils/dates'
import './Home.css'

const Home = () => {
	const { t } = useTranslation()
	const { user } = useAuthStore()
	const { stats, isLoadingStats } = useStats()
	const navigate = useNavigate()

	const handleDocuClick = (docuId: string) => {
		navigate(`${DOCU_URL}/${docuId}`)
	}

	return (
		<DashboardLayout>
			{isLoadingStats ? (
				<Loading />
			) : (
				<>
					<Header title={`${t('home.welcome')}, ${user?.name}`} />
					<Container>
						<div className='home-stats'>
							<div className='stats-row stats-row-full'>
								<Card className='stats-card general-stats-card'>
									<h2 className='stats-title'>{t('home.generalStats')}</h2>
									<div className='general-stats'>
										<div className='stat-item'>
											<span className='stat-value'>{stats?.generalStats?.totalTeams}</span>
											<span className='stat-label'>{t('home.teams')}</span>
										</div>
										<div className='stat-item'>
											<span className='stat-value'>{stats?.generalStats?.totalDocus}</span>
											<span className='stat-label'>{t('home.documents')}</span>
										</div>
										<div className='stat-item'>
											<span className='stat-value'>{stats?.generalStats?.ownedDocus}</span>
											<span className='stat-label'>{t('home.ownedDocuments')}</span>
										</div>
										<div className='stat-item'>
											<span className='stat-value'>{stats?.generalStats?.teamDocus}</span>
											<span className='stat-label'>{t('home.teamDocuments')}</span>
										</div>
									</div>
								</Card>
							</div>
							<div className='stats-row stats-row-charts'>
								<Card className='stats-card chart-card'>
									<h2 className='stats-title'>{t('home.teamsWithMostMembers')}</h2>
									{stats?.teamsWithMostMembers?.length > 0 ? (
										<ResponsiveContainer width='100%' height={200}>
											<BarChart
												data={stats.teamsWithMostMembers}
												margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
												<XAxis
													dataKey='name'
													angle={-45}
													textAnchor='end'
													tick={{ fontSize: 12 }}
													height={40}
												/>
												<YAxis />
												<Tooltip
													formatter={(value) => [`${value} ${t('home.members')}`, '']}
													labelFormatter={(label) => `${label}`}
												/>
												<Bar dataKey='memberCount' name={t('home.members')} radius={[4, 4, 0, 0]}>
													{stats.teamsWithMostMembers.map((entry, index) => (
														<Cell key={`cell-${index}`} fill={entry.color} />
													))}
												</Bar>
											</BarChart>
										</ResponsiveContainer>
									) : (
										<p className='no-data-message'>{t('home.noData')}</p>
									)}
								</Card>
								<Card className='stats-card chart-card'>
									<h2 className='stats-title'>{t('home.teamsWithMostDocus')}</h2>
									{stats?.teamsWithMostDocus?.length > 0 ? (
										<ResponsiveContainer width='100%' height={200}>
											<BarChart
												data={stats.teamsWithMostDocus}
												margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
												<XAxis
													dataKey='name'
													angle={-45}
													textAnchor='end'
													tick={{ fontSize: 12 }}
													height={40}
												/>
												<YAxis />
												<Tooltip
													formatter={(value) => [`${value} ${t('home.documents')}`, '']}
													labelFormatter={(label) => `${label}`}
												/>
												<Bar dataKey='docuCount' name={t('home.documents')} radius={[4, 4, 0, 0]}>
													{stats.teamsWithMostDocus.map((entry, index) => (
														<Cell key={`cell-${index}`} fill={entry.color} />
													))}
												</Bar>
											</BarChart>
										</ResponsiveContainer>
									) : (
										<p className='no-data-message'>{t('home.noData')}</p>
									)}
								</Card>
								<Card className='stats-card chart-card'>
									<h2 className='stats-title'>{t('home.mostActiveUsers')}</h2>
									{stats?.mostActiveUsers?.length > 0 ? (
										<ResponsiveContainer width='100%' height={250}>
											<PieChart>
												<Pie
													data={stats.mostActiveUsers}
													cx='50%'
													cy='50%'
													labelLine={false}
													outerRadius={80}
													fill='#8884d8'
													dataKey='docuCount'
													label={({ name, surname, docuCount }) =>
														`${name} ${surname}: ${docuCount}`
													}>
													{stats.mostActiveUsers.map((entry, index) => (
														<Cell
															key={`cell-${index}`}
															fill={collaborationColors[index % collaborationColors.length]}
														/>
													))}
												</Pie>
												<Tooltip
													formatter={(value, name, props) => [
														`${value} ${t('home.documents')}`,
														`${props.payload.name} ${props.payload.surname}`
													]}
												/>
												<Legend
													formatter={(value, entry) => {
														const { payload } = entry
														return `${payload.name} ${payload.surname}`
													}}
												/>
											</PieChart>
										</ResponsiveContainer>
									) : (
										<p className='no-data-message'>{t('home.noData')}</p>
									)}
								</Card>
							</div>
							<div className='stats-row stats-row-docs'>
								<Card className='stats-card list-card'>
									<h2 className='stats-title'>{t('home.lastUpdatedDocus')}</h2>
									{stats?.lastUpdatedDocus?.length > 0 ? (
										<ul className='docu-list'>
											{stats.lastUpdatedDocus.map((docu) => (
												<li
													key={docu._id}
													className='docu-list-item'
													onClick={() => handleDocuClick(docu._id)}>
													<span className='docu-title'>{docu.title}</span>
													<div className='docu-meta'>
														{docu.team && typeof docu.team === 'object' && (
															<span className='team-tag' style={{ color: docu.team.color }}>
																{docu.team.name}
															</span>
														)}
														<span className='date-info'>
															{formatDateWithTime(new Date(docu.updatedAt))}
														</span>
													</div>
												</li>
											))}
										</ul>
									) : (
										<p className='no-data-message'>{t('home.noData')}</p>
									)}
								</Card>
								<Card className='stats-card list-card'>
									<h2 className='stats-title'>{t('home.lastCreatedDocus')}</h2>
									{stats?.lastCreatedDocus?.length > 0 ? (
										<ul className='docu-list'>
											{stats.lastCreatedDocus.map((docu) => (
												<li
													key={docu._id}
													className='docu-list-item'
													onClick={() => handleDocuClick(docu._id)}>
													<span className='docu-title'>{docu.title}</span>
													<div className='docu-meta'>
														{docu.team && typeof docu.team === 'object' && (
															<span className='team-tag' style={{ color: docu.team.color }}>
																{docu.team.name}
															</span>
														)}
														<span className='date-info'>
															{formatDateWithTime(new Date(docu.createdAt))}
														</span>
													</div>
												</li>
											))}
										</ul>
									) : (
										<p className='no-data-message'>{t('home.noData')}</p>
									)}
								</Card>
							</div>
						</div>
					</Container>
				</>
			)}
		</DashboardLayout>
	)
}

export default Home
