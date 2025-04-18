import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CREATE_DOCU_URL } from 'constants/routes'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Button from 'components/elements/Button/Button'
import Header from 'components/elements/Header/Header'
import './Docus.css'

const Docus = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	return (
		<DashboardLayout>
			<div className='docus-header'>
				<Header title={t('docus.title')} />
				<Button
					variant='secondary'
					className='teams-create-button'
					onClick={() => navigate(CREATE_DOCU_URL)}
					//TODO: disabled={DOCS USER LIMIT}
				>
					{t('docus.create_docu')}
				</Button>
			</div>
			<div className='docus-container'>
				<h2>{t('docus.subtitle')}</h2>
			</div>
		</DashboardLayout>
	)
}

export default Docus
