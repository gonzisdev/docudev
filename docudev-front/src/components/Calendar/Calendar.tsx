import { DateSelectArg, EventChangeArg, EventClickArg } from '@fullcalendar/core/index.js'
import esLocale from '@fullcalendar/core/locales/es'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { ISODateString } from 'models/Common'
import './Calendar.css'

interface EventCalendar {
	eventId: string
	title: string
	startingDate: ISODateString
	endDate: ISODateString
	backgroundColor?: string
	borderColor?: string
	textColor?: string
}

interface Props {
	events: EventCalendar[]
	isEditable?: boolean
	onEventClick?: (event: EventCalendar) => void
	onEventChange?: (event: EventCalendar) => void
	onSelectDate?: (date: Pick<EventCalendar, 'startingDate' | 'endDate'>) => void
}

const Calendar = ({
	events,
	isEditable = false,
	onEventClick,
	onEventChange,
	onSelectDate
}: Props) => {
	const eventsMapped = events.map((event) => ({
		id: event.eventId,
		title: event.title,
		start: event.startingDate,
		end: event.endDate,
		backgroundColor: event.backgroundColor ?? '#E2EBF7',
		borderColor: event.borderColor ?? '#004085',
		textColor: event.textColor ?? '#004085'
	}))

	const handleEventClick = (clickInfo: EventClickArg) => {
		const { event } = clickInfo

		const eventId = event.id
		const title = event.title
		const startingDate = event.start
		const endDate = event.end
		if (!eventId || !onEventClick || !startingDate || !endDate) return
		onEventClick({
			title,
			eventId,
			startingDate: startingDate.toISOString(),
			endDate: endDate.toISOString()
		})
	}

	const handleEventChange = (changeInfo: EventChangeArg) => {
		const { event } = changeInfo
		const eventId = event.id
		const title = event.title
		const startingDate = event.start
		const endDate = event.end

		if (!eventId || !onEventChange || !startingDate || !endDate) return
		onEventChange({
			title,
			eventId,
			startingDate: startingDate.toISOString(),
			endDate: endDate.toISOString()
		})
	}

	const handleSelectDate = (selectInfo: DateSelectArg) => {
		const { start, end } = selectInfo

		if (!onSelectDate || !start || !end) return
		onSelectDate({
			startingDate: start.toISOString(),
			endDate: end.toISOString()
		})
	}

	return (
		<div className='calendar-wrapper'>
			<div className='calendar'>
				<FullCalendar
					editable={isEditable}
					selectable={isEditable}
					selectMirror={isEditable}
					eventClassNames='calendar-event'
					plugins={[timeGridPlugin, interactionPlugin]}
					initialView='timeGridWeek'
					locale={esLocale}
					timeZone='UTC'
					headerToolbar={{
						right: 'prev,next'
					}}
					events={eventsMapped}
					dayHeaderFormat={{ weekday: 'long', day: 'numeric' }}
					views={{
						timeGridWeek: {
							type: 'timeGrid',
							buttonText: 'Semana',
							slotMinTime: '09:00:00',
							slotMaxTime: '20:00:00',
							allDaySlot: false,
							weekends: false,
							slotLabelFormat: {
								hour: 'numeric',
								minute: '2-digit',
								meridiem: 'short'
								// hour12: true //activar si se quiere mostrar las horas en AM y PM
							},
							eventTimeFormat: {
								hour: 'numeric',
								minute: '2-digit',
								meridiem: 'short'
								// hour12: true //activar si se quiere mostrar las horas en AM y PM
							}
						}
					}}
					eventClick={handleEventClick}
					eventChange={handleEventChange}
					snapDuration={{
						minutes: 30
					}}
					select={handleSelectDate}
					selectAllow={(selectInfo) => {
						const { start, end } = selectInfo
						return start.getDate() === end.getDate()
					}}
				/>
			</div>
		</div>
	)
}

export default Calendar
