Prism.languages.rant = {
	'escaped': {
		pattern: /\\((?:\d+,)?(?:[^u\s\r\n]|u[0-9a-f]{4}))/,
		alias: 'char'
	},
	'comment': {
		pattern: /#.*/
	},
	'constliteral': {
		pattern: /(^|[^\\])("(?:(?:[^"]|"")*)?")/,
		alias: 'string',
		lookbehind: true
	},
	'query': {
		pattern: /<[\s\S]+?>/g,
		alias: 'function',
		inside: {
      // White/blacklist regexes
			'regex': /`(.*?[^\\])?`i?/ig,
      // Filters, carrier operators
			'punctuation': /(!?-|\?!?|\$|::|[=!&@])/
		}
	},
	'regex': {
		pattern: /`(.*?[^\\])?`i?/ig
	},
	'keyword': {
		pattern: new RegExp("((?:^|[^\\\\])\\[)([$]\\w+|" + rantFunctions + ")(?=[:\\]])", "i"),
		lookbehind: true
	},
	'subroutine': {
		pattern: /(\[)(\$\??)(\[.*?\])(?=\s*\:)/g,
		alias: 'important',
		lookbehind: true,
	}
}
