module.exports = {
    ci: {
      collect: {
        url: ['https://www.flexbeton.fr/']
      },
      assert: {
        preset: 'lighthouse:no-pwa',
        assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
          },
      },
      upload: {
        target: 'temporary-public-storage',
      },
    },
  };