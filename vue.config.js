module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /node_modules/,
          options: {
            fix: true,
            cache: false,
            failOnError: false,
          },
        },
      ],
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    // disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://59.110.68.178:8085/api',
        changeOrigin: true
      },
    }
  },
  chainWebpack: (config) => {
    config
    .optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true;
      return args;
    });
    
  }
};
