import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from 'stores/authStore'
import { DOCU_URL, TEAM_URL } from 'constants/routes'
import { Docu } from 'models/Docu'
import Card from 'components/elements/Card/Card'
import { formatDateWithTime } from 'utils/dates'
import { TwoArrowsIcon } from 'assets/svgs'
import './DocuCard.css'

interface Props {
	docu: Docu
}

const DocuCard = ({ docu }: Props) => {
	const { t } = useTranslation()
	const { user } = useAuthStore()
	const navigate = useNavigate()

	return (
		<Card className='docu-card'>
			<div className='docu-card-content'>
				<span className='docu-card-name' onClick={() => navigate(`${DOCU_URL}/${docu._id}`)}>
					{docu.title}
				</span>
				<div className='docu-card-details'>
					<div className='docu-card-info'>
						<div className='docu-card-left'>
							<span>
								<span>{t('docus.owner')}:</span> {docu.owner.name} {docu.owner.surname}
							</span>
							{docu.team && (
								<span>
									<span>{t('docus.team')}:</span>{' '}
									<span
										className='team-name'
										onClick={() =>
											typeof docu.team === 'object' &&
											'_id' in docu.team &&
											navigate(`${TEAM_URL}/${docu.team._id}`)
										}
										style={{
											color: typeof docu.team === 'object' ? docu.team.color : undefined
										}}>
										{typeof docu.team === 'object' && docu.team.name}
									</span>
								</span>
							)}
						</div>
						<div className='docu-card-right'>
							<span>
								<span>{t('docus.created')}:</span> {formatDateWithTime(docu.createdAt)}
							</span>
							<span>
								<span>{t('docus.updated')}:</span> {formatDateWithTime(docu.updatedAt)}
							</span>
						</div>
					</div>
				</div>
			</div>
			<TwoArrowsIcon
				className={`docu-card-swipe-hint ${docu.owner._id !== user?._id ? 'disabled' : ''}`}
			/>
		</Card>
	)
}

export default DocuCard
