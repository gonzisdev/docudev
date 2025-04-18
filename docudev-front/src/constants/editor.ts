import { createHighlighter } from 'shiki'

export const codeBlock = {
	indentLineWithTab: true,
	defaultLanguage: 'typescript',
	supportedLanguages: {
		abap: {
			name: 'ABAP',
			aliases: []
		},
		ada: {
			name: 'Ada',
			aliases: []
		},
		apex: {
			name: 'Apex',
			aliases: []
		},
		asciidoc: {
			name: 'AsciiDoc',
			aliases: ['adoc']
		},
		asm: {
			name: 'Assembly',
			aliases: []
		},
		astro: {
			name: 'Astro',
			aliases: []
		},
		bash: {
			name: 'Bash',
			aliases: ['sh', 'shell', 'bash']
		},
		c: {
			name: 'C',
			aliases: []
		},
		clojure: {
			name: 'Clojure',
			aliases: ['clj']
		},
		cmake: {
			name: 'CMake',
			aliases: []
		},
		cobol: {
			name: 'COBOL',
			aliases: []
		},
		coffeescript: {
			name: 'CoffeeScript',
			aliases: ['coffee']
		},
		cpp: {
			name: 'C++',
			aliases: ['cc', 'c++']
		},
		crystal: {
			name: 'Crystal',
			aliases: []
		},
		csharp: {
			name: 'C#',
			aliases: ['cs', 'csharp']
		},
		css: {
			name: 'CSS',
			aliases: []
		},
		dart: {
			name: 'Dart',
			aliases: []
		},
		dockerfile: {
			name: 'Dockerfile',
			aliases: ['docker']
		},
		elixir: {
			name: 'Elixir',
			aliases: []
		},
		elm: {
			name: 'Elm',
			aliases: []
		},
		erlang: {
			name: 'Erlang',
			aliases: ['erl']
		},
		fortran: {
			name: 'Fortran',
			aliases: ['f', 'f77', 'f90', 'f95', 'f03', 'f08']
		},
		fsharp: {
			name: 'F#',
			aliases: ['fs']
		},
		go: {
			name: 'Go',
			aliases: ['golang']
		},
		graphql: {
			name: 'GraphQL',
			aliases: ['gql']
		},
		groovy: {
			name: 'Groovy',
			aliases: []
		},
		haskell: {
			name: 'Haskell',
			aliases: ['hs']
		},
		hcl: {
			name: 'HCL',
			aliases: []
		},
		html: {
			name: 'HTML',
			aliases: ['htm']
		},
		ini: {
			name: 'INI',
			aliases: []
		},
		java: {
			name: 'Java',
			aliases: []
		},
		javascript: {
			name: 'JavaScript',
			aliases: ['js']
		},
		json: {
			name: 'JSON',
			aliases: []
		},
		julia: {
			name: 'Julia',
			aliases: ['jl']
		},
		kotlin: {
			name: 'Kotlin',
			aliases: ['kt', 'kts']
		},
		latex: {
			name: 'LaTeX',
			aliases: ['tex']
		},
		less: {
			name: 'Less',
			aliases: []
		},
		liquid: {
			name: 'Liquid',
			aliases: []
		},
		lua: {
			name: 'Lua',
			aliases: []
		},
		markdown: {
			name: 'Markdown',
			aliases: ['md']
		},
		matlab: {
			name: 'MATLAB',
			aliases: []
		},
		mermaid: {
			name: 'Mermaid',
			aliases: ['mmd']
		},
		nix: {
			name: 'Nix',
			aliases: []
		},
		objectivec: {
			name: 'Objective-C',
			aliases: ['objc', 'objective-c', 'objective-cpp']
		},
		ocaml: {
			name: 'OCaml',
			aliases: []
		},
		pascal: {
			name: 'Pascal',
			aliases: []
		},
		perl: {
			name: 'Perl',
			aliases: []
		},
		php: {
			name: 'PHP',
			aliases: []
		},
		powershell: {
			name: 'PowerShell',
			aliases: ['ps', 'ps1', 'powershell']
		},
		prisma: {
			name: 'Prisma',
			aliases: []
		},
		prolog: {
			name: 'Prolog',
			aliases: []
		},
		pug: {
			name: 'Pug',
			aliases: ['jade']
		},
		python: {
			name: 'Python',
			aliases: ['py']
		},
		r: {
			name: 'R',
			aliases: []
		},
		raku: {
			name: 'Raku',
			aliases: ['perl6']
		},
		regex: {
			name: 'Regex',
			aliases: ['regexp']
		},
		ruby: {
			name: 'Ruby',
			aliases: ['rb']
		},
		rust: {
			name: 'Rust',
			aliases: ['rs']
		},
		scala: {
			name: 'Scala',
			aliases: []
		},
		scheme: {
			name: 'Scheme',
			aliases: []
		},
		scss: {
			name: 'SCSS',
			aliases: []
		},
		solidity: {
			name: 'Solidity',
			aliases: []
		},
		sql: {
			name: 'SQL',
			aliases: []
		},
		stylus: {
			name: 'Stylus',
			aliases: ['styl']
		},
		svelte: {
			name: 'Svelte',
			aliases: []
		},
		swift: {
			name: 'Swift',
			aliases: []
		},
		terraform: {
			name: 'Terraform',
			aliases: ['tf', 'tfvars']
		},
		toml: {
			name: 'TOML',
			aliases: []
		},
		tsx: {
			name: 'TSX',
			aliases: ['typescriptreact']
		},
		twig: {
			name: 'Twig',
			aliases: []
		},
		typescript: {
			name: 'TypeScript',
			aliases: ['ts']
		},
		vue: {
			name: 'Vue',
			aliases: ['vue-html']
		},
		wasm: {
			name: 'WebAssembly',
			aliases: []
		},
		xml: {
			name: 'XML',
			aliases: []
		},
		yaml: {
			name: 'YAML',
			aliases: ['yml']
		},
		zig: {
			name: 'Zig',
			aliases: []
		}
	},
	createHighlighter: () =>
		createHighlighter({
			themes: ['catppuccin-macchiato'],
			langs: []
		})
}
