import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Table from 'components/elements/Table/Table'
import TableActionLayout from 'components/elements/Table/TableActionLayout/TableActionLayout'
import Header from 'components/elements/Header/Header'
import { createColumnHelper } from '@tanstack/react-table'
import { EditIcon, TrashIcon } from 'assets/svgs'
import { Event } from 'models/Event'
import { eventsMock } from 'mock/EventsMock'
import Container from 'components/elements/Container/Container'

const TeamManagement = () => {
	const { t } = useTranslation()
	const [events, setEvents] = useState<Event[]>([])
	useEffect(() => {
		getEvents()
	}, [])

	const getEvents = async () => {
		console.log({ events })
		setEvents(eventsMock)
	}

	const filterStatusOptions = [
		{
			label: 'Todos',
			value: ''
		},
		{
			label: 'Borrador',
			value: 'draft'
		},
		{
			label: 'Activo',
			value: 'active'
		},
		{
			label: 'Cancelado',
			value: 'cancelled'
		}
	]

	const columnHelper = createColumnHelper<Event>()

	const columns = [
		columnHelper.accessor('eventId', {
			header: 'ID'
		}),
		columnHelper.accessor('headline', {
			header: 'Título'
		}),
		columnHelper.accessor('startingDate', {
			header: 'Fecha inicio',
			meta: { filterType: 'date' }
		}),
		columnHelper.accessor('endDate', {
			header: 'Fecha fin',
			meta: { filterType: 'date' }
		}),
		columnHelper.accessor('location', {
			header: 'Ubicación'
		}),
		columnHelper.accessor('participants', {
			header: 'Participantes',
			meta: { filterType: 'range' }
		}),
		columnHelper.accessor('status', {
			header: 'Estado',
			meta: {
				filterType: 'select',
				filterOptions: filterStatusOptions
			}
		}),
		columnHelper.display({
			id: 'actions',
			header: 'Acciones',
			cell: () => {
				return (
					<div className='table-actions'>
						<TableActionLayout>
							<EditIcon />
						</TableActionLayout>
						<TableActionLayout>
							<TrashIcon />
						</TableActionLayout>
					</div>
				)
			},
			meta: {
				isFixed: true
			}
		})
	]

	return (
		<DashboardLayout>
			<Header title={t('team_management.title')} />
			<Container subtitle={t('team_management.subtitle')}></Container>
			<Table
				data={events}
				columns={columns}
				isLoading={false}
				enableRowSelection
				onChangeRowSelection={(rows) => console.log(rows.map((row) => row.original))}
			/>
		</DashboardLayout>
	)
}

export default TeamManagement
