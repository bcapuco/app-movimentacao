module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Isso força o Babel a usar o modo automático do React 19
      ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
    ],
  };
};