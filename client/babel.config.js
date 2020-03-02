module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@views': './src/views',
          '@components': './src/components',
          '@utils': './utils'
        }
      }
    ]
  ]
};
