module.exports = {
    ci: {
      collect: {
        staticDistDir: './public', // Mettez ici le chemin vers le répertoire contenant vos fichiers statiques
      },
      assert: {
        preset: 'lighthouse:no-pwa',
      },
      upload: {
        target: 'temporary-public-storage',
      },
    },
  };