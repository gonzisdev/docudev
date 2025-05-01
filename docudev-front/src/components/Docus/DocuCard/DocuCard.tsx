import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DOCU_URL } from 'constants/routes'
import { Docu } from 'models/Docu'
import { Team } from 'models/Team'
import Card from 'components/elements/Card/Card'
import { formatDateWithTime } from 'utils/dates'
import { findTeamName } from 'utils/team'
import { TwoArrowsIcon } from 'assets/svgs'
import './DocuCard.css'

interface Props {
	docu: Docu
	teams?: Team[]
	teamName?: Team['name']
}

const DocuCard = ({ docu, teams, teamName }: Props) => {
	const { t } = useTranslation()
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
									<span className='team-tag'>
										{teamName ? teamName : teams ? findTeamName(teams, docu.team) : ''}
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
			<TwoArrowsIcon className='docu-card-swipe-hint' />
		</Card>
	)
}

export default DocuCard
