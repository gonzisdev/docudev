import { useTranslation } from 'react-i18next'
import {
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	Radar,
	Tooltip,
	ResponsiveContainer
} from 'recharts'
import { ActiveUser } from 'models/Stats'
import { colors } from 'constants/colors'
import Card from 'components/elements/Card/Card'

interface Props {
	users: ActiveUser[]
}

const ActiveUsersChart = ({ users }: Props) => {
	const { t } = useTranslation()

	return (
		<Card className='stats-card'>
			<h3 className='stats-title'>{t('home.most_active_users')}</h3>
			{users.length > 0 ? (
				<ResponsiveContainer width='100%' height={250}>
					<RadarChart outerRadius={90} data={users}>
						<PolarGrid gridType='polygon' stroke='rgba(255,255,255,0.1)' />
						<PolarAngleAxis
							dataKey={(entry) => `${entry.name} ${entry.surname}`}
							tick={{ fill: colors.neutralNeutral20, fontSize: 11 }}
						/>
						<Radar
							name={t('home.documents')}
							dataKey='docuCount'
							stroke={colors.secondary}
							fill={colors.primaryLight}
							activeDot={{ r: 3, strokeWidth: 1 }}
						/>
						<Tooltip
							labelFormatter={(label) => label}
							formatter={(value) => [`${value}`, t('home.documents')]}
						/>
					</RadarChart>
				</ResponsiveContainer>
			) : (
				<Card empty>{t('home.no_data')}</Card>
			)}
		</Card>
	)
}

export default ActiveUsersChart
