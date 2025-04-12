import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Card from 'components/elements/Card/Card'
import './CustomPage.css'

const CustomPage = () => {
	return (
		<DashboardLayout>
			<div className='custom-page-wrapper'>
				<Card className='center-content'>
					<p>
						This is a restrict page only visible by users with <strong>Admin role</strong>.
					</p>
					<p>
						There are 2 (two) "types" of routes and 4 (four) existing situations you can configure
						in App.js file:
					</p>
					<ul>
						<li>
							<strong>Public route:</strong> everybody can access this route;
						</li>
						<li>
							<strong>Public route (restricted):</strong> everybody can access this route, unless
							the user is logged in. In this case he will be redirected to his role main route (used
							to avoid accessing login and register routes when authenticated);
						</li>
						<li>
							<strong>Private route:</strong> only authenticated users can access this route;
						</li>
						<li>
							<strong>Private route (restricted):</strong> only authenticated and role allowed users
							can access this route.
						</li>
					</ul>
				</Card>
			</div>
		</DashboardLayout>
	)
}

export default CustomPage
