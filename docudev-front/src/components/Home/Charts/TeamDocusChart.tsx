import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TeamWithDocuCount } from 'models/Stats'
import Card from 'components/elements/Card/Card'

interface Props {
	teams: TeamWithDocuCount[]
}

const TeamDocusChart = ({ teams }: Props) => {
	const { t } = useTranslation()

	return (
		<Card className='stats-card'>
			<h3 className='stats-title'>{t('home.teams_with_most_docus')}</h3>
			{teams.length > 0 ? (
				<ResponsiveContainer width='100%' height={250}>
					<BarChart data={teams} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
						<XAxis
							dataKey='name'
							angle={-45}
							textAnchor='end'
							tick={{ fontSize: 12 }}
							height={40}
						/>
						<YAxis />
						<Tooltip labelFormatter={(label) => `${label}`} />
						<Bar dataKey='docuCount' name={t('home.documents')} radius={[4, 4, 0, 0]}>
							{teams.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			) : (
				<Card empty>{t('home.no_data')}</Card>
			)}
		</Card>
	)
}

export default TeamDocusChart
