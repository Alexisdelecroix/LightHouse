module.exports = {
	ci: {
		collect: {
			startServerCommand: "yarn start",
			url: [
				"https://www.flexbeton.fr/",
			
			],
			settings: {
				chromeFlags: "--no-sandbox",
				locale: "fr-FR",
				preset: "desktop",
				onlyCategories: [
					"performance",
					"accessibility",
					"best-practices",
					"seo",
					"pwa",
				],
			},
		},
	},
}