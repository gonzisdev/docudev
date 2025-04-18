import { createHighlighter } from 'shiki'

export const codeBlock = {
	indentLineWithTab: true,
	defaultLanguage: 'typescript',
	supportedLanguages: {
		typescript: {
			name: 'TypeScript',
			aliases: ['ts']
		},
		javascript: {
			name: 'JavaScript',
			aliases: ['js']
		},
		php: {
			name: 'PHP',
			aliases: []
		},
		tsx: {
			name: 'TSX',
			aliases: ['typescriptreact']
		},
		python: {
			name: 'Python',
			aliases: ['py']
		},
		css: {
			name: 'CSS',
			aliases: []
		},
		html: {
			name: 'HTML',
			aliases: ['htm']
		},
		json: {
			name: 'JSON',
			aliases: []
		},
		java: {
			name: 'Java',
			aliases: []
		},
		c: {
			name: 'C',
			aliases: []
		},
		cpp: {
			name: 'C++',
			aliases: ['cc', 'c++']
		},
		csharp: {
			name: 'C#',
			aliases: ['cs', 'csharp']
		},
		ruby: {
			name: 'Ruby',
			aliases: ['rb']
		},
		go: {
			name: 'Go',
			aliases: ['golang']
		},
		rust: {
			name: 'Rust',
			aliases: ['rs']
		},
		bash: {
			name: 'Bash',
			aliases: ['sh', 'shell', 'bash']
		},
		powershell: {
			name: 'PowerShell',
			aliases: ['ps', 'ps1', 'powershell']
		},
		yaml: {
			name: 'YAML',
			aliases: ['yml']
		},
		markdown: {
			name: 'Markdown',
			aliases: ['md']
		}
	},
	createHighlighter: () =>
		createHighlighter({
			themes: ['catppuccin-macchiato'],
			langs: []
		})
}
