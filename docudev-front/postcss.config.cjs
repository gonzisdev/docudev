module.exports = {
	plugins: {
		'postcss-import': {},
		'postcss-preset-env': {
			stage: 1,
			features: {
				'nesting-rules': true
			},
			browsers: [
				'last 2 Chrome versions',
				'last 2 Firefox versions',
				'last 2 Safari versions',
				'last 2 Edge versions',
				'not IE 11'
			]
		}
	}
}
