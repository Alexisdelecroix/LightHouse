module.exports = {
  ci: {
    collect: {
      url: ['https://www.flexbeton.fr/'],
      startServerCommand: 'npm run start',
      numberOfRuns: 1,
      settings: {
        preset: 'perf', 
        emulatedFormFactor: 'mobile' 
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.9}],
      },
    },
  },
};