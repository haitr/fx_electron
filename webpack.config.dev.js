const glob = require('glob')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  // debug only
  mode: "development",
  devtool: 'source-map',
  watch: true,
  // for using __dirname and __filename
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false,
  },
  // path to executed file
  // compile ts into js but not bundle
  entry: glob.sync(
    "./src/**/*.{ts,tsx,scss,sass}",
    {ignore: './src/**/*.d.ts'}).reduce( (acc, file) => {
      p = path.dirname(file).replace('./src', '')
      name = path.basename(file).replace(/\.[^/.]+$/, '')
      dist = `${p}/${name}`
      acc[dist] = file;
      return acc;
    }, {}),
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, 'node_modules'),
      '@material': path.resolve(__dirname, 'node_modules', 'vue-material', 'dist', 'components'),
    }
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            '@babel/preset-env',
            '@babel/typescript',
            '@vue/babel-preset-jsx'
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
          ]
        }
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
          // Autofixer
          'postcss-loader',
        ]
      }
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{
        from:'src/**/*.(html|png|jpe?g)',
        transformPath(targetPath, absolutePath) {
          p = targetPath.replace(/src\//, '')
          return p;
        },
      }],
      options: {
        concurrency: 100,
      },
    }),
  ],
}