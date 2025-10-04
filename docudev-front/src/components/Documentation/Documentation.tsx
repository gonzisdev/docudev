import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { DOCUMENTATION_URL, HOME_URL, TEAM_URL } from 'constants/routes'
import { Docu } from 'models/Docu'
import { codeBlock } from 'constants/editor'
import useTeams from 'hooks/useTeams'
import useDocus from 'hooks/useDocus'
import useDocu from 'hooks/useDocu'
import DocumentationLayout from 'layouts/DocumentationLayout/DocumentationLayout'
import Header from 'components/elements/Header/Header'
import Loading from 'components/elements/Loading/Loading'
import Button from 'components/elements/Button/Button'
import Editor from 'components/elements/Editor/Editor'
import { useCreateBlockNote } from '@blocknote/react'
import { PartialBlock } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/shadcn'
import { exportToPdf } from 'utils/pdf'
import { formatDateWithTime } from 'utils/dates'
import { EyeIcon } from 'assets/svgs'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/shadcn/style.css'
import './Documentation.css'

interface GroupedDocus {
	withTeam: Record<string, Docu[]>
	withoutTeam: Docu[]
}

const Documentation = () => {
	const { t } = useTranslation()
	const { teams, isLoadingTeams } = useTeams()
	const { docus, isLoadingDocus } = useDocus({ limit: 0 })
	const navigate = useNavigate()
	const { docuId } = useParams<{ docuId: Docu['_id'] }>()
	const editorRef = useRef(null)

	const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({})
	const [groupedDocus, setGroupedDocus] = useState<GroupedDocus>({ withTeam: {}, withoutTeam: [] })
	const [activeDocuId, setActiveDocuId] = useState<Docu['_id'] | null>(docuId || null)
	const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined>(undefined)
	const [noTeamExpanded, setNoTeamExpanded] = useState(true)

	const { docu, isLoadingDocu, errorDocu } = useDocu({ docuId: activeDocuId || '' })

	const editor = useCreateBlockNote({
		initialContent,
		codeBlock
	})

	useEffect(() => {
		if (docu && docu.content) {
			const parsedContent = JSON.parse(docu.content)
			setInitialContent(parsedContent)
			if (editor && parsedContent) {
				editor.replaceBlocks(editor.document, parsedContent)
			}
		}
	}, [docu, editor])

	useEffect(() => {
		if (teams && docus) {
			const grouped: GroupedDocus = { withTeam: {}, withoutTeam: [] }
			teams.forEach((team) => {
				grouped.withTeam[team._id] = []
			})
			docus.forEach((docu) => {
				if (docu.team && typeof docu.team === 'object') {
					if (grouped.withTeam[docu.team._id]) {
						grouped.withTeam[docu.team._id].push(docu)
					} else {
						grouped.withTeam[docu.team._id] = [docu]
					}
				} else {
					grouped.withoutTeam.push(docu)
				}
			})
			setGroupedDocus(grouped)
			const autoExpanded: Record<string, boolean> = {}
			teams.forEach((team) => {
				const teamDocs = grouped.withTeam[team._id] || []
				autoExpanded[team._id] = teamDocs.length > 0 && teamDocs.length <= 3
			})
			setExpandedTeams((prev) => ({ ...prev, ...autoExpanded }))
		}
	}, [teams, docus])

	const toggleTeam = (teamId: string) => {
		setExpandedTeams((prev) => ({
			...prev,
			[teamId]: !prev[teamId]
		}))
	}

	const handleDocuClick = (docu: Docu) => {
		if (activeDocuId === docu._id) {
			setActiveDocuId(null)
			navigate(DOCUMENTATION_URL)
			return
		}
		setActiveDocuId(docu._id)
		navigate(`${DOCUMENTATION_URL}/${docu._id}`)
	}

	const orderedDocsForNavigation = useMemo(() => {
		if (!teams || !groupedDocus) return []
		const orderedDocs: Docu[] = []
		teams.forEach((team) => {
			const teamDocs = groupedDocus.withTeam[team._id] || []
			if (teamDocs.length > 0) {
				orderedDocs.push(...teamDocs)
			}
		})
		if (groupedDocus.withoutTeam.length > 0) {
			orderedDocs.push(...groupedDocus.withoutTeam)
		}
		return orderedDocs
	}, [teams, groupedDocus])

	const navigationInfo = useMemo(() => {
		const currentIndex = orderedDocsForNavigation.findIndex((doc) => doc._id === activeDocuId)
		if (currentIndex === -1) return null
		return {
			currentIndex,
			previousDocu: currentIndex > 0 ? orderedDocsForNavigation[currentIndex - 1] : null,
			nextDocu:
				currentIndex < orderedDocsForNavigation.length - 1
					? orderedDocsForNavigation[currentIndex + 1]
					: null,
			total: orderedDocsForNavigation.length
		}
	}, [activeDocuId, orderedDocsForNavigation])

	const navigateToDocu = (targetDocu: Docu) => {
		setActiveDocuId(targetDocu._id)
		navigate(`${DOCUMENTATION_URL}/${targetDocu._id}`)
	}

	const handlePreviousDocu = () => {
		if (navigationInfo?.previousDocu) {
			navigateToDocu(navigationInfo.previousDocu)
		}
	}

	const handleNextDocu = () => {
		if (navigationInfo?.nextDocu) {
			navigateToDocu(navigationInfo.nextDocu)
		}
	}

	const isLoading = isLoadingTeams || isLoadingDocus

	if (errorDocu) return <Navigate to={'*'} />

	return (
		<DocumentationLayout
			teams={teams}
			docus={groupedDocus}
			expandedTeams={expandedTeams}
			toggleTeam={toggleTeam}
			handleDocuClick={handleDocuClick}
			activeDocuId={activeDocuId}
			isLoading={isLoading}
			toggleNoTeamExpanded={() => setNoTeamExpanded(!noTeamExpanded)}>
			{activeDocuId && isLoadingDocu ? (
				<Loading />
			) : (
				<>
					<Header title={activeDocuId ? docu?.title || '' : t('documentation.title')}>
						<div className='documentation-header-actions'>
							{activeDocuId && docu && (
								<div className='docu-header-actions'>
									<Button
										variant='secondary'
										onClick={() => exportToPdf(editorRef.current, docu?.title)}>
										{t('docus.export_pdf')}
									</Button>
								</div>
							)}
							<Button variant='link' onClick={() => navigate(HOME_URL)}>
								← {t('documentation.home')}
							</Button>
						</div>
					</Header>
					{activeDocuId && docu ? (
						<>
							<div className='documentation-details'>
								<div className='documentation-details-info'>
									<div className='documentation-details-left'>
										<span>
											<span>{t('docus.owner')}:</span> {docu.owner?.name} {docu.owner?.surname}
										</span>
										{docu.team && (
											<span>
												<span>{t('docus.team')}:</span>{' '}
												<span
													onClick={() =>
														typeof docu.team === 'object' &&
														'_id' in docu.team &&
														navigate(`${TEAM_URL}/${docu.team._id}`)
													}
													className='documentation-team-name'
													style={{
														color: typeof docu.team === 'object' ? docu.team.color : undefined
													}}>
													{typeof docu.team === 'object' ? docu.team.name : ''}
												</span>
											</span>
										)}
									</div>
									<div className='documentation-details-right'>
										<span>
											<span>{t('docus.created')}:</span> {formatDateWithTime(docu.createdAt)}
										</span>
										<span>
											<span>{t('docus.updated')}:</span> {formatDateWithTime(docu.updatedAt)}
										</span>
										<div className='documentation-details-views'>
											<EyeIcon width={18} height={18} />
											<span>{docu.views}</span>
										</div>
									</div>
								</div>
							</div>
							<div className='documentation-navigation'>
								<Button
									variant='secondary'
									disabled={!navigationInfo?.previousDocu}
									onClick={handlePreviousDocu}>
									<span className='navigation-button-text'>{t('documentation.previous')}</span>
								</Button>
								<Button
									variant='secondary'
									disabled={!navigationInfo?.nextDocu}
									onClick={handleNextDocu}>
									<span className='navigation-button-text'>{t('documentation.next')}</span>
								</Button>
							</div>
							<Editor editorRef={editorRef}>
								<BlockNoteView editor={editor} editable={false} />
							</Editor>
						</>
					) : (
						<div className='welcome-message'>
							<h2>{t('documentation.welcome_title')}</h2>
							<p>{t('documentation.welcome_message')}</p>
						</div>
					)}
				</>
			)}
		</DocumentationLayout>
	)
}

export default Documentation
