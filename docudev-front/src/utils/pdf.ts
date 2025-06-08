// @ts-ignore
import html2pdf from 'html2pdf.js'
import { Docu } from 'models/Docu'

export const exportToPdf = (ref: HTMLElement | null, title?: Docu['title']): void => {
	const editorContent = ref
	if (!editorContent) return
	const opt = {
		margin: [10, 10, 10, 10],
		filename: `${title || 'docu'}.pdf`,
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: { scale: 2, useCORS: true },
		jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
		pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
	}
	html2pdf().set(opt).from(editorContent).save()
}
