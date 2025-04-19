import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CREATE_DOCU_URL, EDIT_DOCU_URL } from 'constants/routes'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import useTeams from 'hooks/useTeams'
import useDocus from 'hooks/useDocus'
import Button from 'components/elements/Button/Button'
import Header from 'components/elements/Header/Header'
import Loading from 'components/elements/Loading/Loading'
import Card from 'components/elements/Card/Card'
import 'react-swipeable-list/dist/styles.css'
import './Docus.css'

const Docus = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { docus, isLoadingDocus } = useDocus()
	const { teams, isLoadingTeams } = useTeams()

	const findTeamName = (teamId: string) => {
		if (!teams) return ''
		const team = teams.find((team) => team._id === teamId)
		return team ? team.name : ''
	}

	return (
		<DashboardLayout>
			<div className='docus-header'>
				<Header title={t('docus.title')} />
				<Button
					variant='secondary'
					className='docus-create-button'
					onClick={() => navigate(CREATE_DOCU_URL)}
					//TODO: disabled={DOCS USER LIMIT}
				>
					{t('docus.create_docu')}
				</Button>
			</div>
			{isLoadingDocus || isLoadingTeams ? (
				<Loading />
			) : (
				<div className='docus-container'>
					<h2>{t('docus.subtitle')}</h2>
					{docus && docus.length > 0 ? (
						<div className='docus-list'>
							{docus.map((docu) => (
								<Card
									className='docu-card'
									onClick={() => navigate(`${EDIT_DOCU_URL}/${docu._id}`)}>
									<div className='docu-card-content'>
										<span className='docu-card-name'>{docu.title}</span>
										{docu.team && (
											<span className='docu-card-description'>{findTeamName(docu.team)}</span>
										)}
									</div>
								</Card>
							))}
						</div>
					) : (
						<Card empty>{t('docus.no_docus')}</Card>
					)}
				</div>
			)}
		</DashboardLayout>
	)
}

export default Docus
