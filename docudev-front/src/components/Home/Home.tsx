import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Card from 'components/elements/Card/Card'
import './Home.css'

const Home = () => {
	return (
		<DashboardLayout>
			<div className='home-wrapper'>
				<Card className='center-content'>Home</Card>
			</div>
		</DashboardLayout>
	)
}

export default Home
