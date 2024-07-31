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
        },
        emulatedUserAgent: false, // Utilise l'user agent de bureau par défaut
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
