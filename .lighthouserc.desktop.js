// .lighthouserc.desktop.js
module.exports = {
  ci: {
    collect: {
      url: [process.env.LIGHTHOUSE_URL],
      startServerCommand: 'npm run start',
      numberOfRuns: 1,
      settings: {
        formFactor: 'desktop', // Émule un ordinateur de bureau
        screenEmulation: {
          mobile: false, // Pas d'émulation mobile
          disabled: false, // Active l'émulation d'écran
          width: 1440, // Largeur de l'écran en pixels
          height: 900, // Hauteur de l'écran en pixels
          deviceScaleRatio: 1 // Densité de pixels standard
        },
        emulatedUserAgent: false,
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
};
