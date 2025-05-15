import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Docu } from 'models/Docu'
import { DOCU_URL } from 'constants/routes'
import Card from 'components/elements/Card/Card'
import { formatDateWithTime } from 'utils/dates'
import { EyeIcon } from 'assets/svgs'
import './ListCard.css'

interface Props {
	title: string
	docus?: Docu[]
	dateField: 'createdAt' | 'updatedAt' | 'views'
	showViews?: boolean
}

const ListCard = ({ title, docus = [], dateField, showViews = false }: Props) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	return (
		<Card className='stats-card list-card'>
			<h3 className='stats-title'>{title}</h3>
			{docus.length > 0 ? (
				<ul className='list'>
					{docus.map((docu) => (
						<li
							key={docu._id}
							className='list-item'
							onClick={() => navigate(`${DOCU_URL}/${docu._id}`)}>
							<div className='list-card-content'>
								<span className='list-card-name'>{docu.title}</span>
								<div className='list-card-details'>
									<div className='list-card-info'>
										<div className='list-card-left'>
											{docu.team && typeof docu.team === 'object' && (
												<span>
													{t('home.team')}:{' '}
													<span className='team-name' style={{ color: docu.team.color }}>
														{docu.team.name}
													</span>
												</span>
											)}
										</div>
										<div className='list-card-right'>
											{showViews ? (
												<span
													className='views-info'
													style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
													<EyeIcon width={16} height={16} />
													<span>{docu.views}</span>
												</span>
											) : (
												<span className='date-info'>
													{formatDateWithTime(new Date(docu[dateField]))}
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						</li>
					))}
				</ul>
			) : (
				<Card empty>{t('home.no_data')}</Card>
			)}
		</Card>
	)
}

export default ListCard
