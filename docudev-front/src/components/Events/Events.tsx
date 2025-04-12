import { Event } from 'models/Event'
import { useEffect, useState } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { eventsMock } from 'mock/EventsMock'
import { PencilIcon, TrashIcon } from 'assets/svgs'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Table from 'components/elements/Table/Table'
import TableActionLayout from 'components/elements/Table/TableActionLayout/TableActionLayout'
import Header from 'components/elements/Header/Header'

const Events = () => {
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
							<PencilIcon />
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
			<Header title='Eventos' />
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

export default Events
