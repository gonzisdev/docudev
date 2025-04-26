import { collaborationColors } from 'constants/colors'

export const getRandomColor = () =>
	collaborationColors[Math.floor(Math.random() * collaborationColors.length)]
