import { useNavigate } from 'react-router-dom'
import { TEAM_URL } from 'constants/routes'
import { Team } from 'models/Team'
import Card from 'components/elements/Card/Card'
import { TwoArrowsIcon } from 'assets/svgs'
import './TeamCard.css'

interface Props {
	team: Team
	isAdmin?: boolean
}

const TeamCard = ({ team, isAdmin }: Props) => {
	const navigate = useNavigate()
	return (
		<Card className='team-card'>
			<div className='team-card-content'>
				<span
					className='team-card-name'
					onClick={() => navigate(`${TEAM_URL}/${team._id}`)}
					style={{ color: team.color }}>
					{team.name}
				</span>
				<span className='team-card-description'>{team.description}</span>
			</div>
			{isAdmin && <TwoArrowsIcon className='team-card-swipe-hint' />}
		</Card>
	)
}

export default TeamCard
