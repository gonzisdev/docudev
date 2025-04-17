import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Card from 'components/elements/Card/Card'
import './Home.css'

const Home = () => {
	return (
		<DashboardLayout>
			<div className='home-wrapper'>
				<Card className='center-content'>
					<h1>Welcome to PTG React Dashboard Boilerplate</h1>
					<p>This boilerplate includes the following features:</p>
					<ul>
						<li>PostCSS integrated</li>
						<li>Layouts components (AuthLayout and DashboardLayout)</li>
						<li>
							Common components: button with lots of options already integrated and simple card
							example
						</li>
						<li>Login view and logic</li>
						<li>Register view and logic</li>
						<li>
							Routing auth workflow as suggested by react-router documentation (
							<a
								href='https://reactrouter.com/web/example/auth-workflow'
								target='_blank'
								rel='noopener noreferrer'>
								https://reactrouter.com/web/example/auth-workflow
							</a>
							)
						</li>
						<li>UI global state: Zustand</li>
						<li>Server global state: Tanstack Query (React Query)</li>
						<li>Use Tanstack Query for data fetching</li>
						<li>
							React hook form, Zod and an Input with RHF integration examples (Login and Register
							components)
						</li>
						<li>Helpers / Services (user, history, endpoints and customFetch)</li>
						<li>
							Using tsconfig.json to avoid relative paths (current absolute path is now set to
							/src).
						</li>
					</ul>
				</Card>
			</div>
		</DashboardLayout>
	)
}

export default Home
