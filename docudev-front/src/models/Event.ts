export interface Event {
	eventId: string
	headline: string
	body: string
	startingDate: Date
	endDate: Date
	location: string
	image?: string
	participants: number
	status: 'draft' | 'active' | 'cancelled'
}
