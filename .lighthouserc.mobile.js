module.exports = {
  ci: {
    collect: {
      url: [process.env.LIGHTHOUSE_URL],
      startServerCommand: 'npm run start',
      numberOfRuns: 1,
      settings: {
        preset: 'mobile',
        emulatedFormFactor: 'mobile',
        timeout: 180000, 
      },
    },
    upload: {
      target: 'temporary-public-storage', // Stockage temporaire public pour les rapports
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
