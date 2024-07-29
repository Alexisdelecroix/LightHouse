module.exports = {
    ci: {
      collect: {
        staticDistDir: "./public/",
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