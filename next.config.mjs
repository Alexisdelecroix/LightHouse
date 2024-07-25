// import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';


/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.plugins.push(new NodePolyfillPlugin());
  //   }

  //     // Ignore les modules problématiques
  //     config.externals = [
  //       'lighthouse/core/config/config-helpers.js',
  //       'lighthouse/core/lib/i18n/i18n.js',
  //       // Ajoutez d'autres modules problématiques ici
  //     ];
  
  //   return config;
  // },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
};

export default nextConfig;
