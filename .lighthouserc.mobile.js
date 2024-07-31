module.exports = {
  ci: {
    collect: {
      url: [process.env.LIGHTHOUSE_URL],
      startServerCommand: 'npm run start',
      numberOfRuns: 1,
      settings: {
        emulatedFormFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 360,
          height: 640,
          deviceScaleRatio: 3  // Ratio d'échelle du périphérique (facteur de densité des pixels)
        },
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
