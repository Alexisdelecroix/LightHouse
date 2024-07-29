module.exports = {
    ci: {
      collect: {
        staticDistDir: './public', // Mettez ici le chemin vers le répertoire contenant vos fichiers statiques
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