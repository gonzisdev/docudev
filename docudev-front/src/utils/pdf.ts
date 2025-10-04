// @ts-ignore
import html2pdf from 'html2pdf.js'
import { Docu } from 'models/Docu'

export const imgToBase64 = async (url: string): Promise<string> => {
	const res = await fetch(url, { credentials: 'include' })
	const blob = await res.blob()
	return new Promise((resolve) => {
		const reader = new FileReader()
		reader.onloadend = () => resolve(reader.result as string)
		reader.readAsDataURL(blob)
	})
}

export const exportToPdf = async (
	ref: HTMLElement | null,
	title?: Docu['title']
): Promise<void> => {
	const editorContent = ref
	if (!editorContent) return
	// Convert images to base64 because they are protected with cookies (require authentication)
	const images = editorContent.querySelectorAll('img')
	await Promise.all(
		Array.from(images).map(async (img) => {
			const base64 = await imgToBase64(img.src)
			img.src = base64
		})
	)

	const opt = {
		margin: [10, 10, 10, 10],
		filename: `${title || 'docu'}.pdf`,
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: { scale: 2, useCORS: true },
		jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
		pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
	}

	await html2pdf().set(opt).from(editorContent).save()
}
