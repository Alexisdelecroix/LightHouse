module.exports = {
	ci: {
		collect: {
			startServerCommand: "yarn start",
			url: [
				"http://localhost:3000?mobile",
				"http://localhost:3000/blog/hexagonal-architecture-front-end?mobile",
			],
			settings: {
				chromeFlags: "--no-sandbox",
				locale: "fr-FR",
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